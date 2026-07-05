# Command surface & orientation

All commands are `dapi <group> <command>`. Groups: `selection` (`sel`), `node`
(`n`), `project` (`p`), `asset` (`a`), `folder` (`fld`), `font` (`f`).
Top-level: `open`, `whoami`, `context` (`ctx`), `models`, `voices`.

Mental model: **selection** reads/changes what's selected; **node** targets one or
more nodes by id (scenes are nodes — a scene is just a root `<div data-w data-h>`
fed to `node add`); **asset** operates on the media library; **folder** organizes
that library (assets move between folders with `asset mv`). There is no
`generate` group — **AI generation is declarative**: declare `<asset>` elements in
HTML and `node add` produces them on import (see `generation.md`). `models` /
`voices` list what those declarations can reference.

## Orient first

```bash
dapi ctx          # project, scenes[], activeSceneId, currentFrame, fontFamilies[]
dapi whoami       # signed-in account (needed for generation), or null
```

`dapi ctx` is the single most important call — run it before deciding anything.

## Open / projects

```bash
dapi open                       # launch the app
dapi open -b                    # launch headless (window hidden, show:false)
dapi open ./my-footage          # folder → create-or-switch a project (writes a .dapi marker)
dapi open ./clip.mp4            # open a file
dapi project active             # current project ({id,name}), or null
dapi project ls                 # all projects, most-recent first
dapi project create "Promo"    # create + open
dapi project switch <id>        # open existing
dapi project rm <id>            # delete a project
```

Folder open is the fastest way to start: it creates a project named after the
folder, imports every supported asset under it, and remembers the association in
a `.dapi` marker (re-running just switches back, no re-import).

## Inspect the node tree

```bash
dapi node ls                    # root (top-level nodes)
dapi node ls <id...>            # specific nodes (size, visible, parentId, childrenIds, text?)
dapi node tree <id> [--depth N] # nested subtree; root is level 0
```

## Selection

```bash
dapi sel ls                     # currently selected nodes (with size, sceneId)
dapi sel set <ids...>           # replace selection
dapi sel add <ids...> | rm <ids...> | clear
dapi sel focus                  # pan/zoom canvas to fit the selection
```

Mutating selection commands return the new selection state, so you can chain.

## Node edits (non-HTML)

```bash
dapi node style --patch '[{"id":12,"opacity":0.5,"left":"120px"}]'
dapi node rename --patch '[{"id":12,"name":"Title"}]'
dapi node cp <ids...>           # deep-clone (duplicate) incl. descendants
dapi node rm <ids...>           # delete node + descendants
dapi node caption [sceneId]     # transcribe a scene's audio → caption node (active scene by default)
```

`node style` accepts only: `opacity`, `left`, `top`, `width`, `height`, `rotate`,
`border-radius`, `background-color` (kebab-case CSS, unitless number or string
with unit). A rejected prop applies none of that node's patch (no half edits).
For anything structural — adding content, timing, media — use `node add` with
HTML (see `authoring-html.md`).

## Export (render to video)

```bash
dapi node export [id] [-o out.mp4] [--config '{…}' | --file preset.json]
```

Renders a scene to a video file (defaults to the active scene) → `{ path }`.
Local and free, but long-running. See `exporting.md` for the encode config
(format, codec, resolution, bitrate, fps, audio, trim).

## Assets (library)

```bash
dapi asset add <paths...> [--folder <id>]   # import local files (optionally into a folder)
dapi asset ls [--folder <id>] [--depth N]   # the library as a folder tree — folders + assets, each entry with `children`
dapi asset rm <ids...>
dapi asset mv <ids...> [--to <folderId>]    # move assets into a folder (omit --to = library root)
dapi asset export <ids...> [-o <path>]      # write assets' original file bytes to disk (no re-encode; local, free) — -o is a directory, or an exact file path for a single id; default: temp dir
dapi asset probe <id|path>      # container + per-track technical metadata (like ffprobe; local, free)
dapi asset transcript <id|path> # timed speech transcript of a video/audio asset
dapi asset frame <id|path> -t 0 2.5  # decode video frames → PNG(s)
dapi asset visualize <id|path> [-x scale]  # waveform / filmstrip / thumbnail → PNG (alias: viz); smaller scale = more rows/columns
dapi asset analyze <id|path> -p "…" [-s startSec] [-e endSec]  # AI description of an asset (or a window of it) — when probe/viz/frame/transcript aren't enough
dapi asset sync <audioId|path> -v <videoId|path>   # time offset aligning audio to a video (alias: align)
```

The inspect commands (`probe`, `transcript`, `frame`, `visualize`, `analyze`,
`sync`) accept an asset id **or a local file path** — a path is imported into the
library first, then the command runs on the new asset.

See `inspection.md` for these read/inspect commands in detail.

## Folders (organize the library)

```bash
dapi folder ls [parentId]            # child folders (library root if omitted)
dapi folder create <name> [-p <id>]  # create (under root, or -p parent)
dapi folder rename <id> <name>
dapi folder mv <ids...> [--to <id>]  # reparent folders (a folder can't move into its own subtree)
dapi folder rm <ids...>              # ⚠ cascades: deletes all descendant folders AND their assets
```

Folder ids are opaque strings like asset ids; the library root has no id — omit
the flag/arg to mean root. `asset ls` reads the whole hierarchy (folders + assets);
`asset mv` moves assets between folders.

## AI generation & discovery

Generation is declarative (declare `<asset>` in HTML, `node add` produces it — see
`generation.md`). Discover what declarations can reference:

```bash
dapi models [image|video|audio] # model ids + per-model constraints
dapi voices                     # voice ids + labels
```

## Fonts

```bash
dapi font ls -f "Inter" -w 400 700 -s normal   # filter by family/weight/style
dapi font ls -n                                # plain family names only
```

Use `font ls` to confirm a family exists before styling text with it; `dapi ctx`
also lists the families already used in the project.

## Conventions

- Unix names are canonical: `ls` (read), `rm` (delete), `cp` (duplicate); `list`,
  `remove`, `duplicate`, `get` are aliases.
- Single record → one JSON value; collection → JSON Lines (one object per line).
- Exit `0` on success, `1` on any error (with a message on stderr).

Full per-command flags and output shapes: [`apps/cli/CLI_API.md`](../../../apps/cli/CLI_API.md).
