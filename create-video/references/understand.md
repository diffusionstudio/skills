# Understand footage

You can't watch the timeline play, so **look** before and after every change.
Inspection commands return either structured JSON or a path to a rendered PNG;
after capturing, **Read the PNG path** to actually view it.

## Choosing an inspection mode (assets)

| Mode | Speed | Cost | Use for |
| --- | --- | --- | --- |
| `asset probe` | Fast | Free | Technical metadata first: container, duration, per-track codec params |
| `asset transcribe` | Medium | Cheap | Footage that contains speakers, e.g. a talking head; word-level times for cutting on a line |
| `asset analyze` | Slow | Expensive | Semantic multimodal analysis; escalate to it when the modes above leave you uncertain. Window the segment to upload less |
| `asset visualize` | Fast | Free | Your main tool for a quick visual overview (filmstrip + waveform); narrow the window for finer analysis |
| `asset frame` | Fast | Free | Peek at individual frames; pin down scene transitions and exact cut timestamps |

All five accept an asset id or a local file path (a path is imported first,
then inspected).

## Canvas vs asset pixels

- `node screenshot` captures the **composited canvas** at a timeline position:
  the truest "what the viewer sees at time T" check. Use it to confirm layout,
  overlaps, text, and timing landed.
- `asset frame` decodes the **asset's own pixels** at full resolution at source
  timestamps. Use it to pick trim points or a start-frame image for generation.
