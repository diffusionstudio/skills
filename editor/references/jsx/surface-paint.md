# `<surface>`

An element backed by a **canvas you draw yourself**. The `ref` callback receives a detached `HTMLCanvasElement`; draw into it with any context type — 2d, webgl, webgpu — and the engine samples the bitmap every frame, stretching it into the parent geometry's box. Use it for procedural graphics and for external renderers (three.js, p5, chart libraries) that want to own a canvas.

```tsx
<surface x={40} y={40} width={640} height={360} cornerRadius={24}
  ref={(el) => {
    const ctx = el.getContext("2d")!;
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, el.width, el.height);
    ctx.strokeStyle = "#7c9cff";
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, el.width - 80, el.height - 80);
  }} />
```

`<surfacePaint ref={...}>` is the paint child form, valid inside any filled visual element; `<surface>` is a rectangle carrying one, with all [common props](./elements.md#common-props).

## The ref and the bitmap

- The ref runs **once**, when the paint materializes, inside the mount's reactive owner — `createEffect`, `onCleanup`, and [`useTicker`](./lifecycle.md) all work inside it.
- **Callback form only** (`ref={(el) => ...}`). Variable refs (`let el; <surface ref={el} />`) receive a renderer-internal node, not the canvas.
- The bitmap is allocated at the element's box size (in composition pixels) **before the ref runs**; after that the engine never touches it — the bitmap belongs to your code. Resize it yourself (`el.width = ...`, or an external renderer's own API) for higher resolution; the bitmap is stretched into the box every frame either way, so an animated box scales pixels rather than re-rasterizing.
- Unlike [`<html>`](./html.md) no flagged browser API is needed, and the sampled pixels render in exports.

## Reactivity

The engine samples the canvas every frame, so anything you draw shows up on the next frame. A [`dapi mount`](../mount.md) stays live, so the reactive graph keeps running: create effects in the ref to redraw from signals, or drive frame-accurate motion from the ticker's composition time:

```tsx
<surface width={400} height={400}
  ref={(el) => {
    const ctx = el.getContext("2d")!;
    const { time } = useTicker();
    createEffect(() => {
      ctx.clearRect(0, 0, el.width, el.height);
      ctx.beginPath();
      ctx.arc(200, 200, 60 + 40 * Math.sin(time() * Math.PI), 0, Math.PI * 2);
      ctx.fillStyle = "#44dd88";
      ctx.fill();
    });
  }} />
```

Because the ticker follows the playhead, ticker-driven drawing stays frame-accurate in exports too; wall-clock timers (`setInterval`, `requestAnimationFrame`) render live but ignore the playhead.

## External renderers

Anything that accepts an existing canvas plugs in directly; a detached canvas is fine for WebGL:

```tsx
<surface width={1280} height={720}
  ref={(el) => {
    const renderer = new THREE.WebGLRenderer({
      canvas: el,
      preserveDrawingBuffer: true,
      alpha: true,
    });
    renderer.setSize(el.width, el.height, false);
    const { time } = useTicker();
    createEffect(() => {
      mesh.rotation.y = time() * 0.5;
      renderer.render(scene, camera);
    });
    onCleanup(() => renderer.dispose());
  }} />
```

- **`preserveDrawingBuffer: true` is effectively required for WebGL** — by default the drawing buffer may be cleared after presentation, so the engine's per-frame sample can read back blank.
- `renderer.setSize(w, h, false)` resizes the bitmap through three.js; the third argument skips CSS sizing, which is meaningless on a detached canvas.
- Browsers cap live WebGL contexts per page (typically ~16, oldest evicted). One renderer is fine; don't give each of many paints its own GL context — share one renderer and copy frames out via `ImageBitmap` if you need many.

## Props

| Prop | Type | Default | Meaning |
| ---- | ---- | ------- | ------- |
| `ref` | `(canvas: HTMLCanvasElement) => void` | **required** | Receives the backing canvas at materialization. |
| `opacity` | `Animatable<number>` | `1` | Paint opacity, `0`-`1`. |

Like all paints it stacks with siblings in document order and clips to the parent's box (including `cornerRadius`). `<surfacePaint>` takes no children.

## Persistence and export

The compiled module is persisted with the document, so the drawing is reproducible, not ephemeral: on reload, export, and `dapi node capture` the engine re-executes it and redraws into a fresh canvas driven by that context's playhead, so ticker surfaces animate in exports. The bitmap itself is not stored; your code reproduces it. This assumes the module's structure is deterministic (`Math.random()`/`Date.now()` must not decide the shape of the tree; using them inside a draw effect is fine).

## Requirements and limitations

- Duplicating or copy-pasting a mounted surface yields a static copy (the drawing does not re-run for the copy); re-mount to get a fresh animated instance.
- Only the `ref` attribute form on the element itself is routed; refs inside spread props are not.
- A real DOM `<canvas>` is not available inside [`<html>`](./html.md) content — its pixels don't survive the html-in-canvas rasterization. Use `<surface>` for hand-drawn graphics instead.
