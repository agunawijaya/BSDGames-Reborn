# AGENTS.md — `ppt` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`ppt`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Utility / Display Toy
- **One-line description:** Format text as 8-bit paper tape or decode it back.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/ppt>

## 2. Port Status

- **Current status:** 🟠 Docs done; awaiting language ADR
- **Owner:** Agun
- **Baseline released?** no

## 3. Folder Contents

```
ppt/
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

## 4. Design Decisions Specific to `ppt`

*If any root defaults have been overridden for this game, they appear
as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to
root defaults.*

- *(No per-game overrides yet.)*

## 5. Gotchas & Non-Obvious Notes

- Each output line represents one byte: `|` + 8 positions + `|`.
- Bit 2 (zero-indexed from the left) is always a feed hole `.`.
- Set bits are printed as `o`; unset bits as spaces.
- Decode mode `-d` reads ppt output from stdin and recovers the original bytes.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives locally — do **not** commit it to this
  repo.
- Preserve original BSD copyright/authorship as a comment where you
  transcribe algorithms from the original.
- List sources in [`docs/references.md`](./docs/references.md).
