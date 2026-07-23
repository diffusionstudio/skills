---
name: brand
description: >-
  Diffusion Studio's source of truth for visual identity, product language, motion, sound,
  reusable media elements, compositions, and brand assets. Use for Diffusion Studio videos,
  graphics, scripts, voiceovers, marketing copy, templates, asset selection, and brand review.
---

# Diffusion Studio brand

Apply the brand system to the requested work. Use the `editor` skill for Diffusion Studio
workflow, JSX, and `dapi` mechanics.

## Read the relevant references

| Work | Read |
| --- | --- |
| Graphic, still, or visual review | `references/design.md` |
| Marketing copy, product text, script, or voiceover | `references/voice.md` |
| Video | `references/design.md`, `references/video.md`, `references/library.md` |
| Reusable brand asset or source file | `references/library.md` and the reference for its medium |

Add `references/voice.md` whenever the work contains words. Read each selected file in full.

## Work from the source of truth

1. Follow the request for subject, format, and goal.
2. Apply the selected references for brand choices.
3. Check `references/library.md` before creating an asset, element, or composition.
4. Reuse the closest item and change its content inputs. Do not redraw an existing brand asset.
5. Use the `editor` skill to build and verify video work.
6. Report any missing asset, undefined rule, or deliberate exception.

Do not invent a required product fact, claim, asset, or brand rule. Continue with safe parts of
the work when a gap does not block them.

## Use bundled files

Treat files under `assets/` as production resources. Keep reusable brand files here and keep
one-off footage, narration, and project media with their project. Use relative paths in this
skill instead of external file-share links.

Video elements do not own a `<scene>`. Compositions own the scene, timing, and editable inputs.
A composition can serve as a template without a separate template copy.

When a visual rule changes, update its Diffusion Studio token or element in the same revision.
