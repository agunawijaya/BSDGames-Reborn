# AGENTS.md — `hangman` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`hangman`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Puzzle & Word Games
- **One-line description:** Classic terminal hangman from the BSDGames package.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/hangman>

## 2. Port Status

- **Current status:** 🟠 In Progress — documentation phase.
- **Owner:** Agun.
- **Baseline released?** No.

## 3. Folder Contents

```
hangman/
├── README.md         Landing page for this game
├── AGENTS.md         This file
├── CLAUDE.md         Thin pointer to this file
├── docs/             Documentation files
│   ├── decisions/    Per-game ADR overrides (currently empty)
│   └── ...
├── src/              Implementation (pending root language ADR)
├── data/             Game data
├── media/            Screenshots / demos
└── tests/            Automated tests
```

## 4. Design Decisions Specific to `hangman`

*No per-game overrides yet. The port defers to root defaults for
language, platform, and structure.*

Open decisions that may become ADRs:
1. Dictionary loading strategy (random-seek vs. load-into-memory).
2. Whether the wrong-guess limit is fixed or configurable.
3. Whether to add multiplayer or daily-word modes.

## 5. Gotchas & Non-Obvious Notes

- Uses curses (not raw termcap).
- Random word selection seeks to a random byte in the dictionary file.
- The hang-man body parts are table-driven via `Err_pos[]`.
- `endgame()` sets `Errors = MAXERRS + 2` on loss to ensure the full body is drawn.
- No persistent score file; averages are per-session only.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives locally in `BSDGames-master/hangman/` — do **not** commit it to this repo.
- Preserve original BSD copyright/authorship as a comment where algorithms are transcribed.
- List sources in [`docs/references.md`](./docs/references.md).
