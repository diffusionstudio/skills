# Scenes (the `scene` property)

A scene is the composition root: it clips its children to `width`×`height`. The **`scene` property promotes a `<rect>`** to a mount root. The property's value is the scene's identity across mounts. Scenes are valid **only** at the document top level; the first rendered root becomes the active scene (see [roots.md](./roots.md)).

```tsx
// A scene: a rectangle promoted to the root.
<rect scene="intro" name="Intro" fill="black" width={1920} height={1080}>
  {/* children */}
</rect>
```

## The `scene` property

| Prop | Type | Meaning |
| ---- | ---- | ------- |
| `scene` | `string` | **Promotes** the element to a scene root and is its identity across mounts: re-mounting replaces the scene carrying the same value, or creates it (see [roots.md](./roots.md)). |

Alongside it a scene uses the ordinary geometry props:

| Prop | Type | Default | Meaning |
| ---- | ---- | ------- | ------- |
| `width`, `height` | `number` | **required** | Composition size in pixels. |
| `name` | `string` | none | Scene name (recommended). |
| `fill` | `string` | none | Background fill, any CSS color (alpha is ignored) |

## Constraints

- **`<rect>` only.** `scene` on any other element is an error.
- **No placement.** A scene root will be auto positioned
