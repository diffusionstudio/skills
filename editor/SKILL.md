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

### Understand the footage

Choose the depth and order of analysis from the brief and the available tracks. Speech-led footage rewards close audio analysis; action-, demonstration-, or atmosphere-led footage may require the visual pass to lead.

1. **Probe first.** `dapi media probe <id|path>` reports the container and its tracks, telling you up front whether the file has a video track, an audio track, or both. Everything after branches on that.
2. **Get the lay of the land.** Render a `dapi media waveform` for audio tracks and a `dapi media filmstrip` for video tracks to see loud and quiet stretches, visual states, and scene changes cheaply.
3. **Follow the audio when it carries meaning.** Run `dapi media listen` with a prompt tailored to what you need to know and ask for timestamps. If it contains speech, also run `dapi media transcribe` for precise word-level timing. See `references/listen-prompts.md` for prompt patterns.
4. **Follow the visuals when they carry meaning.** Use `dapi media grab` to pull frames. Feed it timestamps from audio analysis when they provide useful cues; otherwise use `--auto` to keep new visual states while dropping near-duplicates.
5. **Stop when you have enough evidence.** Match the inspection effort to the decision: a filmstrip may settle a simple visual question, while action, demonstrations, or subtle performances need targeted frames.

### Assemble an edit

Build the composition incrementally, verifying as you go. The JSX syntax that `mount` and `insert` consume is specified in `references/jsx/` (start with `references/jsx/README.md`).

1. **Write the brief first.** Capture the intended outcome and constraints in a markdown file: it is the plan every mount works toward and the result is checked against.
2. **Apply editorial judgment.** After understanding the brief and inspecting any available material, read `references/editing-guidelines.md` before planning or executing a video creation or editing task. Analysis-only tasks can skip it.
3. **Build the spine.** Identify what carries the video and assemble its primary structure as JSX with `dapi mount` before adding supporting layers.
4. **Add only motivated support.** Add B-roll, sound effects, captions, overlays, generated media, transitions, or other secondary elements only when they serve the brief or material.
5. **Verify every change.** After each `mount` or `insert`, run `dapi node capture` to see what the viewer actually gets, and reconcile it against the brief before moving on.

JSX best practices:

- **Wrap entities in sequences** so the timeline stays structured and readable rather than a flat pile of clips.
- **Give every entity an explicit width and height** rather than relying on implicit sizing.

## Guides

| Task | File | Covers |
| ---- | ---- | ------ |
| Install `dapi` | `references/installation.md` | Getting the CLI on PATH: Homebrew (macOS) or from source |
| Prompt `media listen` | `references/listen-prompts.md` | Prompt patterns for audio analysis: summaries, moment lookups, music, timestamp format |
| Make editing decisions | `references/editing-guidelines.md` | Cross-format judgment for structure, pacing, supporting layers, sound, and viewer-focused review |
| Write JSX compositions | `references/jsx/README.md` | The JSX syntax `mount` and `node insert` consume: elements, sequences, timing, generation |
