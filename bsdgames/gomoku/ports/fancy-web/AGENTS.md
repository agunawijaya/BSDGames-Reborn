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
- **Palette (locked): traditional Japanese gomoku / go board.**
  Modelled on a real kaya-wood board with black grid ink, black
  slate (mikage) stones, and white clamshell (hamaguri) stones.
  See [`docs/diff-log.md`](docs/diff-log.md) `2026-09-17 palette
  update` entry for rationale (user rejected the earlier dark
  theme; wanted the port to look like the physical board).
  - Body / tabletop: `#d4b58e` (warm wood)
  - Board frame: `#a06d3d` (darker wood rim)
  - Board surface: `#e8c184` (kaya honey)
  - Grid lines: `#2a1e10` (black ink)
  - Hoshi dots: `#1a1210` (near-black)
  - Labels: `#5a4530` (warm brown ink)
  - Black stone: radial gradient `#3a3a3a → #141410 → #000000`
  - White stone: radial gradient `#ffffff → #f2eddb → #d0c6a6`
  - Last-move indicator: `#c23b22` (vermillion — cinnabar seal)
  - Win line: `#c23b22` (vermillion) with pulse animation
  - Sidebar cards: `#f5efe0` cream on `#c9b48a` border
  - Primary text: `#3a2a1a`; muted text: `#8a7757`
  - Primary button: `#c23b22` (vermillion) with white text
- **Game state lives in React state** — `useState<GameState>`.
  Small enough (a 19×19 array + move history) that immutable
  updates and re-renders are cheap. No `useRef`-based imperative
  updates needed.
- **Spec compliance is a hard requirement.** Faithful to
  [`../../docs/spec.md`](../../docs/spec.md); any deliberate
  deviation is a port-level ADR under
  [`docs/decisions/`](docs/decisions/).
