# `tetris` fancy-web — Diff Log

This log records what was kept, changed, added, or removed when moving from the canonical BSD `tetris` spec to this fancy-web port.

## What Was Kept

- The seven tetromino shapes (I, O, T, S, Z, J, L).
- The 10-wide × 20-high well as the default board size.
- The core loop: spawn → move/rotate/drop → lock → clear lines → repeat.
- Gravity as the main pressure.
- Line-clear scoring bonus (single/double/triple/Tetris).
- Single-keystroke, immediate controls.
- The ability to restart immediately after game over.

## What Was Changed

- **Rotation system:** replaced the original single counter-clockwise rotation with clockwise/counter-clockwise rotation plus a basic wall kick. This removes the frustration of failed rotations near walls while keeping the shapes identical.
- **Randomizer:** replaced `random() % 7` with a 7-bag randomizer to avoid long piece droughts.
- **Speed curve:** gravity now scales by level (derived from lines cleared) rather than the original continuous `faster()` curve.
- **Scoring:** added multipliers for line clears and soft/hard drop bonuses.

## What Was Added

- **Non-rectangular board presets:** Canyon, Split, Hourglass, Donut, Staircase, Tower, and Wide Well (see ADR `001-custom-board-shapes.md`).
- **Custom board dimensions:** players can set width and height directly from the settings screen.
- **Starting garbage stack:** configurable height and hole density (see ADR `002-survival-garbage.md`).
- **Survival mode:** periodic garbage rows rise from the bottom (see ADR `002-survival-garbage.md`).
- **Next-piece preview:** a small side panel shows the upcoming tetromino.
- **Ghost piece:** a transparent outline shows where the current piece will land.
- **On-screen touch controls:** auto-appear on narrow screens for mobile play.
- **Lock delay:** a short grace period after landing before the piece locks.
- **Pause overlay.**
- **Smoke-test suite:** headless Node tests covering engine logic.

## What Was Removed

- Terminal/curses rendering.
- The original high-score file system (setgid/flock).
- The original preview flag (`-p`) is replaced by an always-on next-piece preview.

## Open Questions / Future Work

- Finalize visual polish and capture port-specific screenshots.
- Add a hold-piece slot.
- Add a longer next queue (2–5 pieces).
- Add Sprint / Time Attack modes.
- Deploy to a live static host.
