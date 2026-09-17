# AGENTS.md — `fish` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`fish`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Card Games
- **One-line description:** Terminal implementation of the card game
  Go Fish against the computer.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/fish>

## 2. Port Status

- **Current status:** 🟠 In Progress — documentation done; awaiting
  language ADR.
- **Owner:** Agun (Kimi)
- **Baseline released?** no

## 3. Folder Contents

```
fish/
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

## 4. Design Decisions Specific to `fish`

*If any root defaults have been overridden for this game, they appear
as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to
root defaults.*

- *(No per-game overrides yet.)*

## 5. Gotchas & Non-Obvious Notes

- The original is a C program using `fork()` + a pager to display
  instructions from `fish.instr`.
- Paths to the instruction file come from `pathnames.h.in` and are
  replaced at install time.
- The computer has two modes: normal (cycles ranks) and pro (`-p`),
  which uses the player's previous asks and hand-size heuristics.
- The game ends when one hand is empty; books are compared to decide
  the winner.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives in `BSDGames-master/fish/` — do **not**
  commit it to this repo.
- Preserve the BSD copyright notice and original authorship where you
  transcribe logic from the original.
- List sources in [`docs/references.md`](./docs/references.md).
