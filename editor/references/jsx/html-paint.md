# `<Html>`

An element whose children are **real HTML**: the browser lays them out at the element's box size and the result is drawn into the box via the [html-in-canvas](https://github.com/WICG/html-in-canvas) API. Use it for content that is painful to build from `<Rect>` and `<Text>`: styled cards, tables, code blocks, flex/grid layouts.

```tsx
<Html x={40} y={40} width={800} height={120} cornerRadius={24}>
  <div style="display:flex;align-items:center;gap:16px;height:100%;
              background:#111;color:#fff;font:500 40px Inter;padding:0 32px;">
    <span style="color:#7c9cff;">01</span> Introduction
  </div>
</Html>
```

`<HtmlPaint>` is the paint child form, valid inside any filled visual element; `<Html>` is a rectangle carrying one, with all [common props](./elements.md#common-props). Use the paint form to draw HTML onto an existing geometry:

```tsx
<Rect x={40} y={40} width={800} height={120} cornerRadius={24} fill="#111">
  <HtmlPaint>
    <div style="font:500 40px Inter;color:#fff;">Introduction</div>
  </HtmlPaint>
</Rect>
```

Inside the HTML children, the tag's case decides the environment: PascalCase tags are composition elements, lowercase tags are HTML/SVG DOM elements. Lowercase tags remain invalid outside `<Html>`/`<HtmlPaint>` content.

## Reactivity

The children are part of the project's Solid graph: signals in attributes and text update the live DOM, and the drawn content follows on the next frame. A [`dapi mount`](../mount.md) stays live, so the graph keeps running and `useTicker` or timers can drive the markup:

```tsx
const [count, setCount] = createSignal(0);
setInterval(() => setCount((c) => c + 1), 1000);

<Html width={400} height={200}>
  <div style="font:700 96px Inter;color:#fff;">{count()}</div>
</Html>
```

## Props

`<Html>` takes all [common props](./elements.md#common-props). `<HtmlPaint>` takes:

| Prop | Type | Default | Meaning |
| ---- | ---- | ------- | ------- |
| `opacity` | `Animatable<number>` | `1` | Paint opacity, `0`-`1`. |

Like all paints, `<HtmlPaint>` stacks with siblings in document order and clips to the parent's box (including `cornerRadius`).

## Persistence and export

The compiled module is persisted with the document: on reload, export, and `dapi node capture` the engine re-executes it and rebuilds the DOM content in that context. Exports wait for the browser's rendering update before sampling each frame, so the drawn HTML appears in the output; ticker-driven signals follow the playhead and animate frame-accurately. This assumes the module's structure is deterministic (`Math.random()`/`Date.now()` must not decide the shape of the tree).

## Requirements and limitations

- Requires Chromium's html-in-canvas API, currently behind `chrome://flags/#canvas-draw-element`. Mounting `<Html>` or `<HtmlPaint>` fails with an explicit error when the API is unavailable.
- Markup renders with the page's fonts and full CSS. Event handlers are dropped: the content is painted, not interactive.
- CSS animations in the markup play on the wall clock, not the composition playhead. Animate the element's props with [keyframes](./keyframes.md) for frame-accurate motion.
- Cross-origin subresources (e.g. remote images) are excluded from the painted output by the browser's read-back rules; use local assets.
- `<audio>` and `<video>` tags are rejected: media doesn't play under a paint host. Use the [`<Audio>`](./audio.md) and [`<Video>`](./video.md) composition elements, which own playback and the timeline.
- A DOM `<canvas>` is likewise unavailable: its pixels don't survive the html-in-canvas rasterization. Use [`<Surface>`](./surface-paint.md) for hand-drawn graphics.
