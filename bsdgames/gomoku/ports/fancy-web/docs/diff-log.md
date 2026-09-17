# `gomoku` `fancy-web` — Diff Log

Feature-by-feature narrative of choices made in this port versus
the original BSDGames `gomoku`. The canonical
[`../../docs/spec.md`](../../../docs/spec.md) is the contract;
this log explains how this port implements or deliberately
diverges from it.

**Legend:**

- 🟢 **Kept** — behaves as the original (with platform translation
  where noted).
- 🟠 **Modernized** — platform / UX translation preserving
  spec-level behavior.
- 🔵 **Added** — new behavior not in the original spec (requires
  a port-level ADR).
- 🔴 **Removed** — original behavior deliberately absent (requires
  a port-level ADR).

---

## Board

- 🟢 **19 × 19 board** with a border sentinel (BSZ = 19). Matches
  canonical `spec.md` §State Variables.
- 🟢 **Coordinate system A–T (skipping I), rows 1–19.**
  Center = K10 — the AI's forced first move.
- 🟠 **Rendering.** Original renders `curses` characters on an
  ANSI-drawn grid. This port renders an SVG board: a
  slate-warm background, muted-sienna grid lines, dot marks
  (hoshi) at 4-4, 4-10, 4-16, 10-4, 10-10, 10-16, 16-4, 16-10,
  16-16.

## Rules

- 🟢 **Black moves first**, alternating turns.
- 🟢 **Win = first to five in an unbroken line** (horizontal,
  vertical, or either diagonal). Free-gomoku rules — overlines
  (6+) also count as wins per the original.
- 🟢 **No captures.** Stones are permanent once placed.
- 🟢 **Legal moves = any interior EMPTY spot.**
- 🟢 **Tie** = board full with no winner (practically unreachable
  on 19 × 19 with heuristic play).

## AI

- 🟢 **First AI move always K10** (spec §Rules invariant 8;
  `pickmove.c:77-78`).
- 🟠 **Heuristic evaluator ported.** Original frame + overlap
  scoring from `pickmove.c` reimplemented in TypeScript. See
  [`decisions/002-ai-approach.md`](decisions/002-ai-approach.md)
  when landed.
- 🔵 **Tie-break RNG behavior kept.** Equally-valued moves are
  chosen at random via a seeded Mulberry32 (spec permits this;
  `srandom(time(0))` in the original). Seed is Date.now() unless
  overridden for tests.
- 🔴 **No MCTS / neural AI in v1.** Heuristic is the shipped
  default. Deferred to future port ADR.

## Input

- 🟢 **`K10` notation.** Typed as characters, matches original.
- 🔵 **Click / tap intersection.** Modern web affordance.
- 🔵 **Arrow-key cursor** — move a highlight, place with Enter.
  Modern accessibility affordance.
- 🟠 **`quit` / `resign` / `save`** — mapped to buttons in the
  HUD instead of typed words.
- 🔵 **Undo (`u` / Ctrl+Z).** Not in spec; additive convenience
  that helps hot-seat games.

## Termination

- 🟢 **Win / Tie / Resign** outcomes match spec.
- 🟠 **Win animation** — the 5+ stones on the winning line pulse
  and get a highlight stroke. Original just prints "Game over".

## Persistence

- 🔵 **`localStorage`: game-in-progress resume + winrate stats.**
  Not in spec; modern replacement for the original's save-file
  workflow.
- 🔴 **SGF save/load** deferred to v2.

## Sound

*(Planned as an additive feature; would need a port-level ADR
before landing.)*

## Modernization Additions (per port-level ADRs)

- [ADR-001 — Tech stack (TypeScript + React + SVG + Vite)](decisions/001-tech-stack.md)

## Release milestone — 2026-09-17

🟢 **Released.** All Universal Port Contract baseline items
satisfied.

### Verification

- ✅ **47/47 Vitest tests pass** (11 coords + 22 engine + 14 AI).
  Full spec coverage: init, place stone, alternating turns,
  bounds check, occupied-cell rejection, 4 direction win
  detection (H/V/↘/↗), middle-fill win, broken-line no-win,
  overline as win (free-gomoku rules), undo (single + full
  history), resign, AI first-move K10 rule, AI winning-move
  detection, AI defensive blocking, AI RNG determinism.
- ✅ **TypeScript strict clean** (`tsc --noEmit`).
- ✅ **Production bundle 49.67 KB gzipped** (154 KB raw).
  Well under the 150 KB gzipped target set in
  [`decisions/001-tech-stack.md`](decisions/001-tech-stack.md).
- ✅ **4 port-specific screenshots** captured via a Playwright
  script (`scripts/capture-screenshots.mjs`) driving a headless
  Chromium against the running dev server. Screenshots exercise
  empty board, midgame vs AI, hot-seat threats, and a Black-wins
  end state with the golden win-line highlight.

### File tree at release

```
bsdgames/gomoku/ports/fancy-web/
├── README.md              (embeds 4 screenshots)
├── AGENTS.md
├── CLAUDE.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .gitignore
├── src/
│   ├── main.tsx / App.tsx / Game.tsx
│   ├── Board.tsx          (SVG board renderer)
│   ├── game/
│   │   ├── state.ts       (Board, Stone, Move, GameState types)
│   │   ├── coords.ts      ("K10" ↔ (col, row))
│   │   ├── engine.ts      (rules, win detection, undo, resign)
│   │   └── ai.ts          (heuristic AI — pattern scoring)
│   └── ui/
│       └── Sidebar.tsx    (Status + Mode + Controls + MoveHistory)
├── tests/                 (47 vitest tests)
├── scripts/
│   └── capture-screenshots.mjs
├── media/                 (4 PNGs)
└── docs/
    ├── diff-log.md
    └── decisions/
        ├── README.md
        └── 001-tech-stack.md
```

## Removed / Deferred

- SGF format save/load — v2.
- Rule variants (Renju, Caro) — v2.
- Board size options (9×9, 13×13, 15×15) — v2.
- MCTS / neural AI stronger than heuristic — v2.
- Online multiplayer, correspondence games — v2.
- Puzzle mode — v2.
- Post-game analysis (AI thinks bubble, alternative lines) — v2.

---

**This log is the story of how the port chose to solve the
problems the spec sets.** Updated as each feature lands.
