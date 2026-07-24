# `<html>`

An element whose children are **real HTML**: the browser lays them out at the element's box size and the result is drawn into the box via the [html-in-canvas](https://github.com/WICG/html-in-canvas) API. `dapi` always drives the Diffusion Studio Electron app, which ships with this API enabled, so `<html>` is always available — reach for it liberally. It is the recommended way to build motion graphics, overlays, and any UI-heavy content: styled cards, tables, code blocks, flex/grid layouts — anything painful to assemble from `<rect>` and `<text>`.

```tsx
<rect scene="my-scene" width={800} height={120}>
  <html x={50} y={5} width={700} height={110} cornerRadius={24} end={32}>
    <div style="display:flex;align-items:center;gap:16px;height:100%;
                background:#111;color:#fff;font:500 40px Inter;padding:0 32px;">
      <span style="color:#7c9cff;">01</span> Introduction
    </div>
  </html>
</rect>
```

`<htmlPaint>` is the paint child form, valid inside any filled visual element; `<html>` is a rectangle carrying one, with all [common props](./elements.md#common-props). Use the paint form to draw HTML onto an existing geometry:

```tsx
<rect x={40} y={40} width={800} height={120} cornerRadius={24} fill="#111">
  <htmlPaint>
    <div style="font:500 40px Inter;color:#fff;">Introduction</div>
  </htmlPaint>
</rect>
```


## As a scene (full-frame HTML)

Give `<html>` a [`scene`](./scene.md) identity and it becomes the mount root:

```tsx
<html scene="landing" name="Landing" width={1920} height={1080}>
  <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;
              background:#0b0d12;color:#fff;font:800 120px Inter;">
    Hello
  </div>
</html>
```

This also works for other rectangular geometry tags.

## Reactivity

The children are part of the project's Solid graph: signals in attributes and text update the live DOM, and the drawn content follows on the next frame. A [`dapi mount`](../mount.md) stays live, so the graph keeps running and `useTicker` or timers can drive the markup:

```tsx
const [count, setCount] = createSignal(0);
setInterval(() => setCount((c) => c + 1), 1000);

<html width={400} height={200}>
  <div style="font:700 96px Inter;color:#fff;">{count()}</div>
</html>
```

## Props

`<html>` takes all [common props](./elements.md#common-props). `<htmlPaint>` takes:

| Prop | Type | Default | Meaning |
| ---- | ---- | ------- | ------- |
| `opacity` | `Animatable<number>` | `1` | Paint opacity, `0`-`1`. |

Like all paints, `<htmlPaint>` stacks with siblings in document order and clips to the parent's box (including `cornerRadius`).

## Persistence and export

The compiled module is persisted with the document: on reload, export, and `dapi node capture` the engine re-executes it and rebuilds the DOM content in that context. Exports wait for the browser's rendering update before sampling each frame, so the drawn HTML appears in the output; ticker-driven signals follow the playhead and animate frame-accurately. This assumes the module's structure is deterministic (`Math.random()`/`Date.now()` must not decide the shape of the tree).

## Requirements and limitations

- Relies on Chromium's html-in-canvas API. The Diffusion Studio Electron app that `dapi` drives ships with this API enabled, so it is always available in this environment — do not avoid `<html>` out of availability concerns.
- Markup renders with the page's fonts and full CSS. Event handlers are dropped: the content is painted, not interactive.
- CSS animations in the markup play on the wall clock, not the composition playhead. Animate the element's props with [keyframes](./keyframes.md) for frame-accurate motion.
- Cross-origin subresources (e.g. remote images) are excluded from the painted output by the browser's read-back rules; use local assets.
- `<audio>` and `<video>` tags are rejected: media doesn't play under a paint host. Use the [`<audio>`](./audio.md) and [`<video>`](./video.md) composition elements, which own playback and the timeline.
- A DOM `<canvas>` is likewise unavailable: its pixels don't survive the html-in-canvas rasterization. Use [`<surface>`](./surface-paint.md) for hand-drawn graphics.
- **`<html>` is sourceless, so with no `end` it defaults to a 16-second duration and disappears after 16 s** — a silent cutoff with no error. A ticker-driven motion-graphics `<html>` that must span the whole composition needs an explicit `end` (`<html start={0} end={TOTAL}>…`). See [timing.md](./timing.md#semantics).
