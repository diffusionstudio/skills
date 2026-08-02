# Media source resolution

`src` (on [`<video>`](./video.md), [`<image>`](./image.md), [`<audio>`](./audio.md), and the DOM [`<img>`](./html.md#images) inside `<html>`) accepts:

- **Global path**: e.g. `"/Movies/video.mp4"`, resolved against the user's OS.
- **Remote URL**: e.g. `"https://my.videoarchive.com/audio/clip.wav"`, registered as a remote asset.
- **Asset id**: e.g. `"gbHJ"`, an imported asset (discover ids with [`dapi asset ls`](../asset/ls.md) or [`dapi asset tree`](../asset/tree.md)).
- **`AssetRef`**: the value returned by a `generate.*` declaration (see [generate.md](./generate.md)). The node is inserted immediately as a placeholder and its paint is attached once the asset has generated.

In [`dapi node patch`](../node/patch.md), `src` takes a path, URL, or asset id; `generate.*` declarations are JSX-only.

An `<img>` additionally takes a `data:` or `blob:` URL, which goes to the browser as it is.

To read a source's raw bytes inside an effect (rather than mount it as a node), pass the same input to [`useFile`](./lifecycle.md#usefile), which resolves it to a `File`.
