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

**Let the content pick the lead modality.** Speech, action, music, graphics, or atmosphere may carry the meaning; there is no fixed priority. When audio carries useful cues, `dapi media listen` with timestamps and, for speech, `dapi media transcribe` with word-level timestamps can identify moments for targeted grabs. With no useful timestamp cues, consider automatic visual sampling after confirming its live command contract.

**Match conclusion strength to evidence.** A still supports a claim about that frame only; motion, sustained quality or readability, boundaries, and whole-interval claims need evidence that can actually test them. Reach for hosted analysis only when its evidence justifies the privacy, upload, time, credit, and context cost. Stop when consequential decisions are supported at the fidelity their risk requires, and name any material uncertainty you could not resolve.

**On failure, separate what you saw from what you suspect.** Report the observed error apart from suspected causes. Do not rerun an unchanged command unless the retry tests a named hypothesis. A fallback preserves progress but is not automatically equivalent evidence; say what stays unverified.

### Assemble an edit

Decide the edit before representing it as JSX, then build incrementally. The JSX consumed by `mount` and `insert` is specified in `references/jsx/` (start with `references/jsx/README.md`).

1. **Record intent proportionally.** For nontrivial, open-ended, multi-asset, consequential, or long-running work, capture the outcome, constraints, and major decisions in a brief or edit plan. When inspection or validation choices carry consequential tradeoffs such as destination, quality, uncertainty, privacy, failure risk, time, compute, hosted credits, uploads, or context, also note what must be learned or verified, which expensive or hosted operations are acceptable, and a validation milestone or stop condition. For small deterministic changes, metadata inspection, export, and fully specified operations, use the request as the brief and skip the persistent file; a compact inline risk or verification note is enough.
2. **Load editorial judgment only when choices remain.** After initial inspection and before structural decisions, read `references/editing-guidelines.md` when unresolved editorial judgment could materially affect the edit, viewer experience, source meaning, or qualitative assessment. Skip it when the work is fully specified and mechanical.
3. **Decide the organizing structure.** Choose selection, ordering logic, section-level drivers, and timing intent before expressing any of it as JSX.
4. **Establish the primary structure, then layer.** Build the primary structure first, then add supporting media and secondary layers through further mounts or inserts. Take element structure, sizing, and timing from `references/jsx/` rather than assuming conventions.
5. **Verify meaningful changes.** Inspect the result after each meaningful or high-risk mount or insert and reconcile it against the brief. Scale review depth to risk. Obtain temporal evidence when quality depends on motion, pacing, duration, or sound, and check a segment's entry and exit in surrounding picture and sound when trimming or selecting where cut accuracy or contamination matters. Report material residual uncertainty.

## Guides

| Task | File | Covers |
| ---- | ---- | ------ |
| Install `dapi` | `references/installation.md` | Getting the CLI on PATH: Homebrew (macOS) or from source |
| Prompt semantic audio analysis | `references/listen-prompts.md` | Prompt patterns for audio analysis: summaries, moment lookups, music, timestamp format |
| Make editing decisions | `references/editing-guidelines.md` | Structure, pace, layer necessity, sound, source integrity, and viewer review |
| Write JSX compositions | `references/jsx/README.md` | Elements, sequences, timing, sizing, generation, and technical validation |
