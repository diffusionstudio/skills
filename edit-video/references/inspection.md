# Inspecting & verifying

You can't watch the timeline play — so **look** before and after every change.
These commands render PNGs (to the system temp dir unless `-o` is given) or return
structured data, which you then open/read. The render commands (`screenshot`,
`frame`, `visualize`) are **local and free** (no credits).

## Choosing an inspection mode

| Mode | Speed | Cost | Use for |
| --- | --- | --- | --- |
| `probe` | Fast | Free | Technical metadata first: container, duration, per-track codec params |
| `transcript` | Medium (audio upload) | Cheap | Footage that contains speakers, e.g. a talking head |
| `analyze` | Slow (source upload) | Expensive | Semantic multimodal analysis of an asset; escalate to it when the modes above leave you uncertain. Window with `-s`/`-e` to upload less |
| `visualize` (`viz`) | Fast | Free | Your main tool for a quick visual representation. Narrow the window for more fine-grained analysis |
| `frame` | Fast | Free | Peek at individual frames; useful to narrow down scene transitions and find visual cut timestamps |

## See the composed canvas

```bash
dapi node screenshot [id] [-t, --time <time>]
```

Focuses the node and captures the **composited canvas** as a PNG → `{ path }`.
Omit `id` to capture the active scene. `-t/--time` picks the timeline position —
seconds (`3`), frames (`"90f"`), or `"MM:SS"` (default = current playhead). This
is the truest "what the viewer sees at time T" check — use it to confirm layout,
overlaps, text, and timing landed.

```bash
dapi node screenshot 5 -t 90f       # active edit at frame 90
```

After capturing, **Read the returned PNG path** to actually view it.

## See an asset's own pixels (full-res)

```bash
dapi asset frame <videoId> -t 0 2.5 "01:40" [-o dir]
```

Decodes a **video asset** at one or more source-time timestamps (`Time` values:
seconds, `"45f"`, or `"MM:SS"`) and writes a PNG per timestamp → JSON Lines
`{ time, path }`. Unlike `node screenshot` (composited), this is the asset's raw
pixels at full resolution. Great for picking trim points or a `startFrame` image
for generation.

## Overview a whole asset at a glance

```bash
dapi asset visualize <id> [-s start] [-e end] [-x scale] [-o out.png]   # alias: viz
```

Renders by media type → `{ path }`:
- **video** → filmstrip of evenly-sampled frames + audio waveform under a shared `mm:ss` axis.
- **audio** → amplitude waveform with a time axis.
- **image** → auto-scaled thumbnail.

Use this to understand pacing/where the audio peaks are before cutting. `-s`/`-e`
window the time range (`Time` values in source time; ignored for images). `-x` scales the thumbnails
(default `1`, clamped `0.25`–`4`): the canvas stays the same size, so a smaller
scale packs in more rows and columns (denser time sampling), a larger one shows
fewer, more detailed cells. For images it scales the output resolution.

## Read what's said / what's shown

```bash
dapi asset transcript <id>          # video/audio → segments[] with word-level start/end (seconds)
dapi asset analyze <id> [-p "..."] [-s start] [-e end]   # image/video/audio → multimodal answer
```

- `transcript` gives timed words (source/content time) — ideal for caption timing
  or finding a quote to cut to. Fails with `No speech detected` if silent.
- `analyze` (no prompt → general description; with `-p` → answers your question,
  e.g. "what's the dominant color?", "summarize what happens"). Note: `analyze`
  uses a multimodal model and may consume credits; the render commands above do not.
  Reach for it mostly when `probe`/`visualize`/`frame`/`transcript` don't settle the question — e.g. to better understand audio
- `-s`/`-e` window the segment to analyze (`Time` values, ignored for images). Only that
  segment is uploaded — faster and cheaper on long footage, so prefer a window when
  you already know the region of interest (e.g. from `visualize`). Timestamps in
  the answer are relative to `-s`, not the full asset.


## Verification habit

1. Make the edit (`mount` / `node insert` / `node patch`).
2. `dapi node screenshot` at the relevant time(s) → **Read the PNG**.
3. Confirm it matches intent; if not, adjust and re-shoot. Only then report done.
