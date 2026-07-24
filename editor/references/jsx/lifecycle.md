# Lifecycle

## A mount stays live

After `dapi mount` returns, its reactive graph keeps running: signals, effects, timers, and [`useTicker`](#useticker) keep driving the mounted entities. Updates land in the document immediately (not as undo steps) — prop writes, conditional inserts and removals (`<Show>`, `<For>`), text, and reactive `src` swaps including `generate.*`. The materialized nodes are ordinary editable entities; asset generation is owned by the engine. `syncTo` and new `<captions>` are mount-only and throw if changed after commit. A run ends when a later `mount` claims one of its root keys (swapping the entities and disposing the old graph) or the project closes.

The compiled module is persisted with the document and re-executed in every context: reload rebuilds the graph and its runtime hosts (`<surface>`/`<html>`), and export and capture drive the ticker across the frames they render. Re-execution binds to the existing entities rather than re-authoring them, so hand-edits survive; it rewrites only the props your effects animate. This requires the module's structure to be deterministic: `Math.random()` and `Date.now()` must not decide element counts or `<Show>`/`<For>` branches (using them inside an effect is fine).

`node insert` renders into an existing parent and is not persisted or kept live.

## `useTicker`

A mount can subscribe to the project's timeline instead of reaching for wall-clock timers:

```tsx
import { useTicker } from "@diffusionstudio/jsx";

export default function Project() {
  const { time, frame } = useTicker();
  return (
    <rect scene="hud" width={1920} height={1080}>
      <text width={600} height={100} fontSize={80}>{`frame ${frame()}`}</text>
      <rect x={860 + Math.sin(time() * 4) * 200} y={490} width={100} height={100} fill="#f43" />
    </rect>
  );
}
```

Call it in a component body. It returns accessors for the playhead of the scene the mount's root lives in (or is):

| Accessor | Value |
| -------- | ----- |
| `time()` | Playhead in seconds (sub-frame precision while playing) |
| `frame()` | Playhead in frames (30 fps) |
| `delta()` | Seconds advanced since the previous engine tick: 0 while paused, negative on a backward scrub or loop |
| `playing()` | Whether the scene is playing |

The values respect play, pause, scrubbing, looping, and playback speed, which wall-clock timers do not. Each accessor only propagates when its value changes, so a paused scene re-runs nothing and `frame()` consumers update at most once per frame. Ticker-driven drawing follows the playhead in the editor and in exports and captures; wall-clock timers (`setInterval`, `requestAnimationFrame`) render live but do not appear in exports.

## `useFile`

Resolves a [`src`](./media.md) (path, asset id, URL, or a `generate.*` ref) to its `File`, so effects can read the raw bytes: draw a library image onto a [`<surface>`](./surface-paint.md), parse a data file, decode audio. The module is sandboxed and can't fetch a path or asset id itself, so resolution goes through the host, exactly as `src` does.

```tsx
import { createSignal, createEffect } from "solid-js";
import { useFile } from "@diffusionstudio/jsx";

function Logo() {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();
  const [file] = useFile("/assets/logo.png");  // path, asset id, URL, or AssetRef

  createEffect(async () => {
    const el = canvas();
    const f = file();                          // undefined until it resolves
    if (!el || !f) return;
    const ctx = el.getContext("2d")!;
    ctx.drawImage(await createImageBitmap(f), 0, 0, el.width, el.height);
  });

  return <surface ref={setCanvas} width={640} height={360} />;
}
```

Returns Solid's `createResource` tuple unchanged: `[file, { mutate, refetch }]`. The `file` accessor reads `undefined` until resolution completes, then the `File`; `file.loading` and `file.error` report progress and failure. Resolution is async (fetch a URL, read a path or library asset, await a `generate.*` ref); export and capture await the first resolution before rendering frame 0. A `node insert` has no surviving effect to consume the result.
