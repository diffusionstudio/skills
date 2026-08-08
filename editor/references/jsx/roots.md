# Roots

A mount renders one or more root elements (a fragment of roots is allowed) and **refreshes the document**: like reloading a webpage, re-running a mount rebuilds its roots in place instead of accumulating copies; a rendered root with no existing node to replace is created. **Only a [scene](./scene.md) is mountable as a root** (a `<rect>` promoted with the `scene` property); every top-level element declares its identity with `scene`.

| Identity | Contract |
| -------- | -------- |
| `<rect scene="intro">` | Rebuilds the existing scene carrying the same identity, or creates it (storing it) if none does. Scenes in the document that the render no longer produces are **deleted**; the mount owns its roots. |

Identities must be unique within a render, and rebuilding keeps the scene's entity id and canvas position. Scenes with no matching render are never touched. The **first** rendered root becomes the active scene. Assigning a `name` alongside is recommended (e.g. `<rect scene="intro" name="Intro">`): `scene` identifies the node across mounts, the name labels it in the editor.

The `scene` property is valid **only** at the document root.

[`dapi node insert`](../node/insert.md) skips this reconciliation entirely: its roots are inserted as children and every run inserts fresh entities.

## Canvas placement

The canvas holds many roots, but a root's position on the canvas is an **editor concern, not part of the composition**: a scene root has no `x`/`y`, and a project describes content, not canvas arrangement.

- **Rebuilt roots** (matched by `scene`) keep their existing canvas position.
- **New roots** are placed automatically: in the nearest empty space around the current viewport center, gapped so they never overlap existing content (the same auto-placement the editor uses when generating onto the canvas). A mount that creates multiple roots places them side by side in render order.

The camera is not moved; because placement anchors to the viewport center, new roots typically land in view. Use [`dapi selection focus`](../selection/focus.md) to frame them explicitly.
