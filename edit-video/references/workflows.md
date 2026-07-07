# End-to-end recipes

Each recipe assumes the app is running (`dapi open` if not) and you've run
`dapi ctx` to orient. Commands return JSON — capture ids you'll reuse. For
non-trivial edits, keep the project module as a `.tsx` file next to the footage
and re-`mount` it as it evolves (keyed roots rebuild in place, no duplicates).

## 1. Start a project from a folder of footage

```bash
dapi open ./shoot-2026-06        # creates project, imports all media, writes .dapi
dapi asset ls                    # confirm what got imported (ids + types)
dapi ctx                         # note activeSceneId
```

## 2. Build a title scene over a clip

```bash
# pick the clip's asset id from `asset ls`, then author JSX
cat > open.tsx <<'TSX'
export default function Project() {
  return (
    <scene key="open" name="Open" width={1920} height={1080}>
      <video src="<clipAssetId>" inPoint={0} outPoint={8} />
      <text name="Title" inPoint={1} outPoint={6}
            textAlign="center" textBaseline="middle"
            fontSize={128} fontWeight="bold" fill="white">
        Hello World
      </text>
    </scene>
  );
}
TSX
dapi mount open.tsx
dapi node tree                    # discover the created node ids
dapi node screenshot -t 3         # verify, then Read the PNG
```

(`mount` takes a module path or `--code <str>` — there's no stdin. `--code`
accepts a bare JSX expression: `dapi mount --code '<scene key="x" …>…</scene>'`.)

## 3. Trim a clip

Trimming = setting the visible window (`inPoint`/`outPoint`) and which source
part plays (`startTime`). Edit the timing in your module and re-`mount` (keyed
roots rebuild in place), or patch the node directly:

```bash
dapi node grep -k Name "Main clip" -l          # find the node id
dapi node patch --json '[{"id":12,"inPoint":0,"outPoint":10,"startTime":"-1:30"}]'
# shows 10s; source starts 1m30s in
```

To find the right trim points first: `dapi asset visualize <id>` (filmstrip +
waveform) or `dapi asset frame <id> -t 90 95 100`.

## 4. Sequence several clips back-to-back

```tsx
<sequence>
  <video src="<a>" inPoint={0}  outPoint={5} />
  <video src="<b>" inPoint={5}  outPoint={12} />
  <video src="<c>" inPoint={12} outPoint={20} />
</sequence>
```

`<sequence>` enforces non-overlapping order — the track-like layout.

## 5. Add narration + auto-captions

Generation is declarative — declare the voice with `generate.voice` and reference
it; `<captions />` transcribes the scene's mix:

```bash
dapi voices                       # pick a voice id
dapi node insert <sceneId> --code '
  import { generate } from "@diffusionstudio/jsx";
  const vo = generate.voice({ prompt: "In 2026, everything changed.", voice: "<voiceId>" });
  export default () => <>
    <audio src={vo} inPoint={0} />
    <captions preset="classic" />
  </>;
'
# blocks until the voice generates; captions attach asynchronously after
dapi node screenshot -t 1         # verify captions render
```

## 6. Generate B-roll you don't have

```bash
dapi models video                 # check model ids, durations, features
cat > broll.tsx <<'TSX'
import { generate } from "@diffusionstudio/jsx";

const broll = generate.video({
  prompt: "slow aerial over snowy peaks",
  model: "kling-3-pro",
  duration: 5,
  aspectRatio: "16:9",
});

export default function Project() {
  return (
    <scene key="broll" name="B-roll" width={1920} height={1080}>
      <video src={broll} inPoint={0} outPoint={5} />
    </scene>
  );
}
TSX
dapi mount broll.tsx              # blocks until generation lands (credits!)
dapi node screenshot              # verify
```

## 7. Align a lav/voice recording to camera audio

No offset math — mute the camera track and let `syncTo` place the clean
recording (see `authoring-jsx.md`):

```tsx
<scene key="talk" width={1920} height={1080}>
  <video key="camera" src="<cameraAssetId>" muted />
  <audio src="<lavAssetId>" syncTo="camera" />
</scene>
```

Check the `{ offsetSeconds, confidence }` line on stderr (≳ 0.9 = trustworthy).

## 8. Restyle existing nodes quickly

```bash
dapi node grep -k Name Title -l               # find the node id by name
dapi node patch --json '[{"id":12,"opacity":0.8,"rotation":4,"y":60}]'
dapi sel set 12 && dapi sel focus             # frame it on canvas
dapi node screenshot                          # verify
```

## General loop

`ctx → (find ids: asset ls / node tree / node grep) → edit (mount — incl.
`generate.*` and `<captions>` — | node insert | node patch) → inspect
(screenshot / frame / visualize) → adjust → report only what you saw.`
