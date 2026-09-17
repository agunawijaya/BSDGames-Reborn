# `hangman` — Diff Log

> Feature-by-feature log of what changes from the original BSD `hangman`
> to this port. Updated as the port progresses.

---

## Documentation Phase (current)

### Preserved from the original

- Single-player letter-guessing against a hidden word.
- 7 wrong guesses allowed (`MAXERRS = 7`).
- ASCII gallows and table-driven body parts.
- Dictionary file as the word source.
- Minimum word length option (`-m`).
- Custom dictionary option (`-d`).
- curses-based terminal UI.
- Running average of errors per word.

### Changed / modernized (planned)

- Rendering: curses → modern TUI library or web UI.
- Dictionary selection: random file seek → likely load-into-memory for uniform selection (pending ADR).
- Difficulty: implicit word-length knob → explicit Easy/Medium/Hard modes.
- Visuals: static ASCII → animated figure, color feedback, on-screen keyboard.
- Persistence: none → session stats, streaks, optional cloud sync.
- Multiplayer: none → optional local/online modes.

### Removed

- Setgid privilege model (the original only revokes setgid at startup).

### Added

- Difficulty tiers, themed word packs, daily word.
- Hint system and keyboard visual feedback.
- Accessibility options (screen-reader mode, high contrast).

## Implementation Phase

*To be filled once coding begins.*
