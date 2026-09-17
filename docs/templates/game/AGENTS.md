# AGENTS.md — `<GAME>` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`<GAME>`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** [Adventure & RPG / Board / Card / ... (from `catalog.md`)]
- **One-line description:** [copy from `catalog.md`]
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/<GAME>>

## 2. Port Status

- **Current status:** [🔴 / 🟡 / 🟠 / 🟢 / ✨] — mirror
  [`../../docs/progress.md`](../../docs/progress.md).
- **Owner:** [name / "unclaimed"]
- **Baseline released?** [yes / no]

## 3. Folder Contents

```
<GAME>/
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

## 4. Design Decisions Specific to `<GAME>`

*If any root defaults have been overridden for this game, they appear
as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to
root defaults.*

- [Link and one-line summary for each per-game ADR.]
- *(No per-game overrides yet.)*

## 5. Gotchas & Non-Obvious Notes

*Things a stranger to this game folder would not know from reading
the code alone. Fill during porting.*

- ...
- ...

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives locally — do **not** commit it to this
  repo.
- Preserve original BSD copyright/authorship as a comment where you
  transcribe algorithms from the original.
- List sources in [`docs/references.md`](./docs/references.md).
