# AGENTS.md — `canfield` `fancy-web` port

For per-game agent context, see [`../../AGENTS.md`](../../AGENTS.md).

For repository-wide agent instructions and the Universal Port Contract, see the root [`AGENTS.md`](../../../../AGENTS.md).

## Port-Specific Notes

- **Tech stack:** TypeScript 5.6 + React 18 + SVG + Vite 5.
- **Build system:** npm.
- **Run dev server:** `npm run dev` (opens on `http://localhost:5173`).
- **Run tests:** `npm test` (watch) or `npm run test:once`.
- **Build production:** `npm run build` → `dist/`.
- **Typecheck only:** `npm run typecheck`.

## Directory conventions

- `src/game/` — pure game logic. **No React imports here.** Testable via Vitest without a DOM.
  - `types.ts` — `Card`, `Suit`, `Rank`, `Pile`, `GameState`, etc.
  - `deck.ts` — deterministic seeded shuffle.
  - `engine.ts` — deal, legal moves, apply move, win detection.
  - `scoring.ts` — betting economics and `cfscores` persistence format.
  - `moves.ts` — command grammar parser.
- `src/ui/` — React components for the casino table and controls.
- `src/hooks/` — `useGame`, `useSound`, `useStorage`.

## Constraints Specific to This Port

- **SVG-native cards.** No Canvas, no WebGL.
- **Spec compliance is a hard requirement.** Faithful to [`../../docs/spec.md`](../../docs/spec.md); any deliberate deviation is a port-level ADR under [`docs/decisions/`](docs/decisions/).
- **Betting economics are sacred.** `$13 / $13 / $26 / $5 / $1 / $1/min` must behave exactly as documented.
