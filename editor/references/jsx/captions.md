# Captions

`<captions />` inside a scene transcribes that scene's audio into a caption node: a styled, timed transcript, produced on import. To caption an already-open scene, insert one with [`dapi node insert`](../node/insert.md).

```tsx
<captions />
```

Transcription is **asynchronous and non-blocking**: the caption node is inserted at commit and its transcript attaches once ready. Because it reads the scene's audio, it runs **after** any generated assets in the scene have landed and after [audio sync](./audio-sync.md) has resolved; captioning a generated `voice`/`audio` track transcribes the finished audio at its final placement. The scene must contain an unmuted audio or video source; otherwise the caption node is left empty.

Transcripts are **cached**: every transcript asset records a fingerprint of the scene's audible mix (source content, placement, source offset, playback rate, gain). When a scene's fingerprint matches an existing transcript, that asset is reused instead of transcribing again; re-mounting a project with unchanged audio consumes no credits. Any change to the scene's audio invalidates the fingerprint.

## Props

| Prop | Type | Default | Meaning |
| ---- | ---- | ------- | ------- |
| `preset` | see below | `"classic"` | Caption style preset. |
| `colors` | `string[]` | preset defaults | Fills the preset's color slots in order; any CSS color, alpha ignored. Ignored by presets without slots. |
| `verticalAlign` | `"top" \| "center" \| "bottom"` | preset default | Vertical placement of the caption block: anchored to the top or bottom safe margin (100 px), or centered. Horizontal placement stays with the preset. |
| `seed` | `number` | none | Joins the transcript cache key: a value unused for this audio transcribes the scene again instead of reusing the cached transcript (it costs credits). Reusing a value replays that take from cache. |
| `offsetX`, `offsetY` | `Animatable<number>` | `0` | Render-time nudge in px on top of the preset placement; subpixel values are kept. A slide animation drives the same channel and wins while it plays. |
| `start`, `end`, `sourceIn`, `sourceOut` | `Time` | full transcript | Trim which stretch of the transcript is captioned, using the same [timing](./timing.md) semantics as media nodes. Set the source window (`sourceIn`/`sourceOut`) and timeline placement (`start`/`end`) together — see [Trimming](#trimming). |

The preset positions the caption block; `verticalAlign` overrides only its vertical anchor (`whisper` and `cascade` default to `bottom`, all other presets to `center`), and `offsetX`/`offsetY` nudge the drawn result from there.

## Trimming

Captions carry the same [timing](./timing.md) props as media nodes, and the transcript is source content that must stay aligned to the audio — so advance `start` and `sourceIn` together (and `end`/`sourceOut`), never `start` alone. To show only from 15 s onward, set both `sourceIn={15}` and `start={15}`. One node can't skip a gap, so to blank captions out for a middle stretch — e.g. under an overlay — use two nodes that meet at the gap:

```tsx
<captions start={0} end={15} sourceIn={0} sourceOut={15} />   // before the overlay
<captions start={20} sourceIn={20} />                         // after the overlay
```

## Presets

`preset` selects the caption style: the same presets as the editor's caption inspector. Some presets expose **color slots**, filled in order by the `colors` prop; a missing or omitted entry falls back to the slot's default.

| Preset | Style | Color slots (defaults) |
| ------ | ----- | ---------------------- |
| `"classic"` (default) | Simple one word captions, first choice for vertical content | none |
| `"whisper"` | Small, wide, understated line shown in ~2 s phrases, first choice for landscape content | none |
| `"cascade"` | Light text in the lower left; words appear progressively as they are spoken | none |
| `"spotlight"` | Bold italic centered line; the spoken word lights up in the highlight color | 1: highlight (`#24D5FF`) |
| `"paper"` | Centered two-line block; the line being spoken is emphasized with a heavier weight. | none |
| `"guinea"` | Uppercase display text; the spoken word enlarges and cycles through the three colors. | 3: `#F55353`, `#FEB139`, `#F6F54D` |
| `"stark"` | Heavy uppercase text blended into the footage with a difference blend. | none |
