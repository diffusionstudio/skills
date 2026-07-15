# `<image>`

An image. `src` resolves to an image asset (see [media.md](./media.md)).

```tsx
<image src="/photo.jpg" x={40} y={40} width={200} height={112} />
```

**Sizing.** Like [`<video>`](./video.md), when `width`/`height` are omitted the box defaults to the source's **intrinsic dimensions**, not the parent box — set them explicitly to fit a differently-shaped scene. `objectFit` then governs how the source maps into that box.

## Props

All [common props](./elements.md#common-props), plus:

| Prop | Type | Default | Meaning |
| ---- | ---- | ------- | ------- |
| `src` | `string \| AssetRef` | **required** | See [media.md](./media.md). |
| `objectFit` | `"cover" \| "contain" \| "fill"` | `"contain"` | How the source maps into the box. |

A paint child draws over the media paint created by `src` (see [paints.md](./paints.md)).
