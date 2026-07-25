# Examples

Read only the example that clearly matches the task. Make sure you have sufficient context before deciding on any of the following editing styles.

## Video editing

- [Long-form talking head](./video-editing/talking-head.md)

## Prompts

- [Writing prompts for `dapi media listen`](./prompts/media-listen.md)

## JSX

```tsx
import { For } from "solid-js";

const raw = "/Recordings/take.mp4";

const takes = [
  { src: raw, sourceIn: 48.2, sourceOut: 53.9 },
  { src: raw, sourceIn: 61.7, sourceOut: 69.4 },
];

let cursor = 0;
const aRoll = takes.map((t) => {
  const start = cursor;
  cursor += t.sourceOut - t.sourceIn;
  return { ...t, start };
});

const SIZE = { height: 1080, width: 1920 }

export default function MyScene() {
  return (
    <rect scene="my-scene" name="My Scene" {...SIZE} fill="black">
      <audio src="path/to/bg-music.mp3" />
      <sequence name="A-roll">
        <For each={aRoll}>
          {(clip) => <video {...SIZE} {...clip} />}
        </For>
      </sequence>
      <sequence name="B-roll">
        <image {...SIZE} src="path/to/img.png" />
      </sequence>
      {/* Html is best for motion graphics and overlays */}
      <html {...SIZE}>
        <div style="font:700 96px Inter;color:#fff;">My Overlay</div>
      </html>
      {/* Surfaces are great for imparative programming */}
      <surface {...SIZE} />
      <captions />
    </rect>
  );
}
```
