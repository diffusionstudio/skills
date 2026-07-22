# Keyframes

Animatable props accept a keyframe list in place of a static value:

```tsx
<image
  src="/photo.jpg"
  start={0} end={5}
  x={[
    { time: 0, value: -400 },
    { time: 1, value: 200, easing: "easeOut" },
  ]}
  opacity={[{ time: 0, value: 0 }, { time: "15f", value: 1 }]}
/>
```

```ts
type Keyframe<T> = { time: Time; value: T; easing?: Easing };
type Animatable<T> = T | Keyframe<T>[];
```

Animatable props: `x`, `y`, `offsetX`, `offsetY`, `width`, `height`, `rotation`, `opacity`, `cornerRadius`, `volume`, `color`, `offset`. As part of the shared property table this applies to [`dapi node patch`](../node/patch.md) identically, and to [paints and color stops](./paints.md) (`color`, `opacity`, `offset` animate gradients). For preset in/out effects (fade, slides, text reveals, ...) use the [`animations` prop](./animations.md) instead.

## Semantics

- `time` is **node-local**: `0` is where the clip begins (its `start`), in any [time format](./timing.md#time-formats). Timing props are parent-relative; keyframe times are not, so animation moves with the clip.
- Outside the keyframed range the value holds at the first/last keyframe.
- `easing` shapes the segment from its keyframe to the next; the last keyframe's easing is ignored. Default `"linear"`.
- A **static value replaces any existing keyframes** on that property; mount and `dapi node patch` own what they set. Keyframes land as regular editor keyframes, editable in the timeline and inspector, and props the render doesn't set keep their hand-made tracks across re-mounts.

## Easing

| Easing | Use for |
| ------ | ------- |
| `"linear"` (default) | Constant-rate change. |
| `"easeIn"`, `"easeOut"`, `"easeInOut"` | Standard acceleration curves (CSS equivalents). |
| `"gentle"`, `"snappy"`, `"bouncy"`, `"strong"` | Spring presets, from soft settle to hard overshoot. |
| `"cubicBezier(x1,y1,x2,y2)"` | Custom curve, CSS control points. |
| `"spring(bounce,duration)"` | Custom spring: bounce `0`-`1`, duration in ms. |
| `"steps(n)"` | Discrete hold: n equal steps, no interpolation. |

Named presets expand to the same descriptors the editor's interpolation inspector writes, so they round-trip cleanly.
