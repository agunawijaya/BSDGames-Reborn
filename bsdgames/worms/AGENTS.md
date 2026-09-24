# AGENTS.md — `worms` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`worms`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Screensaver / Demo
- **One-line description:** Animate worms on a display terminal.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/worms>

## 2. Port Status

- **Current status:** 🟢 Released (2026-09-24). Canonical docs are complete and
  [`ports/fancy-web/`](./ports/fancy-web/) is Released.
- **Owner:** Agun (canonical docs); Agun (Claude) for `ports/fancy-web`
- **Baseline released?** yes

## 3. Folder Contents

```
worms/
├── README.md         Landing page for this game
├── AGENTS.md         This file
├── CLAUDE.md         Thin pointer to this file
├── docs/             14 documentation files (see README)
│   ├── decisions/    Per-game ADR overrides (may be empty)
│   └── ...
├── media/            Screenshots of the ORIGINAL program
├── ports/
│   └── fancy-web/    Abyssal Worms (see its AGENTS.md)
├── src/, tests/      Legacy pre-ADR-006 folders (empty; left in place)
└── data/             Game data (empty)
```

## 4. Design Decisions Specific to `worms`

*If any root defaults have been overridden for this game, they appear
as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to
root defaults.*

- *(No per-game overrides yet.)*

## 5. Gotchas & Non-Obvious Notes

- The program uses `curses` and expects a real terminal.
- Each worm has a fixed-length circular queue of positions; when the head moves, the tail is erased.
- Boundary tables (`normal`, `upper`, `left`, `right`, etc.) prevent worms from leaving the screen by restricting valid orientations at edges.
- The `-f` flag fills the screen with the text "WORM" before worms start crawling.
- The `-t` flag leaves a trail of `.` instead of erasing with spaces.
- Default delay is `0` (fast); use `-d` for a slower animation.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives locally — do **not** commit it to this
  repo.
- Preserve original BSD copyright/authorship as a comment where you
  transcribe algorithms from the original.
- List sources in [`docs/references.md`](./docs/references.md).
