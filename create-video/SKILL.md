---
name: video-editing
description: >-
  Edit videos in Diffusion Studio via the `dapi` CLI — build and modify
  compositions: scenes, clips, assets, timing, captions, and AI generation.
  Use for any video editing or image/video/audio generation tasks.
---

# Video editing with Diffusion Studio

`dapi` is the CLI that drives a running Diffusion Studio app over a local socket.
You build and edit a video composition entirely through these commands. Each
scene is a canvas of nodes (video / image / audio / text / rect / group),
authored as **Solid JSX** — positioned with explicit pixel props and timed with
Lottie-style props.

## Golden rules

1. **The app must be running.** If it isn't running, run `dapi open` first.
2. **Always start with `dapi ctx`** to learn the project,
   scenes, active scene, playhead frame, and available fonts before doing anything.
3. **Output is JSON** on stdout (single value or JSON Lines); errors go to stderr
   with a non-zero exit. Parse stdout, don't scrape prose.
4. **Node ids are integers** (entity ids); **asset and folder ids are opaque
   strings**. Don't mix them up.
5. **You can't watch the video — so look.** After any visual change, capture a
   frame or screenshot and inspect it (see `references/inspection.md`).
6. **Generation costs credits and is slow** (`mount` blocks until every declared
   asset lands) and requires a signed-in account (`dapi whoami`).
7. **Plan before you cut.** For anything beyond a one-off tweak, work like a studio:
   map and analyze the footage, then write the edit plan to markdown files before
   assembling. See `references/editing-process.md`.


## Sub-categories — read the one you need

| Topic | File | When |
| ----- | ---- | ---- |
| **How to approach an edit** | `references/editing-process.md` | **Start here for any non-trivial edit** — the studio pipeline (asset map → analysis → shortlists → plan), persisted as markdown |
| Command surface & orientation | `references/commands.md` | Navigating projects, selection, nodes, assets, folders |
| Authoring scenes (JSX API) | `references/authoring-jsx.md` | Adding/replacing content, positioning, **timing & trims**, keyframe animation, transitions |
| AI generation | `references/generation.md` | Creating image/video/voice/audio assets, auto-captions, models |
| Inspecting & verifying | `references/inspection.md` | Seeing the canvas/assets — screenshots, frames, waveforms, transcripts |
| Rendering | `references/rendering.md` | Rendering a scene to a video file — formats, codecs, resolution, trims |
| End-to-end recipes | `references/workflows.md` | Full task walkthroughs that combine the above |
