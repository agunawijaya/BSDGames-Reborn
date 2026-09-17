# AGENTS.md — `countmail` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`countmail`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Fun / Info
- **One-line description:** Count your mail and loudly announce the
  total in all-caps English.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/countmail>

## 2. Port Status

- **Current status:** 🟠 In Progress — documentation done; awaiting
  language ADR.
- **Owner:** Agun (Kimi)
- **Baseline released?** no

## 3. Folder Contents

```
countmail/
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

## 4. Design Decisions Specific to `countmail`

*If any root defaults have been overridden for this game, they appear
as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to
root defaults.*

- *(No per-game overrides yet.)*

## 5. Gotchas & Non-Obvious Notes

- The original is a POSIX shell script, not a C program.
- It relies on the `from(1)` command to list mail headers and `wc(1)`
  to count them.
- The number-to-words converter handles groups of three digits and
  produces scales up to `SEPTILLION`.
- More than `SEPTILLION` messages causes the script to print *"YOU
  HAVE TOO MUCH MAIL!"* and exit with code `1`.
- Pluralisation is hand-coded: `ONE MAIL MESSAGE` vs `TWO MAIL
  MESSAGES`.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original shell script lives in `BSDGames-master/countmail/` — do
  **not** commit it to this repo.
- Preserve the BSD copyright notice and original authorship where you
  transcribe logic from the original.
- List sources in [`docs/references.md`](./docs/references.md).
