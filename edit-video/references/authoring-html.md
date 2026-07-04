# Authoring scenes — the HTML API

Content is added to the canvas by feeding **HTML** to `node add`. The HTML is
rendered offscreen, its computed layout is measured, and each element becomes an
editable node. **Styling = standard CSS; timing & identity = `data-*` attributes.**

```bash
dapi node add --html '<div data-w="1920" data-h="1080">...</div>'   # default mode: replace
dapi node add --file scene.html                                      # from a file
dapi node add <targetId> --mode insert-child --file overlay.html     # append into a node
```

- `--mode replace` (default) rebuilds `target` in place from the HTML.
- `--mode insert-child` appends the parsed HTML as a child of `target` (root if
  `target` omitted). A new top-level scene becomes the active scene.
- Returns `{ insertedIds: number[] }` (root first) — keep these to style/trim later.

## Document structure

Exactly one **root** element = the **scene**. It must declare its pixel size:

```html
<div data-nm="Intro" data-w="1920" data-h="1080"
     style="display:flex; align-items:center; justify-content:center;">
  ...
</div>
```

| Attr | Required | Meaning |
| ---- | -------- | ------- |
| `data-w` / `data-h` | yes | Composition width / height in px (the scene `Size`). |
| `data-nm` | no | Human-readable name (works on any node). |

## Element → node mapping

| HTML | Node |
| ---- | ---- |
| root `<div>` | Scene (clips children to `data-w`×`data-h`) |
| `<div>` | Group container (transform; children nested) |
| `<video src>` | Video |
| `<img src>` | Image |
| `<audio src>` | Audio (no visual; carries volume) |
| `<span>` / text | Text (editable glyphs; typography from computed style) |
| `<sequence>` | Sequential group (see below) |
| `<captions>` | Caption node (transcribes the enclosing scene's audio) |
| `<defs>` / `<asset>` | Declarations — render nothing; a declared asset appears only when referenced by `src` (see below) |

### Positioning (CSS)

Tailwind / utility classes are **not** available — author plain CSS. Position
visuals with `position:absolute; inset:0` inside the relative root; use flexbox
for text placement. Layout is read back from the real rendered box, so what the
browser computes is what you get.

### Media `src` resolution

`<video>`, `<img>`, `<audio>` need a `src`, resolved to an asset:
- **Asset id** — `src="gbHJ"` (from `dapi asset ls`).
- **Declared asset** — `src="hero"` references the `id` of an `<asset>` declared
  in `<defs>` (AI-generated on import — see below).
- **Global path** — `src="/Movies/clip.mp4"`.
- **Remote URL** — `src="https://.../clip.wav"` (registered as a remote asset).

### Declared (AI-generated) assets & captions

Assets that don't exist yet are **declared** in a `<defs>` block and generated on
import — generation is declarative, not a command. A `<captions>` element inside a
scene transcribes that scene's audio into a caption node. Both are async and
non-blocking (placeholders appear immediately). Full details in
[`generation.md`](generation.md).

```html
<defs>
  <asset id="hero" type="image" model="flux-2-turbo" prompt="neon skyline" aspect-ratio="16:9" />
</defs>
<div data-nm="Scene" data-w="1920" data-h="1080">
  <img src="hero" style="position:absolute; inset:0;" />
  <captions></captions>
</div>
```

## Timing & trims (the part agents get wrong)

Timing is **composition-relative** (against the parent timeline). Canonical unit
is frames @ **30 fps**; values accept these formats:

| Format | Example | Meaning |
| ------ | ------- | ------- |
| `${n}` | `2.2` | seconds (fractional ok) |
| `${n}f` | `-30f` | frames |
| `${n}:${n}` | `02:30` | `MM:SS` |
| `${n}:${n}:${n}` | `01:02:30` | `HH:MM:SS` |

| Attr | Meaning |
| ---- | ------- |
| `data-ip` | **In point** — when the node becomes visible/audible on the parent timeline. |
| `data-op` | **Out point** — when it stops. (`ip`/`op` are a pair = the visible window.) |
| `data-st` | **Start time** — composition time where the source's frame 0 sits. Shifts/**trims** which part of the source plays inside the window. Defaults to `ip`. May be negative to skip into the source. |
| `data-vol` | Audio volume `0`–`1` (audio/video only). |

**Trim example:** show a clip from comp 0s→16s but start 1s into the source:

```html
<video src="clip.mp4" data-ip="0" data-op="16" data-st="-30f"></video>
```

`data-st="-30f"` places source-frame-0 thirty frames (1s @30fps) *before* the in
point, so the first second of the source is trimmed off.

If `ip`/`op` are omitted, a media node fits its natural duration and a group
auto-fits its children.

## Sequences (track-like, back-to-back)

`<sequence>` lays its children out sequentially, non-overlapping, in document
order. It has no styling and no timing of its own — purely structural.

```html
<sequence>
  <video src="/Movies/intro.mp4" data-ip="0"     data-op="12"></video>
  <video src="/Movies/main.mp4"  data-ip="12"    data-op="02:30"></video>
  <video src="/Movies/outro.mp4" data-ip="02:30" data-op="02:45"></video>
</sequence>
```

Full contract (conversion pipeline, every attribute, edge cases):
[`apps/cli/HTML_API.md`](../../../apps/cli/HTML_API.md).
