# JSX Code Syntax

The JSX API defines the code contract for injecting content into the editor via the CLI. Compositions are authored as **Solid components** that a custom renderer (built on `solid-js/universal`, Solid's equivalent of React's reconciler) mounts **directly into the editor's ECS**. Every JSX element becomes an entity; every prop is a component write. There is no hidden DOM, no CSS resolution, and no measuring pass.

A project is structured like a SolidJS app: a **root** is established on the canvas (typically a scene, identified by its `scene` property and created if absent) and the project's component tree renders into it. **All positioning is explicit** (`x`, `y`, `width`, `height` in pixels).

The markup is **pseudo-SVG**: elements like `<rect>`, `<text>`, `<linearGradientPaint>`, and `<colorStop>` mirror SVG's shape-and-paint model, but the tags and props are the editor's own (see [elements.md](./elements.md)), not the SVG spec.

The pipeline is driven by two commands: [`dapi mount`](../mount.md) renders the project's roots into the document, and [`dapi node insert`](../node/insert.md) runs the same pipeline into an existing parent entity. [`dapi node patch`](../node/patch.md) assigns the same props on existing nodes.

## Contents

| File | Covers |
| ---- | ------ |
| [module.md](./module.md) | Project module contract, module environment, types and tooling |
| [roots.md](./roots.md) | Root elements, `key` identity, canvas placement |
| [elements.md](./elements.md) | Element-to-node mapping, coordinates and sizing, the shared property table |
| [scene.md](./scene.md), [group.md](./group.md), [rect.md](./rect.md), [text.md](./text.md), [video.md](./video.md), [image.md](./image.md), [audio.md](./audio.md) | Per-element props |
| [fonts.md](./fonts.md) | Fonts for `<text>` and HTML: local families, `dapi fonts` |
| [paints.md](./paints.md) | `<solidPaint>`, gradients, `<colorStop>` |
| [html.md](./html.md) | `<html>`: reactive HTML children drawn into the box |
| [surface-paint.md](./surface-paint.md) | `<surface>`: a ref-provided canvas you draw into, sampled every frame |
| [shader-paint.md](./shader-paint.md) | `<shaderPaint>`: a WGSL fragment shader over the media paint below it |
| [media.md](./media.md) | `src` resolution (paths, URLs, asset ids, `AssetRef`) |
| [timing.md](./timing.md) | `start` / `end` / `sourceIn` / `sourceOut`, time formats |
| [keyframes.md](./keyframes.md) | Keyframe animation and easing |
| [animations.md](./animations.md) | The `animations` prop: preset in/out animations |
| [transitions.md](./transitions.md) | The `transition` prop on sequence clips |
| [sequences.md](./sequences.md) | `<sequence>` sequential placement |
| [audio-sync.md](./audio-sync.md) | `syncTo` audio alignment |
| [captions.md](./captions.md) | `<captions>` and style presets |
| [generate.md](./generate.md) | Declarative AI asset generation (`generate.*`) |
| [lifecycle.md](./lifecycle.md) | Mount lifecycle: always live, persisted + re-executed, `useTicker` |
| [errors.md](./errors.md) | Where each pipeline stage fails and with what effect |

## Pipeline

1. **Compile**: the CLI bundles the entry file with esbuild + `babel-preset-solid` in `universal` mode, so JSX compiles against the editor's renderer runtime (`@diffusionstudio/jsx`) instead of the DOM. Compile errors fail here, before the app is contacted.
2. **Ship**: the resulting single-file ESM bundle is sent to the running app over the local socket.
3. **Evaluate**: the app imports the module. Top-level code (including top-level `await`) runs to completion. The module's **default export** is the project component.
4. **Mount**: the component tree is rendered into a **staging root**. The universal renderer materializes each element as an ECS entity with the appropriate components (see [elements.md](./elements.md)). Mounting is synchronous; an error here aborts the import with nothing inserted.
5. **Commit**: the rendered roots are reconciled against the document (see [roots.md](./roots.md)) as a **single undoable operation** that also covers the generated assets below.
6. **Generate**: declared assets generate in dependency order, **blocking the command** until every one has landed. Each placeholder renders a generating state until its asset lands, then the node's paint is attached (see [generate.md](./generate.md)).
7. **Sync**: nodes declaring `syncTo` are aligned once every generated asset has landed: each node's audio is cross-correlated against its target's and its `start` is written from the measured offset (see [audio-sync.md](./audio-sync.md)). Local and blocking; captions wait for it.
