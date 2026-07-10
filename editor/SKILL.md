---
name: editor
description: >-
  Understand, generate, and edit footage with Diffusion Studio via the `dapi`
  CLI: analyze video/audio/images, generate them with AI, and compose video
  compositions. Use for any media analysis, media generation, or video editing
  task.
---

# Video editing with Diffusion Studio

`dapi` is the CLI that drives a running Diffusion Studio app over a local socket.
You build and edit a video composition entirely through these commands.

## Discover the CLI; don't work from memory

The CLI is self-describing and ships its own API reference, use:

- `dapi --help`, `dapi <group> --help`, and `dapi <group> <command> --help`
  enumerate every command, argument, and option.
- Every command's help links its page in the API reference; fetch that page
  before using a command in a non-trivial way. The JSX syntax is specified in
  the reference's `jsx/` folder, linked from the `mount` and `node insert` pages.

## Golden rules

1. **The app must be running.** If it isn't, run `dapi open` first.
2. **Always start with `dapi ctx`** to orient before doing anything.
3. **You can't watch the video, so look.** After any visual change, capture a
   screenshot or frame and inspect it (`dapi node screenshot`).
4. **Generation costs credits and is slow**, and requires a signed-in account
   (`dapi whoami`).
5. **Plan before you cut.** For anything beyond a one-off tweak, map and
   analyze the footage and write the plan to disk before assembling (see
   `references/edit.md`).

## Guides

| Task | File | Covers |
| ---- | ---- | ------ |
| Install `dapi` | `references/installation.md` | Getting the CLI on PATH: Homebrew (macOS) or from source |
| Edit footage | `references/edit.md` | The studio process from footage (or brief) to a finished composition |
