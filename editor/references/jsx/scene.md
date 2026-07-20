# `<Scene>`

The composition root: clips its children to `width`×`height`. Valid **only** at the document top level; scenes do not nest. The first rendered root becomes the active scene (see [roots.md](./roots.md)).

```tsx
<Scene key="intro" name="Intro" fill="black" width={1920} height={1080}>
  {/* children */}
</Scene>
```

## Props

| Prop | Type | Default | Meaning |
| ---- | ---- | ------- | ------- |
| `key` | `string` | **required** | Identity across mounts; re-mounting replaces the scene carrying the same key (see [roots.md](./roots.md)). |
| `width`, `height` | `number` | **required** | Composition size in pixels. |
| `name` | `string` | none | Scene name (recommended). |
| `fill` | `string` | none | Background fill, any CSS color (alpha is ignored). |

No timing or transform props. Canvas position is an editor concern; `<Scene>` has no `x`/`y`.
