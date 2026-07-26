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
