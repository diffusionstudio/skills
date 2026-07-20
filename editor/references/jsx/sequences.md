# Sequences

`<sequence>` is a track-like container for back-to-back clips. It carries no timing of its own and **does not position its children at mount** — give each child an explicit `start` (see [timing.md](./timing.md)). What it adds is clip-to-clip [transitions](./transitions.md) on direct children, and, in the editor, a non-overlapping invariant: dragging or regrouping clips trims or removes whatever they land on.

```tsx
<sequence>
  {/* timeline 0–12 */}
  <video src="/Movies/intro.mp4" width={1920} height={1080} start={0} end={12} />
  {/* timeline 12–2:30, source from 5 s */}
  <video src="/Movies/main.mp4" width={1920} height={1080} start={12} end="02:30" sourceIn={5} />
  {/* from 2:30, plays to its natural end */}
  <video src="/Movies/outro.mp4" width={1920} height={1080} start="02:30" />
</sequence>
```

The next clip's `start` must match the previous clip's on-timeline end — its `end`, or from the source side `start + (sourceOut - sourceIn)`. Here `main` ends at `02:30`, so `outro` starts there. Giving `main` an `end` places the next cut at a round timeline mark without computing source lengths.

## Props

| Prop | Type | Meaning |
| ---- | ---- | ------- |
| `name` | `string` | Human-readable node name. |

Purely structural; nothing else.

Direct children of a sequence may declare a [`transition`](./transitions.md) into the following clip.
