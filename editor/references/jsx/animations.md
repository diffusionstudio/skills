# Animations

`animations` declares **preset in/out animations** on a clip: each entry plays over the clip's head (`"in"`) or tail (`"out"`), between the node's static state and the preset's start/end state. For hand-authored motion on individual props, use [keyframes](./keyframes.md); the two compose on distinct properties.

```tsx
<video
  src="/Movies/intro.mp4"
  width={1920} height={1080}
  start={0} end={8}
  animations={[
    { type: "fade", duration: "15f" },
    { type: "slideUp", phase: "out", duration: 0.5, delay: 0.2 },
  ]}
/>
```

```ts
type AnimationSpec = {
  type: AnimationType;      // preset, see below
  phase?: "in" | "out";     // default "in"
  duration?: Time;          // default 1 second
  delay?: Time;             // gap between the clip edge and the animation; default 0
};
```

## Types

The editor's animations inspector options:

| `type` | Effect |
| ------ | ------ |
| `"fade"` | Opacity ramp. |
| `"slideLeft"`, `"slideRight"`, `"slideUp"`, `"slideDown"` | Slide in from (or out toward) the named direction, fading. |
| `"grow"` | Scales up from 50%. |
| `"shrink"` | Scales down from 150%. |
| `"spin"` | Scale plus rotation. |
| `"twist"` | Overscale plus rotation and offset. |
| `"blur"` | 24px blur ramp. |
| `"appearWord"` | Text only: reveals the text word by word. |
| `"appearChar"` | Text only: reveals the text character by character. |
| `"scramble"` | Text only: resolves scrambled characters into the text. |
| `"gain"` | Audio only: volume ramp (fade-in/fade-out of the mix). No visual effect. |

Text types apply only to [`<text>`](./text.md) and [`<captions>`](./captions.md); a mount that puts them elsewhere fails validation.

## Semantics

- `duration` and `delay` take any [time format](./timing.md#time-formats). An `"in"` animation plays over `[delay, delay + duration]` from the clip's in point; an `"out"` animation ends `delay` before the clip's out point. Both track the clip when it is retimed.
- A node takes **any number of animations**; overlapping entries apply in list order, later ones writing over earlier ones on the properties they share. A [keyframe](./keyframes.md) track on the same property (say, keyframed `opacity` next to `"fade"`) overrides the preset while it has effect; presets and keyframes on distinct properties compose freely.
- The list is **mount-shaped**: setting `animations` replaces the node's existing animations, `[]` removes them all, and an omitted prop leaves hand-added ones untouched.
- Animations land as regular editor animations, editable in the inspector. Part of the shared property table: [`dapi node patch`](../node/patch.md) accepts `animations` with identical semantics, e.g. `--json '[{ "id": 42, "animations": [{ "type": "fade" }] }]'`, and they list under `animations` in [`dapi node tree`](../node/tree.md).
