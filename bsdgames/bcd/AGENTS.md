# AGENTS.md — `bcd` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`bcd`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Utility / Display Toy
- **One-line description:** Print text as vintage IBM punch cards.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/bcd>

## 2. Port Status

- **Current status:** 🟠 Docs done; awaiting language ADR
- **Owner:** Agun
- **Baseline released?** no

## 3. Folder Contents

```
bcd/
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

## 4. Design Decisions Specific to `bcd`

*If any root defaults have been overridden for this game, they appear
as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to
root defaults.*

- *(No per-game overrides yet.)*

## 5. Gotchas & Non-Obvious Notes

- The hole pattern table (`holes[256]`) uses the low 12 bits of each `u_short`; a `1` bit means a hole.
- Input is converted to uppercase before lookup.
- Lines are truncated to 48 characters.
- The original `Q`/`R` punch-code bug was fixed in 1993.
- The man page is shared with `ppt` and `morse`.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives locally — do **not** commit it to this
  repo.
- Preserve original BSD copyright/authorship as a comment where you
  transcribe algorithms from the original.
- List sources in [`docs/references.md`](./docs/references.md).
