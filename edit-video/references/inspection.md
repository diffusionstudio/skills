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
dapi node screenshot [id] [-f, --frame N]
```

Focuses the node and captures the **composited canvas** as a PNG → `{ path }`.
Omit `id` to capture the active scene. `-f/--frame` picks the timeline frame
(default = current playhead). This is the truest "what the viewer sees at frame N"
check — use it to confirm layout, overlaps, text, and timing landed.

```bash
dapi node screenshot 5 -f 90        # active edit at frame 90
```

After capturing, **Read the returned PNG path** to actually view it.

## See an asset's own pixels (full-res)

```bash
dapi asset frame <videoId> -t 0 2.5 10 [-o dir]
```

Decodes a **video asset** at one or more source-time timestamps (seconds) and
writes a PNG per timestamp → JSON Lines `{ time, path }`. Unlike `node screenshot`
(composited), this is the asset's raw pixels at full resolution. Great for picking
trim points or a `--start-frame` for generation.

## Overview a whole asset at a glance

```bash
dapi asset visualize <id> [-s startSec] [-e endSec] [-x scale] [-o out.png]   # alias: viz
```

Renders by media type → `{ path }`:
- **video** → filmstrip of evenly-sampled frames + audio waveform under a shared `mm:ss` axis.
- **audio** → amplitude waveform with a time axis.
- **image** → auto-scaled thumbnail.

Use this to understand pacing/where the audio peaks are before cutting. `-s`/`-e`
window the time range (seconds, ignored for images). `-x` scales the thumbnails
(default `1`, clamped `0.25`–`4`): the canvas stays the same size, so a smaller
scale packs in more rows and columns (denser time sampling), a larger one shows
fewer, more detailed cells. For images it scales the output resolution.

## Read what's said / what's shown

```bash
dapi asset transcript <id>          # video/audio → segments[] with word-level start/end (seconds)
dapi asset analyze <id> [-p "..."] [-s startSec] [-e endSec]   # image/video/audio → multimodal answer, saved as an Analysis .md asset
```

- `transcript` gives timed words (source/content time) — ideal for caption timing
  or finding a quote to cut to. Fails with `No speech detected` if silent.
- `analyze` (no prompt → general description; with `-p` → answers your question,
  e.g. "what's the dominant color?", "summarize what happens"). Note: `analyze`
  uses a multimodal model and may consume credits; the render commands above do not.
  Reach for it mostly when `probe`/`visualize`/`frame`/`transcript` don't settle the question — e.g. to better understand audio
- `-s`/`-e` window the segment to analyze (seconds, ignored for images). Only that
  segment is uploaded — faster and cheaper on long footage, so prefer a window when
  you already know the region of interest (e.g. from `visualize`). Timestamps in
  the answer are relative to `-s`, not the full asset.

## Align a separate audio recording to a video

```bash
dapi asset sync <audioId> -v <videoId>    # → { audioId, videoId, offsetSeconds, confidence }
```

Cross-correlates a standalone recording (e.g. a lav/voice take) against the camera
audio of `<videoId>`. Read-only: it returns the offset; you position the clip yourself.
Sign convention: `audioStart = videoStart + offsetSeconds` — feed `offsetSeconds`
straight into a `node` start update.

- **Check `confidence` before trusting it** (0..1; clear match ≳ 0.9). Low values mean
  the takes don't share enough common sound — don't apply blindly.
- Local and free. Both assets must contain overlapping audio from the same take, or it
  fails with `No reliable alignment found`.

## Verification habit

1. Make the edit (`node add` / `node style` / `node caption`).
2. `dapi node screenshot` at the relevant frame(s) → **Read the PNG**.
3. Confirm it matches intent; if not, adjust and re-shoot. Only then report done.
