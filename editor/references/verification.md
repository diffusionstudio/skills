# Verification

How to confirm a change actually produced what you intended. A clean `mount` or `insert` does not guarantee a correct-looking frame — verify the composited result, not just that the command succeeded.

- After each `mount` or `insert`, `dapi node capture` the composited **scene** (capture the scene id, not the isolated node) to see what the viewer actually gets.
- Reconcile the captured frame against the brief before moving on. Check framing, crop, readability, hierarchy, and timing at the intended delivery size.
- Verify after every stage, not only at the end — build the composition incrementally so a problem is caught next to the change that caused it. See [compositing.md](./compositing.md).
- Fix the largest viewer-facing problem before polishing details, and recheck related moments after structural changes, since pacing, continuity, emphasis, and meaning are relational.
