# Rendering to video

```bash
dapi node render [id] [-o, --output <path>] [<config.json> | --json <str>]
```

Renders a **scene** to a video file on disk. Scenes are nodes, so this lives under
`node`. Omit `[id]` to render the active scene. **Local and free** (no credits, no
sign-in required), but **long-running** — it blocks while compositing every frame,
with an elapsed-time spinner on stderr and clean JSON on stdout. Returns the
written path:

```ts
{ path: string }   // e.g. "/tmp/3f2c1a8e-….mp4", or your --output path
```

The app streams the encode straight to the output path (it doesn't buffer the
whole file in memory), so large/long renders are fine.

## Scope & timing

- **One scene per call** — there's no whole-project/timeline render. Render each
  scene separately.
- The encode window follows the scene's timeline **workarea** (its trim): it
  starts at the workarea start and runs to the scene's end, unless capped earlier
  with the config's `trim.end` (see below).

## Output

- `-o, --output <path>` — where to write it (relative paths resolve against your
  CWD). Default: a temp file named by the container format. The extension comes
  from the config's `format`.

## Encode config

Pass encode settings as one JSON object — the same shape the in-app encoder uses
(`EncoderConfig`), minus the runtime fields the CLI fills in. Give it as a
positional `.json` file path or inline with `--json` (at most one). Node ids are
integers, so a lone non-numeric positional is read as the config path
(`dapi node render encode.json` works without an id). The whole thing is
**optional** — omit it for an mp4 / 1080p / H.264 render.

```ts
{
  format?: "mp4" | "webm" | "ogg" | "mov";        // default "mp4"; sets the extension
  video?: {
    codec?:      "avc" | "hevc" | "vp9" | "av1" | "vp8";  // default "avc" (H.264)
    enabled?:    boolean;   // default true
    bitrate?:    number;    // bits/sec, default 10_000_000 (10 Mbps)
    fps?:        number;    // default the scene's frame rate
    resolution?: number;    // target height in px (720, 1080, 1440, 2160); default 1080
  };
  audio?: {
    enabled?:          boolean;        // default true; false → video-only
    codec?:            "aac" | "opus"; // default "aac"
    bitrate?:          number;         // bits/sec, default 128_000
    sampleRate?:       number;         // Hz, 44100 / 48000 / 96000; default 48000
    numberOfChannels?: number;         // default 2
  };
  trim?: { end?: number };   // seconds; cap the encode earlier. Can't extend past the scene
}
```

Codec choices must be compatible with `format` (e.g. `vp9`/`opus` for `webm`).
Width follows the scene's aspect ratio from the chosen `resolution`.

## Examples

```bash
# Active scene → temp mp4, all defaults
dapi node render

# A specific scene → a path you choose
dapi node render 4 -o ~/Desktop/cut.mp4

# 4K, higher bitrate
dapi node render 4 -o out.mp4 --json '{"video":{"resolution":2160,"bitrate":40000000}}'

# WebM (VP9 + Opus) for the web
dapi node render -o promo.webm --json '{"format":"webm","video":{"codec":"vp9"},"audio":{"codec":"opus"}}'

# Audio-only (ogg), or first 10s only
dapi node render -o voiceover.ogg --json '{"format":"ogg"}'
dapi node render -o teaser.mp4   --json '{"trim":{"end":10}}'

# Reuse a saved preset file
dapi node render 4 -o final.mp4 ./presets/youtube-4k.json
```

## Errors

Exits non-zero if the id is unknown or **not a scene**, if no scene is active and
`[id]` is omitted, if the config is malformed or holds a value out of range /
incompatible with `format`, if `--output` can't be written, or if the render
fails or is canceled.

## Verify it

Rendering is the end of the pipeline, but still confirm the cut before declaring
done: re-check the relevant frames with `dapi node screenshot` (see
`inspection.md`), and only then hand over the path.
