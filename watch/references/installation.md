# Installation

`dapi` ships bundled inside the desktop app, so installing the app is what puts
the CLI within reach. Check the cases in this order.

## App already installed, dapi not linked (default case)

Most users have installed the app manually from the `.dmg` without setting up
the CLI. If `dapi` is not on the PATH, check for the app first:

```sh
ls "/Applications/Diffusion Studio.app"
```

If it exists, link the bundled CLI instead of installing anything. Either way
works:

- **App menu:** **Diffusion Studio > Install dapi Command Line Tool** (shows the
  macOS admin prompt, links into `/usr/local/bin`).
- **Terminal:**

  ```sh
  sudo ln -sf "/Applications/Diffusion Studio.app/Contents/Resources/cli/bin/dapi" /usr/local/bin/dapi
  ```

## Nothing installed: Homebrew (recommended)

```sh
brew install --cask diffusionstudio/tap/editor
```

The cask installs the app and links `dapi` automatically. Requires macOS 11+ on
Apple silicon.

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

## Verify

Whichever path you took: `dapi --help` should print the command list, and
`dapi open` launches the app.
