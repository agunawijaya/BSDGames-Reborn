# AGENTS.md — `wargames` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`wargames`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Simulation & Strategy / Easter egg
- **One-line description:** The classic "Shall we play a game?"
  launcher Easter egg from the movie *WarGames*.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/wargames>

## 2. Port Status

- **Current status:** 🟠 In Progress — documentation done; awaiting
  language ADR.
- **Owner:** Agun (Kimi)
- **Baseline released?** no

## 3. Folder Contents

```
wargames/
├── README.md         Landing page for this game
├── AGENTS.md         This file
├── CLAUDE.md         Thin pointer to this file
├── docs/             14 documentation files (see README)
│   ├── decisions/    Per-game ADR overrides (may be empty)
│   └── ...
├── src/              Implementation
├── data/             Game data
├── media/            Screenshots / demos
└── tests/            Automated tests
```

## 4. Design Decisions Specific to `wargames`

*If any root defaults have been overridden for this game, they appear
as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to
root defaults.*

- *(No per-game overrides yet.)*

## 5. Gotchas & Non-Obvious Notes

- The program is a 52-line POSIX shell script, not a compiled C game.
- It hard-codes the launcher path `/usr/games/$x`.
- Input is sanitized with `sed 's/[^-a-z0-9]//g'` before lookup.
- If the requested game exists, the script `tput clear`s the screen
  and `exec`s the game, replacing the shell process entirely.
- If the game is not found, it prints the *WarGames* movie quote.
- Answering `wargames` itself can recursively relaunch the script.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original shell script lives in `BSDGames-master/wargames/` — do
  **not** commit it to this repo.
- Preserve the BSD copyright notice and original authorship where you
  transcribe logic from the original.
- List sources in [`docs/references.md`](./docs/references.md).
