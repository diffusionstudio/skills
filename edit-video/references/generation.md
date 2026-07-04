# AI generation

AI generation is **declarative**, not a command. Instead of running a `generate`
command, you **declare** the asset you want in a `<defs>` block and let the editor
produce it on import. There is no `dapi generate` / `gen` group — generation
happens through `dapi node add` (HTML) and `dapi node caption`.

Generation is **long-running**, **costs credits**, and requires a signed-in
account (`dapi whoami`). It is **asynchronous and non-blocking**: `node add`
returns immediately with placeholder nodes in place, and each node's paint is
attached as soon as its asset lands.

## Discover models & voices first

These are **top-level** commands (not under `generate`):

```bash
dapi models [image|video|audio]   # model ids + per-model constraints (durations, aspectRatios, features)
dapi voices                       # voice ids + labels for voice assets
```

Run these before declaring an `<asset>` so you pick a valid `model` and stay
within its constraints.

## Declare assets in `<defs>`

Put one `<asset>` per generated asset in a `<defs>` block, then reference each by
its `id` from a media element's `src`. `<defs>`/`<asset>` render nothing on their
own — an asset is only placed on the canvas when referenced.

```bash
dapi node add --html "$(cat <<'HTML'
<defs>
  <asset id="hero" type="image"
         model="flux-2-turbo" prompt="A neon city at night, cinematic"
         aspect-ratio="16:9" seed="42" />
  <!-- one generated asset can reference another -->
  <asset id="heroMotion" type="video"
         model="kling-3-pro" prompt="slow camera push-in"
         start-frame="hero" duration="5" />
</defs>

<div data-nm="Intro" data-w="1920" data-h="1080">
  <video src="heroMotion" data-ip="0" data-op="5"
         style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover;"></video>
  <img src="hero" style="position:absolute; top:40px; left:40px; width:200px;" />
</div>
HTML
)"
```

## `<asset>` attributes

| Attribute      | Applies to    | Meaning |
| -------------- | ------------- | ------- |
| `id`           | all           | **Required.** Unique reference target for `src` / `start-frame` / `end-frame` / `ref`. |
| `type`         | all           | **Required.** `image` \| `video` \| `voice` \| `audio`. |
| `prompt`       | all           | **Required.** The text prompt; for `voice`, the text to speak. |
| `model`        | all           | Model id. Defaults to the first listed by `dapi models <type>`. |
| `aspect-ratio` | image, video  | `1:1` \| `4:3` \| `3:4` \| `16:9` \| `9:16`. Default `16:9`; supported set varies by model. |
| `ref`          | image         | Space-separated image references (declared `id`s, asset ids, or paths). |
| `duration`     | video         | Whole seconds (default `5`); valid values vary by model. |
| `audio`        | video         | `audio="true"` generates audio too. Honored only by models whose `features` include `audio`. |
| `start-frame`  | video         | Image reference used as the first frame. |
| `end-frame`    | video         | Image reference used as the last frame. Honored only if `features` include `end-frame`. |
| `voice`        | voice         | Voice id. Defaults to the first listed by `dapi voices`. |
| `seed`         | image, video  | Integer seed for reproducible, cache-stable generation. |

- **Dependency order:** `start-frame` / `end-frame` / `ref` may point at another
  `<asset>`'s `id`; the converter generates in topological order. Cycles are
  rejected at parse time.
- **Caching:** results are cached by content (type, model, prompt, resolved refs,
  seed). Re-importing an unchanged declaration reuses the cached asset; changing
  any attribute regenerates. Set `seed` to make a spec reproducible.
- **Errors:** missing/duplicate `id`, unknown `type`, or missing `prompt` fail at
  parse time (the whole import fails). Per-model constraint violations
  (`aspect-ratio`, `duration`, `end-frame`/`audio` features) and cycles surface
  later, when the asset generates, and leave the placeholder without a paint.

See [`authoring-html.md`](authoring-html.md) and the full contract in
[`apps/cli/HTML_API.md`](../../../apps/cli/HTML_API.md#declared-assets).

## Captions — caption a scene

Captioning is a **node**, not a reusable asset. Two equivalent forms:

```bash
dapi node caption [sceneId]     # imperative; defaults to the active scene
```

```html
<div data-nm="Scene" data-w="1920" data-h="1080">
  <video src="/Movies/clip.mp4" data-ip="0" data-op="10"></video>
  <captions></captions>          <!-- declarative equivalent -->
</div>
```

Both transcribe the scene's existing audio and add a styled, timed caption node as
a child of the scene — no prompt or model. `node caption` returns a single JSON
value. Fails if the scene has no unmuted audio/video or no detectable speech.

> To caption raw media instead of a scene's mix, use `dapi asset transcript <id>`
> (see [`inspection.md`](inspection.md)) and author the caption text yourself.
