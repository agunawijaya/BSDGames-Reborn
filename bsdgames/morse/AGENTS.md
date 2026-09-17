# AGENTS.md — `morse` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`morse`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Utility Is

- **Category:** Cryptography / Text-Transform
- **One-line description:** International Morse code encoder/decoder.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/morse>

## 2. Port Status

- **Current status:** 🟠 In Progress — documentation phase.
- **Owner:** Agun.
- **Baseline released?** No.

## 3. Folder Contents

```
morse/
├── README.md
├── AGENTS.md
├── CLAUDE.md
├── docs/
│   ├── decisions/
│   └── ...
├── src/
├── data/
├── media/
└── tests/
```

## 4. Design Decisions Specific to `morse`

*No per-game overrides yet.*

## 5. Gotchas & Non-Obvious Notes

- No original man page in upstream BSDGames source.
- Encoding ends with the SK prosign.
- Decode mode prints `x` for unknown tokens.

## 6. Workflow

Follow [`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives locally in `BSDGames-master/morse/` — do **not** commit it.
- List sources in [`docs/references.md`](./docs/references.md).
