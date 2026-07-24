# Errors

Where each [pipeline](./README.md#pipeline) stage fails, and with what effect:

| Stage | Where it surfaces | Effect |
| ----- | ----------------- | ------ |
| Compile (syntax/type-stripping/bundling) | CLI stderr, exit 1 | App never contacted. |
| Evaluate / mount (thrown errors, invalid props, invalid root: e.g. a root that is not a scene, missing `src`, malformed `Time`, an unknown or cyclic `syncTo` key, `syncTo` combined with `start`) | CLI stderr, exit 1 | Staging root discarded; **nothing inserted**. |
| Generation (per-model constraints: `aspectRatio`, `duration`, feature flags) | CLI stderr, exit 1, after every generation settled | No rollback; the mounted tree stays committed. The affected placeholder stops showing its generating state and is left without a paint. |
| Sync (a side without a decodable audio track, or no reliable alignment) | CLI stderr, exit 1, after every alignment settled | No rollback; the tree stays committed and the node keeps its default placement. |

Runtime errors are mapped back to the source via inline sourcemaps produced at compile time.
