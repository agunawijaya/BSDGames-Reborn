# AGENTS.md — `factor` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`factor`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Utility / Mathematics
- **One-line description:** Factor integers into primes.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/factor>

## 2. Port Status

- **Current status:** 🟠 Docs done; awaiting language ADR
- **Owner:** Agun
- **Baseline released?** no

## 3. Folder Contents

```
factor/
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

## 4. Design Decisions Specific to `factor`

*If any root defaults have been overridden for this game, they appear
as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to
root defaults.*

- *(No per-game overrides yet.)*

## 5. Gotchas & Non-Obvious Notes

- The original supports two build modes: with OpenSSL (Pollard p−1 for large primes) and without (trial division up to the prime table limit).
- Negative numbers are explicitly rejected with `negative numbers aren't permitted.`
- `0` is a historical quirk: `pr_fact()` silently exits the program when given `0`.
- The prime table covers all primes up to `65537`, which is sufficient to factor any 32-bit integer by trial division.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives locally — do **not** commit it to this
  repo.
- Preserve original BSD copyright/authorship as a comment where you
  transcribe algorithms from the original.
- List sources in [`docs/references.md`](./docs/references.md).
