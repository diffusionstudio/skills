# Diffusion Studio — video guide

Motion, easing, cuts, transitions, pacing, and sound. Defines the choices, not how to
execute them.

Color, type, layout, and captions are in `design.md`. Workflow, editorial judgment, and
`dapi` mechanics are in the `editor` skill.

Frames run at 30 fps, so `"12f"` is 400 ms. There are no masks and no trim paths; anything
built on them is out.

## Timing

Enter 400 ms `"12f"`. Exit 200 ms `"6f"`. Stagger 100 ms `"3f"`. Nothing runs past 600 ms
`"18f"`.

## Easing

Derive from the nearest anchor and adjust one quality. Reach for a new curve only when none
of these fits. Never `linear` unless the motion is mechanical.

| Anchor | Use for | `easing` |
| ------ | ------- | -------- |
| Entrance | anything arriving | `cubicBezier(0.2,0.75,0.34,0.94)` |
| Settle | landing, a lockup, a number resolving | `cubicBezier(0,0.65,0.51,0.99)` |
| Travel | moving between two states | `cubicBezier(1,0.49,0,0.55)` |
| Exit | leaving, and the companion to a hard cut | `cubicBezier(1,0.02,0.54,0.42)` |

Elements arrive and settle. Overshoot is off, so the `bouncy` and `strong` spring presets
stay unused.

## Movement

Lead with one element and delay its support by `"3f"`. Stagger repeated items from a
meaningful origin — first, center, or focal point. Let opacity finish before the movement
does, so text is readable while it is still settling.

One flourish per beat. A busy scene is a layout problem; more motion will not fix it.

### Camera

There is no camera. Simulated moves — push-in, drift, pan — go only on footage that is already
moving, matched to its direction and speed. Never add one to a static shot, a screen
recording, or a still image.

## Cuts and pacing

Seams are cuts. Pick the method from the reason for the seam.

| Method | How | Use for |
| ------ | --- | ------- |
| Hard cut on action | no transition | energy; the eye is mid-move so the jump hides |
| Jump cut | no transition | the same, with direction and speed matched across the seam |
| Continuous carry | one element keyframed across both beats | identity continuity, walkthroughs |
| Hold cut | no transition, after the beat settles | read-critical text, a final lockup |

Transitions are the exception. `dissolve` at 300 ms only between two shots of the same
subject. `fadeToBlack` only to end a video. Never `fadeToWhite`, `slideFromLeft`, or
`slideFromRight`.

Cuts carry the rhythm. When a sequence drags, cut it tighter before adding motion.

### Cutting on action

The outgoing motion must still be moving at the cut, heading somewhere past it. Author the
keyframe so its target lands beyond the visible end: a clip ending at `3s` whose `y` resolves
at `3.4s` is still travelling when you cut, and the eye carries the motion into the next shot.

It needs authored motion to cut on. Screen recordings, talking heads, and static product
shots have none, so they take hold cuts. It also needs rhythm — a single interrupted move
inside settled footage reads as a mistake, so use it across three or more beats or not at
all. Never on a final beat.

Cutting after a move settles is a hold cut. That is a different tool, not a worse version of
this one.

## Sound

PLACEHOLDER — no music bed is licensed and no levels are set. Do not add music unless the
request supplies a track, and do not invent a level. Sound effect judgment stays in `editor`.
