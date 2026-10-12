# Installation

`diffusion` ships bundled inside the desktop app (as does its `dapi` alias),
so installing the app is what puts the CLI within reach. On Windows, skip to
[Windows](#windows). On macOS, check the cases in this order.

## macOS: app already installed, diffusion not linked (default case)

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

## macOS: nothing installed, Homebrew (recommended)

```sh
brew install --cask diffusionstudio/tap/editor
```

The cask installs the app and links `diffusion` (and `dapi`) automatically.
Requires macOS 11+ on Apple silicon.

## Windows

The Windows build (x64) is a per-user installer from the GitHub releases. It
needs no administrator and installs to `%LOCALAPPDATA%\DiffusionStudio`.

### App already installed, diffusion not on PATH

The installer always writes the `diffusion.cmd` and `dapi.cmd` shims, but
does not put them on PATH. Check for them first (PowerShell):

```powershell
Test-Path "$env:LOCALAPPDATA\DiffusionStudio\bin\diffusion.cmd"
```

If they exist, add the folder to PATH from the app's **Settings** → **CLI**
section → **Install** (no admin prompt). Terminals opened afterwards find
`diffusion`; in a shell that is already running, add it for this session:

```powershell
$env:Path += ";$env:LOCALAPPDATA\DiffusionStudio\bin"
```

### Nothing installed: GitHub release

Download the latest installer and run it silently (PowerShell):

```powershell
$setup = "$env:TEMP\Diffusion-Studio-x64-Setup.exe"
curl.exe -L -o $setup https://github.com/diffusionstudio/editor/releases/latest/download/Diffusion-Studio-x64-Setup.exe
Start-Process $setup -ArgumentList '--silent' -Wait
```

Then put `diffusion` on PATH as in the case above. The app updates itself
from then on. Users who prefer to click through can download the same
installer from [diffusion.studio](https://www.diffusion.studio/download).

## From source (any platform, full codebase access)

Only if you need the full codebase to read and modify, or a Linux setup:
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

## Optional: connect the MCP server

The skills only need `diffusion`. For MCP, the app registers its server with
supported agents during setup; otherwise connect it manually:

- Agents that speak Streamable HTTP: `http://127.0.0.1:3274/mcp` (the app
  must be running).
- Agents that only speak stdio (Claude Desktop): run `diffusion mcp`, which
  also launches the app in the background.

## Verify

Whichever path you took: `diffusion --help` should print the command list,
and `diffusion open --background` launches the app without raising a window.
The docs are then at `Diffusion Studio.app/Contents/Resources/docs` on macOS,
or `%LOCALAPPDATA%\DiffusionStudio\app-<version>\resources\docs` on Windows.
