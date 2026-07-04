# How to approach an edit (studio process)

Don't dive straight into `node add`. A good edit is a **planned pipeline**, the
same way a professional post-production team works: understand the material,
decide the story, then assemble. Crucially, **persist each step as a markdown
file on disk** rather than holding it all in your head.

## Why write it down

- **Context survives.** Footage analysis and shortlists are long; offloading them
  to files keeps your working context lean and lets you resume after a reset.
- **It's auditable & editable.** The user (or you, later) can read, correct, and
  reorder the plan before a single credit is spent or clip is placed.
- **It mirrors real EDLs/briefs.** An ordered, timestamped plan *is* the edit;
  assembly becomes mechanical once it exists.

Keep these docs next to the footage — e.g. an `edit/` folder in the project
directory (the same folder you `dapi open`ed). Suggested artifacts below; adapt
names to the job.

## The pipeline

### 1. Asset map — `edit/asset-map.md`

Inventory everything `dapi asset ls` returns. One row per asset: id, type, name,
duration, and a one-line "what it is" (fill the last column as you analyze).

```markdown
| id | type | name | dur | contents |
| -- | ---- | ---- | --- | -------- |
| gbHJ | video | A001.mp4 | 0:42 | handheld, subject walks to car |
| k2Lp | audio | vo.wav | 0:30 | narrator VO |
```

### 2. Analyze the footage — `edit/footage-analysis.md`

Go through each asset with the inspection tools (see `inspection.md`) and record
findings: what happens, usable in/out ranges, cut points, audio quality, speech.

- `visualize` first (fast/free) for a filmstrip + waveform overview of each clip.
- `frame` to pin exact transition/cut timestamps.
- `transcript` for any clip with speakers (gives word-level times for cutting on
  a line). `analyze` only when meaning matters and speech is sparse/absent —
  window it with `-s`/`-e` when you already know the region of interest.

Write timestamps down — they feed every later step.

### 3. A-roll shortlist — `edit/a-roll.md`

A-roll is the **spine**: the primary narrative (interview, VO-driven beats, the
main action). Pick the keepers and the exact in/out you'd use, then **compare
against the footage analysis** — does the spine cover the whole story? Note gaps.

```markdown
- [story beat] gbHJ  in 0:03  out 0:09   "walks to car"
- [gap] need a reaction shot between beat 2 and 3
```

### 4. B-roll shortlist (optional) — `edit/b-roll.md`

B-roll is **supporting/cutaway** footage that covers cuts, illustrates the VO, or
hides jump cuts. List candidates against the gaps from step 3. If you don't have
coverage, this is where you decide what to **AI-generate** (`generation.md`) — a
shortlist of prompts is itself a plannable artifact.

### 5. Edit plan / creative brief — `edit/edit-plan.md`

The ordered timeline: every clip in sequence with composition in/out points and
which source range plays. This is the thing you translate into the HTML you feed
`node add` (timing maps directly to `data-ip`/`data-op`/`data-st` —
see `authoring-html.md`).

```markdown
1. 0:00–0:08  gbHJ (src 0:03–0:11)        title overlay "Hello"
2. 0:08–0:14  brollX (src 0:00–0:06)      VO continues
3. 0:14–0:30  gbHJ (src 0:20–0:36)        captions
```

## Two ways in

- **Footage-first** (above): you have the material, so map → analyze → shortlist →
  plan. Best for editing existing footage.
- **Brief-first:** start from a creative brief (`edit/brief.md`) — goal, audience,
  tone, length, beats — *then* find or generate footage to satisfy it. Best when
  generating most assets from scratch. Either way the brief/plan is a written
  artifact you assemble from.

## Then assemble

Only once the plan exists do you build: author HTML per `authoring-html.md`,
place clips with timing straight from the plan, and **verify each step visually**
(`inspection.md`). Update the plan file as reality diverges — it stays the source
of truth for the edit.
