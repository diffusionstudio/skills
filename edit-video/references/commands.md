# Command surface & orientation

All commands are `dapi <group> <command>` or top-level. Groups: `selection`
(`sel`), `node` (`n`, `entity`), `project` (`p`), `asset` (`a`), `folder` (`fld`).
Top-level: `open`, `whoami`, `context` (`ctx`), `mount`, `models`, `voices`, `fonts`.

Mental model: **selection** reads/changes what's selected; **node** targets one or
more nodes by id (scenes are nodes — created declaratively via `mount` with
`<scene key="...">`); **asset** operates on the media library; **folder** organizes
that library (assets move between folders with `asset mv`). Declarative composition
happens through **`mount`**, which renders a Solid JSX project into the canvas;
`node insert` runs the same pipeline but inserts into an existing parent. There is
no `generate` group — **AI generation is declarative**: declare `generate.*` assets
in the project module and `mount` produces them (see `generation.md`). `models` /
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
dapi project set <id>           # open existing (null if unknown id)
dapi project rm <id>            # delete a project
```

Folder open is the fastest way to start: it creates a project named after the
folder, imports every supported asset under it, and remembers the association in
a `.dapi` marker (re-running just switches back, no re-import).

## Mount a project module (the authoring path)

```bash
dapi mount scene.tsx            # compile Solid JSX module, mount roots into the document
dapi mount --code '<scene key="intro" width={1920} height={1080}>…</scene>'
```

Re-mounting rebuilds keyed roots in place (no duplicates). Output: none — inspect
with `ctx` / `node tree`. Blocks until any declared generation finishes. See
`authoring-jsx.md`.

## Inspect & find nodes

```bash
dapi node ls [ids...]           # raw entity records — every component, as persisted
dapi node tree [id] [--depth N] # nested subtree + ids; depth default 3, 0 = full
dapi node grep <regex> [id]     # search entity records; the discovery front-end to ls/patch
dapi node grep -k Name Title    # the common case: find nodes by name
dapi node grep -k Trim . -l     # presence query: every entity with a Trim component (refs only)
```

`node ls` records are **raw engine data**: times in frames @30fps, colors packed
`0xRRGGBB`, volume in dB — `grep` searches these same stringified values. `grep`
flags: `-i` case-insensitive, `-t <types...>` node types, `-k <components...>`,
`-l` refs only, `-c` count only. Use `tree` to discover structure/ids, `ls` for
exact values, `grep` to find by content.

## Selection

```bash
dapi sel ls                     # currently selected nodes
dapi sel set <ids...>           # replace selection (no ids = clear)
dapi sel focus                  # pan/zoom canvas to fit the selection
```

Mutating selection commands return the new selection state, so you can chain.

## Node edits

```bash
dapi node patch --json '[{"id":12,"opacity":0.5,"x":120,"name":"Title"}]'
dapi node patch patch.json      # same payload from a file
dapi node insert <parentId> overlay.tsx [--index N]   # JSX into an existing parent
dapi node cp <ids...>           # deep-clone (duplicate) incl. descendants
dapi node rm <ids...>           # delete node + descendants
```

`node patch` assigns **JSX props** (`PatchProps` — the same property table as
mount elements: `x`, `y`, `width`, `height`, `rotation`, `opacity`, `cornerRadius`,
`fill`, `src`, timing, text props, …). Renaming = patching `name`. Paints and
color stops are patchable too (`color`, `offset`, gradient `rotation`). A rejected
prop rejects that entity's whole patch (no half edits). For anything structural —
adding content, sequences, generation — use `mount` / `node insert` with JSX
(see `authoring-jsx.md`).

## Export (render to video)

```bash
dapi node export [id] [-o out.mp4] [config.json | --json '{…}']
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
dapi asset analyze <id|path> -p "…" [-s start] [-e end]  # AI description of an asset (or a window of it) — when probe/viz/frame/transcript aren't enough
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

Generation is declarative (`generate.*` declarations in the project module,
produced on `mount` — see `generation.md`). Discover what declarations can
reference:

```bash
dapi models [image|video|audio] # model ids + per-model constraints (durations, aspectRatios, features)
dapi voices                     # voice ids + labels
```

## Fonts

```bash
dapi fonts -f "Inter" -w 400 700 -s normal   # filter by family/weight/style
dapi fonts -n [-l 50]                        # plain family names only (limit 50)
```

Use `fonts` to confirm a family exists before styling text with it; `dapi ctx`
also lists the families already used in the project. macOS only; works without
the app running.

## Conventions

- Unix names are canonical: `ls` (read), `rm` (delete), `cp` (duplicate), `mv`
  (move), `grep` (search); `list`, `remove`, `duplicate`, `move`, `get` are aliases.
- Single record → one JSON value; collection → JSON Lines (one object per line).
  `mount` and `node insert` write nothing.
- Times in **inputs** accept seconds (`2.2`), frames (`"45f"` @30fps), or clock
  strings (`"MM:SS"`). Times in **outputs** are plain seconds — except `node ls`,
  which is raw engine units.
- Exit `0` on success, `1` on any error (with a message on stderr).
