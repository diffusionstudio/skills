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
scene is a canvas of nodes (video / image / audio / text / groups), positioned
with CSS and timed with Lottie-style attributes.

## Golden rules

1. **The app must be running.** Every command except `dapi open` and `dapi font ls`
   talks to the open app. If it isn't running, run `dapi open` first.
2. **Always start with `dapi ctx`** to learn the project,
   scenes, active scene, playhead frame, and available fonts before doing anything.
3. **Output is JSON** on stdout (single value or JSON Lines); errors go to stderr
   with a non-zero exit. Parse stdout, don't scrape prose.
4. **Node ids are integers** (entity ids); **asset ids are opaque strings**. Don't
   mix them up.
5. **You can't watch the video — so look.** After any visual change, capture a
   frame or screenshot and inspect it (see `references/inspection.md`). Never
   claim an edit worked without seeing it.
6. **Generation costs credits and is slow** (blocks until done) and requires a
   signed-in account (`dapi whoami`). Prefer importing existing assets when you can.
7. **Plan before you cut.** For anything beyond a one-off tweak, work like a studio:
   map and analyze the footage, then write the edit plan to markdown files before
   assembling. See `references/editing-process.md`.

## How a composition is structured

- A **project** holds an asset library and one or more **scenes**.
- A **scene** is the root composition (has a pixel `Size`); its children are nodes.
- **Nodes** are video/image/audio/text/group entities — positioned via CSS,
  timed via `data-ip`/`data-op`/`data-st`. You create them by feeding **HTML** to
  `dapi node add` (the canonical authoring path), then tweak with `node style`.
- **Assets** are the raw media; placing an asset on a scene means referencing its
  id (or path/URL) from HTML.

## Sub-categories — read the one you need

| Topic | File | When |
| ----- | ---- | ---- |
| **How to approach an edit** | `references/editing-process.md` | **Start here for any non-trivial edit** — the studio pipeline (asset map → analysis → shortlists → plan), persisted as markdown |
| Command surface & orientation | `references/commands.md` | Navigating projects, selection, nodes, assets, folders |
| Authoring scenes (HTML API) | `references/authoring-html.md` | Adding/replacing content, positioning, **timing & trims** |
| AI generation | `references/generation.md` | Creating image/video/voice/audio assets, auto-captions, models |
| Inspecting & verifying | `references/inspection.md` | Seeing the canvas/assets — screenshots, frames, waveforms, transcripts |
| Exporting (rendering) | `references/exporting.md` | Rendering a scene to a video file — formats, codecs, resolution, trims |
| End-to-end recipes | `references/workflows.md` | Full task walkthroughs that combine the above |

Authoritative, exhaustive references (kept in sync with the CLI) live in the app
itself: [`apps/cli/CLI_API.md`](../../apps/cli/CLI_API.md) (every command + flags)
and [`apps/cli/HTML_API.md`](../../apps/cli/HTML_API.md) (full HTML contract).
The files above are the agent-oriented digest; consult the source docs for the
complete signature of any command.
