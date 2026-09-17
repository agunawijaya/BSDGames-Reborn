# AGENTS.md — `banner` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`banner`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Utility / Display Toy
- **One-line description:** Print large ASCII banners.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/banner>

## 2. Port Status

- **Current status:** 🟠 Docs done; awaiting language ADR
- **Owner:** Agun
- **Baseline released?** no

## 3. Folder Contents

```
banner/
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

## 4. Design Decisions Specific to `banner`

*If any root defaults have been overridden for this game, they appear
as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to
root defaults.*

- *(No per-game overrides yet.)*

## 5. Gotchas & Non-Obvious Notes

- The glyph data is stored in a single large byte array (`data_table`, ~9 KB) with a run-length encoding scheme.
- Default output width is 132 columns; `-w` scrunches it down for narrower terminals.
- Several characters are not defined: `< > [ ] \ ^ _ { } | ~`.
- `-d` and `-t` flags are accepted but their exact effect depends on the specific BSD variant.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives locally — do **not** commit it to this
  repo.
- Preserve original BSD copyright/authorship as a comment where you
  transcribe algorithms from the original.
- List sources in [`docs/references.md`](./docs/references.md).
