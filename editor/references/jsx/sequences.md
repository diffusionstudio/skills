# Sequences

`<sequence>` enforces **sequential, non-overlapping** placement of its children: the editor's track-like behavior. It has no spatial or temporal properties of its own; it lays its children out back-to-back in document order.

```tsx
<sequence>
  <video src="/Movies/intro.mp4" inPoint={0}     outPoint={12} />
  <video src="/Movies/main.mp4"  inPoint={12}    outPoint="02:30" />
  <video src="/Movies/outro.mp4" inPoint="02:30" outPoint="02:45" />
</sequence>
```

## Props

| Prop | Type | Meaning |
| ---- | ---- | ------- |
| `name` | `string` | Human-readable node name. |

Purely structural; nothing else.

Direct children of a sequence may declare a [`transition`](./transitions.md) into the following clip.
