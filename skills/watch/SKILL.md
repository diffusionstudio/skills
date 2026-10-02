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

Use the tools through the `diffusion` CLI (alias `dapi`). The docs use MCP tool names; `media_grab` is `diffusion media grab`, and `diffusion <command> --help` lists its options. If the MCP tools are connected, they work the same.

Work with the app in the background (`diffusion open --background`), then show the result with `diffusion window show`.

If `diffusion` or the app is missing, read [installation.md](references/installation.md).
