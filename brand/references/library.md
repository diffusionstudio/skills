# Diffusion Studio — brand library

Choose existing source and assets before making new ones. Components contain reusable layout;
compositions contain full scenes. The files support manual and agent-led work but do not add a
component system to the Diffusion Studio app.

All TSX examples use Solid components and the JSX contract from the `editor` skill. Import or
copy only the files needed by the current project.

## Shared source

| Source | Use |
| ------ | --- |
| `assets/components/tokens.ts` | Color, type, spacing, safe-area, and short-edge scaling values |
| `assets/components/index.ts` | Exports every approved or provisional component |

## Components

| Component | Status | Use | Required content |
| --------- | ------ | --- | ---------------- |
| `TitleCard` | ready | A title and optional qualifier on a plain background | `title`; optional `subtitle` |
| `LowerThird` | ready | A name and detail over footage | `name`, `detail` |
| `Callout` | PLACEHOLDER | A short label and value over footage | `label`, `value` |

Read the matching file in `assets/components/` for its props. Keep components free of
`<scene>` so they can sit inside any composition. Keep content within the caps in `design.md`.

## Compositions

| File | Status | Use |
| ---- | ------ | --- |
| `assets/compositions/end-card.tsx` | PLACEHOLDER | Full end-card example; replace its title and CTA before use |
| `assets/compositions/product-demo.tsx` | PLACEHOLDER | Full product-footage example; replace its media path and copy before use |

Compositions own the scene, media, and timing. Review every PLACEHOLDER before mounting.

## Brand assets

| Folder | Status |
| ------ | ------ |
| `assets/logos/` | White wordmark and icon available |
| `assets/fonts/` | PLACEHOLDER — no font files bundled; use installed Geist and Geist Mono |
| `assets/audio/music/` | PLACEHOLDER — no licensed music available |
| `assets/audio/sfx/` | PLACEHOLDER — no approved recurring sound effects available |
| `assets/audio/voiceovers/` | PLACEHOLDER — no approved recurring voiceovers available |

## Adding to the library

Add a component after it has a clear repeated use. Give it one job and a small prop set. Add a
composition when the whole scene repeats. Put final media in the matching asset folder and add
it to this catalog. Do not turn a one-off choice into a brand rule without review.
