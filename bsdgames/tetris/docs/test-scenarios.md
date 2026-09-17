# `tetris` — Manual Test Scenarios

> Human-executable playthrough scripts. For anything unit tests
> can't easily cover: terminal UI, real-time timing, RNG, and
> high-score persistence. Run these before releases.
>
> Automated tests live under [`../tests/`](../tests/). This file is for
> the human eye.

---

## Test Environment

- **Terminal:** minimum 80×24, recommended 80×30 or larger.
- **Platform:** Linux / macOS / Windows with a POSIX-like terminal (WSL2, Git Bash, Windows Terminal).
- **Build:** build the port according to the root language ADR (pending) and the per-game `README.md`.

## Regression Suite

Run these before every release.

### T-01 — Smoke test

**Setup:** Fresh install; no existing high-score file (or a backup copy).
**Steps:**
1. Launch `tetris` with no arguments.
2. Observe that the game starts in a valid state: an empty well, a falling piece, and a key reminder at the bottom.
3. Press the quit key (default `q`).
4. Observe clean exit and terminal restored to sane state.
**Expected:** No crash; terminal cursor and echo restored; prompt returns.

### T-02 — Basic gameplay

**Setup:** Launch with `tetris -l 1`.
**Steps:**
1. Move the first piece left and right (default `j`/`l`) to confirm movement boundaries.
2. Rotate the piece (default `k`) at least once against a wall and once in open space.
3. Let a piece fall naturally to the bottom.
4. Drop a piece with the drop key (default `<space>`).
5. Fill a complete horizontal row and confirm it clears.
**Expected:** Movement stops at walls; rotation fails when blocked; drop locks the piece and awards drop-distance points; completed row vanishes and rows above shift down.

### T-03 — Game over

**Setup:** Launch with `tetris -l 9` or play until the stack reaches the top.
**Steps:**
1. Stack pieces until a new spawn cannot fit.
2. Confirm the game ends.
3. Confirm final score is shown as `raw score × level`.
**Expected:** Game loop exits, screen clears, score prints, high-score list displays.

### T-04 — Pause and resume

**Setup:** Launch with `tetris -l 1`.
**Steps:**
1. Start a game.
2. Press pause (default `p`).
3. Confirm the game freezes.
4. Press `RETURN`/`Enter` to resume.
5. Confirm gameplay continues from the same state.
**Expected:** Piece does not fall while paused; timer does not advance; resume restores play cleanly.

### T-05 — Custom keys

**Setup:** Terminal with a shell.
**Steps:**
1. Launch with `tetris -k 'asdwqz'` (left, rotate, right, drop, pause, quit).
2. Verify the key reminder at the bottom shows the custom keys.
3. Use each custom key in-game.
**Expected:** All six custom keys work as mapped.

### T-06 — Next-piece preview

**Setup:** Launch with `tetris -p`.
**Steps:**
1. Observe the preview area showing the next piece.
2. Lock the current piece.
3. Confirm the previewed piece becomes the active piece and a new preview appears.
**Expected:** Preview updates consistently; no visual glitches when the preview shape is the same as the active shape.

## Feature-Specific Scenarios

### F-01 — High-score persistence

**Setup:** Ensure a writable score file location is configured.
**Steps:**
1. Play a game and achieve a non-zero score.
2. Exit to the high-score list.
3. Launch `tetris -s`.
**Expected:** The score appears in the list, ranked by `level × score`. Highest score per level is marked with `*`.

### F-02 — RNG distribution

**Setup:** Not manually testable in one run, but automated tests can sample many runs.
**Steps (for QA script):**
1. Run 1,000 spawns.
2. Count occurrences of each base shape.
**Expected:** Each of the 7 shapes appears approximately 1/7 of the time. (The port may later use a 7-bag; update this scenario when that ADR is decided.)

### F-03 — Terminal resize / redraw

**Setup:** Launch in a resizable terminal emulator.
**Steps:**
1. Start a game.
2. Resize the terminal smaller and larger.
3. Press `Ctrl-L` (or the port's redraw key).
**Expected:** Screen redraws without crashing; layout adapts within minimum bounds.

## Multiplayer Scenarios

N/A for the original game. If the port adds versus mode, add scenarios here.

## Regression from Bugs

*As bugs are fixed, add a scenario that reproduces the bug so it
 doesn't regress.*

### R-YYYYMMDD — [bug slug]

Bug reference: [issue link]  
Repro steps: ...  
Expected after fix: ...

## Sign-off Template

Once all scenarios pass:

```
- [ ] T-01 smoke
- [ ] T-02 basic gameplay
- [ ] T-03 game over
- [ ] T-04 pause and resume
- [ ] T-05 custom keys
- [ ] T-06 next-piece preview
- [ ] F-01 high-score persistence
- [ ] F-02 RNG distribution (automated or sampled)
- [ ] F-03 terminal resize / redraw
Tested by: [name]
Date: YYYY-MM-DD
Build: [commit hash]
```
