# Project module

The entry file is a standard Solid component module:

```tsx
export default function Project() {
  return (
    <rect scene="intro" name="Intro" fill="black" width={1920} height={1080}>
      {/* ... */}
    </rect>
  );
}
```


The component receives no props; which document node each rendered root maps onto is declared in the JSX itself via `key` (see [roots.md](./roots.md)).

## Module environment

Imports resolve by category:

- **Host modules** (marked external at compile time, resolved in-app so the project shares the editor's reactive runtime): `solid-js`, `solid-js/store`, `@diffusionstudio/jsx`. These must be the editor's own instance and never come from anywhere else.
- **Userland packages** — any other bare specifier (`three`, `gsap`, `d3-scale`, …). These are **not installed and not bundled**: the CLI rewrites them to a CDN URL (default `https://esm.sh/<specifier>`, so `three/examples/jsm/loaders/GLTFLoader.js` becomes `https://esm.sh/three/examples/jsm/loaders/GLTFLoader.js`) and the renderer imports them natively at runtime. Any npm package works without a `node_modules`, so this works in a packaged app too. The package's own transitive deps are resolved by the CDN. Libraries must be browser-compatible (no Node builtins).
- **Local and URL imports**: relative/absolute paths (`./helper`, local JSON) are resolved on disk and bundled as before; explicit `https://…` imports pass through to the renderer untouched.
- The module executes **inside the editor process**, unsandboxed. This is local tooling with a local trust model, the same trust as running the CLI itself. Only effects made through the JSX runtime are part of the document (and its undo history); anything else the module does is unsupported.
- Solid's control flow (`<For>`, `<Show>`, `<Index>`, `<Switch>`) and primitives (`createSignal`, `createMemo`, …) are fully available during mount. See [lifecycle.md](./lifecycle.md) for what happens after mount.

### Import map (`dapi.config.json`)

A `dapi.config.json` in the working directory pins versions or redirects userland specifiers — for reproducible mounts, a self-hosted mirror, or a local vendored copy. Exact keys match a specifier; a trailing-slash key maps its subpaths (longest prefix wins):

```json
{
  "cdnBase": "https://esm.sh",
  "imports": {
    "three": "https://esm.sh/three@0.185.1",
    "three/": "https://esm.sh/three@0.185.1/"
  }
}
```

`cdnBase` overrides the default CDN for anything not in `imports`. The `DAPI_CDN_BASE` and `DAPI_IMPORT_MAP` (a JSON object) env vars override for one-offs. An unpinned specifier resolves to the CDN's latest.

## Types and tooling

`@diffusionstudio/jsx` ships the JSX namespace (which types the camelCase composition tags), for editor IntelliSense and typechecking in a project folder:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "@diffusionstudio/jsx"
  }
}
```

The CLI does not typecheck; types are stripped at compile time. Run `tsc --noEmit` in the project folder for type safety.

Userland packages resolve from a CDN at runtime, so they need no runtime install, but the editor still wants their type declarations. For IntelliSense on a library, install it (or its `@types/…`) as a **dev-only** dependency (`npm i -D three`); it is used purely for typechecking and never bundled or shipped.
