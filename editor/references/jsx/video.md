# `<video>`

A video clip. `src` resolves to a video asset (see [media.md](./media.md)); when `inPoint`/`outPoint` are omitted, the node fits its natural duration (see [timing.md](./timing.md)).

```tsx
<video src="/Movies/main.mp4" inPoint={0} outPoint={12} startTime="-30f" volume={0.8} />
```

## Props

All [common props](./elements.md#common-props), plus:

| Prop | Type | Default | Meaning |
| ---- | ---- | ------- | ------- |
| `src` | `string \| AssetRef` | **required** | See [media.md](./media.md). |
| `objectFit` | `"cover" \| "contain" \| "fill"` | `"cover"` | How the source maps into the box. |
| `volume` | `Animatable<number>` | `1` | `0`-`1`; `1` = unity gain. |
| `muted` | `boolean` | `false` | Excludes the node's audio from the mix; independent of `volume`. |
| `syncTo` | `string` | none | Key of another element carrying audio; derives `startTime` by audio alignment (see [audio-sync.md](./audio-sync.md)). Mutually exclusive with `startTime`. |

A paint child draws over the media paint created by `src` (see [paints.md](./paints.md)).
