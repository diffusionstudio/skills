# Timing

Timing props follow Lottie-inspired semantics. All values are **composition-relative** (measured against the parent's timeline), in any supported [time format](#time-formats).

| Prop | Lottie | Meaning |
| ---- | ------ | ------- |
| `inPoint` | `ip` | Composition time at which the node becomes visible/audible. |
| `outPoint` | `op` | Composition time at which the node stops. |
| `startTime` | `st` | Composition time at which the node's *source* time 0 is placed. Shifts the source content within the in/out window. Defaults to the in point. |

## Semantics

- `inPoint` / `outPoint` define the **visible/audible window** on the parent timeline. They are a pair; if omitted, a media node fits its natural duration and a group auto-fits its children.
- `startTime` controls **which part of the source plays inside that window**. It is the composition time where source frame 0 sits, so it may be negative to skip into the source.
- Instead of declaring `startTime`, a media node can derive it from another node's audio with `syncTo` (see [audio-sync.md](./audio-sync.md)).

> Example: `inPoint={0} outPoint={16} startTime="-30f"` shows the clip from composition second 0 to 16, but because source-time-0 is placed 30 frames *before* the in point, the first 30 frames (1s @ 30fps) of the source are trimmed; playback begins 1s into the source.

## Time formats

```ts
type Time = number | `${number}f` | `${string}:${string}`;
```

The canonical internal unit is frames at **30 fps**; all formats are converted on import. All values may be negative.

| Format | Example | Meaning |
| ------ | ------- | ------- |
| `number` | `2.2` | Seconds (may be fractional). |
| `"${number}f"` | `"-30f"` | Frames. |
| `"MM:SS"` | `"02:30"` | Minutes and seconds. |
| `"HH:MM:SS"` | `"01:02:30"` | Hours, minutes, seconds. |

CLI flags documented as taking a `Time` value (e.g. `--time` on [`node capture`](../node/capture.md) and [`media grab`](../media/grab.md)) accept the same formats.
