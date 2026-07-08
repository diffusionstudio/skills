# Choosing commands

When to reach for which command. For arguments, options, and output shapes, use
`--help` and the command's `Reference:` page (see SKILL.md).

## Mental model

Groups: **selection** reads/changes what's selected; **node** targets nodes by
id (scenes are nodes, created declaratively via `mount`); **asset** operates on
the media library; **folder** organizes that library. Declarative composition
happens through **`mount`**; `node insert` runs the same pipeline into an
existing parent. There is no `generate` group: **AI generation is declarative**
(`generate.*` in the project module, produced on mount); `models` / `voices`
list what those declarations can reference.

Orient first, always: `dapi ctx`. Before generating: `dapi whoami`.

## Finding things

| You want | Use | Because |
| -------- | --- | ------- |
| Structure and ids of what's on the canvas | `node tree` | Nested subtree; the way to discover entity ids |
| Exact property values of an entity | `node ls` | Raw persisted records (engine units: frames @30fps, packed colors, dB) |
| Nodes by name or content | `node grep` | Searches the same records `ls` emits; the discovery front-end to `ls` / `patch` / `selection set` |
| The media library as a hierarchy | `asset tree` | Folders and assets together |
| An asset's stored metadata | `asset ls` | Raw records (per-type metadata, `folderId`, stored transcript) |
| What's selected / to select / to frame on canvas | `selection ls` / `set` / `focus` | Mutations return the new state, so you can chain |

## Changing the composition

| Change | Use | Because |
| ------ | --- | ------- |
| Build or restructure scenes | `mount` | Reconciles by `key`: re-mounting rebuilds keyed roots in place, no duplicates; keyed roots the render drops are deleted |
| Add content under an existing node | `node insert` | Same pipeline, but always inserts fresh entities; nothing replaced or deleted |
| Tweak props on existing nodes | `node patch` | Same property table as JSX elements; renaming is patching `name`; paints and color stops are patchable too |
| Duplicate / delete nodes | `node cp` / `node rm` | |

For anything structural (adding content, sequences, generation), prefer keeping
a `.tsx` module next to the footage and re-`mount`ing it as it evolves; use
`patch` for one-off tweaks that shouldn't force a re-mount.

## Authoring: which JSX reference page to read when

The JSX syntax is specified in the API reference's `jsx/` folder; read the page
that matches the task before writing code:

- **Timing and trims** are the usual failure point: read `jsx/timing.md` before
  setting `inPoint` / `outPoint` / `startTime`.
- Clips back-to-back, track-like: `<sequence>` (`jsx/sequences.md`). A cut
  between two sequence clips is styled with `transition` on the **outgoing**
  clip (`jsx/transitions.md`).
- Animating a prop over time: keyframe lists; keyframe time is node-local
  (`jsx/keyframes.md`).
- Aligning multi-recorder material (lav vs camera, two cameras): don't compute
  offsets, use `syncTo` (`jsx/audio-sync.md`).
- Gradients or stacked fills: paints are child entities (`jsx/paints.md`).
- What `src` accepts: `jsx/media.md`.

## Generation

Declare `generate.image/video/voice/audio` in the module and let `mount`
produce them (`jsx/generate.md`). Advice that saves credits and retries:

- Run `dapi models <type>` / `dapi voices` **before declaring**, to pick a valid
  model/voice and stay within its constraints (durations, aspect ratios,
  features).
- Generation blocks the mount, costs credits, and needs a signed-in account.
- Results are cached by content: re-mounting unchanged declarations regenerates
  nothing, so iterating on layout around a generated asset is safe. Set `seed`
  for reproducibility.

### Captions: choosing a preset

Captioning is declarative too: `<captions />` inside a scene transcribes that
scene's audio mix (`jsx/captions.md`). Pick the preset by the video's tone:

| Preset | Reach for it when |
| ------ | ----------------- |
| `classic` (default) | Safe default: vlogs, talking heads, general content |
| `cascade` | Calm, editorial feel; interviews, documentary pacing |
| `spotlight` | High-energy social clips (Reels/Shorts/TikTok) needing word-level emphasis |
| `whisper` | Minimal, cinematic footage where captions should stay out of the way |
| `paper` | Text-forward content: explainers, quotes, essays |
| `guinea` | Loud, playful, meme-adjacent content |
| `stark` | Stylized promos/trailers where type is part of the image |

To caption raw media instead of a scene's mix, `asset transcribe` it and author
the text yourself.

## Projects and the library

- Fastest start with existing footage: `dapi open <folder>` creates a project,
  imports every supported file, and remembers the association; re-running just
  switches back.
- `folder rm` **cascades**: it deletes descendant folders and their assets.
- Getting media back out: `asset export` writes the original bytes (no
  re-encode); `asset frame` / `visualize` render PNGs.

## Rendering

`node render` renders **one scene per call** (default: the active scene) to a
video file. Local and free, but long-running. Encode options (format, codec,
resolution, trim) are in the command's reference page; defaults give an
mp4 / 1080p / H.264 render. Verify the cut visually before handing over the
path.
