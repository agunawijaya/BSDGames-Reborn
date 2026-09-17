# AGENTS.md — `random` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`random`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Utility / Filter
- **One-line description:** Randomly select lines from stdin or return a random exit code.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/random>

## 2. Port Status

- **Current status:** 🟠 Docs done; awaiting language ADR
- **Owner:** Agun
- **Baseline released?** no

## 3. Folder Contents

```
random/
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

## 4. Design Decisions Specific to `random`

*If any root defaults have been overridden for this game, they appear
as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to
root defaults.*

- *(No per-game overrides yet.)*

## 5. Gotchas & Non-Obvious Notes

- The default denominator is `2`, meaning each line has a 50% chance of being printed.
- The `-e` flag changes behaviour entirely: no I/O, just a random exit code.
- The `-r` flag forces unbuffered output, useful for pipelines and live logs.
- Seeding uses `gettimeofday()` plus `getpid()`, so two rapid runs may still differ.
- Output probabilities are independent per line; there is no guarantee on total count.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives locally — do **not** commit it to this
  repo.
- Preserve original BSD copyright/authorship as a comment where you
  transcribe algorithms from the original.
- List sources in [`docs/references.md`](./docs/references.md).
