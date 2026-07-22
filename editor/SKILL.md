---
name: editor
description: >-
  Understand, generate, and edit footage with Diffusion Studio via the `dapi`
  CLI: analyze video/audio/images, generate them with AI, and compose video
  compositions. Use for any media analysis, media generation, or video editing
  task.
---

The CLI is self-describing and ships its own API reference. Use `dapi --help`, `dapi <group> --help`, and `dapi <group> <command> --help` to enumerate every command, argument, and option, and treat live help as authoritative rather than working from memory.

# Footage analysis

How to understand source material before editing it. Inspect only the modalities the decision turns on — speech, action, music, graphics, or atmosphere may lead, so there is no fixed priority. Sample the picture against what the audio tells you.

1. **Probe first.** `dapi media probe <id|path>` reports the container and its tracks, telling you up front whether the file has a video track, an audio track, or both. Everything after branches on that.
2. **Get the lay of the land.** Render a `dapi media waveform` (audio) and a `dapi media filmstrip` (video) for a fast, cheap overview of where the loud and quiet stretches and the visual scene changes fall. A filmstrip shows coarse structure and scene state, not crop, framing, readability, or an exact cut frame — grab a specific frame for any of those.
3. **Listen to the audio.** Run `dapi media listen` with a prompt tailored to the context (what you actually need to know), and explicitly ask the model to include timestamps in its answer. See [listen-prompts.md](references/listen-prompts.md) for prompt patterns.
4. **Transcribe speech.** For speech, `dapi media transcribe` prints word-level start/end times directly and takes `--start`/`--end` to scope a range — read any segment straight from it.
5. **Sample the video against the audio.** Use `dapi media grab` to pull frames. When the audio has already pointed you at specific moments, feed those timestamps straight in from the transcript or listen output, e.g. `-t '00:32' '00:45' ...`. When you need a visual pass without such cues, reach for `--auto`: it scans the footage and keeps only the frames where the picture settles into a new visual state, dropping near-duplicates.

# Video Editing

1. **Write the brief first.** For anything nontrivial, capture the edit as a markdown file: it is the plan every mount works toward and the thing to check the result against.
2. **Lay down the A-roll.** Assemble the primary footage as JSX and `dapi mount` it. Get the spine of the edit right before anything else.
3. **Layer the rest on top.** Once the A-roll holds, add B-roll and secondary assets (sound effects, captions, overlays) with further mounts or `dapi node insert`.

# Motion graphics

- **`<html>` — the default for motion graphics, overlays, and UI-heavy graphics.** Its children are real HTML laid out and painted into the box, so styled cards, tables, code blocks, titles, and flex/grid layouts are far easier than hand-building them from `<rect>` and `<text>`. `dapi` always runs inside the Diffusion Studio Electron app, which has the html-in-canvas API enabled, so `<html>` is always available — prefer it and use it as much as possible. See [html-paint.md](references/jsx/html-paint.md).
- **`<surface>` + Three.js — for anything 3D.** A ref-provided canvas you draw into, sampled every frame; render a Three.js scene into it. See [surface-paint.md](references/jsx/surface-paint.md).
- **Shaders — for GPU effects.** Paint fragment-shader output into an element for gradients, distortion, and generative visuals. See [shader-paint.md](references/jsx/shader-paint.md).
- **`<rect>`, `<text>`, and paints — for simple primitives.** Reach for these when the graphic is genuinely a shape or a line of type rather than a laid-out block. See [elements.md](references/jsx/elements.md) and [text.md](references/jsx/text.md).

## Animating

Animate frame-accurately with [keyframes](references/jsx/keyframes.md) and [animations](references/jsx/animations.md). For anything beyond a single tween — sequenced, staggered, or multi-property motion — it is recommended to work with **anime.js timelines**, which orchestrate the motion cleanly and keep complex sequences readable.

## Captions and on-screen text

- Add auto captions last, after everything else is assembled, so they transcribe the finished audio at its final placement.
- Default to the `"classic"` caption preset — it reads cleanly across almost any footage. Only reach for another preset when the brief calls for a specific look. See [captions.md](references/jsx/captions.md).
- Never stack a text overlay on top of captions. A styled overlay and the running caption track compete for the same reading attention. Wherever an overlay appears, [trim the captions](references/jsx/captions.md#trimming) so the transcript is absent for that stretch and the overlay owns the moment. The two should hand off in time, not overlap.

# Compositing

How a composition is built and changed. `dapi mount` renders a block of JSX into the running editor over the local socket; `dapi node insert` adds further nodes into an already-mounted scene. The JSX syntax these consume is specified in [jsx/README.md](references/jsx/README.md) — treat it as authoritative for elements, props, timing, sizing, and generation.

## Best practices

- Build the mounted JSX in stages, and verify the result after each stage before adding the next.
- Wrap entities in `<sequence>` tags wherever they support it — A-roll, B-roll, and other clips belong in sequences so the timeline stays structured rather than a flat, messy pile. (`<html>` does not support sequences.)
- Use the built-in tags for the media a composition is made of (audio, video, images, captions).
- For anything 3D, use Three.js drawn into a `<surface>` tag.
- For motion graphics, overlays and UI-heavy graphics, use the `<html>` tag. Prefer it and use it as much as possible rather than hand-building layouts from `<rect>`/`<text>`.
- Add auto captions last, after everything else is assembled, so they transcribe the finished audio at its final placement.

# Verification

How to confirm a change actually produced what you intended. A clean `mount` or `insert` does not guarantee a correct-looking frame — verify the composited result, not just that the command succeeded.

- After each `mount` or `insert`, `dapi node capture` the composited **scene** (capture the scene id, not the isolated node) to see what the viewer actually gets.
- Reconcile the captured frame against the brief before moving on. Check framing, crop, readability, hierarchy, and timing at the intended delivery size.
- Verify after every stage, not only at the end — build the composition incrementally so a problem is caught next to the change that caused it. See [compositing.md](references/compositing.md).
- Fix the largest viewer-facing problem before polishing details, and recheck related moments after structural changes, since pacing, continuity, emphasis, and meaning are relational.

## Examples

| Area | File |
| ---- | ---- |
| Video editing | [references/examples/video-editing.md](references/examples/video-editing.md) |
| Motion graphics | [references/examples/motion-graphics.md](references/examples/motion-graphics.md) |

---

Supporting references: [references/installation.md](references/installation.md) (getting the CLI on PATH), [references/listen-prompts.md](references/listen-prompts.md) (prompt patterns for `media listen`), and [references/jsx/README.md](references/jsx/README.md) (the full JSX syntax that `mount` and `node insert` consume).
