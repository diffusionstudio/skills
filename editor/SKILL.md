---
name: editor
description: >-
  Understand, generate, and edit footage with Diffusion Studio via the `dapi`
  CLI: analyze video/audio/images, generate them with AI, and compose video
  compositions. Use for any media analysis, media generation, or video editing
  task.
---

# Video editing with Diffusion Studio

`dapi` is the CLI that drives a running Diffusion Studio editor over a local socket.
You build and edit a video composition entirely through these commands.

## Discover the CLI; don't work from memory

The CLI is self-describing and ships its own API reference. Use `dapi --help`, `dapi <group> --help`, and `dapi <group> <command> --help` to enumerate every command, argument, and option, and treat live help as authoritative rather than working from memory.

## Workflow

### In depth footage analysis

Inspect only the modalities the decision turns on — speech, action, music, graphics, or atmosphere may lead, so there is no fixed priority. Sample the picture against what the audio tells you.

1. **Probe first.** `dapi media probe <id|path>` reports the container and its tracks, telling you up front whether the file has a video track, an audio track, or both. Everything after branches on that.
2. **Get the lay of the land.** Render a `dapi media waveform` (audio) and a `dapi media filmstrip` (video) for a fast, cheap overview of where the loud and quiet stretches and the visual scene changes fall. A filmstrip shows coarse structure and scene state, not crop, framing, readability, or an exact cut frame — grab a specific frame for any of those.
3. **Listen to the audio.** Run `dapi media listen` with a prompt tailored to the context (what you actually need to know), and explicitly ask the model to include timestamps in its answer. See `references/listen-prompts.md` for prompt patterns.
4. **Transcribe speech.** For speech, `dapi media transcribe` prints word-level start/end times directly and takes `--start`/`--end` to scope a range — read any segment straight from it.
5. **Sample the video against the audio.** Use `dapi media grab` to pull frames. When the audio has already pointed you at specific moments, feed those timestamps straight in from the transcript or listen output, e.g. `-t '00:32' '00:45' ...`. When you need a visual pass without such cues, reach for `--auto`: it scans the footage and keeps only the frames where the picture settles into a new visual state, dropping near-duplicates.

Stop when every consequential decision is supported at the fidelity it needs — often the filmstrip plus a few targeted grabs is enough. Match a claim's strength to the evidence behind it, and name any uncertainty you could not resolve.

### Assemble an edit

Build the composition incrementally, verifying as you go. The JSX syntax that `mount` and `insert` consume is specified in `references/jsx/` (start with `references/jsx/README.md`).

1. **Write the brief first.** For anything nontrivial, capture the edit as a markdown file: it is the plan every mount works toward and the thing to check the result against.
2. **Load editorial judgment when choices remain.** Before structural decisions, read `references/editing-guidelines.md` when unresolved editorial judgment could materially affect the edit; skip it when the work is fully specified and mechanical.
3. **Lay down the A-roll.** Assemble the primary footage as JSX and `dapi mount` it. Get the spine of the edit right before anything else.
4. **Layer the rest on top.** Once the A-roll holds, add B-roll and secondary assets (sound effects, captions, overlays) with further mounts or `dapi node insert`.
5. **Verify every change.** After each `mount` or `insert`, `dapi node capture` the composited scene (capture the scene id, not the isolated node) to see what the viewer actually gets, and reconcile it against the brief before moving on — a clean mount does not guarantee a correct-looking frame.

JSX best practices:

- Build the mounted JSX in stages rather than all at once, and verify the result after each stage before adding the next.
- Wrap entities in `<sequence>` tags wherever they support it — A-roll, B-roll, and other clips belong in sequences so the timeline stays structured rather than a flat, messy pile. (`<html>` does not support sequences.)
- For audio, video, images and captions use the built-in tags.
- For anything 3D, use Three.js drawn into a `<surface>` tag.
- For motion graphics, overlays and UI-heavy graphics, use the `<html>` tag. Prefer it and use it as much as possible rather than hand-building layouts from `<rect>`/`<text>`.
- Add auto captions last, after everything else is assembled, so they transcribe the finished audio at its final placement.

## Guides

| Task | File | Covers |
| ---- | ---- | ------ |
| Install `dapi` | `references/installation.md` | Getting the CLI on PATH: link from an installed app (default), Homebrew, or from source |
| Prompt `media listen` | `references/listen-prompts.md` | Prompt patterns for audio analysis: summaries, moment lookups, music, timestamp format |
| Make editing decisions | `references/editing-guidelines.md` | Structure, pace, layer necessity, sound, source integrity, and viewer review |
| Write JSX compositions | `references/jsx/README.md` | The JSX syntax `mount` and `node insert` consume: elements, sequences, timing, sizing, generation |
