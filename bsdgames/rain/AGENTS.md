# AGENTS.md — `rain` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`rain`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Screensaver / Demo
- **One-line description:** Animated raindrops display using curses.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/rain>

## 2. Port Status

- **Current status:** 🟠 Docs done; awaiting language ADR
- **Owner:** Agun
- **Baseline released?** no

## 3. Folder Contents

```
rain/
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

## 4. Design Decisions Specific to `rain`

*If any root defaults have been overridden for this game, they appear
as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to
root defaults.*

- *(No per-game overrides yet.)*

## 5. Gotchas & Non-Obvious Notes

- The program uses `curses` and expects a real terminal.
- The `-d` delay is in milliseconds (converted to microseconds internally).
- Default delay is `0`, which can be too fast on modern terminals; `-d 120` is recommended.
- The animation is stopped by sending `SIGHUP`, `SIGINT`, or `SIGTERM`.
- The program draws a trail of characters (`.`, `o`, `O`, `-`, `|`) to simulate expanding and fading raindrops.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives locally — do **not** commit it to this
  repo.
- Preserve original BSD copyright/authorship as a comment where you
  transcribe algorithms from the original.
- List sources in [`docs/references.md`](./docs/references.md).
