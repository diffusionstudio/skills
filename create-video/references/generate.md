# Generate footage

Generation is **declarative**: there is no `generate` command. You declare
`generate.image` / `generate.video` / `generate.voice` / `generate.audio`
assets in the project module and `dapi mount` produces them (syntax: the API
reference's `jsx/generate.md`).

## Before declaring

- `dapi whoami`: generation requires a signed-in account.
- `dapi models <type>` / `dapi voices`: pick a valid model or voice and stay
  within its constraints (durations, aspect ratios, features). Never guess
  model ids.

## Working economically

Generation costs credits and blocks the mount until every declared asset lands,
so:

- Results are **cached by content**: re-mounting unchanged declarations
  regenerates nothing. Iterating on layout around a generated asset is safe;
  changing any option of a declaration regenerates it. Set `seed` for
  reproducibility.
- Declarations can feed each other (e.g. a generated image as a video's start
  frame), letting you approve a cheap image before spending on video.
- Decide **what** to generate from the edit plan (see `edit.md`): generation
  fills the coverage gaps your shot lists expose; a shot list of prompts is
  itself a plannable artifact.

## Iterate like a shoot

Generate, then **inspect the result** (`understand.md`) before building on it:
screenshot or visualize, judge, and refine the prompt or seed. Don't stack
edits on footage you haven't looked at.
