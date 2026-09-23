---
name: editor
description: >-
  Understand, generate, and edit footage with Diffusion Studio: analyze
  video/audio/images, generate them with AI, and compose video compositions.
  Use for any media analysis, media generation, or video editing task.
---

The guidance for this skill ships with the Diffusion Studio app, so it always matches the installed version. Read it from there and trust it over memory; it belongs to the app, so never edit it.

The docs live inside the app bundle at `Diffusion Studio.app/Contents/Resources/docs` (usually under `/Applications`). Start with `skills/editor.md` and follow it for the rest of the session. It links to the tool and JSX reference, guides, runnable examples, and the brand kit in the same folder.

The app exposes its tools through an MCP server (`media_probe`, `capture`, `check`, …). The `diffusion` CLI (`dapi` also works, as an alias) provides the same tools from a shell: `diffusion media grab` corresponds to `media_grab`.

If neither the Diffusion Studio tools nor `diffusion` is available, or the app is not installed, read [installation.md](references/installation.md).
