# AGENTS.md — `pom` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`pom`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Fun / Info
- **One-line description:** Display the current phase of the moon.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/pom>

## 2. Port Status

- **Current status:** 🟠 In Progress — documentation done; awaiting
  language ADR.
- **Owner:** Agun (Kimi)
- **Baseline released?** no

## 3. Folder Contents

```
pom/
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

## 4. Design Decisions Specific to `pom`

*If any root defaults have been overridden for this game, they appear
as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to
root defaults.*

- *(No per-game overrides yet.)*

## 5. Gotchas & Non-Obvious Notes

- The original is a small C program using `math.h` (`-lm`).
- Date parsing accepts a compressed string
  `[[[[[cc]yy]mm]dd]HH]` similar to `date(1)`.
- The algorithm is taken from *Practical Astronomy with Your
  Calculator* by Peter Duffett-Smith.
- It does not correct for the small difference between TDT and UTC
  (about one minute).

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives in `BSDGames-master/pom/` — do **not**
  commit it to this repo.
- Preserve the BSD copyright notice and original authorship where you
  transcribe logic from the original.
- List sources in [`docs/references.md`](./docs/references.md).
