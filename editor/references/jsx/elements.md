# Element reference

camelCase composition elements map 1:1 onto internal node types. Lowercase DOM vocabulary is valid only inside [`<html>`](./html.md) content.

| Element | Internal node | Notes |
| ------- | ------------- | ----- |
| [`<group>`](./group.md) | **Container with Group tag** | Container with a transform; auto-fits its size from its children. Takes no `fill` or explicit size. |
| [`<rect>`](./rect.md) | **Geometry with Solid paint** | A filled rectangle; takes only paint children. |
| [`<video>`](./video.md) | **Geometry with Video paint** | `src` resolves to a video asset. |
| [`<image>`](./image.md) | **Geometry with Image paint** | `src` resolves to an image asset. |
| [`<audio>`](./audio.md) | **Geometry with Audio component and a hidden Waveform paint** | No visual output; carries volume. |
| [`<text>`](./text.md) | **Geometry with Text component** | Children become editable glyphs. |
| [`<sequence>`](./sequences.md) | **Sequential group** | Track container for back-to-back clips; positions are explicit. |
| [`<captions>`](./captions.md) | **Caption node** | Transcribes the enclosing scene's audio. |
| [`<solidPaint>`](./paints.md) | **Solid paint** | Paint child. |
| [`<linearGradientPaint>` / `<radialGradientPaint>`](./paints.md) | **Gradient paint** | Paint child; takes `<colorStop>` children. |
| [`<colorStop>`](./paints.md) | **Gradient color stop** | Valid only inside gradient paints. |
| [`<html>`](./html.md) | **Geometry with Html paint** | Children are real, reactive HTML drawn into the box by the browser (html-in-canvas, flagged Chromium API). `<htmlPaint>` is the paint child form. |
| [`<surface>`](./surface-paint.md) | **Geometry with Surface paint** | `ref` hands you a canvas to draw with any context type (2d, webgl, webgpu); sampled every frame. `<surfacePaint>` is the paint child form. |

A `<rect>` becomes a **scene** (the composition root) when given a `scene` identity: it then clips its children to `width`×`height` and is valid only at the document top level. See [scene.md](./scene.md).

User-defined components are ordinary Solid components; they compose the elements above and carry no runtime cost. Only the elements above produce entities.

## Coordinates and sizing

- Coordinates are **pixels relative to the parent's box**, origin top-left. No percentages, no layout keywords; explicit numbers until the layout engine lands.
- **Every element's box defaults to its parent's box**: `x` and `y` default to `0`, `width` and `height` default to the parent's size (the JSX analog of `position: absolute; inset: 0`). The scene's box is its required `width`×`height`.
- How media pixels map into the box is controlled by `objectFit` (default `"cover"`), never by the box itself. A generated asset's placeholder therefore always has a definite size, even before the asset exists.

## Common props

All visual elements accept:

| Prop | Type | Default | Meaning |
| ---- | ---- | ------- | ------- |
| `key` | `string` | none | A within-render label so another node can reference this one (e.g. [`syncTo`](./audio-sync.md)); |
| `scene` | `string` | none | Promotes a `<rect>` to a scene, the only mountable root, and is its identity across mounts (see [scene.md](./scene.md)). |
| `name` | `string` | none | Human-readable node name. |
| `x`, `y` | `Animatable<number>` | `0` | Position relative to the parent, px. |
| `offsetX`, `offsetY` | `Animatable<number>` | `0` | Render-time translation on top of `x`/`y`, px; moves the drawn content without changing the layout box. Subpixel values are kept. |
| `width`, `height` | `Animatable<number>` | parent size | Box size, px. |
| `rotation` | `Animatable<number>` | `0` | Rotation in degrees. |
| `opacity` | `Animatable<number>` | `1` | `0`-`1`. |
| `cornerRadius` | `Animatable<number>` | `0` | Uniform corner radius, px. |
| `start`, `end`, `sourceIn`, `sourceOut` | `Time` | see [timing.md](./timing.md) | Temporal placement. |
| `transition` | `TransitionSpec \| null` | none | Transition into the next clip; direct children of `<sequence>` only (see [transitions.md](./transitions.md)). |
| `animations` | `AnimationSpec[]` | none | Preset in/out animations over the clip's head and tail (see [animations.md](./animations.md)). |

`Animatable` props also take a keyframe list; see [keyframes.md](./keyframes.md).

## One property table

Common and per-element props share a single property table, exported as `PatchProps` from `@diffusionstudio/jsx`. [`dapi node patch`](../node/patch.md) accepts exactly these keys, with the same value requirements, as patch entries on existing nodes; JSX and CLI cannot drift.
