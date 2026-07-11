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

The CLI is self-describing and ships its own API reference, use `dapi --help`, `dapi <group> --help`, 
and `dapi <group> <command> --help` enumerate every command, argument, and option.

## Workflow

### In depth footage analysis

Analysis is audio-first: the soundtrack usually carries more meaning than the pixels, so lead with it and sample the video against what you hear.

1. **Probe first.** `dapi media probe <id|path>` reports the container and its tracks, telling you up front whether the file has a video track, an audio track, or both. Everything after branches on that.
2. **Get the lay of the land.** Render a `dapi media waveform` (audio) and a `dapi media filmstrip` (video) for a fast, cheap overview of where the loud and quiet stretches and the visual scene changes fall.
3. **Listen to the audio.** Run `dapi media listen` with a prompt tailored to the context (what you actually need to know), and explicitly ask the model to include timestamps in its answer. See `references/listen-prompts.md` for prompt patterns.
4. **Transcribe speech.** If the audio contains speech, also run `dapi media transcribe`: its word-level timestamps are far more precise than a listen summary.
5. **Sample the video against the audio.** Use `dapi media grab` to pull 5 to 20 frames. Grabbing at a fixed interval is the naive default; the better approach is to pull the distinct moments the audio already pointed you to, feeding the timestamps from the transcript or listen output straight in, e.g. `-t '00:32' '00:45' ...`. Let the audio decide which frames are worth looking at rather than sampling blindly.

Because audio usually matters more than the visuals, you can often stop early: for a lot of footage the filmstrip alone is enough to grasp the video side, and a full frame-by-frame pass with `grab` adds little.

### Assemble an edit

Build the composition incrementally, verifying as you go. The JSX syntax that `mount` and `insert` consume is specified in `references/jsx/` (start with `references/jsx/README.md`).

1. **Write the brief first.** Capture the edit as a markdown file: It is the plan every mount works toward and the thing to check the result against.
2. **Lay down the A-roll.** Assemble the primary footage as JSX and `dapi mount` it. Get the spine of the edit right before anything else.
3. **Layer the rest on top.** Once the A-roll holds, add B-roll and secondary assets (sound effects, captions, overlays) with further mounts or `dapi node insert`.
4. **Verify every change.** After each `mount` or `insert`, run `dapi node capture` to see what the viewer actually gets, and reconcile it against the brief before moving on.

JSX best practices:

- **Wrap entities in sequences** so the timeline stays structured and readable rather than a flat pile of clips.
- **Give every entity an explicit width and height** rather than relying on implicit sizing.

## Guides

| Task | File | Covers |
| ---- | ---- | ------ |
| Install `dapi` | `references/installation.md` | Getting the CLI on PATH: Homebrew (macOS) or from source |
| Prompt `media listen` | `references/listen-prompts.md` | Prompt patterns for audio analysis: summaries, moment lookups, music, timestamp format |
| Write JSX compositions | `references/jsx/README.md` | The JSX syntax `mount` and `node insert` consume: elements, sequences, timing, generation |
