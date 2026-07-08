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
- Every command's help links its page in the API reference; fetch that page
  before using a command in a non-trivial way. The JSX syntax is specified in
  the reference's `jsx/` folder, linked from the `mount` and `node insert` pages.

## Golden rules

1. **The app must be running.** If it isn't, run `dapi open` first.
2. **Always start with `dapi ctx`** to orient before doing anything.
3. **You can't watch the video, so look.** After any visual change, capture a
   screenshot or frame and inspect it (see `references/understand.md`).
4. **Generation costs credits and is slow**, and requires a signed-in account
   (`dapi whoami`).
5. **Plan before you cut.** For anything beyond a one-off tweak, map and
   analyze the footage and write the plan to disk before assembling (see
   `references/edit.md`).

## Task guides

| Task | File | Covers |
| ---- | ---- | ------ |
| Understand footage | `references/understand.md` | Inspecting and analyzing video/audio/images; verifying your edits |
| Generate footage | `references/generate.md` | Producing AI image/video/voice/audio assets |
| Edit footage | `references/edit.md` | The studio process from footage (or brief) to a finished composition |
| Install `dapi` | `references/installation.md` | Getting the CLI on PATH: Homebrew (macOS) or from source |
