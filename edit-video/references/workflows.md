# End-to-end recipes

Each recipe assumes the app is running (`dapi open` if not) and you've run
`dapi ctx` to orient. Commands return JSON — capture ids you'll reuse.

## 1. Start a project from a folder of footage

```bash
dapi open ./shoot-2026-06        # creates project, imports all media, writes .dapi
dapi asset ls                    # confirm what got imported (ids + types)
dapi ctx                         # note activeSceneId
```

## 2. Build a title scene over a clip

```bash
# pick the clip's asset id from `asset ls`, then author HTML
dapi node add --html "$(cat <<'HTML'
<div data-nm="Open" data-w="1920" data-h="1080"
     style="display:flex; align-items:center; justify-content:center;">
  <video src="<clipAssetId>" data-ip="0" data-op="8"
         style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;"></video>
  <span data-nm="Title" data-ip="1" data-op="6"
        style="font-size:8rem; font-weight:bold; color:white;">Hello World</span>
</div>
HTML
)"
# -> { insertedIds: [...] }
dapi node screenshot -f 90        # verify, then Read the PNG
```

(`node add` takes `--html <str>` or `--file <path>` — there's no stdin. If the
inline form is awkward, write the HTML to a file and use `--file scene.html`.)

## 3. Trim a clip

Trimming = setting the visible window (`data-ip`/`data-op`) and which source part
plays (`data-st`). Re-author the node (or its `insert-child`) with new timing:

```html
<video src="<id>" data-ip="0" data-op="10" data-st="-1:30"></video>
<!-- shows 10s; source starts 1m30s in -->
```

To find the right trim points first: `dapi asset visualize <id>` (filmstrip +
waveform) or `dapi asset frame <id> -t 90 95 100`.

## 4. Sequence several clips back-to-back

```html
<sequence>
  <video src="<a>" data-ip="0"  data-op="5"></video>
  <video src="<b>" data-ip="5"  data-op="12"></video>
  <video src="<c>" data-ip="12" data-op="20"></video>
</sequence>
```

`<sequence>` enforces non-overlapping order — the track-like layout.

## 5. Add narration + auto-captions

Generation is declarative — declare the voice as an `<asset>` and reference it, then
caption the scene:

```bash
dapi voices                       # pick a voice id
dapi node add <sceneId> --mode insert-child --html "$(cat <<'HTML'
<defs>
  <asset id="vo" type="voice" voice="<voiceId>" prompt="In 2026, everything changed." />
</defs>
<audio src="vo" data-ip="0"></audio>
HTML
)"
dapi node caption                 # captions the active scene's audio -> caption node
dapi node screenshot -f 30        # verify captions render
```

## 6. Generate B-roll you don't have

```bash
dapi models video                 # check model ids, durations, features
dapi node add --html "$(cat <<'HTML'
<defs>
  <asset id="broll" type="video" model="kling-3-pro"
         prompt="slow aerial over snowy peaks" duration="5" aspect-ratio="16:9" />
</defs>
<div data-nm="B-roll" data-w="1920" data-h="1080">
  <video src="broll" data-ip="0" data-op="5" style="position:absolute; inset:0;"></video>
</div>
HTML
)"
# placeholders appear immediately; screenshot again once generation lands
```

## 7. Restyle existing nodes quickly

```bash
dapi node ls                                  # find the node id
dapi node style --patch '[{"id":12,"opacity":0.8,"rotate":"4deg","top":"60px"}]'
dapi sel set 12 && dapi sel focus             # frame it on canvas
dapi node screenshot                          # verify
```

## General loop

`ctx → (find ids: asset ls / node ls / tree) → edit (node add — incl. declared
`<asset>` generation — | node style | node caption) → inspect (screenshot / frame /
visualize) → adjust → report only what you saw.`
