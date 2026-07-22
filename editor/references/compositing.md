# Compositing

How a composition is built and changed. `dapi mount` renders a block of JSX into the running editor over the local socket; `dapi node insert` adds further nodes into an already-mounted scene. The JSX syntax these consume is specified in [jsx/README.md](./jsx/README.md) — treat it as authoritative for elements, props, timing, sizing, and generation.

## Best practices

- Build the mounted JSX in stages rather than all at once, and verify the result after each stage before adding the next. See [verification.md](./verification.md).
- Wrap entities in `<sequence>` tags wherever they support it — A-roll, B-roll, and other clips belong in sequences so the timeline stays structured rather than a flat, messy pile. (`<html>` does not support sequences.)
- Use the built-in tags for the media a composition is made of (audio, video, images, captions).
- For anything 3D, use Three.js drawn into a `<surface>` tag.
- For motion graphics, overlays and UI-heavy graphics, use the `<html>` tag. Prefer it and use it as much as possible rather than hand-building layouts from `<rect>`/`<text>`.
- Add auto captions last, after everything else is assembled, so they transcribe the finished audio at its final placement.

## Where to go next

- Editorial decisions about a video edit — structure, pace, what to keep — are in [editing-guidelines.md](./editing-guidelines.md).
- Motion graphics, overlays, titles, 3D, effects, and on-screen text are in [motion-graphics.md](./motion-graphics.md).
