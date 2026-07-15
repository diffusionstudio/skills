---
name: editor
description: >-
  Understand, generate, and edit footage with Diffusion Studio via the `dapi`
  CLI: analyze video/audio/images, generate them with AI, and compose video
  compositions. Use for any media analysis, media generation, or video editing
  task.
---

# Video editing with Diffusion Studio

`dapi` drives a running Diffusion Studio editor over a local socket. You build and edit video compositions entirely through it.

## Discover the live CLI

The CLI is self-describing and ships its own API reference. Treat live help as authoritative for the command contract: exact names, arguments, and options can change, so confirm them in `dapi --help`, `dapi <group> --help`, and `dapi <group> <command> --help` rather than working from memory. Commands named below are executable anchors, not the contract; the references cover concepts and composition syntax.

## Workflow

### Understand the material

Orient to the request, project, and material, then inspect only the modalities the decision actually turns on.

**Probe before anything.** `dapi media probe <id|path>` reports the container and its tracks: video, audio, or both. Every later choice branches on what is actually present.

**Get cheap orientation first.** Where the tracks exist, render a waveform (`dapi media waveform`) and filmstrip (`dapi media filmstrip`) to see where loud and quiet stretches and visual scene changes fall. A filmstrip gives coarse structure and scene-state orientation; it does not validate crop, framing, readability, expression, gesture, UI detail, or an exact cut frame. Grab a specific frame for any of those.

**Let the content pick the lead modality.** Speech, action, music, graphics, or atmosphere may carry the meaning; there is no fixed priority. When audio carries useful cues, `dapi media listen` with timestamps and, for speech, `dapi media transcribe` with word-level timestamps can identify moments; feed those straight into `dapi media grab -t <timestamps>` for targeted frames. With no useful timestamp cues, `dapi media grab --auto` samples the footage and keeps only frames where the picture settles into a new visual state.

**Match evidence to claims, and fail honestly.** A still proves only that frame; motion, readability, boundary, and whole-interval claims need evidence that can test them — name any uncertainty you can't resolve, and reach for hosted analysis only when the payoff justifies its privacy, upload, credit, and time cost. On failure, report the observed error apart from suspected causes, don't rerun an unchanged command without a named hypothesis, and if you fall back to a weaker method say what stays unverified.

### Assemble an edit

Decide the edit before representing it as JSX, then build incrementally. The JSX consumed by `mount` and `insert` is specified in `references/jsx/` (start with `references/jsx/README.md`).

1. **Record intent proportionally.** For nontrivial, open-ended, multi-asset, or consequential work, capture the outcome, constraints, and major decisions in a brief. Where inspection or validation carries real tradeoffs (privacy, uploads, credits, failure risk, time, compute, context), also note what must be verified, which expensive or hosted operations are acceptable, and a stop condition. For small, fully-specified changes, use the request as the brief and skip the file.
2. **Load editorial judgment only when choices remain.** After initial inspection and before structural decisions, read `references/editing-guidelines.md` when unresolved editorial judgment could materially affect the edit, viewer experience, source meaning, or qualitative assessment. Skip it when the work is fully specified and mechanical.
3. **Decide the organizing structure.** Choose selection, ordering logic, section-level drivers, and timing intent before expressing any of it as JSX.
4. **Establish the primary structure, then layer.** Build and `dapi mount` the primary structure first, then add supporting media and secondary layers with further mounts or `dapi node insert`. Take element structure, sizing, and timing from `references/jsx/` rather than assuming conventions: wrap clips in sequences so the timeline stays structured rather than a flat pile, and give every entity an explicit width and height rather than relying on implicit sizing.
5. **Verify meaningful changes.** After each meaningful or high-risk mount or insert, `dapi node capture` the composited scene (capture the scene id, not the isolated node) and reconcile it against the brief — a clean mount does not guarantee a correct-looking frame. Scale review depth to risk. Obtain temporal evidence when quality depends on motion, pacing, duration, or sound, and check a segment's entry and exit in surrounding picture and sound when trimming or selecting where cut accuracy or contamination matters. Report material residual uncertainty.

## Guides

| Task | File | Covers |
| ---- | ---- | ------ |
| Install `dapi` | `references/installation.md` | Getting the CLI on PATH: Homebrew (macOS) or from source |
| Prompt semantic audio analysis | `references/listen-prompts.md` | Prompt patterns for audio analysis: summaries, moment lookups, music, timestamp format |
| Make editing decisions | `references/editing-guidelines.md` | Structure, pace, layer necessity, sound, source integrity, and viewer review |
| Write JSX compositions | `references/jsx/README.md` | Elements, sequences, timing, sizing, generation, and technical validation |
