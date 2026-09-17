# `tetris` — Working Notes

> Free-form scratchpad for this game's port.

---

## Source quick facts

- Total original C: ~1,900 lines across 5 `.c` files + headers.
- No curses dependency; uses raw termcap.
- Board is a 1-D byte array with sentinel walls.
- Rotation is table-driven, not matrix-driven.
- Score file uses setgid + `flock()`.

## Decisions pending

- Target language / framework pending root language ADR.
- Rotation system for port (SRS vs. original single-CCW) — needs per-game ADR.
- Scoring model (modern line bonuses vs. original flat) — needs per-game ADR.
- Whether to preserve continuous `faster()` acceleration — needs per-game ADR.

## Things to verify during implementation

- `fits_in()` and `place()` must remain perfectly inverse.
- Frame differencing renderer must update `curscreen[]` correctly on every state change.
- High-score file locking and privilege handling must be replicated or replaced by a safe modern equivalent.
- Terminal restore on abnormal exit (signal handling) must be robust.

## Interesting observations

- The `/dev/null` descriptor check is unusual; the port may remove it or keep it as a historical curiosity.
- Preview (`-p`) was a later addition — the original contest entry had no preview.
- The man page's honest bug line ("higher levels are unplayable without a fast terminal connection") is a charming historical artifact.
