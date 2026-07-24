# Scenes (the `scene` property)

A scene is the composition root: it clips its children to `width`×`height`. The **`scene` property promotes a rectangle geometry** (`<rect>`,`<html>`, `<surface>`) to a mount root. The property's value is the scene's identity across mounts. Scenes are valid **only** at the document top level; the first rendered root becomes the active scene (see [roots.md](./roots.md)).

```tsx
// A plain scene: a rectangle promoted to the root.
<rect scene="intro" name="Intro" fill="black" width={1920} height={1080}>
  {/* children */}
</rect>

// An HTML scene: the whole frame is one DOM tree laid out by the browser.
<html scene="landing" name="Landing" width={1920} height={1080}>
  <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
    Hello
  </div>
</html>
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

- **Rectangle geometry only.** `scene` on a `<text>`, paint, or other non-rectangle element is an error.
- **No placement.** A scene root will be auto positioned
