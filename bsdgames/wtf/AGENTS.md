# AGENTS.md — `wtf` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`wtf`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Cryptography / Text-Transform
- **One-line description:** Command-line acronym expander for chat and
  technical shorthand.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/wtf>

## 2. Port Status

- **Current status:** 🟠 In Progress — documentation done; awaiting
  language ADR.
- **Owner:** Agun (Kimi)
- **Baseline released?** no

## 3. Folder Contents

```
wtf/
├── README.md         Landing page for this game
├── AGENTS.md         This file
├── CLAUDE.md         Thin pointer to this file
├── docs/             14 documentation files (see README)
│   ├── decisions/    Per-game ADR overrides (may be empty)
│   └── ...
├── src/              Implementation
├── data/             Acronym database files
├── media/            Screenshots
└── tests/            Automated tests
```

## 4. Design Decisions Specific to `wtf`

*If any root defaults have been overridden for this game, they appear
as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to
root defaults.*

- *(No per-game overrides yet.)*

## 5. Gotchas & Non-Obvious Notes

- The original is a POSIX shell script (`wtf.in`), not a C program.
- The acronym database is plain text: `ACRONYM<TAB>expansion`.
- A second database, `acronyms.comp`, holds computer-related acronyms
  and is selected with `-t comp`.
- If `wtf` cannot find an acronym, it falls back to `whatis(1)`.
- The word `is` is accepted and ignored so that `wtf is WTF` reads
  naturally.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original shell script lives in `BSDGames-master/wtf/` — do **not**
  commit it to this repo.
- Preserve the public-domain notice and original authorship where you
  transcribe logic from the original.
- List sources in [`docs/references.md`](./docs/references.md).
