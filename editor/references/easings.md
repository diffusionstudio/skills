# Easings

Six go-to cubic beziers, in mirrored pairs. Choose from the intended weight, energy, and continuity of the action — never leave a move on linear or a default curve.

| Easing | Value | Use for |
| --- | --- | --- |
| `snappyOut` | `cubicBezier(0,0.6,0.4,1)` | Energetic entrances that settle softly |
| `expoOut` | `cubicBezier(0,1,0,1)` | Dramatic reveals, scale pops, counters |
| `snappyIn` | `cubicBezier(0.6,0,1,0.4)` | Wind-ups that exit at full speed |
| `expoIn` | `cubicBezier(1,0,1,0)` | Anticipation into a hard exit or cut |
| `outIn` | `cubicBezier(0,0.7,1,0.3)` | Motion carried across a cut, whip feel |
| `inOut` | `cubicBezier(0.7,0,0.3,1)` | A-to-B moves at rest on both ends |

Across a cut, alternate them so objects are at their highest velocity at the moment of the cut: ease in to animate out, followed by ease out for the reveal.

Motion graphics are motion: this is not a presentation or a static website. Elements that fade in, sit still, and fade out read as slides. Keep energy in the frame — overlap entrances and exits, stagger siblings by a few frames, keep something moving during holds (a slow drift, scale, or counter), and drive every move with one of these curves.
