---
name: watch
description: >-
  Watch and understand footage with Diffusion Studio: answer questions about a
  video or audio file, summarize it, find scenes and moments, pull quotes, and
  describe what happens and when. Use whenever the user asks what's in a piece
  of footage, wants a summary or recap, wants to locate a moment ("where does X
  happen", "find the scene where..."), or needs a claim about a video or audio
  file checked.
---

The guidance for this skill ships with the Diffusion Studio app, so it always matches the installed version. Read it from there and trust it over memory; it belongs to the app, so never edit it.

The docs live inside the app bundle at `Diffusion Studio.app/Contents/Resources/docs` (usually under `/Applications`). Start with `skills/watch.md` and follow it for the rest of the session. It links to the media tool reference and prompt guides in the same folder.

The app exposes its tools through an MCP server (`media_probe`, `media_transcribe`, …). The `dapi` CLI provides the same tools from a shell: `dapi media grab` corresponds to `media_grab`.

If neither the Diffusion Studio tools nor `dapi` is available, or the app is not installed, read [installation.md](references/installation.md).
