// Six go-to cubic beziers, in mirrored pairs.
// Across a cut, alternate them so objects are at their highest velocity at the
// moment of the cut: ease in to animate out, followed by ease out for the reveal.
//
// Motion graphics are motion: this is not a presentation or a static website.
// Elements that fade in, sit still, and fade out read as slides. Keep energy in
// the frame — overlap entrances and exits, stagger siblings by a few frames,
// keep something moving during holds (a slow drift, scale, or counter), and
// drive every move with one of these curves rather than linear or a default.
const snappyOut = "cubicBezier(0,0.6,0.4,1)"; // energetic entrances that settle softly
const expoOut = "cubicBezier(0,1,0,1)"; // dramatic reveals, scale pops, counters
const snappyIn = "cubicBezier(0.6,0,1,0.4)"; // wind-ups that exit at full speed
const expoIn = "cubicBezier(1,0,1,0)"; // anticipation into a hard exit or cut
const outIn = "cubicBezier(0,0.7,1,0.3)"; // motion carried across a cut, whip feel
const inOut = "cubicBezier(0.7,0,0.3,1)"; // A-to-B moves at rest on both ends

const EASINGS = { snappyOut, expoOut, snappyIn, expoIn, outIn, inOut };

export default function Easings() {
  return (
    <rect scene="example-easings" name="Easings" width={1920} height={1080} fill="#0b0d12">
      {Object.entries(EASINGS).map(([name, easing], i) => (
        <>
          <text x={160} y={126 + i * 150} fontSize={32} fontWeight={600} fontFamily="Inter">
            {name}
          </text>
          <rect
            x={[
              { time: 0, value: 460, easing },
              { time: 2, value: 1700 },
            ]}
            y={110 + i * 150}
            width={64}
            height={64}
            cornerRadius={32}
            fill="#7c9cff"
          />
        </>
      ))}
    </rect>
  );
}
