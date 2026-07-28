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
- **Listen to the audio.** Run `dapi media listen` with a prompt tailored to the context (what you actually need to know), and explicitly ask the model to include timestamps in its answer. See [media-listen.md](references/examples/prompts/media-listen.md) for prompt patterns.
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
- Start with a fresh project

### Directing

- Direct like a film director. Anchor each beat in the person, action, or idea that carries it. Let sound and image share the story: every shot must reveal, clarify, contrast, or deepen the beat, and may continue only while it still does that work. At each shift in beat or topic, make a new visual decision—cut, reframe, or hold only when the hold adds meaning, tension, or continuity. Complete the thought, not just the sentence. Story over compression.
- Give every chosen element cinematic life through framing, focus, movement, stillness, timing, sound, pace, emotion, and tension.
- For dialogue-led edits, hide the picture and confirm that the speech carries the core thought; then restore it and confirm that each visual adds meaning, preserves continuity, or supports a needed transition rather than merely filling the frame.

### Composition

- Chrome, scaffolding, and ornament all draw from a visual budget whose default balance is `0`; prefer not to use them. A cut, hold, or change of size can separate two ideas as clearly as a divider without adding visual clutter. An element earns its place by deepening the story, guiding attention, or expanding imagination, never by filling space.
- Video is its own medium, with its own rules; it is not a website, poster, slide, or UI. It is watched, not read.
- Let visuals, sound, and voice carry context; let text punctuate rather than explain. Do not add copy, eyebrows, labels, underlines, or brand color highlights unless the brief or explicit video guidance calls for them; examples alone are not instructions.
- Choose easing from the intended weight, energy, and continuity of the action.

### Video editing guideline

- Write the brief first. For anything nontrivial, capture the edit as a markdown file: it is the plan every mount works toward and the thing to check the result against.
- Lay down the A-roll. Assemble the primary footage as JSX and `dapi mount` it. Get the spine of the edit right before anything else.
- Layer the rest on top. Once the A-roll holds, add B-roll and secondary assets (sound effects, captions, overlays) with further mounts or `dapi node insert`.

# Verification

How to confirm a change actually produced what you intended. A clean `mount` or `insert` does not guarantee a correct-looking frame — verify the composited result, not just that the command succeeded.

- After each `mount` or `insert`, `dapi node capture` the composited **scene** (capture the scene id, not the isolated node) to see what the viewer actually gets.
- Reconcile captured frames with the brief, and the brief with these guidelines. At the intended delivery size, check framing, crop, readability, and hierarchy. Review the scene in motion across every story-beat change and through the start, middle, and end of any long-held visual. Ask, “Why this image now?” Keep it only when the answer is specific to that moment.
- Verify after every stage, not only at the end — build the composition incrementally so a problem is caught next to the change that caused it.
- Fix the largest viewer-facing problem before polishing details, and recheck related moments after structural changes, since pacing, continuity, emphasis, and meaning are relational.
- Use `screenshot` or `logs` to debug issues

---

Supporting references: [references/installation.md](references/installation.md) (getting the CLI on PATH), [references/jsx/README.md](references/jsx/README.md) (the full JSX syntax that `mount` and `node insert` consume), [references/examples/examples.md](references/examples/examples.md) (worked examples for video editing and motion graphics).
