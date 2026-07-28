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

### Video editing guidelines

- Direct like a film director. Focus on cinematography. Keep the subject as the anchor. The story should work with your eyes closed. Complete the thought, not just the sentence. Story over compression.
- Think in temporal beats and grammar. Structure information through framing, timing, and sequence. Let composition create hierarchy and separation before adding visual structure. 
- Use the least structure needed for clarity; let content work before decoration. Default to the plainest choice. Its budget is `0`. Chrome, scaffolding, and ornament all spend from it. Every addition adds attention cost and complexity.
- Video is its own medium, not a website, poster, presentation slide, or UI. A video is watched, not read. Let visuals and voice carry context. Text should punctuate, not explain. Prefer to not add eyebrows, descriptions, labels, or supporting copy.
- When user or brand guidance comes from another medium, preserve its intent, not its form. Re derive it through video and cinematography. Show only what the audience needs to see. Let nothing enter the frame unless it helps tell the story.
- Facts constrain what may be said, not how it must be shown. Separate source meaning from source presentation; re-author hierarchy, grouping, and emphasis for the film.
- Let every shot, media, element and moment feel intentional. Use it to deepen the story, guide attention, or expand imagination. Never add something merely to fill space or occupy the screen.
- Give every visual cinematic life through technique, framing, focus, movement, timing, audio, pace, emotion, and tension. Let emotion and rhythm shape the pace. Make room to pause and breathe, or let momentum flow. Shape pacing as a curve between them.
- Choose easing from the intended weight, energy, and continuity of the action.
- Write the brief first. For anything nontrivial, capture the edit as a markdown file: it is the plan every mount works toward and the thing to check the result against.
- Lay down the A-roll. Assemble the primary footage as JSX and `dapi mount` it. Get the spine of the edit right before anything else.
- Layer the rest on top. Once the A-roll holds, add B-roll and secondary assets (sound effects, captions, overlays) with further mounts or `dapi node insert`.

# Verification

How to confirm a change actually produced what you intended. A clean `mount` or `insert` does not guarantee a correct-looking frame — verify the composited result, not just that the command succeeded.

- After each `mount` or `insert`, `dapi node capture` the composited **scene** (capture the scene id, not the isolated node) to see what the viewer actually gets.
- Reconcile the captured frame against the brief before moving on, and the brief itself against these guidelines. Check framing, crop, readability, hierarchy, and timing at the intended delivery size.
- Verify after every stage, not only at the end — build the composition incrementally so a problem is caught next to the change that caused it.
- Fix the largest viewer-facing problem before polishing details, and recheck related moments after structural changes, since pacing, continuity, emphasis, and meaning are relational.
- Use `screenshot` or `logs` to debug issues

---

Supporting references: [references/installation.md](references/installation.md) (getting the CLI on PATH), [references/jsx/README.md](references/jsx/README.md) (the full JSX syntax that `mount` and `node insert` consume), [references/examples/examples.md](references/examples/examples.md) (worked examples for video editing and motion graphics).
