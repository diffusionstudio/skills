# Paints

Internally a node's fill is not a property but a **paint child**: a sub-entity appended to the geometry, exactly like the editor's fill list. The `fill` prop is shorthand for a solid paint; declaring paints as JSX children exposes the full model, including gradients:

```tsx
<Rect width={640} height={360} cornerRadius={24}>
  <LinearGradientPaint rotation={90}>
    <ColorStop offset={0} color="#FF0055" />
    <ColorStop offset={1} color="#0055FF" />
  </LinearGradientPaint>
</Rect>
```

Paint elements are valid inside any filled visual element (`<Rect>`, `<Scene>`, `<Text>`, `<Video>`, `<Image>`); a `<Group>` has no fill of its own, so it takes none. Multiple paints stack in document order; later paints render on top, and a paint child on a `<Video>`/`<Image>` draws over the media paint created by `src`.

| Element | Props | Meaning |
| ------- | ----- | ------- |
| `<SolidPaint>` | `color` (**required**), `opacity` | Solid fill; equivalent to the `fill` prop. |
| `<LinearGradientPaint>` | `rotation`, `opacity` | Linear gradient across the parent's box; `rotation` in degrees, `0` = left to right. |
| `<RadialGradientPaint>` | `rotation`, `opacity` | Radial gradient centered in the parent's box. |
| `<ColorStop>` | `offset` (**required**, `0`-`1`), `color` (**required**), `opacity` | Gradient color stop. Valid only inside gradient paints, which take no other children. |
| [`<HtmlPaint>`](./html-paint.md) | `opacity`, HTML children | Reactive HTML laid out and drawn into the parent's box (flagged Chromium API). `<Html>` is shorthand for a `<Rect>` carrying one. |
| [`<SurfacePaint>`](./surface-paint.md) | `opacity`, `ref` (**required**) | A canvas your `ref` callback draws into (any context type), sampled into the parent's box every frame. `<Surface>` is shorthand for a `<Rect>` carrying one. |

Colors accept any CSS color; alpha is ignored (use `opacity`). `color`, `opacity`, and `offset` are animatable (see [keyframes.md](./keyframes.md)), so gradients can animate. Paints have no spatial or timing props and cannot be document roots.

Paints are live entities like any other: patch them with [`dapi node patch`](../node/patch.md), and add a stop to an existing gradient with [`dapi node insert`](../node/insert.md) (`node insert <paintId> '<ColorStop offset={0.5} color="#FF0055" />'`).
