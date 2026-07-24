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

- **Always probe first.** `dapi media probe <id|path>` reports the container and its tracks, telling you up front whether the file has a video track, an audio track, or both. Everything after branches on that.
- **Get the lay of the land.** Render a `dapi media waveform` (audio) and a `dapi media filmstrip` (video) for a fast, cheap overview of where the loud and quiet stretches and the visual scene changes fall. A filmstrip shows coarse structure and scene state, not crop, framing, readability, or an exact cut frame.
- **Listen to the audio.** Run `dapi media listen` with a prompt tailored to the context (what you actually need to know), and explicitly ask the model to include timestamps in its answer. See [listen-prompts.md](references/listen-prompts.md) for prompt patterns.
- **Transcribe speech.** For speech, `dapi media transcribe` prints the full transcript with word-level start/end times directly — read any segment straight from it.
- **Sample the video against the audio.** Use `dapi media grab` to pull frames. When the audio has already pointed you at specific moments, feed those timestamps straight in from the transcript or listen output, e.g. `-t '00:32' '00:45' ...`. When you need a visual pass without such cues, reach for `--auto`: it scans the footage and keeps only the frames where the picture settles into a new visual state, dropping near-duplicates.

## Best practices

- Wrap entities in `<sequence>` tags wherever they support it — A-roll, B-roll, and other clips belong in sequences so the timeline stays structured rather than a flat, messy pile. (`<html>` does not support sequences.)
- Use the built-in tags for the media a composition is made of (audio, video, images, captions).
- For anything 3D, use Three.js drawn into a `<surface>` tag.
- For motion graphics, overlays and UI-heavy graphics, use the `<html>` tag.
- Add auto captions last, after everything else is assembled, so they transcribe the finished audio at its final placement.
- Open the application in the background for tasks that don't require an editing ui
- Only render (export) the result when prompted

### Video editing guidelines

- Write the brief first. For anything nontrivial, capture the edit as a markdown file: it is the plan every mount works toward and the thing to check the result against.
- Lay down the A-roll. Assemble the primary footage as JSX and `dapi mount` it. Get the spine of the edit right before anything else.
- Layer the rest on top. Once the A-roll holds, add B-roll and secondary assets (sound effects, captions, overlays) with further mounts or `dapi node insert`.

# Verification

How to confirm a change actually produced what you intended. A clean `mount` or `insert` does not guarantee a correct-looking frame — verify the composited result, not just that the command succeeded.

- After each `mount` or `insert`, `dapi node capture` the composited **scene** (capture the scene id, not the isolated node) to see what the viewer actually gets.
- Reconcile the captured frame against the brief before moving on. Check framing, crop, readability, hierarchy, and timing at the intended delivery size.
- Verify after every stage, not only at the end — build the composition incrementally so a problem is caught next to the change that caused it.
- Fix the largest viewer-facing problem before polishing details, and recheck related moments after structural changes, since pacing, continuity, emphasis, and meaning are relational.
- Use `screenshot` or `logs` to debug issues

---

Supporting references: [references/installation.md](references/installation.md) (getting the CLI on PATH), [references/jsx/README.md](references/jsx/README.md) (the full JSX syntax that `mount` and `node insert` consume), [references/examples/examples.md](references/examples/examples.md) (worked examples for video editing and motion graphics).
