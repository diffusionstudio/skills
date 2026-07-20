# `<video>`

A video clip. `src` resolves to a video asset (see [media.md](./media.md)); when timing is omitted, the node fits its natural duration (see [timing.md](./timing.md)).

```tsx
<video src="/Movies/main.mp4" width={1920} height={1080} start={0} sourceIn={1} sourceOut={13} volume={-3} />
```

## Props

All [common props](./elements.md#common-props), plus:

| Prop | Type | Default | Meaning |
| ---- | ---- | ------- | ------- |
| `src` | `string \| AssetRef` | **required** | See [media.md](./media.md). |
| `objectFit` | `"cover" \| "contain" \| "fill"` | `"cover"` | How the source maps into the box. |
| `volume` | `Animatable<number>` | `0` | Decibels: `0` = unity, negative attenuates (`-6` ≈ half as loud), `-Infinity` = silence. Not linear. |
| `muted` | `boolean` | `false` | Excludes the node's audio from the mix; independent of `volume`. |
| `syncTo` | `string` | none | Key of another element carrying audio; derives `start` by audio alignment (see [audio-sync.md](./audio-sync.md)). Mutually exclusive with `start`. |

A paint child draws over the media paint created by `src` (see [paints.md](./paints.md)); a [`<shaderPaint>`](./shader-paint.md) child instead post-processes it, so the frame renders through the shader.
