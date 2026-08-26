# Template: GitHub star-milestone celebration

A 10-second, 1920×1080 celebration of a repository crossing a star milestone
("we crossed 5k stars"), replicating GitHub's light-mode UI: the repo header
slides in top-left, a strip of real stargazer avatars — each with a filled
star under it — scrolls through the middle band, and a large counter
bottom-right counts the avatars as they pass, landing exactly on the
milestone as the last avatar (the actual milestone stargazer) settles on the
right margin and confetti fires.

The styling is fixed; only the content is swapped per repo. [scene.jsx](scene.jsx)
is the complete composition — copy it into a project folder as the entry file,
edit the `CONTENT` block at the top (`OWNER`, `REPO`, `MILESTONE`, `ORG_LOGO`,
`AVATAR_DIR`), provide the data described below, and `dapi open` the folder.
The source is the document, so saving the file is what re-renders it.
Everything below that block — GitHub's light palette (a deliberate brand
exception, since the scene reproduces GitHub's own interface), the geometry,
easings, and confetti — stays as is.

## 1. Fetch the stargazers

The GitHub API lists stargazers in starred order, 100 per page:

```bash
gh api 'repos/OWNER/REPO/stargazers?per_page=100&page=1'
```

**Do not fetch all N profiles.** The strip renders `MILESTONE` items, but only
the ends are ever readable: the first stargazers pass during the slow start,
and the true milestone stargazer lands last. Fetch just the first page and the
last page (page `MILESTONE / 100`) — the scene cycles those ~200 avatars
through the middle, where the scroll is a high-speed blur, and the repeats go
unnoticed.

Write the logins, in order, to a `stargazers.js` next to the scene:

```js
export const FIRST = ["kartikk-k", "fengjinyi98", /* … stargazers 1–100 */];
export const LAST = [/* … stargazers MILESTONE-99 – MILESTONE, in order */];
```

## 2. Download the avatars into a folder

Save each fetched user's avatar as `avatars/<login>.png` (the API's
`avatar_url` with `&s=460` appended — avatars display at 224 px, so 460 px
stays sharp), plus the org's avatar as the logo.

The profile images have to be in the project's library, which means putting
them under its `assets/` folder — the app picks up what lands there and the
library path is where the file sits under it (see
`reference/jsx/media.md` in the project's docs, under "Adding an asset"). The scene names each avatar
by that path, so `AVATAR_DIR` is `"avatars"` and `ORG_LOGO` is `"logo.png"`.

```
github-stargazers/
├── index.tsx         # scene.jsx, copied in as the entry file
├── stargazers.js
└── assets/
    ├── logo.png      # org avatar
    └── avatars/
        ├── kartikk-k.png
        └── …
```

## 3. How the scene holds up at 5,000 items

Worth knowing before touching the internals:

- The strip is virtualized: a memo derived from the playhead yields only the
  handful of avatars overlapping the frame, so item count barely matters. Each
  is a real `<img>` inside the `<html>` layer, resolved by library path.
- The scroll position is a closed-form function of composition time (`xAt`),
  mirrored by the anime.js timeline. The counter derives from the same eased
  position — the number of avatars fully entered — so it lands on the
  milestone exactly when the strip lands, with no separate tween to drift.
- Confetti parameters come from a seeded PRNG and the motion is pure
  ballistics evaluated from `time()`, so scrubbing and export reproduce the
  identical burst.
- The strip's edges are feathered by two white-to-transparent gradients laid
  over the ends, so avatars dissolve at the frame edges instead of clipping.

## 4. Verify

Capture three moments with `dapi capture`: t = 0 (header entrance
starting, strip still off-screen), mid-scroll (~4 s, the deliberate
high-speed blur), and the final frame — last avatars settled, counter reading
the milestone, confetti in the air.
