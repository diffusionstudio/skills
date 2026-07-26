# `<text>`

A text node; children become editable glyphs. Because the box defaults to the parent's box, a centered full-frame title is simply `<text textAlign="center" textBaseline="middle">…</text>`.

```tsx
<text fill="#FFFFFF" fontSize={128} fontWeight="bold" textAlign="center" textBaseline="middle">
  Hello World
</text>
```

## Props

All [common props](./elements.md#common-props), plus:

| Prop | Type | Default | Meaning |
| ---- | ---- | ------- | ------- |
| children | `string` (or expressions resolving to strings) | **required** | The text content. |
| `fontFamily` | `string` | editor default | A family available on the machine ([`dapi fonts`](../fonts.md)); see [fonts.md](./fonts.md). |
| `fontSize` | `number` | editor default | Px. |
| `fontWeight` | `number \| "normal" \| "bold"` | `"normal"` | CSS weights `100`-`900`. |
| `fontStyle` | `"normal" \| "italic"` | `"normal"` | |
| `fill` | `string` | white | The glyph color; any CSS color, alpha ignored (use `opacity`). Shorthand for a solid paint child (see [paints.md](./paints.md)); animate it by declaring the paint explicitly. |
| `textAlign` | `"left" \| "center" \| "right"` | `"left"` | Horizontal alignment of glyphs within the box. |
| `textBaseline` | `"top" \| "middle" \| "bottom"` | `"top"` | Vertical alignment within the box. |

The text-only [animation types](./animations.md) (`"appearWord"`, `"appearChar"`, `"scramble"`) animate the glyphs themselves.
