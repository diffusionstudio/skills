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

Go through each asset, inspecting it and recording what
happens, usable in/out ranges, cut points, audio quality, speech. Write
timestamps down; they feed every later step.

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
it there. Re-mounting the evolving module is the main loop; add to or tweak
existing nodes in place when you don't want to rebuild the whole scene.

**Verify each mount visually** using `node screenshot`.
