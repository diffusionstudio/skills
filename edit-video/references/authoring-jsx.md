# Authoring scenes — the JSX API

Content is added to the canvas by writing a **Solid JSX project module** and
running `dapi mount`. Every JSX element becomes an editable node. There is no
DOM and no CSS — **all positioning is explicit** (`x`, `y`, `width`, `height`
in pixels).

```bash
dapi mount scene.tsx                         # mount a module file (.tsx/.jsx/.ts/.js)
dapi mount --code '<scene key="intro" width={1920} height={1080}>…</scene>'
dapi node insert <parentId> overlay.tsx      # same pipeline, into an existing parent
dapi node insert <parentId> --code '<rect width={100} height={100} />' [--index N]
```

- **`mount` reconciles by `key`** — like reloading a webpage. Every top-level
  element must declare a `key`; a keyed root rebuilds the existing node carrying
  that key (keeping its id and canvas position) or creates it. Keyed nodes the
  render no longer produces are **deleted** — the mount owns its keyed roots.
  Unkeyed, hand-made nodes are never touched. The first rendered root becomes the
  active scene.
- **`node insert` always inserts fresh entities** (no keys, nothing replaced or
  deleted). `--index` sets the 0-based position among the parent's children
  (node roots only). Inserting a `<colorStop>` into a gradient paint id is how you
  add a stop to an existing gradient.
- Output: **none** on success. Inspect the result with `dapi ctx`, `node tree`,
  or a screenshot.
- With `--code`, a bare JSX expression is auto-wrapped — no `export default`
  needed.

## Project module contract

A standard Solid component module; the default export is the project:

```tsx
export default function Project() {
  return (
    <scene key="intro" name="Intro" fill="black" width={1920} height={1080}>
      {/* ... */}
    </scene>
  );
}
```

- `solid-js`, `solid-js/store`, and `@diffusionstudio/jsx` are provided by the
  host; **everything else is bundled** (npm deps, local imports, JSON) — a project
  folder is an ordinary npm package, libraries must be browser-compatible.
- Solid control flow (`<For>`, `<Show>`, …) and primitives work during mount, and
  user-defined components compose freely — use them to loop over an edit plan or
  build reusable titles/lower-thirds. Mounting is **one-shot**: signals don't
  animate the document afterward; the update path is editing the module and
  re-mounting.
- Errors (compile, invalid props, root without `key`, nested `<scene>`, missing
  `src`) abort with **nothing inserted** — fix and re-run.

## Element → node mapping

| JSX | Node |
| --- | ---- |
| `<scene>` | Scene (clips children to `width`×`height`; **document root only**, never nested) |
| `<group>` | Group container (transform; give it `fill` to draw a rectangle) |
| `<rect>` | Filled rectangle (`fill`, `cornerRadius`; takes paint children) |
| `<video src>` | Video |
| `<image src>` | Image |
| `<audio src>` | Audio (no visual; carries `volume`) |
| `<text>` | Text (children become editable glyphs) |
| `<sequence>` | Sequential group (see below) |
| `<captions>` | Caption node — transcribes the enclosing scene's audio (see `generation.md`) |
| `<solidPaint>` / `<linearGradientPaint>` / `<radialGradientPaint>` / `<colorStop>` | Paint sub-entities (see Paints) |

## Positioning (explicit pixels)

- Coordinates are **pixels relative to the parent's box**, origin top-left. No
  percentages, no layout keywords, no CSS.
- **Every element's box defaults to its parent's box**: `x`/`y` default to `0`,
  `width`/`height` default to the parent's size (the analog of
  `position:absolute; inset:0`). A full-frame video is just `<video src=… />`.
- `objectFit` (`"cover"` default for video, `"contain"` for image, or `"fill"`)
  controls how media pixels map into the box — never the box itself.

### Common props (all visual elements)

`key`, `name`, `x`, `y`, `width`, `height`, `rotation` (degrees), `opacity`
(0–1), `cornerRadius` (px), and the timing props below.

### Per-element props

- **`<scene>`** — `key` (**required**), `width`/`height` (**required**), `name`
  (recommended), `fill`. No timing/transform props, no `x`/`y` (canvas placement
  is the editor's concern; new roots are auto-placed near the viewport center).
- **`<video>`** — `src` (**required**), `objectFit`, `volume` (0–1), `muted`
  (exclude from the audio mix; independent of `volume`), `syncTo` (see Audio sync).
- **`<image>`** — `src` (**required**), `objectFit`.
- **`<audio>`** — `src` (**required**), `volume`, `muted`, `syncTo`, `name`,
  timing only.
- **`<text>`** — children = the text (**required**), `fontFamily` (check
  `dapi fonts`), `fontSize` (px), `fontWeight` (100–900 / `"bold"`), `fontStyle`,
  `fill`, `textAlign` (`left|center|right`), `textBaseline` (`top|middle|bottom`).
  Because the box defaults to the parent, a centered full-frame title is simply
  `<text textAlign="center" textBaseline="middle">…</text>`.
- **`<rect>`/`<group>`** — common props plus `fill` (any CSS color; **alpha is
  ignored — use `opacity`**).

## Paints (fills, gradients)

A node's fill is a **paint child** sub-entity; the `fill` prop is shorthand for a
solid paint. Declaring paints as children exposes gradients:

```tsx
<rect width={640} height={360} cornerRadius={24}>
  <linearGradientPaint rotation={90}>
    <colorStop offset={0} color="#FF0055" />
    <colorStop offset={1} color="#0055FF" />
  </linearGradientPaint>
</rect>
```

Paints are valid inside any visual element; multiple paints stack in document
order (later on top; a paint on `<video>`/`<image>` draws over the media).
`<solidPaint color>` , `<linearGradientPaint rotation>` (0 = left→right),
`<radialGradientPaint>`, `<colorStop offset color>` (offset 0–1). Colors: any CSS
color, alpha ignored — use `opacity`.

## Media `src` resolution

`src` accepts:
- **Asset id** — `src="gbHJ"` (from `dapi asset ls`).
- **`AssetRef`** — the value returned by a `generate.*` declaration (AI-generated
  on mount — see `generation.md`): `src={hero}`.
- **Global path** — `src="/Movies/clip.mp4"`.
- **Remote URL** — `src="https://…/clip.wav"` (registered as a remote asset).

## Timing & trims (the part agents get wrong)

Timing is **composition-relative** (against the parent timeline). Canonical unit
is frames @ **30 fps**; `Time` values accept these formats (may be negative):

| Format | Example | Meaning |
| ------ | ------- | ------- |
| `number` | `2.2` | seconds (fractional ok) |
| `"${n}f"` | `"-30f"` | frames |
| `"MM:SS"` | `"02:30"` | minutes:seconds |
| `"HH:MM:SS"` | `"01:02:30"` | hours:minutes:seconds |

| Prop | Lottie | Meaning |
| ---- | ------ | ------- |
| `inPoint` | `ip` | When the node becomes visible/audible on the parent timeline. |
| `outPoint` | `op` | When it stops. (`inPoint`/`outPoint` are a pair = the visible window.) |
| `startTime` | `st` | Composition time where the source's frame 0 sits. Shifts/**trims** which part of the source plays inside the window. Defaults to `inPoint`. May be negative to skip into the source. |

**Trim example:** show a clip from comp 0s→16s but start 1s into the source:

```tsx
<video src="clip.mp4" inPoint={0} outPoint={16} startTime="-30f" />
```

`startTime="-30f"` places source-frame-0 thirty frames (1s @30fps) *before* the
in point, so the first second of the source is trimmed off.

If `inPoint`/`outPoint` are omitted, a media node fits its natural duration and a
group auto-fits its children.

## Sequences (track-like, back-to-back)

`<sequence>` lays its children out sequentially, non-overlapping, in document
order. Takes `name` only — purely structural.

```tsx
<sequence>
  <video src="/Movies/intro.mp4" inPoint={0}       outPoint={12} />
  <video src="/Movies/main.mp4"  inPoint={12}      outPoint="02:30" />
  <video src="/Movies/outro.mp4" inPoint="02:30"   outPoint="02:45" />
</sequence>
```

## Audio sync (`syncTo`) — align multi-recorder material

`syncTo` places a node in time by listening instead of arithmetic: give it the
`key` of another element carrying audio, and the node's `startTime` is derived
by cross-correlating the two recordings. Use it whenever two recordings capture
the same take — a lav/voice track against camera audio, two cameras, two mics:

```tsx
<scene key="talk" width={1920} height={1080}>
  <video key="camera" src="/Movies/take-3.mp4" inPoint={0} outPoint={45} muted />
  <audio src="/Movies/lav.wav" syncTo="camera" />
</scene>
```

- Both sides must carry an audio track; any pairing works. `syncTo` and
  `startTime` are mutually exclusive; `inPoint`/`outPoint` stay yours to set
  (omitted on a synced node, the window defaults to overlapping the target's —
  a lav track simply covers its take).
- `muted`/`volume` don't affect the measurement — mute the camera track (as
  above) to keep only the clean recording audible.
- Also patchable: `dapi node patch --json '[{"id":12,"syncTo":"camera"}]'`
  re-aligns an existing node.

## Editing existing nodes: `node patch`

For prop tweaks on nodes that already exist, skip the mount and patch directly —
same property table, same value rules:

```bash
dapi node patch --json '[{"id":12,"x":60,"opacity":0.8,"name":"Title"}]'
```

Notes: `fill` recolors the existing solid fill(s) or creates one; `src` accepts a
path/URL/asset id (not `generate.*` — that's JSX-only) and resolves async — patch
`src` on its own to avoid ambiguity; a rejected prop rejects that entity's whole
patch.

## Types & tooling

`@diffusionstudio/jsx` ships the JSX types, `Time`, `AssetRef`, and `generate`.
For IntelliSense in a project folder set `"jsx": "preserve"`,
`"jsxImportSource": "@diffusionstudio/jsx"` in tsconfig. The CLI strips types
without checking — run `tsc --noEmit` yourself for type safety.
