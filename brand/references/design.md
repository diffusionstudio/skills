# Diffusion Studio — visual guide

Color, type, logo, layout, safe areas, captions, and open placeholders. Applies to stills and
video alike.

Motion, cuts, and sound are in `video.md`. Copy rules are in `voice.md`. Reusable layouts are
listed in `library.md`. `dapi` mechanics are in the `editor` skill.

Aspect ratio follows the request. Every value below is given at **short edge 1080** and
scales linearly with the short edge.

## Color

Near-achromatic. Structure runs on luminance; color is an event, not a layer.

| Role | Hex | Source |
| ---- | --- | ------ |
| Background | `#000000` | `oklch(0% 0 0)` |
| Surface | `#161616` | `oklch(20% 0 0)` |
| Text | `#F8F8F8` | `oklch(98% 0 0)` |
| Text, secondary | `#A4A4A4` | `oklch(72% 0 0)` |
| Brand red | `#F43535` | rarely present |

Default to leaving red out — it lives on the app icon. At most one element carries it, never
a title and never a fill. The app's destructive state is `#E62D2D`, so red beside product UI
reads as an error.

`#008CFF` is the product blue. It appears only where real product UI is on screen. Never use
it as an accent.

Build emphasis from weight, size, or a `#161616` surface.

## Type

`Geist`. `Geist Mono` for code and figures. No italic is installed.

| Role | Size | Weight | Cap |
| ---- | ---- | ------ | --- |
| Title | 96 | 600 | 32 chars |
| Subtitle | 60 | 400 | 64 chars |
| Lower third, name | 48 | 500 | 28 chars |
| Lower third, detail | 30 | 400 | 40 chars |
| Label | 24 | 500 | 16 chars |
| Code — `Geist Mono` | 30 | 400 | 48 per line |

Copy that overruns a cap gets rewritten, not shrunk. Follow `voice.md` when writing it.

`<text>` carries no stroke and no shadow. Text over footage needs a `#161616` panel behind it.

## Logo

`#F8F8F8` on dark, `#030303` on light. Never red, never tinted, never over a busy frame.

Logo bug: PLACEHOLDER — no video-scale asset exists. Omit it and say you did.

## Layout

- **Margin** 64 from every edge.
- **Anchor low.** Text bottom-aligns in the lower third. Left-align it; center only when
  text stands alone on a plain background.
- **Two text elements at most** — a primary and its qualifier. A third means two shots.
- **Spacing** in multiples of 8: 16 between a label and its value, 24 between stacked lines
  of one block, 40 between separate blocks.

### Safe area — 9:16 only

At 1080×1920 keep anything that must be read inside `x 64–900`, `y 200–1520`. The right 180
is the platform's action rail, the bottom 400 its captions. Graphics may cross these bounds;
text may not. Every other aspect ratio uses the margin alone.

## Captions

`stark` on 9:16 output, `cascade` on everything else. Neither exposes color slots, so pass no
`colors`. On 9:16 do not bottom-anchor — the preset's 100 px bottom margin lands the block
inside the platform reserve.

## Library

Use `references/library.md` to choose a ready-made title card, lower third, callout, or full
composition. Keep the rules here and the reusable source in `assets/`.

## Placeholders

| Item | Status | Replace with |
| ---- | ------ | ------------ |
| Logo bug | omitted | a video-scale asset, then its slot and timing |
| Endcard | example only | an approved composition and CTA string |
