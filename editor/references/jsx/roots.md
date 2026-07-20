# Roots

A mount renders one or more root elements (a fragment of roots is allowed) and **refreshes the document**: like reloading a webpage, re-running a mount rebuilds its roots in place instead of accumulating copies; a rendered root with no existing node to replace is created. Roots are typically [`<scene>`](./scene.md) elements, but any element can be a root (e.g. a bare `<rect>`). Every top-level element must declare its identity with a `key`:

| Identity | Contract |
| -------- | -------- |
| `<scene key="intro">` | Rebuilds the existing node carrying the same key, or creates it (storing the key) if none does. Keyed nodes in the document that the render no longer produces are **deleted**; the mount owns its keyed roots. |

Keys must be unique within a render, and rebuilding keeps the node's entity id and canvas position. Nodes without a key (e.g. hand-made scratch scenes) are never touched. The **first** rendered root becomes the active scene. Assigning a `name` alongside the key (e.g. `<scene key="intro" name="Intro">`) is recommended: the key identifies the node across mounts, the name labels it in the editor.

`<scene>` is valid **only** at the document root; scenes do not nest.

[`dapi node insert`](../node/insert.md) skips this reconciliation entirely: its roots take no `key` and every run inserts fresh entities.

## Canvas placement

The canvas holds many roots, but a root's position on the canvas is an **editor concern, not part of the composition**: `<scene>` has no `x`/`y`, and a project describes content, not canvas arrangement.

- **Rebuilt roots** (matched by `key`) keep their existing canvas position.
- **New roots** are placed automatically: in the nearest empty space around the current viewport center, gapped so they never overlap existing content (the same auto-placement the editor uses when generating onto the canvas). A mount that creates multiple roots places them side by side in render order.

The camera is not moved; because placement anchors to the viewport center, new roots typically land in view. Use [`dapi selection focus`](../selection/focus.md) to frame them explicitly.
