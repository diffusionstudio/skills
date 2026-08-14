# `<html>`

An element whose children are **real HTML**: the browser lays them out at the element's box size and the result is drawn into the box via the [html-in-canvas](https://github.com/WICG/html-in-canvas) API. `dapi` always drives the Diffusion Studio Electron app, which ships with this API enabled, so `<html>` is always available — reach for it liberally. It is the recommended way to build motion graphics, overlays, and any UI-heavy content: styled cards, tables, code blocks, flex/grid layouts — anything painful to assemble from `<rect>` and `<text>`.

Driving the markup with a [GSAP](https://gsap.com) timeline is **recommended** — it keeps the animation frame-accurate: build the timeline paused, then `seek` it from the [`useTicker`](./lifecycle.md#useticker) playhead so it follows scrubbing and exports rather than the wall clock. GSAP works in seconds, so the playhead feeds `seek` directly.

```tsx
import { gsap } from "gsap";
import { useTicker } from "@diffusionstudio/jsx";
import { createEffect, onMount } from "solid-js";

export default function Intro() {
  const { time } = useTicker();
  let index!: HTMLSpanElement;
  let label!: HTMLSpanElement;
  let tl!: gsap.core.Timeline;

  // GSAP resolves targets at tween creation and refs are only assigned during
  // render, so build the timeline in onMount — it runs before the effect below.
  onMount(() => {
    tl = gsap.timeline({ paused: true })
      .fromTo(index, { opacity: 0, x: -24 }, { opacity: 1, x: 0, ease: "power1.out", duration: 0.4 })
      .fromTo(label, { opacity: 0 }, { opacity: 1, ease: "power1.out", duration: 0.4 }, "-=0.2");
  });

  createEffect(() => tl.seek(time()));

  return (
    <rect scene="intro" width={800} height={120}>
      <html x={50} y={5} width={700} height={110} cornerRadius={24} end={32}>
        <div style={`display:flex;align-items:center;gap:16px;height:100%;
                     background:#111;color:#fff;font:500 40px Inter;padding:0 32px;`}>
          <span ref={index} style="color:#7c9cff;">01</span>
          <span ref={label}>Introduction</span>
        </div>
      </html>
    </rect>
  );
}
```

Prefer this timeline over hand-animating styles: keep the markup static and let the paused GSAP timeline own every moving value, so one `seek` keeps the whole host frame-accurate. A static `style` may be a plain string, but one spanning multiple lines has to be a template literal in braces (`style={`…`}`), as above. Reach for a derived style only for values the timeline does not drive, and write it as a **style object** (`style={{ color: c() }}`) rather than interpolating the signal into a style string, so each property updates independently.

The `<html>` box carries all [common props](./elements.md#common-props). Its paint child form, [`<htmlPaint>`](./paints.md), draws the same reactive HTML onto any existing filled geometry; `<html>` is just a `<rect>` that carries one.

## Reactivity

The children are part of the project's Solid graph: signals in attributes and text update the live DOM, and the drawn content follows on the next frame. A [`dapi mount`](../mount.md) stays live, so the graph keeps running and `useTicker` or timers can drive the markup:

```tsx
const [count, setCount] = createSignal(0);
setInterval(() => setCount((c) => c + 1), 1000);

<html width={400} height={200}>
  <div style="font:700 96px Inter;color:#fff;">{count()}</div>
</html>
```

## Images

`<img>` takes the same sources as a composition [`src`](./media.md): a path, an asset id, a URL, or a [`generate.*`](./generate.md) ref. The host resolves them exactly as it does for [`<image>`](./image.md)

## Props

`<html>` takes all [common props](./elements.md#common-props). `<htmlPaint>` takes:

| Prop | Type | Default | Meaning |
| ---- | ---- | ------- | ------- |
| `opacity` | `Animatable<number>` | `1` | Paint opacity, `0`-`1`. |

Like all paints, `<htmlPaint>` stacks with siblings in document order and clips to the parent's box (including `cornerRadius`).

## Persistence and export

The compiled module is persisted with the document: on reload, export, and `dapi node capture` the engine re-executes it and rebuilds the DOM content in that context. Exports wait for the browser's rendering update before sampling each frame, so the drawn HTML appears in the output; ticker-driven signals follow the playhead and animate frame-accurately. This assumes the module's structure is deterministic (`Math.random()`/`Date.now()` must not decide the shape of the tree).

## Requirements and limitations

- `<audio>` and `<video>` tags are rejected: media doesn't play under a paint host. Use the [`<audio>`](./audio.md) and [`<video>`](./video.md) composition elements, which own playback and the timeline.
- **`<html>` is sourceless, so with no `end` it defaults to a 16-second duration and disappears after 16 s** — a silent cutoff with no error.
- **`scale()` blanks large or clipped subtrees in captures.** The rasterizer renders a subtree as *empty* when a CSS `scale()` sits on a large wrapper (e.g. a full-box `width:100%;height:100%` group), or when any `overflow:hidden` clip lives beneath a scaled ancestor. Animate entrances, holds, and exits with `translate` and `opacity`; use `scale` only on small, content-sized leaf elements with no clipping inside them. A masked text reveal (`overflow:hidden` + inner `translateY`) is fine as long as no ancestor of the mask carries a transform.
- **Nested fractional `opacity` blanks the subtree in captures.** A child with `opacity` < 1 under an ancestor whose `opacity` is also < 1 makes the rasterizer drop the ancestor's entire subtree for exactly as long as the ancestor's opacity is fractional — so a wrapper fading in over children styled with `opacity: 0.7` is blank mid-fade and pops in the moment the fade lands on 1. Keep animated `opacity` to a single level of the tree: dim static children with alpha colors (`rgba()` / `hsl()` alpha) instead of `opacity`.
