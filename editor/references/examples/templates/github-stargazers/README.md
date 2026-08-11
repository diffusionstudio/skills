# Template: GitHub star-milestone celebration

A 10-second, 1920×1080 celebration of a repository crossing a star milestone
("we crossed 5k stars"), replicating GitHub's light-mode UI: the repo header
slides in top-left, a strip of real stargazer avatars — each with a filled
star under it — scrolls through the middle band, and a large counter
bottom-right counts the avatars as they pass, landing exactly on the
milestone as the last avatar (the actual milestone stargazer) settles on the
right margin and confetti fires.

The styling is fixed; only the content is swapped per repo. [scene.jsx](scene.jsx)
is the complete composition — edit the `CONTENT` block at the top (`OWNER`,
`REPO`, `MILESTONE`, `ORG_LOGO`, `AVATAR_DIR`) and provide the data described
below, then `dapi mount scene.jsx`. Everything below that block — GitHub's
light palette (a deliberate brand exception, since the scene reproduces
GitHub's own interface), the geometry, easings, and confetti — stays as is.

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

The profile images must be available to the editor: keep them in a folder
inside the project directory and open the project from there with `dapi open`,
so the whole folder of icons comes along with it. The scene then resolves each
file by path (`useFile`, see [lifecycle.md](../../../jsx/lifecycle.md#usefile))
— point `AVATAR_DIR` and `ORG_LOGO` at those paths.

```
github-stargazers/
├── scene.jsx
├── stargazers.js
├── logo.png          # org avatar
└── avatars/
    ├── kartikk-k.png
    └── …
```

## 3. How the scene holds up at 5,000 items

Worth knowing before touching the internals:

- The strip is a virtualized canvas: a `<surface>` draws only the on-screen
  slice each frame, so item count barely matters.
- The scroll position is a closed-form function of composition time (`xAt`),
  mirrored by the anime.js timeline. The counter derives from the same eased
  position — the number of avatars fully entered — so it lands on the
  milestone exactly when the strip lands, with no separate tween to drift.
- Confetti parameters come from a seeded PRNG and the motion is pure
  ballistics evaluated from `time()`, so scrubbing and export reproduce the
  identical burst.
- The strip's edges are feathered by erasing with `destination-out`
  gradients, so avatars dissolve at the frame edges instead of clipping.

## 4. Verify

Capture three moments with `dapi node capture`: t = 0 (header entrance
starting, strip still off-screen), mid-scroll (~4 s, the deliberate
high-speed blur), and the final frame — last avatars settled, counter reading
the milestone, confetti in the air.
