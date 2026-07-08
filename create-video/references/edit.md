# Edit footage

Editing is authoring **Solid JSX project modules** and mounting them, plus
targeted patches on existing nodes. Don't dive straight into `mount`: a good
edit is a planned pipeline, the same way a post-production team works.
Understand the material, decide the story, then assemble; **persist each step
as a markdown file on disk** rather than holding it all in your head.

## Why write it down

- **Context survives.** Footage analysis and shot lists are long; offloading
  them to files keeps your working context lean and lets you resume after a
  reset.
- **It's auditable and editable.** The user (or you, later) can read, correct,
  and reorder the plan before a single credit is spent or clip is placed.
- **It mirrors real EDLs/briefs.** An ordered, timestamped plan *is* the edit;
  assembly becomes mechanical once it exists.

Keep these docs next to the footage, e.g. an `edit/` folder in the project
directory (the same folder you `dapi open`ed). Adapt the artifact names to the
job.

## The pipeline

### 1. Asset map: `edit/asset-map.md`

Inventory the library (`dapi asset ls`). One row per asset: id, type, name,
duration, and a one-line "what it is" (fill the last column as you analyze).

### 2. Analyze the footage: `edit/footage-analysis.md`

Go through each asset with the inspection modes (see `understand.md`) and
record what happens, usable in/out ranges, cut points, audio quality, speech.
Write timestamps down; they feed every later step.

### 3. A-roll shot list: `edit/a-roll.md`

A-roll is the **spine**: the primary narrative (interview, VO-driven beats,
the main action). Pick the keepers and the exact in/out you'd use, then check
the spine covers the whole story. Note gaps.

### 4. B-roll shot list (optional): `edit/b-roll.md`

B-roll is **supporting/cutaway** footage that covers cuts, illustrates the VO,
or hides jump cuts. List candidates against the gaps from step 3. Missing
coverage is what you AI-generate (see `generate.md`).

### 5. Edit plan: `edit/edit-plan.md`

The ordered timeline: every clip in sequence, its composition in/out points,
and which source range plays. This is what you translate into the project
module.

**Brief-first alternative:** when generating most assets from scratch, start
from a creative brief (`edit/brief.md`: goal, audience, tone, length, beats)
and then find or generate footage to satisfy it. Either way the plan is a
written artifact you assemble from, and it stays the source of truth: update
it as reality diverges.

## Assemble

Keep the project module next to the plan (e.g. `edit/project.tsx`) and evolve
it there. Three ways to change the composition; read each command's reference
page before first use:

- **`mount`**: build or rebuild scenes from the module. Idempotent by `key`,
  so re-mounting the evolving module is the main loop.
- **`node insert`**: add content under an existing node, leaving the rest
  untouched.
- **`node patch`**: tweak props on existing nodes without a re-mount.

To find ids: `node tree` for structure, `node grep` to search by name or
content, `asset tree` / `asset ls` for media. Orient with `dapi ctx` whenever
unsure.

While authoring, read the JSX reference page that matches what you're writing:

- **Timing and trims are the usual failure point**: read `jsx/timing.md`
  before setting in/out points or source offsets.
- Clips back-to-back: `jsx/sequences.md`; styling the cut between two sequence
  clips: `jsx/transitions.md`.
- Animating a prop: `jsx/keyframes.md`.
- Aligning multi-recorder material (lav vs camera, two cameras): don't compute
  offsets, use audio sync (`jsx/audio-sync.md`).

**Verify each step visually** (`understand.md`) and only report what you saw.

## Captions

`<captions />` inside a scene transcribes that scene's audio mix
(`jsx/captions.md`). Pick the preset by the video's tone:

| Preset | Reach for it when |
| ------ | ----------------- |
| `classic` (default) | Safe default: vlogs, talking heads, general content |
| `cascade` | Calm, editorial feel; interviews, documentary pacing |
| `spotlight` | High-energy social clips (Reels/Shorts/TikTok) needing word-level emphasis |
| `whisper` | Minimal, cinematic footage where captions should stay out of the way |
| `paper` | Text-forward content: explainers, quotes, essays |
| `guinea` | Loud, playful, meme-adjacent content |
| `stark` | Stylized promos/trailers where type is part of the image |

## Deliver

`node render` renders one scene per call to a video file: local and free, but
long-running. Re-check the relevant frames before handing over the path.
