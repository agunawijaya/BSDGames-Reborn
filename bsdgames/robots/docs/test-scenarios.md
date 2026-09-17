# `robots` — Manual Test Scenarios

> Human-executable playthrough scripts. For anything unit tests
> can't easily cover: `curses` UI, real-time, RNG, animation.

Automated tests live under `../tests/`. This file is for the human
eye.

---

## Test Environment

- **Terminal:** minimum 80×24, recommended 100×30+.
- **Platform:** Windows (primary dev), Linux, macOS.
- **Build:** *(TBD — depends on chosen language)*

## Smoke & Regression Suite

### T-01 — Startup and quit

**Setup:** Fresh install; no score file.
**Steps:**
1. Launch `robots` with no arguments.
2. Observe: 10 robots (`+`), player (`@`), empty grid.
3. Press `q`.
**Expected:** Clean exit; terminal restored.

### T-02 — Score file created on first run

**Setup:** No pre-existing score file.
**Steps:**
1. Launch `robots`.
2. Immediately press `q`.
3. Check that score file exists at configured path.
**Expected:** File exists, empty or with header.

### T-03 — Basic movement

**Setup:** Standard game.
**Steps:**
1. Press `l` (right).
2. Observe: player moves right by 1; robots move 1 toward new
   player position.
3. Press `h`, `k`, `j`, `y`, `u`, `b`, `n` in turn.
**Expected:** Each direction moves player 1 square accordingly;
robots respond each turn.

### T-04 — Boundary clamp

**Setup:** Move player to the top-left corner.
**Steps:**
1. Press `h` (further left).
2. Press `k` (further up).
**Expected:** Player does not leave the field; move is a no-op (or
visibly clamped).

### T-05 — Robot collision

**Setup:** Force two robots to be adjacent along the axis toward
the player (use debug seed if available; or observe naturally).
**Steps:**
1. Move so both robots would land on the same cell next turn.
**Expected:** Two robots converge; both become one `*` scrap heap
(single `*` visible); score +20 (2 × 10).

### T-06 — Robot into scrap

**Setup:** After T-05, an existing scrap heap.
**Steps:**
1. Move so a third robot's next-step lands on the heap.
**Expected:** Third robot becomes part of heap; score +10.

### T-07 — Level clear

**Setup:** Play a level. Get all robots killed.
**Expected:** Player advances to Level 2 with 20 robots (or 40 if
already at cap).

### T-08 — Death

**Setup:** Any level.
**Steps:**
1. Move deliberately onto a robot.
**Expected:** Message: `AARRrrgghhhh....`. Game shows score
summary. Prompts for another game.

### T-09 — Teleport

**Setup:** Standard game.
**Steps:**
1. Press `t`.
**Expected:** Player disappears from current position, appears at a
random empty cell.

### T-10 — Wait command

**Setup:** Level with 3–5 robots and existing scrap.
**Steps:**
1. Position self so all remaining robots' paths pass through
   scrap.
2. Press `w`.
**Expected:** Player does not move; robots move autonomously each
tick; observe scoring updates including a "Wait bonus" at level
clear.

### T-11 — Auto-teleport mode

**Setup:** Launch with `robots -t`.
**Steps:**
1. Play until robots would corner you.
2. Move into an unavoidable-death position.
**Expected:** Instead of dying, player is automatically teleported.

### T-12 — Advance mode

**Setup:** Launch with `robots -a`.
**Expected:** Level starts at 4 (not 1); score shows +600 advance
bonus.

### T-13 — Auto-bot mode

**Setup:** Launch with `robots -A`.
**Expected:** Game plays itself; each turn animates without user
input.

### T-14 — Score screen

**Setup:** After death.
**Expected:** Score list displayed; new high score highlighted if
achieved.

## RNG Determinism (Port-Specific)

### R-01 — Reproducible seed

**Setup:** Port supports `--seed <n>` (added feature; see
`port-ideas.md`).
**Steps:**
1. Run `robots --seed 42`, note initial layout.
2. Run again with `--seed 42`.
**Expected:** Identical initial layout.

### R-02 — Replay from log

**Setup:** Port supports move logging.
**Steps:**
1. Play a full game; log inputs.
2. Replay from log.
**Expected:** Same final state.

## Regression from Bugs

*As bugs are fixed, add scenarios that reproduce them so they
don't regress.*

*(None yet — port not started.)*

## Sign-off Template

```
- [ ] T-01 startup and quit
- [ ] T-02 score file created
- [ ] T-03 basic movement
- [ ] T-04 boundary clamp
- [ ] T-05 robot collision
- [ ] T-06 robot into scrap
- [ ] T-07 level clear
- [ ] T-08 death and score screen
- [ ] T-09 teleport
- [ ] T-10 wait command
- [ ] T-11 auto-teleport
- [ ] T-12 advance mode
- [ ] T-13 auto-bot mode
- [ ] T-14 score screen
- [ ] R-01 seed reproducibility
- [ ] R-02 replay from log

Tested by: [name]
Date: YYYY-MM-DD
Build: [commit hash]
```
