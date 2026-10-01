# Diffusion Studio

Agent skills for [Diffusion Studio](https://www.diffusion.studio), the video editor your agent can drive. Install them as the `diffusion` plugin in Claude or Codex, or as plain skills in any agent that reads `SKILL.md`.

| Skill | Use it to |
| --- | --- |
| `diffusion:editor` | Analyze video, audio, and images, generate media with AI, and compose video compositions |
| `diffusion:watch` | Summarize footage, answer questions about it, pull quotes, and find the moment something happens |

The skills need the Diffusion Studio desktop app on the same machine. They work wherever the agent can run shell commands or reach the app's MCP server: Claude Code, Cowork on your computer, the Claude desktop app with the app's MCP server connected, and Codex.

## Install

**Claude** (claude.ai, the desktop app, Cowork, Claude Code): add **Diffusion Studio** from the plugin directory under **Customize > Plugins**. To install it from this repository in Claude Code instead:

```sh
claude plugin marketplace add diffusionstudio/skills
claude plugin install diffusion@diffusionstudio
```

**Codex and ChatGPT:** add **Diffusion Studio** from the plugin directory. To install it from this repository in Codex instead:

```sh
codex plugin marketplace add diffusionstudio/skills
```

**Any other agent:**

```sh
npx skills add diffusionstudio/skills
```

Then install the app, if you haven't: `brew install --cask diffusionstudio/tap/editor`, or download it from [diffusion.studio](https://www.diffusion.studio). The skills walk the agent through it when the app is missing.

## What the plugin does

The plugin is Markdown only: two skills and an installation reference. It runs nothing on its own, bundles no MCP server or executables, and sends nothing anywhere. When a skill is active, it tells the agent to:

- Read the guidance that ships inside the installed app, at `Diffusion Studio.app/Contents/Resources/docs`, so it always matches your version.
- Use the app's tools, either through its MCP server (`http://127.0.0.1:3274/mcp`, local to your machine) or through the `diffusion` command-line tool bundled with the app.
- Launch the app in the background with `diffusion open --background`.
- If the app or the `diffusion` command is missing, follow `references/installation.md`. That can mean running `brew install --cask diffusionstudio/tap/editor`, or linking the bundled command into `/usr/local/bin` with `sudo ln -sf`. Depending on its permission settings, your agent asks before running them.

What the app itself does with your media, including any AI generation, is covered by the [privacy policy](https://www.diffusion.studio/legal/privacy-policy) and [terms of service](https://www.diffusion.studio/legal/terms-of-service).

## License

[MIT](LICENSE)
