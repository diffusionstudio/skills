---
name: editor
description: >-
  Understand, generate, and edit footage with Diffusion Studio via the `dapi`
  CLI: analyze video/audio/images, generate them with AI, and compose video
  compositions. Use for any media analysis, media generation, or video editing
  task.
---


The CLI is self-describing and ships its own API reference. Use `dapi --help`, `dapi <group> --help`, and `dapi <group> <command> --help` to enumerate every command, argument, and option, and treat live help as authoritative rather than working from memory.

## Reference files

Read the file that matches the work in front of you; each is authoritative for its area.

| Area | File | Covers |
| ---- | ---- | ------ |
| Analyze footage | [references/footage-analysis.md](references/footage-analysis.md) | Probing, waveforms/filmstrips, listening, transcription, and frame sampling to understand source material |
| Composite the edit | [references/compositing.md](references/compositing.md) | How `dapi mount` and `dapi node insert` build a composition, and the JSX best practices for structuring it |
| Make editing decisions | [references/editing-guidelines.md](references/editing-guidelines.md) | High-level editorial judgment: structure, pace, layer necessity, sound, source integrity, and viewer review |
| Create motion graphics | [references/motion-graphics.md](references/motion-graphics.md) | High-level building blocks for overlays, titles, animated UI, 3D, effects, and on-screen text |
| Verify changes | [references/verification.md](references/verification.md) | Capturing the composited scene and reconciling each change against the brief |

Supporting references: [references/installation.md](references/installation.md) (getting the CLI on PATH), [references/listen-prompts.md](references/listen-prompts.md) (prompt patterns for `media listen`), and [references/jsx/README.md](references/jsx/README.md) (the full JSX syntax that `mount` and `node insert` consume).

## Examples

| Area | File |
| ---- | ---- |
| Video editing | [references/examples/video-editing.md](references/examples/video-editing.md) |
| Motion graphics | [references/examples/motion-graphics.md](references/examples/motion-graphics.md) |
