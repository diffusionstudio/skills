# `<group>`

A container with a transform. Children are positioned relative to the group's box; give it `fill` to draw a rectangle behind them.

```tsx
<group x={100} y={100} width={800} height={600} fill="#111111">
  {/* children */}
</group>
```

## Props

All [common props](./elements.md#common-props), plus:

| Prop | Type | Default | Meaning |
| ---- | ---- | ------- | ------- |
| `fill` | `string` | none | Any CSS color, applied to the node's fill; alpha is ignored (use `opacity`). |

Also accepts [paint children](./paints.md). When `inPoint`/`outPoint` are omitted, a group auto-fits its children (see [timing.md](./timing.md)).
