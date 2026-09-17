# AGENTS.md — `gomoku` (BSDGames Reborn)

Context for AI agents and human contributors working on the port of
**`gomoku`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Board Games
- **One-line description:** Get five in a row on a 19×19 grid.
  Includes a serious heuristic AI.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/gomoku>

## 2. Port Status

- **Current status:** 🟠 In Progress (documentation phase)
- **Owner:** Agun Wijaya
- **Baseline released?** no

## 3. Folder Contents

```
gomoku/
├── README.md         Landing page
├── AGENTS.md         This file
├── CLAUDE.md         Thin pointer
├── docs/             12 documentation files
├── src/              (empty — awaiting language ADR)
├── data/             (may hold opening books / test games)
├── media/            (empty)
└── tests/            (empty)
```

## 4. Design Decisions Specific to `gomoku`

None yet. All decisions defer to root defaults.

Likely future ADRs:

- **AI upgrade strategy**: keep original heuristic, add MCTS as
  optional, or replace with a small NN.
- **Board size**: 19×19 (default), 15×15 (Renju standard), or
  configurable.
- **Rule variant**: free gomoku (default) vs. Renju (with forbidden
  moves for Black).

## 5. Gotchas & Non-Obvious Notes

- **The AI is genuinely sophisticated** — this is not a 2-line
  greedy. `pickmove.c` uses **frames** (5-in-a-row lines), **combo
  values**, and multi-level combo composition. Understanding it
  fully takes time; see [`architecture.md`](./docs/architecture.md).
- **Board is 20×20 internally** to include the border sentinel
  (`gomoku.h`). Legal moves are 19×19.
- **First move is hardcoded** to K10 (center) —
  `pickmove.c:77-78`.
- **Tie-breaker uses RNG** — the only place `rand()` affects
  gameplay is `better()` at `pickmove.c:214-218`, when two spots
  have equal value.
- **Two-player mode** — flag `-u` enables user-vs-user (hot-seat).
- **Save/load** to file via `save` command; can also load an
  input file as first argument.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives locally — do **not** commit it to this
  repo.
- Ralph Campbell's copyright and the Peter Langston acknowledgement
  (for `goref`-based display) are preserved.
