# AGENTS.md — `pig` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`pig`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Utility Is

- **Category:** Cryptography / Text-Transform
- **One-line description:** English-to-Pig-Latin stream translator.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/pig>

## 2. Port Status

- **Current status:** 🟠 In Progress — documentation phase.
- **Owner:** Agun.
- **Baseline released?** No.

## 3. Folder Contents

```
pig/
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

## 4. Design Decisions Specific to `pig`

*No per-game overrides yet.*

## 5. Gotchas & Non-Obvious Notes

- No flags or options.
- Treats `qu` as a consonant unit.
- 1024-character word limit.

## 6. Workflow

Follow [`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives locally in `BSDGames-master/pig/` — do **not** commit it.
- List sources in [`docs/references.md`](./docs/references.md).
