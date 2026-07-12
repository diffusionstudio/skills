# Paints

Internally a node's fill is not a property but a **paint child**: a sub-entity appended to the geometry, exactly like the editor's fill list. The `fill` prop is shorthand for a solid paint; declaring paints as JSX children exposes the full model, including gradients:

```tsx
<rect width={640} height={360} cornerRadius={24}>
  <linearGradientPaint rotation={90}>
    <colorStop offset={0} color="#FF0055" />
    <colorStop offset={1} color="#0055FF" />
  </linearGradientPaint>
</rect>
```

Paint elements are valid inside any filled visual element (`<rect>`, `<scene>`, `<text>`, `<video>`, `<image>`); a `<group>` has no fill of its own, so it takes none. Multiple paints stack in document order; later paints render on top, and a paint child on a `<video>`/`<image>` draws over the media paint created by `src`.

| Element | Props | Meaning |
| ------- | ----- | ------- |
| `<solidPaint>` | `color` (**required**), `opacity` | Solid fill; equivalent to the `fill` prop. |
| `<linearGradientPaint>` | `rotation`, `opacity` | Linear gradient across the parent's box; `rotation` in degrees, `0` = left to right. |
| `<radialGradientPaint>` | `rotation`, `opacity` | Radial gradient centered in the parent's box. |
| `<colorStop>` | `offset` (**required**, `0`-`1`), `color` (**required**), `opacity` | Gradient color stop. Valid only inside gradient paints, which take no other children. |

Colors accept any CSS color; alpha is ignored (use `opacity`). `color`, `opacity`, and `offset` are animatable (see [keyframes.md](./keyframes.md)), so gradients can animate. Paints have no spatial or timing props and cannot be document roots.

Paints are live entities like any other: patch them with [`dapi node patch`](../node/patch.md), and add a stop to an existing gradient with [`dapi node insert`](../node/insert.md) (`node insert <paintId> --code '<colorStop offset={0.5} color="#FF0055" />'`).
