# AGENTS.md — `caesar` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`caesar`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Utility Is

- **Category:** Cryptography / Text-Transform
- **One-line description:** Caesar-cipher decoder using frequency analysis or explicit rotation.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/caesar>

## 2. Port Status

- **Current status:** 🟠 In Progress — documentation phase.
- **Owner:** Agun.
- **Baseline released?** No.

## 3. Folder Contents

```
caesar/
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

## 4. Design Decisions Specific to `caesar`

*No per-game overrides yet.*

## 5. Gotchas & Non-Obvious Notes

- Stateless Unix filter.
- Auto-detect mode uses hard-coded English letter frequencies.
- Explicit rotation mode applies ROT-N directly.

## 6. Workflow

Follow [`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives locally in `BSDGames-master/caesar/` — do **not** commit it.
- List sources in [`docs/references.md`](./docs/references.md).
