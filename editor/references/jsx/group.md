# `<group>`

A container with a transform but no dimensions of its own: a group derives its box from its children, and they are positioned relative to it.

```tsx
<group x={100} y={100}>
  {/* children */}
</group>
```

## Props

A group takes only **transform** (`x`, `y`, `rotation`, `opacity`) and **timing** (`start`, `end`) props (see [common props](./elements.md#common-props) and [timing.md](./timing.md)). It has no `fill` and no explicit `width` / `height`, and takes no [paint children](./paints.md): its size is auto-fit from its children. When timing is omitted, a group spans its children in time as well (see [timing.md](./timing.md)).
