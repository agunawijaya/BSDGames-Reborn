# `hangman` — Working Notes

> Free-form scratchpad for this game's port.

---

## Source quick facts

- Total original C: ~920 lines across 10 files.
- Uses curses (not raw termcap).
- Dictionary is not loaded into memory; random byte seek selects a word.
- 7 wrong guesses end the game.
- No persistent scores; averages are per-session.

## Decisions pending

- Target language / framework pending root language ADR.
- Whether to load dictionary into memory vs. preserve random-seek behavior — needs ADR if changed.
- Whether to keep 7-error limit as fixed constant or make it configurable — needs ADR if changed.

## Things to verify during implementation

- `getword()` retry loop terminates quickly even with short or invalid dictionaries.
- `readch()` handles EOF cleanly after Ctrl-D.
- `endwin()` is called on every exit path.
- Word length validation matches `Minlen`.

## Interesting observations

- The noose picture is drawn once and never updated.
- `endgame()` sets `Errors = MAXERRS + 2` on loss to force drawing the full body before revealing the word.
- The game has no setgid score file; it simply drops privileges at startup.
