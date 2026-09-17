# AGENTS.md — `dab` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`dab`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Board Games
- **One-line description:** Terminal implementation of Dots and Boxes
  with human and computer players.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/dab>

## 2. Port Status

- **Current status:** 🟠 In Progress — documentation done; awaiting
  language ADR.
- **Owner:** Agun (Kimi)
- **Baseline released?** no

## 3. Folder Contents

```
dab/
├── README.md         Landing page for this game
├── AGENTS.md         This file
├── CLAUDE.md         Thin pointer to this file
├── docs/             14 documentation files (see README)
│   ├── decisions/    Per-game ADR overrides (may be empty)
│   └── ...
├── src/              Implementation
├── data/             Game data
├── media/            Screenshots
└── tests/            Automated tests
```

## 4. Design Decisions Specific to `dab`

*If any root defaults have been overridden for this game, they appear
as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to
root defaults.*

- *(No per-game overrides yet.)*

## 5. Gotchas & Non-Obvious Notes

- The original is written in C++ and uses `ncurses` (or the terminal
  alternate character set).
- The cursor moves on a grid of dots; `space` draws the edge under the
  cursor.
- Diagonal keys (`u/y/b/n`) move the cursor between the even and odd
  rows of the dot grid.
- The AI (`ALGOR`) uses closure search + minimisation of opponent
  closures.
- The `RANDOM` class wraps `random()` and provides repeatable
  iteration order for the AI search.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C++ source lives in `BSDGames-master/dab/` — do **not**
  commit it to this repo.
- Preserve the BSD copyright notice and original authorship where you
  transcribe logic from the original.
- List sources in [`docs/references.md`](./docs/references.md).
