# AGENTS.md — `tetris` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`tetris`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Arcade & Action
- **One-line description:** Classic terminal falling-block puzzle from the BSDGames package.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/tetris>

## 2. Port Status

- **Current status:** 🟠 In Progress — documentation phase.
- **Owner:** Kimi.
- **Baseline released?** No.

## 3. Folder Contents

```
tetris/
├── README.md         Landing page for this game
├── AGENTS.md         This file
├── CLAUDE.md         Thin pointer to this file
├── docs/             Documentation files
│   ├── decisions/    Per-game ADR overrides (currently empty)
│   └── ...
├── src/              Implementation (pending root language ADR)
├── data/             Game data
├── media/            Screenshots / demos (to be captured)
└── tests/            Automated tests
```

## 4. Design Decisions Specific to `tetris`

*No per-game overrides yet. The port defers to root defaults for
language, platform, and structure.*

Open decisions that may become ADRs:
1. Rotation system for the port (SRS vs. original single-CCW).
2. Scoring model (modern line-clear bonuses vs. original flat scoring).
3. Whether to preserve the continuous `faster()` acceleration curve.

## 5. Gotchas & Non-Obvious Notes

- The original uses raw termcap, not curses.
- The board is a 1-D byte array with sentinel walls; collision detection has no explicit bounds checks.
- Rotation is table-driven via `shape.rot`, not computed from a matrix.
- The game speeds up continuously via `faster()` regardless of starting level.
- The preview flag (`-p`) was added later; the original IOCCC entry had no preview.
- High-score file handling historically used setgid privileges and `flock()`.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source at upstream <https://github.com/vattam/BSDGames/tree/master/tetris> — do **not** commit it to this repo.
- Preserve original BSD copyright/authorship as a comment where algorithms are transcribed.
- List sources in [`docs/references.md`](./docs/references.md).
