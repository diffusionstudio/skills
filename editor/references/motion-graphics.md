# Motion graphics

How to create graphical content — overlays, titles, callouts, animated UI, 3D, and effects — inside a composition. Pick the building block that fits the content, then animate it (see [Animating](#animating) below).

## Building blocks

- **`<html>` — the default for motion graphics, overlays, and UI-heavy graphics.** Its children are real HTML laid out and painted into the box, so styled cards, tables, code blocks, titles, and flex/grid layouts are far easier than hand-building them from `<rect>` and `<text>`. `dapi` always runs inside the Diffusion Studio Electron app, which has the html-in-canvas API enabled, so `<html>` is always available — prefer it and use it as much as possible. See [html-paint.md](./jsx/html-paint.md).
- **`<surface>` + Three.js — for anything 3D.** A ref-provided canvas you draw into, sampled every frame; render a Three.js scene into it. See [surface-paint.md](./jsx/surface-paint.md).
- **Shaders — for GPU effects.** Paint fragment-shader output into an element for gradients, distortion, and generative visuals. See [shader-paint.md](./jsx/shader-paint.md).
- **`<rect>`, `<text>`, and paints — for simple primitives.** Reach for these when the graphic is genuinely a shape or a line of type rather than a laid-out block. See [elements.md](./jsx/elements.md) and [text.md](./jsx/text.md).

## Animating

Animate frame-accurately with [keyframes](./jsx/keyframes.md) and [animations](./jsx/animations.md). For anything beyond a single tween — sequenced, staggered, or multi-property motion — it is recommended to work with **anime.js timelines**, which orchestrate the motion cleanly and keep complex sequences readable.

## Captions and on-screen text

- Add auto captions last, after everything else is assembled, so they transcribe the finished audio at its final placement.
- Default to the `"classic"` caption preset — it reads cleanly across almost any footage. Only reach for another preset when the brief calls for a specific look (e.g. `spotlight`/`guinea` for punchy word-by-word highlighting, `whisper` for understated subtitles, `stark` for a blended-in title treatment). See [captions.md](./jsx/captions.md).
- Never stack a text overlay on top of captions. A styled overlay and the running caption track compete for the same reading attention. Wherever an overlay appears, [trim the captions](./jsx/captions.md#trimming) so the transcript is absent for that stretch and the overlay owns the moment. The two should hand off in time, not overlap.
