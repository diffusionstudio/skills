# `<rect>`

A filled rectangle. Takes only [paint children](./paints.md); use `cornerRadius` for rounded corners.

```tsx
<rect x={40} y={40} width={640} height={360} cornerRadius={24} fill="#FF0055" />
```

## Props

All [common props](./elements.md#common-props), plus:

| Prop | Type | Default | Meaning |
| ---- | ---- | ------- | ------- |
| `fill` | `string` | light gray | Any CSS color; alpha is ignored (use `opacity`). Shorthand for a solid paint child. |
