# AGENTS.md — `arithmetic` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`arithmetic`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Puzzle & Word Games
- **One-line description:** Flash-card drill for simple arithmetic with
  adaptive question selection.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/arithmetic>

## 2. Port Status

- **Current status:** 🟠 In Progress — documentation done; awaiting
  language ADR.
- **Owner:** Agun (Kimi)
- **Baseline released?** no

## 3. Folder Contents

```
arithmetic/
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

## 4. Design Decisions Specific to `arithmetic`

*If any root defaults have been overridden for this game, they appear
as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to
root defaults.*

- *(No per-game overrides yet.)*

## 5. Gotchas & Non-Obvious Notes

- The program is interactive and reads answers from stdin.
- It loops forever until EOF or `SIGINT`; every 20 questions it prints
  statistics and waits for RETURN.
- The adaptive penalty system adds extra "tickets" for numbers you get
  wrong, gradually decaying as those numbers are selected again.
- Division problems include a random remainder so the answer is not
  always a clean integer; wait, no — the user is expected to give the
  integer quotient? Actually `left = right * result + random() % right`,
  so the displayed `left / right` has a remainder. The program expects
  `result` (the quotient), not the remainder. This is a deliberate
  design choice.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives in `BSDGames-master/arithmetic/` — do **not**
  commit it to this repo.
- Preserve the BSD copyright notice and original authorship where you
  transcribe logic from the original.
- List sources in [`docs/references.md`](./docs/references.md).
