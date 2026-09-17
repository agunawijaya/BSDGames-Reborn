# `tetris` — Diff Log

> Feature-by-feature log of what changes from the original BSD `tetris`
> to this port. Updated as the port progresses.

---

## Documentation Phase (current)

### Preserved from the original

- 10×20 visible playfield with 1-D sentinel-walled board representation.
- Seven tetromino shapes and their rotations.
- Single counterclockwise rotation (for the faithful port variant).
- Default key mapping `j`/`k`/`l`/space/`p`/`q`.
- Level range 1–9 and `final score = raw score × level`.
- Flat scoring: +1 per lock, +1 per drop row.
- Continuous acceleration via `faster()`.
- Uniform random piece selection (`random() % 7`).
- High-score file with per-user/per-level limits and 5-year expiration.

### Changed / modernized (planned)

- Rendering: raw termcap → modern TUI library or HTML5 canvas/WebGL.
- Input: fixed default keys → remappable keys, plus optional mouse/touch/controller.
- Rotation: single CCW → likely SRS with CW/CCW and wall kicks (pending ADR).
- Randomizer: `random() % 7` → likely 7-bag (pending ADR).
- Scoring: flat → likely line-clear bonuses (pending ADR).
- Preview: opt-in `-p` → always-on next queue, with optional hold/ghost pieces.
- Persistence: setgid score file → user-owned local file or cloud leaderboard.
- Multiplayer: none → optional local/online versus mode.

### Removed

- Setgid privilege model; replaced by user-scoped or cloud persistence.
- `/dev/null` descriptor sanity check (no longer relevant in modern runtime).

### Added

- Hold queue, ghost piece, lock delay (modernization).
- Replay files and leaderboards.
- Accessibility options (screen-reader mode, colorblind shapes, timing tuning).
- Multiple game modes (Marathon, Sprint, Ultra, challenges).

## Implementation Phase

*To be filled once coding begins.*
