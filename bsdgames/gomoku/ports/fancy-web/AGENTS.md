# AGENTS.md — `gomoku` `fancy-web` port

For per-game agent context, see
[`../../AGENTS.md`](../../AGENTS.md).

For repository-wide agent instructions and the Universal Port
Contract, see the root
[`AGENTS.md`](../../../../AGENTS.md).

## Port-Specific Notes

- **Tech stack:** TypeScript 5.6 + React 18 + SVG + Vite 5.
  **No Canvas, no WebGL.** Board is native SVG.
- **Build system:** npm.
- **Run dev server:** `npm run dev` (opens on `http://localhost:5173`).
- **Run tests:** `npm test` (watch) or `npm run test:once`.
- **Build production:** `npm run build` → `dist/`.
- **Typecheck only:** `npm run typecheck`.
- **Deploy target:** *(pending — GitHub Pages / Vercel / Cloudflare
  Pages likely)*.

## Directory conventions

- `src/game/` — pure game logic. **No React imports here.**
  Testable via Vitest without a DOM.
  - `state.ts` — `Board`, `Stone`, `Move`, `GameState` types.
  - `coords.ts` — Notation ↔ (col, row) conversion. Column
    letters A–T (skipping I), rows 1–19.
  - `engine.ts` — Legal-move check, place stone, win detection
    (5-in-a-row in 4 directions from the just-placed stone),
    undo.
  - `ai.ts` — Heuristic AI ported from
    `../../docs/architecture.md` (frame + overlap scoring).
    First move is always K10 to match the original.
- `src/ui/` — React components for HUD (MoveHistory, Controls,
  HelpPanel).
- `src/Board.tsx` — SVG board renderer + click / keyboard input.
- `src/Game.tsx` — root game component holding state, wiring
  input to engine + AI.
- `src/App.tsx`, `src/main.tsx` — React bootstrap.

## Constraints Specific to This Port

- **SVG-native rendering.** No `<canvas>`, no WebGL. Every visual
  element (grid lines, stones, labels, win-line highlight) is an
  SVG primitive. This keeps the bundle small (~ 150 KB gzipped
  target) and the app accessible on low-end mobile / no-GPU
  devices.
- **Palette (locked):**
  - Board: slate warm `#2b2b32`
  - Grid lines: `#8a8676` (muted sienna)
  - Hoshi dots: `#c0b899`
  - Black stone: `#141418` with subtle radial highlight
  - White stone: `#f4f2e8` with subtle radial shadow
  - Last-move indicator: `#e63946` (accent red)
  - Win line: `#ffbe0b` (accent yellow) with pulse animation
  - HUD text: `#e8e5d6` / `#a09b8a`
- **Game state lives in React state** — `useState<GameState>`.
  Small enough (a 19×19 array + move history) that immutable
  updates and re-renders are cheap. No `useRef`-based imperative
  updates needed.
- **Spec compliance is a hard requirement.** Faithful to
  [`../../docs/spec.md`](../../docs/spec.md); any deliberate
  deviation is a port-level ADR under
  [`docs/decisions/`](docs/decisions/).
