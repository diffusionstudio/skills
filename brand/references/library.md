# Diffusion Studio brand library

Use this catalog before making a new brand file. References own brand decisions; assets apply
them. Keep one-off project media with its project.

## Diffusion Studio source

| File | Use | Inputs and limits |
| --- | --- | --- |
| `assets/video/tokens.ts` | Apply brand color, type, spacing, and safe areas in JSX | Keep it in sync with `design.md` |
| `assets/video/elements/title-card.tsx` | Add a title and optional qualifier | Follow title and subtitle limits in `design.md` |
| `assets/video/elements/lower-third.tsx` | Add a name and detail over footage | Keep both lines inside the text safe area |
| `assets/video/elements/callout.tsx` | Add a short label and value | Use for one fact, not a paragraph |
| `assets/video/elements/media-grid.tsx` | Place one, two, or four media sources | Supports full, landscape, portrait, and square geometry |

Elements do not own a `<scene>`. Read the matching source for its props and copy only the files
the project needs.

## Compositions

| File | Use | Replace before mounting |
| --- | --- | --- |
| `assets/video/compositions/product-demo.tsx` | A single product capture with a lower third | Media source, name, and detail |
| `assets/video/compositions/product-tour.tsx` | Full frame to two-up to four-up and back | Media sources and copy |
| `assets/video/compositions/end-card.tsx` | A plain branded end card | Title and call to action |

Compositions own `<scene>`, timing, and editable inputs. They are starting points, not a second
component system in the Diffusion Studio app.

## Identity assets

| File | Use |
| --- | --- |
| `assets/identity/logos/logo-white.svg` | Wordmark on a dark, quiet background |
| `assets/identity/icons/icon-white.svg` | Product icon when the name is already clear |

No dark mark or font file is bundled.

## Imagery and audio

No reusable image, music, sound-effect, or voiceover file is bundled. Do not replace a missing
asset with an unlicensed or unrelated file.

When adding media, record its source and usage rights in this catalog. Add a reusable item only
after it has a clear repeated use. Give an element one job and a small input set. Add a
composition when the scene flow repeats. Do not add a one-off choice as a brand rule.
