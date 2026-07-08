# Installation (macOS, Apple silicon)

`dapi` ships bundled inside the desktop app, so installing the app puts the CLI
on your PATH. Install both with Homebrew:

```sh
brew install --cask diffusionstudio/tap/diffusion-studio
```

The cask links `dapi` automatically. After a manual `.dmg` install instead, link
it from the app menu: **Diffusion Studio > Install dapi Command Line Tool** (links
into `/usr/local/bin`).

Verify with `dapi --help`, then launch the app with `dapi open`. Requires macOS
11+ on Apple silicon.
