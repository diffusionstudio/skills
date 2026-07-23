# Timing

Timing splits the two independent questions a clip answers: **where it sits on the parent timeline** (`start` / `end`) and **which part of its source plays** (`sourceIn` / `sourceOut`). All values accept any [time format](#time-formats).

| Prop | Meaning |
| ---- | ------- |
| `start` | Parent-timeline time at which the clip begins. Default 0. |
| `end` | Parent-timeline time at which the clip ends. Alternative to `sourceOut`. |
| `sourceIn` | Source in point: the time within the source where playback begins. Default 0; trims the head. |
| `sourceOut` | Source out point: the time within the source where playback ends. Defaults to the source's natural end. Alternative to `end`. |

## Semantics

- `start` / `end` place the clip on the parent timeline. `sourceIn` / `sourceOut` select which part of the source plays. On-timeline duration always equals the played source length, so `end - start == sourceOut - sourceIn`.
- **Trimming the source is not the same as moving the clip.** To drop part of the source you must move `sourceIn` / `sourceOut`; changing `start` alone only slides the clip along the timeline while the full source keeps playing. If the source is meant to stay aligned with something else in the scene (synced audio, a transcript, another track), advance `start` and `sourceIn` **together** — moving one without the other offsets the content instead of trimming it.
- **`end` and `sourceOut` are two spellings of the same out edge** — the clip's end in timeline time (`end`) versus source time (`sourceOut`). Set one; the last one set wins.
- Sourceless nodes (`<rect>`, `<group>`, `<text>`, `<html>`, `<surface>`) have no footage to trim, so you place them with `start` / `end` alone.
- Instead of setting `start`, a media node can derive its placement from another node's audio with `syncTo` (see [audio-sync.md](./audio-sync.md)).
- If timing is omitted, a media node fits its natural duration at `start` 0, and a group auto-fits its children. A [`<sequence>`](./sequences.md) does not position its children for you: give each an explicit `start` (the next clip's `start` is the previous clip's end).
- **A sourceless _leaf_ node with no `end` defaults to a fixed 16-second duration**

> Examples:
> - `<rect start={2} end={5} width={200} height={120} fill="red" />` — a rectangle on screen from timeline second 2 to 5.
> - `<video start={5} sourceIn={10} sourceOut={20} />` — plays source seconds 10–20 (a 10-second clip) beginning at timeline second 5.
> - `<video start={2} end={5} sourceIn={10} />` — the same source starting at 10 s, stretched to fill the timeline window 2–5 (so it plays source 10–13).
> - `<video start={0} sourceIn={1} />` — trims the first second off the head and places the clip at the top of the timeline.

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
