# Lifecycle

Mounting is a **one-shot render**: the reactive graph exists to *compose* the document (loops, conditionals, derived values, component props), not to drive it afterward.

1. The component tree renders synchronously into the staging root; `onMount` callbacks flush once.
2. The subtree commits and the reactive root is **disposed**. Signal changes after commit do not affect the document.
3. Ownership transfers to the document: every materialized node is a fully editable composition node. Asset generation is owned by the engine, not the reactive graph, so it proceeds normally after disposal.

The update path is **re-running the project**, which rebuilds the mount root in place, like refreshing a webpage; unchanged asset specs hit the generation cache. A future *live mode* may keep the reactive root mounted so signals animate the document; the one-shot contract above is deliberately forward-compatible with it.
