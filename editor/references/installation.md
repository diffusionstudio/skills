# Installation

`diffusion` ships bundled inside the desktop app (as does its `dapi` alias),
so installing the app is what puts the CLI within reach. Check the cases in
this order.

## App already installed, diffusion not linked (default case)

Most users have installed the app manually from the `.dmg` without setting up
the CLI. If `diffusion` is not on the PATH, check for the app first:

```sh
ls "/Applications/Diffusion Studio.app"
```

If it exists, link the bundled CLI instead of installing anything. Either way
works:

- **Settings:** the app's **CLI** section → **Install** (shows the macOS
  admin prompt, links into `/usr/local/bin`).
- **Terminal:**

  ```sh
  sudo ln -sf "/Applications/Diffusion Studio.app/Contents/Resources/cli/bin/dapi" /usr/local/bin/diffusion
  sudo ln -sf "/Applications/Diffusion Studio.app/Contents/Resources/cli/bin/dapi" /usr/local/bin/dapi
  ```

## Nothing installed: Homebrew (recommended)

```sh
brew install --cask diffusionstudio/tap/editor
```

The cask installs the app and links `diffusion` (and `dapi`) automatically.
Requires macOS 11+ on Apple silicon.

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

Then put `diffusion` (and its `dapi` alias) on your PATH from the built CLI:

```sh
npm run link --workspace=@diffusionstudio/cli
```

`npm run dev:desktop` rebuilds the CLI on every start, so the linked
`diffusion` always drives the locally running app with the latest code.

## Connecting the agent (MCP)

The app registers its MCP server with supported agents (Claude Code, Codex,
Cursor, Copilot, Gemini CLI) during setup. If it is not registered, connect it
manually:

- Agents that speak Streamable HTTP: `http://127.0.0.1:3274/mcp` (the app
  must be running).
- Agents that only speak stdio (Claude Desktop): run `diffusion mcp`, which
  also launches the app in the background.

## Verify

Whichever path you took: `diffusion --help` should print the command list,
and `diffusion open` launches the app. The docs are then at
`Diffusion Studio.app/Contents/Resources/docs`.
