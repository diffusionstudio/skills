---
name: editor
description: >-
  Understand, generate, and edit footage with Diffusion Studio: analyze
  video/audio/images, generate them with AI, and compose video compositions.
  Use for any media analysis, media generation, or video editing task.
---

The guidance for this skill ships with the Diffusion Studio app, so it always matches the installed version. Read it from there and trust it over memory; it belongs to the app, so never edit it.

The docs live inside the app bundle at `Diffusion Studio.app/Contents/Resources/docs` (usually under `/Applications`). Start with `skills/editor.md` and follow it for the rest of the session. It links to the tool and JSX reference, guides, runnable examples, and the brand kit in the same folder.

Use the tools through the `diffusion` CLI (alias `dapi`). The docs use MCP tool names; `media_grab` is `diffusion media grab`, and `diffusion <command> --help` lists its options. If the MCP tools are connected, they work the same.

Work with the app in the background (`diffusion open --background <dir>`), then show the result with `diffusion window show`.

If `diffusion` or the app is missing, read [installation.md](references/installation.md).
