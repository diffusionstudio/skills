# Diffusion Studio — visual guide

Color, type, logo, layout, safe areas, captions, worked examples, and open placeholders.
Applies to stills and video alike.

Motion, cuts, and sound are in `video.md`. `dapi` mechanics are in the `editor` skill.

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

Cut every word that can go, take the short word over the long one and the active voice over
the passive, and never use a figure of speech you are used to seeing in print. Copy that
overruns a cap gets rewritten, not shrunk.

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

## Examples

Static geometry at 1080×1920. `video.md` covers how these enter and leave.

### Title card

```tsx
<scene key="intro" name="Intro" width={1080} height={1920} fill="#000000">
  <text name="Title" start={0} end={4}
    x={64} y={1140} width={836} height={240} textAlign="left" textBaseline="bottom"
    fontFamily="Geist" fontSize={96} fontWeight={600} fill="#F8F8F8">
    Timeline, rebuilt
  </text>
  <text name="Subtitle" start={0} end={4}
    x={64} y={1404} width={836} height={80} textAlign="left" textBaseline="top"
    fontFamily="Geist" fontSize={60} fontWeight={400} fill="#A4A4A4">
    Every clip, one gesture
  </text>
</scene>
```

Left edge 64, right edge 900. Title glyphs land at 1380, subtitle starts 24 below, and the
block closes at 1484 — inside the read limit.

### Lower third over product footage

```tsx
<scene key="feature" name="Feature" width={1080} height={1920} fill="#000000">
  <video src="/Movies/capture.mp4" width={1080} height={1920} start={0} end={6} />
  <rect x={0} y={1348} width={1080} height={172} fill="#161616" />
  <text name="Name" start={0} end={6}
    x={64} y={1380} width={836} height={60} textAlign="left" textBaseline="bottom"
    fontFamily="Geist" fontSize={48} fontWeight={500} fill="#F8F8F8">
    Shader paint
  </text>
  <text name="Detail" start={0} end={6}
    x={64} y={1456} width={836} height={40} textAlign="left" textBaseline="top"
    fontFamily="Geist" fontSize={30} fontWeight={400} fill="#A4A4A4">
    Live GLSL on any layer
  </text>
</scene>
```

The panel carries the text over moving footage. Name and detail sit 16 apart; the panel pads
32 above the name box and closes on 1520, the read limit.

## Placeholders

| Item | Status | Replace with |
| ---- | ------ | ------------ |
| Logo bug | omitted | a video-scale asset, then its slot and timing |
| Endcard | omitted | a composition and the CTA string |
