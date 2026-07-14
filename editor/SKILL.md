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

### Understand the material

Choose the depth and order of analysis from the request and the available material. Speech-led footage rewards close audio analysis; action-, demonstration-, atmosphere-, or graphics-led work may require the visual pass to lead.

1. **Probe first.** `dapi media probe <id|path>` reports the container and its tracks, telling you up front whether the file has a video track, an audio track, or both. Everything after branches on that.
2. **Get the lay of the land.** Render a `dapi media waveform` for audio tracks and a `dapi media filmstrip` for video tracks to see loud and quiet stretches, visual states, and scene changes cheaply.
3. **Follow the audio when it carries meaning.** Run `dapi media listen` with a prompt tailored to what you need to know and ask for timestamps. If it contains speech, also run `dapi media transcribe` for precise word-level timing. See `references/listen-prompts.md` for prompt patterns.
4. **Follow the visuals when they carry meaning.** Use `dapi media grab` to pull frames. Feed it timestamps from audio analysis when they provide useful cues; otherwise use `--auto` to keep new visual states while dropping near-duplicates.
5. **Stop when you have enough evidence.** Match the inspection effort to the decision: a filmstrip may settle a simple visual question, while action, demonstrations, or subtle performances need targeted frames.

### Assemble an edit

Decide the edit before representing it as JSX, then build incrementally. The JSX syntax that `mount` and `insert` consume is specified in `references/jsx/` (start with `references/jsx/README.md`).

1. **Record intent in proportion to the task.** For nontrivial, open-ended, multi-asset, or long-running work, capture the intended outcome, explicit constraints, and major decisions in a Markdown brief or edit plan. For small deterministic changes, use the request itself as the brief.
2. **Apply editorial judgment when choices remain.** After the first-pass inspection and before structural decisions, read `references/editing-guidelines.md` when the task leaves unresolved choices about selection, ordering, pacing, emphasis, layer roles, sound-picture relationships, generated representation, source meaning, or qualitative critique. Skip it for fully specified mechanical changes, metadata inspection, and export.
3. **Decide the organizing structure.** Choose the selection, ordering logic, section-level drivers, and timing intent before expressing them as JSX. Then assemble the structure with `dapi mount`.
4. **Assign each layer a role.** Speech, visuals, music, text, graphics, captions, sound, effects, or generated media may lead or support at different moments. Add or refine them only when their role follows from the request or material.
5. **Validate technically at meaningful milestones.** Inspect the tree or state after high-risk changes. Use targeted `dapi node capture <scene-or-node-id> -t ...` checks for layout, visibility, text, and isolated appearance; explicit times are relative to the selected node's first visible frame. Do not use capture alone to validate scene timing. Consult the live command help before use.
6. **Review editorially in time.** After the rough structure and before delivery, render the affected sequence and review it at its intended pace for pacing, transition movement, readability duration, audio continuity, rhythm, and surrounding boundaries. If direct playback is unavailable, use bounded `dapi media listen <rendered-path> --keep-video`, filmstrip, waveform, and targeted frames as supplements, and report remaining temporal uncertainty.

JSX best practices:

- **Wrap entities in sequences** so the timeline stays structured and readable rather than a flat pile of clips.
- **Give every entity an explicit width and height** rather than relying on implicit sizing.

## Guides

| Task | File | Covers |
| ---- | ---- | ------ |
| Install `dapi` | `references/installation.md` | Getting the CLI on PATH: Homebrew (macOS) or from source |
| Prompt `media listen` | `references/listen-prompts.md` | Prompt patterns for audio analysis: summaries, moment lookups, music, timestamp format |
| Make editing decisions | `references/editing-guidelines.md` | Cross-format judgment for structure, pacing, layer roles, sound, source integrity, and viewer-focused review |
| Write JSX compositions | `references/jsx/README.md` | The JSX syntax `mount` and `node insert` consume: elements, sequences, timing, generation |
