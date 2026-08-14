# Errors

Where each [pipeline](./README.md#pipeline) stage fails, and with what effect:

| Stage | Where it surfaces | Effect |
| ----- | ----------------- | ------ |
| Compile (syntax/type-stripping/bundling) | CLI stderr, exit 1 | App never contacted. |
| Evaluate / mount (thrown errors, invalid props, invalid root: e.g. a root that is not a scene, missing `src`, malformed `Time`, an unknown or cyclic `syncTo` key, `syncTo` combined with `start`) | CLI stderr, exit 1 | Staging root discarded; **nothing inserted**. |
| Generation (per-model constraints: `aspectRatio`, `duration`, feature flags) | CLI stderr, exit 1, after every generation settled | No rollback; the mounted tree stays committed. The affected placeholder stops showing its generating state and is left without a paint. |
| Sync (a side without a decodable audio track, or no reliable alignment) | CLI stderr, exit 1, after every alignment settled | No rollback; the tree stays committed and the node keeps its default placement. |

Runtime errors are mapped back to the source via inline sourcemaps produced at compile time.

## Blank or partial `<html>` content in captures

A mount that looks right in the viewport but captures black, frozen, or partially missing frames is almost always one of four things — check them in this order:

1. **A stateful animation seek.** GSAP records a tween's start values at the tween's *first* render, and captures/exports sample frames out of order — so a tween whose target was written to outside the timeline before its first render bakes that mutated state in as its starting values and replays it at every subsequent frame. Symptom: deterministic but *order-dependent* wrong frames — the same time renders when requested first and comes out wrong when requested after a later frame. See the caveat in [html.md](./html.md): give tweens explicit start values with `fromTo`, never write to or reset tween targets between seeks, and derive capture-critical values statelessly from `time()`.
2. **`scale()` on a large or clipped subtree.** The rasterizer renders these as empty (see [html.md limitations](./html.md#requirements-and-limitations)). Symptom: one wrapper's entire subtree missing at every sampled time while siblings render. Fix: translate/opacity animation; `scale` only on small content-sized leaves without inner clips.
3. **Fractional `opacity` nested under fractional `opacity`.** The rasterizer drops the ancestor's whole subtree while its opacity is between 0 and 1 if any descendant carries its own `opacity` < 1 (see [html.md limitations](./html.md#requirements-and-limitations)). Symptom: an element blank at every time its entrance/exit fade is mid-flight, rendering normally the moment the animated opacity reaches exactly 1 — deterministic per time and independent of sampling order. Fix: animate `opacity` on one level only; dim children with `rgba()`/`hsl()` alpha colors.
4. **`Error drawing <HtmlPaint> content: … No cached paint record for element`** in `dapi logs`, or html content missing from the first sampled frame(s) of a capture while later frames render: the offline draw raced the browser's paint snapshot for a freshly mounted host. Engine-side, not a composition bug — until the `whenReady` paint-snapshot fix ships, re-request the affected time or lead the capture with a throwaway frame.
