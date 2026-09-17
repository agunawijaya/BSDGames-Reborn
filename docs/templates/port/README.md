# `<GAME>` — `<PORT-NAME>` port

> One-line pitch describing what makes *this* port distinct from
> other ports of the same game.

<!--
Embed at least 2 screenshots or one GIF / asciicast from ./media/
once the port has working src/. Example:

![Gameplay](./media/01-gameplay.png)
*Caption describing the shot.*
-->

## Status

- **Status:** Active | Maintained | Frozen | Archived
- **Author:** `<Your Name>` (`<contact / GitHub handle>`)
- **License:** MIT (root default) — or state a compatible license
- **Live URL:** *(fill in once deployed)*

## Pitch

A few sentences explaining what this port does and who it is for.
For the game's history and mechanics, see the canonical
[`../../docs/about.md`](../../docs/about.md) — this section is
about *this port's* identity, not the game itself.

## Tech Stack

- **Language:** *(e.g. TypeScript 5.6)*
- **Framework:** *(e.g. Vite 5 + vanilla TS, Ratatui, Godot 4, …)*
- **Rendering:** *(e.g. DOM grid, Canvas, WebGL, TUI, native)*
- **Target platform(s):** *(e.g. Web + PWA installable on Android and iOS)*
- **Multiplayer:** *(e.g. WebRTC peer-to-peer, or N/A)*
- **Persistence:** *(e.g. localStorage, IndexedDB, or N/A)*

## Install & Build

<!--
Provide exact commands. Example for a TS/Node port:
-->

```bash
# From this port folder:
npm install
npm run dev         # dev server
npm run build       # production build
npm test            # run tests
```

## Play

- Live URL: *(fill in when deployed)*
- Or serve `dist/` locally: `npm run preview`.
- Game rules and controls: see canonical
  [`../../docs/how-to-play.md`](../../docs/how-to-play.md).

## What makes this port different

Contrast with sibling ports (once they exist):

- vs `../classic-web/`: *(this port is fancier / faster / uses X …)*
- vs `../fancy-web/`: *(this port is more minimal / uses Y …)*

## Spec compliance

This port implements the mechanics in
[`../../docs/spec.md`](../../docs/spec.md) faithfully. Any
deliberate deviation is documented in
[`docs/decisions/`](docs/decisions/) as a port-level ADR.

All scenarios in the canonical
[`../../docs/test-scenarios.md`](../../docs/test-scenarios.md)
pass. If this port adds features beyond the canonical spec
(multiplayer, cloud save, custom modes), the additional scenarios
live in [`docs/test-scenarios.md`](docs/test-scenarios.md).

## Attribution

- Original BSDGames authors — see root
  [`ATTRIBUTION.md`](../../../../ATTRIBUTION.md).
- Upstream source:
  <https://github.com/vattam/BSDGames/tree/master/<GAME>>.
- This port © `<Your Name>` `<YEAR>`, MIT (or your compatible
  license).

## Documentation

- Canonical (game-level):
  [`../../docs/`](../../docs/) — spec, architecture, about,
  how-to-play, lessons, etc.
- This port's diff log:
  [`docs/diff-log.md`](docs/diff-log.md).
- This port's decisions:
  [`docs/decisions/`](docs/decisions/).
