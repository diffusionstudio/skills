# Project module

The entry file is a standard Solid component module:

```tsx
export default function Project() {
  return (
    <scene key="intro" name="Intro" fill="black" width={1920} height={1080}>
      {/* ... */}
    </scene>
  );
}
```

The component receives no props; which document node each rendered root maps onto is declared in the JSX itself via `key` (see [roots.md](./roots.md)).

## Module environment

- **Provided by the host** (marked external at compile time, resolved in-app so the project shares the editor's reactive runtime): `solid-js`, `solid-js/store`, `@diffusionstudio/jsx`.
- **Everything else is bundled** by the CLI at compile time: npm dependencies, local imports, JSON, etc. A project folder is an ordinary npm package: install any helper library (`date-fns`, `zod`, `d3-scale`, …) and import it; it is resolved from the project's `node_modules` and baked into the shipped bundle. Libraries must be browser-compatible (no Node builtins); violations surface as compile errors, before the app is contacted.
- The module executes **inside the editor process**, unsandboxed. This is local tooling with a local trust model, the same trust as running the CLI itself. Only effects made through the JSX runtime are part of the document (and its undo history); anything else the module does is unsupported.
- Solid's control flow (`<For>`, `<Show>`, `<Index>`, `<Switch>`) and primitives (`createSignal`, `createMemo`, …) are fully available during mount. See [lifecycle.md](./lifecycle.md) for what happens after mount.

## Types and tooling

`@diffusionstudio/jsx` ships the JSX namespace (intrinsic elements and props), `Time`, `AssetRef`, and the `generate` namespace. For editor IntelliSense and typechecking in a project folder:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "@diffusionstudio/jsx"
  }
}
```

The CLI does not typecheck; types are stripped at compile time. Run `tsc --noEmit` in the project folder for type safety.
