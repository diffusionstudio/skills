# Installation

## Homebrew (recommended)

`dapi` ships bundled inside the desktop app, so installing the app puts the CLI
on your PATH. Install both with Homebrew:

```sh
brew install --cask diffusionstudio/tap/editor
```

The cask links `dapi` automatically. After a manual `.dmg` install instead, link
it from the app menu: **Diffusion Studio > Install dapi Command Line Tool** (links
into `/usr/local/bin`).

Verify with `dapi --help`, then launch the app with `dapi open`. Requires macOS
11+ on Apple silicon.

## From source (any platform, full codebase access)

Only if you need the full codebase to read and modify, or a non-macOS setup:
clone the repo and run the app locally. Requires Node 20+ and npm.

```sh
git clone https://github.com/diffusionstudio/editor.git
cd editor
npm install

cp apps/web/.env.example apps/web/.env   # required: the app won't run without it

npm run dev:desktop    # editor as a desktop app (Electron): builds the CLI, starts the web server, launches the app
```

Then put `dapi` on your PATH from the built CLI (macOS/Homebrew link layout;
adjust the link target for other setups):

```sh
npm run symlink:create --workspace=@diffusionstudio/cli
```

`npm run dev:desktop` rebuilds the CLI on every start, so the linked `dapi`
always drives the locally running app with the latest code.
