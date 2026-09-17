# `robots` — `fancy-web` port

> A modern, animated web reimplementation of BSDGames `robots`.
> Faithful mechanics, fancy presentation — sprite art, smooth
> animations, sound effects, polished menus.

<!--
Screenshots and gameplay GIF go here once the port has working
sprite rendering. Embed from ./media/.
-->

## Status

- **Status:** Active (walking skeleton — engine & rendering in
  progress)
- **Author:** Agun Wijaya
- **License:** MIT (root default)
- **Live URL:** *(pending deploy)*

## Pitch

BSDGames `robots`, but with sprite art, smooth animations, sound
effects, and modern UI polish. Game mechanics are preserved
verbatim from the canonical
[`../../docs/spec.md`](../../docs/spec.md) — 60×22 grid,
turn-based, robots move toward the player, collisions leave
piles, teleport is available with limited uses.

The presentation layer, though, is a complete reinterpretation
for the modern web. Where the classic port renders `@`, `+`, `*`
in monospace green, this port renders sprites, animated moves,
particle explosions, sound.

For the game's history and mechanics, see canonical
[`../../docs/about.md`](../../docs/about.md).

## Tech Stack

- **Language:** TypeScript 5.6
- **UI framework:** React 18 (functional components + hooks)
- **Rendering:** [`@react-three/fiber`](https://docs.pmnd.rs/react-three-fiber) + Three.js (WebGL)
  with an **orthographic camera at ~30° for isometric look**. All
  geometry procedural — no external asset packs.
- **Visual reference:** Monument Valley, Into the Breach, Mini Metro.
- **Build:** Vite 5
- **Tests:** Vitest 2 + Testing Library
- **Target platform:** Web (browser). Mobile via responsive
  layout + touch controls. Capacitor Android path stays open per
  ADR-005 Forward-Compatibility Rules.
- **Multiplayer:** N/A (robots is single-player)
- **Persistence:** localStorage (high scores)

Full stack rationale (including the react-konva → R3F pivot on
2026-09-17 afternoon): see
[`docs/decisions/001-tech-stack.md`](docs/decisions/001-tech-stack.md).

## Install & Build

```bash
# From this port folder:
npm install
npm run dev         # dev server (http://localhost:5173)
npm run build       # production build → dist/
npm run preview     # preview production build
npm test            # watch-mode tests
npm run test:once   # single-run tests
npm run typecheck   # tsc -b
```

## Play

*(Live URL pending. Once built locally: `npm run preview` and
open the printed URL.)*

Controls (planned — being implemented):

| Key | Action |
|---|---|
| Arrow keys / `hjkl` | Move one step (cardinal) |
| `y` `u` `b` `n` | Move one step (diagonal) |
| Space / `.` | Wait one turn |
| `t` | Teleport (limited uses per level) |
| `w` | Wait until safe |
| `q` | Quit to menu |

Game rules: see canonical
[`../../docs/how-to-play.md`](../../docs/how-to-play.md).

## What makes this port different

- vs `../classic-web/` *(pending)*: this port uses sprite art,
  smooth animations, and sound. `classic-web` will be a faithful
  ASCII terminal-in-browser reproduction with the original green
  palette.
- vs `../classic-terminal/` *(pending)*: `classic-terminal`
  targets native terminal; this port targets browser and
  prioritizes visual polish over minimalism.

## Spec compliance

This port implements the mechanics in
[`../../docs/spec.md`](../../docs/spec.md) faithfully. Any
deliberate deviation is documented as an ADR under
[`docs/decisions/`](docs/decisions/).

All scenarios in the canonical
[`../../docs/test-scenarios.md`](../../docs/test-scenarios.md)
must pass before the port is marked Released.

## Attribution

- Original BSDGames authors — see root
  [`ATTRIBUTION.md`](../../../../ATTRIBUTION.md).
- Upstream source:
  <https://github.com/vattam/BSDGames/tree/master/robots>.
- This port © 2026 Agun Wijaya, MIT.

## Documentation

- Canonical (game-level):
  [`../../docs/`](../../docs/) — spec, architecture, about,
  how-to-play, lessons, references.
- This port's diff log:
  [`docs/diff-log.md`](docs/diff-log.md).
- This port's decisions:
  [`docs/decisions/`](docs/decisions/).
