# Audio sync

`syncTo` places a node in time by listening instead of arithmetic: the node's audio is cross-correlated against another node's audio, and its `start` is computed so the two recordings coincide on the timeline. It replaces manual offset measurement for multi-recorder material: a lav or voice track against camera audio, two cameras on the same take, two microphones in one room.

```tsx
<rect scene="talk" width={1920} height={1080}>
  <video key="camera" src="/Movies/take-3.mp4" width={1920} height={1080} sourceOut={45} muted />
  <audio src="/Movies/lav.wav" syncTo="camera" />
</rect>
```

## Semantics

- `syncTo` names the `key` of another element in the same render. Both sides must carry an audio track; any pairing works (audio-to-video, audio-to-audio, video-to-video).
- The computed placement is `start = target.start + offset`, where `offset` is the measured source-time offset between the two recordings (positive when this node's recording started after the target's; possibly negative). `syncTo` and `start` are mutually exclusive.
- `sourceIn`/`sourceOut` keep their normal meaning and remain yours to set. When omitted on a synced node, the window defaults to the intersection of the node's natural extent with the target's window (instead of the usual natural-duration fit), so a lav track simply covers its take.
- Alignment reads source content: `muted` and `volume` on either side do not affect the measurement. Use `muted` to keep only one side audible, as on the camera track above.
- Chains resolve in dependency order (A may sync to B while B syncs to C). Unknown keys, cycles, and combining `syncTo` with `start` are mount errors; nothing is inserted.

## Execution

Alignment runs at the sync stage of the [pipeline](./README.md#pipeline): after generated assets land (either side may be generated), before captions read the scene. It is local, consumes no credits, and blocks the command, so exit `0` means final placement. A correlation too weak to trust fails the command (see [errors.md](./errors.md)) while the node keeps its default placement. Offsets are **cached** by the pair of source contents, so re-mounting an unchanged project re-measures nothing.

Because `syncTo` is part of the shared property table, [`dapi node patch`](../node/patch.md) accepts it too: patching `syncTo` onto an existing node re-aligns it against the document node carrying that key.
