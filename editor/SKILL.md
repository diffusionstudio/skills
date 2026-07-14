---
name: editor
description: >-
  Understand, generate, and edit footage with Diffusion Studio via the `dapi`
  CLI: analyze video/audio/images, generate them with AI, and compose video
  compositions. Use for any media analysis, media generation, or video editing
  task.
---

# Video editing with Diffusion Studio

`dapi` drives a running Diffusion Studio editor. Build and edit compositions through it.

## Discover the live CLI

Inspect the relevant `dapi` help before use. Treat it as authoritative for the live command contract; use the references below for concepts and composition syntax.

## Workflow

### Understand the material

Orient to the request, project, and material. When supplied media needs inspection, probe it first to identify its tracks and properties, then inspect only the modalities and evidence the decision requires. Speech, action, music, graphics, or atmosphere may lead.

Use waveform and filmstrip as inexpensive orientation evidence when the corresponding tracks exist. A filmstrip provides coarse visual structure and scene-state orientation; it does not validate precise crop, framing, readability, expression, gesture, UI detail, or an exact cut frame.

Use transcript or timestamped audio findings to choose targeted frame grabs when audio provides useful cues. When no useful timestamps exist, consider automatic visual sampling if the exact live help and available runtime support it. Use targeted grabs whenever a decision depends on a specific frame-level property. Use hosted analysis only when its evidence justifies privacy, upload, time, credit, and context costs.

Match conclusion strength to inspected evidence. A suitable still supports a claim about that frame; motion, sustained quality or readability, boundary, and whole-interval claims require evidence capable of testing them. Stop only when every consequential decision has evidence at the needed fidelity, and state material uncertainty when stronger evidence is unavailable.

On failure, report the observed error separately from suspected causes. Do not repeat an unchanged command unless the retry tests a named hypothesis. A fallback preserves progress but is not automatically evidentially equivalent; state what remains unverified.

### Assemble an edit

Decide the edit before representing it as JSX, then build incrementally. The JSX consumed by `mount` and `insert` is specified in `references/jsx/` (start with `references/jsx/README.md`).

1. **Record intent proportionally.** For nontrivial, open-ended, multi-asset, consequential, or long-running work, record the outcome, constraints, and major decisions in a brief or edit plan. When inspection or validation choices have consequential tradeoffs—destination, quality, uncertainty, privacy, failure risk, time, compute, hosted credits, uploads, or context—also note what must be learned or verified, acceptable expensive or hosted operations, and a validation milestone or stop condition. For small deterministic changes, metadata inspection, export, and fully specified operations, use the request as the brief and avoid a persistent file; a compact inline risk or verification note is allowed.
2. **Load editorial judgment only when choices remain.** After initial inspection and before structural decisions, read `references/editing-guidelines.md` when unresolved editorial judgment could materially affect the edit, viewer experience, source meaning, or qualitative assessment. Skip it when the work is fully specified and mechanical.
3. **Decide the organizing structure.** Choose selection, ordering logic, section-level drivers, and timing intent before expressing them as JSX.
4. **Implement incrementally.** Assemble the structure, inspect the resulting state, and refine it in meaningful stages.
5. **Validate proportionally.** Separate technical and structural checks from viewer-oriented temporal review. Inspect state after meaningful or high-risk changes; obtain temporal evidence when quality depends on motion, pacing, duration, or sound. When selecting or trimming a segment, check its entry and exit in surrounding picture and sound when contamination or cut accuracy could matter. Report material residual uncertainty. Choose mechanisms from live help and technical references.

## Guides

| Task | File | Covers |
| ---- | ---- | ------ |
| Install `dapi` | `references/installation.md` | Getting the CLI on PATH |
| Prompt semantic audio analysis | `references/listen-prompts.md` | Conditional prompt patterns when semantic audio analysis is selected |
| Make editing decisions | `references/editing-guidelines.md` | Structure, pace, layer necessity, sound, source integrity, and viewer review |
| Write JSX compositions | `references/jsx/README.md` | Elements, sequences, timing, generation, and technical validation |
