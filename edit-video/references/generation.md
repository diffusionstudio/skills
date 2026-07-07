# AI generation

AI generation is **declarative**, not a command. Instead of running a `generate`
command, you **declare** the asset as a value with the `generate` namespace from
`@diffusionstudio/jsx` and let the editor produce it on mount. There is no
`dapi generate` group — generation happens through `dapi mount` / `dapi node insert`.

Generation is **long-running**, **costs credits**, and requires a signed-in
account (`dapi whoami`). It **blocks the command**: `mount` exits only after every
declared asset has landed (each placeholder shows a generating state until then).

## Discover models & voices first

These are **top-level** commands:

```bash
dapi models [image|video|audio]   # model ids + per-model constraints (durations, aspectRatios, features)
dapi voices                       # voice ids + labels for voice assets
```

Run these before declaring so you pick a valid `model` and stay within its
constraints (`durations`, `aspectRatios`, `features: start-frame|end-frame|audio`).

## Declare assets with `generate.*`

A declaration returns an **`AssetRef`** that you pass wherever a source is
expected (`src`, `startFrame`, `endFrame`, `refs`). A ref never used by a mounted
element is dropped without generating.

```tsx
import { generate } from "@diffusionstudio/jsx";

const hero = generate.image({
  prompt: "A neon city at night, cinematic",
  model: "flux-2-turbo",
  aspectRatio: "16:9",
  seed: 42,
});

// one generated asset can feed another
const heroMotion = generate.video({
  prompt: "slow camera push-in",
  model: "kling-3-pro",
  startFrame: hero,
  duration: 5,
});

export default function Project() {
  return (
    <scene key="intro" name="Intro" width={1920} height={1080}>
      <video src={heroMotion} inPoint={0} outPoint={5} />
      <image src={hero} x={40} y={40} width={200} height={112} />
    </scene>
  );
}
```

## Declaration options

```ts
type AssetInput = string | AssetRef;   // path, URL, asset id, or another declaration

generate.image({ prompt, model?, aspectRatio?, refs?, seed? })
generate.video({ prompt, model?, aspectRatio?, duration?, audio?, startFrame?, endFrame?, seed? })
generate.voice({ prompt /* the text to speak */, voice? })
generate.audio({ prompt, model? })
```

- `prompt` is always required; `model`/`voice` default to the first listed by
  `dapi models <type>` / `dapi voices`.
- `aspectRatio`: `1:1 | 4:3 | 3:4 | 16:9 | 9:16` (default `16:9`; supported set
  varies by model). `duration`: whole seconds, default `5`, valid values vary by
  model. `audio: true` and `endFrame` are honored only by models whose `features`
  include them.
- **Chaining:** `startFrame` / `endFrame` / `refs` accept other `AssetRef`s —
  generate an image, then animate it into a video. Referenced-only assets
  generate but produce no node.
- **Caching:** unchanged declarations are reused on re-mount instead of
  regenerating; changing any option regenerates. Set `seed` for reproducibility.
  The cache lasts for the app session only.
- **Errors:** per-model constraint violations (`aspectRatio`, `duration`, feature
  flags) exit non-zero after generation settles; the mounted tree stays and the
  affected placeholder is left without a paint — fix the declaration and re-mount.

## Captions — caption a scene

Captioning is declarative too: a `<captions />` element inside a scene transcribes
that scene's audio into a styled, timed caption node. There is no `node caption`
command. To caption an already-open scene, insert one:

```bash
dapi node insert <sceneId> --code '<captions preset="spotlight" colors={["#FF0055"]} />'
```

```tsx
<scene key="main" width={1920} height={1080}>
  <video src="/Movies/clip.mp4" inPoint={0} outPoint={10} />
  <captions />
</scene>
```

Usage notes:

- The scene needs an unmuted audio/video source, else the caption node stays
  empty. Captions attach shortly after mount and wait for generated audio, so a
  generated voice track is captioned correctly.
- Transcripts are **cached** — re-mounting with unchanged audio costs nothing.

### Choosing a preset

`preset` picks the template (default `"classic"`); `colors` fills the preset's
color slots in order (any CSS color; only some presets have slots — omit for the
defaults). **Pick by the video's tone:**

| Preset | Looks like | Reach for it when | Color slots (defaults) |
| ------ | ---------- | ----------------- | ---------------------- |
| `classic` | Centered lowercase text, soft drop shadow, a few words at a time | Safe default — vlogs, talking heads, general content | — |
| `cascade` | Light text in the lower left; words appear progressively as spoken | Calm, editorial feel; interviews, documentary pacing | — |
| `spotlight` | Bold italic centered line; the spoken word lights up in the highlight color | High-energy social clips (Reels/Shorts/TikTok) that need word-level emphasis | 1: highlight (`#24D5FF`) |
| `whisper` | Small, wide, understated line in ~2 s phrases | Minimal, cinematic footage where captions should stay out of the way | — |
| `paper` | Centered two-line block; the spoken line gets a heavier weight | Text-forward content: explainers, quotes, essays | — |
| `guinea` | Uppercase display type; the spoken word enlarges and cycles through three colors | Loud, playful, meme-adjacent content | 3: `#F55353`, `#FEB139`, `#F6F54D` |
| `stark` | Heavy uppercase blended into the footage with a difference blend | Stylized promos/trailers where type is part of the image | — |

```tsx
<captions preset="spotlight" colors={["#FF0055"]} />
```

> To caption raw media instead of a scene's mix, use `dapi asset transcript <id>`
> (see [`inspection.md`](inspection.md)) and author the caption text yourself.

See [`authoring-jsx.md`](authoring-jsx.md) for placing the generated assets.
