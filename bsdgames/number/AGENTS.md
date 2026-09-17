# AGENTS.md — `number` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`number`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Utility / Text
- **One-line description:** Convert decimal numbers into English words.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/number>

## 2. Port Status

- **Current status:** 🟠 Docs done; awaiting language ADR
- **Owner:** Agun
- **Baseline released?** no

## 3. Folder Contents

```
number/
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

## 4. Design Decisions Specific to `number`

*If any root defaults have been overridden for this game, they appear
as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to
root defaults.*

- *(No per-game overrides yet.)*

## 5. Gotchas & Non-Obvious Notes

- The `-l` flag switches output to a single-line format without sentence punctuation.
- Input is limited to `MAXNUM` (65) digits for both the integer and fractional parts.
- Negative numbers are accepted and prefixed with "minus".
- Decimal fractions are pronounced as tenths, hundredths, thousandths, etc.
- Multiple inputs are separated by `...` in non-line mode.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives locally — do **not** commit it to this
  repo.
- Preserve original BSD copyright/authorship as a comment where you
  transcribe algorithms from the original.
- List sources in [`docs/references.md`](./docs/references.md).
