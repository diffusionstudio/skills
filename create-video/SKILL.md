---
name: video-editing
description: >-
  Understand, generate, and edit footage with Diffusion Studio via the `dapi`
  CLI: analyze video/audio/images, generate them with AI, and compose video
  compositions. Use for any media analysis, media generation, or video editing
  task.
---

# Video editing with Diffusion Studio

`dapi` is the CLI that drives a running Diffusion Studio app over a local socket.
You build and edit a video composition entirely through these commands. Each
scene is a scene graph of nodes, authored as **Solid JSX**: positioned with explicit 
pixel props and timed with Lottie-style props.

## Discover the CLI; don't work from memory

The CLI is self-describing and ships its own API reference. Treat that reference
as the source of truth and pull it on demand instead of guessing flags, props,
or output shapes:

- `dapi --help`, `dapi <group> --help`, and `dapi <group> <command> --help`
  enumerate every command, argument, and option.

## Golden rules

1. **The app must be running.** If it isn't, run `dapi open` first.
2. **Always start with `dapi ctx`** to learn the project, scenes, active scene,
   playhead frame, and available fonts before doing anything.
3. **Output is JSON** on stdout (single value or JSON Lines); errors go to
   stderr with a non-zero exit. Parse stdout, don't scrape prose.
4. **Node ids are integers** (entity ids); **asset and folder ids are opaque
   strings**. Don't mix them up.
5. **You can't watch the video, so look.** After any visual change, capture a
   frame or screenshot and inspect it (see `references/inspection.md`).
6. **Generation costs credits and is slow** (`mount` blocks until every
   declared asset lands) and requires a signed-in account (`dapi whoami`).
7. **Plan before you cut.** For anything beyond a one-off tweak, work like a
   studio: map and analyze the footage, then write the edit plan to markdown
   files before assembling. See `references/editing-process.md`.

## Read the one you need

| Topic | File | When |
| ----- | ---- | ---- |
| Installing `dapi` | `references/installation.md` | `dapi` isn't on PATH yet: Homebrew (macOS) or from source |
| **How to approach an edit** | `references/editing-process.md` | **Start here for any non-trivial edit**: the studio pipeline (asset map → analysis → shortlists → plan), persisted as markdown |
| Choosing commands | `references/choosing-commands.md` | Which command (and which JSX reference page) fits the task at hand |
| Inspecting & verifying | `references/inspection.md` | Picking the right way to see the canvas or an asset, and the verify habit |
