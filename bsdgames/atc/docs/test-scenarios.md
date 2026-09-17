# `atc` — Manual Test Scenarios

> Human-executable playthrough scripts for validating gameplay,
> the command parser, the real-time tick loop, and playfield DSL
> loading.

Automated tests live under `../tests/`. This file is for the
human eye.

---

## Test Environment

- **Terminal:** 80×24 minimum, 100×30 recommended.
- **Platform:** Linux / WSL2 (primary), macOS.
- **Build:** *(TBD — depends on chosen language)*.

## Smoke & Regression Suite

### T-01 — Startup and clean quit

**Setup:** Fresh install, no prior state.
**Steps:**
1. Launch `atc` with no arguments.
2. Observe radar + info + input + author regions render.
3. Send `SIGINT` (Ctrl-C).

**Expected:** Clean exit, terminal restored, score file updated with
0 planes safe if any were spawned.

### T-02 — CLI: list games

**Steps:**
1. `atc -l`
**Expected:** Prints all 17 playfields; exits 0. First line is the
default game.

### T-03 — CLI: show scores

**Steps:**
1. `atc -s`
**Expected:** Prints scoreboard (may be empty); exits 0.

### T-04 — CLI: unknown game → test mode

**Steps:**
1. `atc -g does_not_exist`
**Expected:** Warning: game not found; test mode; scoring disabled;
game still runs from local file if present, else exits.

### T-05 — Fresh game: first plane spawn

**Steps:**
1. Launch `atc -g default`.
2. Observe info panel: exactly 1 plane.

**Expected:** Plane at altitude 7 (or 0 if from airport) at valid
origin coordinates. Fuel = width + height = 51.

### T-06 — Manual tick fast-forward

**Steps:**
1. Fresh game.
2. Press Enter with no command.
3. Observe Time increment.

**Expected:** Time increments by 1 per Enter press. Plane positions
update between screenshots.

### T-07 — Send valid altitude command

**Steps:**
1. Fresh game with plane `a` at altitude 7.
2. Type `aa9` then Enter (plane A, altitude 9).

**Expected:** Info line for plane a shows target 9 in command
column. Two ticks later, altitude is 9.

### T-08 — Send valid turn command

**Steps:**
1. Fresh game.
2. Type `atld` then Enter (plane A, turn to direction d = east).

**Expected:** Info shows turn command; plane direction changes by ≤2
per tick.

### T-09 — Command completion (`?`)

**Steps:**
1. Fresh game.
2. Type `a?`.

**Expected:** Screen (or side region) prints list of valid next
characters after `a<plane>`. Typically the command letters (a, m,
i, u, c, t).

### T-10 — Invalid command → error underline

**Steps:**
1. Fresh game.
2. Type `azz` then Enter.

**Expected:** Offending token underlined; error message under input
line; command not applied.

### T-11 — Successful exit (win a plane)

**Setup:** Plane a going to Exit 3.
**Steps:**
1. `aa9` — set altitude 9.
2. Wait for altitude to reach 9.
3. `atte3` — turn toward exit 3.
4. Wait until plane reaches exit position.

**Expected:** Plane vanishes; Safe count += 1; info panel no longer
lists plane a.

### T-12 — Collision

**Steps:**
1. Find or wait for 2 planes at similar altitudes.
2. Direct one plane toward the other.
3. Wait until they occupy adjacent cells at similar altitude.

**Expected:** Game over with "collided with plane 'X'." message.
Score saved.

### T-13 — Wrong-direction landing

**Setup:** Plane b going to Airport 0 (facing north = ^).
**Steps:**
1. Descend to 0 (`ba0`).
2. Turn to south (`bts`) — deliberately wrong.
3. Wait for landing.

**Expected:** Game over with "landed in the wrong direction."

### T-14 — Wrong altitude at exit

**Setup:** Plane at exit position at altitude ≠ 9.
**Steps:**
1. Push plane out at altitude 7 (`ttea<n>` without altitude change).

**Expected:** Game over with "exited at the wrong altitude."

### T-15 — Empty command Enter fast-forward

**Steps:**
1. Fresh game.
2. Press Enter 5 times in quick succession.

**Expected:** Time advances by 5 ticks; timer resets between
tricks; no signal-timing corruption.

### T-16 — SIGTSTP ignored

**Steps:**
1. Fresh game.
2. Press Ctrl-Z.

**Expected:** Nothing happens. Game continues. Terminal not
backgrounded.

### T-17 — Custom playfield

**Setup:** Write `games/mytest` with valid syntax.
**Steps:**
1. `atc -g mytest`

**Expected:** Warning "game not found in Game_List"; test mode;
game runs; scores not logged.

### T-18 — Playfield syntax error

**Setup:** Introduce syntax error in a playfield (e.g. `width = ;`).
**Steps:**
1. `atc -g broken`

**Expected:** yacc error message, game fails to launch.

### T-19 — Prop vs jet timing

**Setup:** Playfield with both types present.
**Steps:**
1. Observe plane movements over 10 ticks.

**Expected:** Uppercase (prop) planes move on even ticks only.
Lowercase (jet) planes move every tick.

### T-20 — Fuel exhaustion

**Setup:** Small playfield (fuel = width + height, small = fast).
**Steps:**
1. Leave a plane circling until fuel depletes.

**Expected:** Game over with "ran out of fuel."

## Sign-off Template

```
- [ ] T-01 startup and clean quit
- [ ] T-02 CLI list games
- [ ] T-03 CLI show scores
- [ ] T-04 CLI unknown game → test mode
- [ ] T-05 fresh game first plane spawn
- [ ] T-06 manual tick fast-forward
- [ ] T-07 valid altitude command
- [ ] T-08 valid turn command
- [ ] T-09 command completion `?`
- [ ] T-10 invalid command error
- [ ] T-11 successful exit
- [ ] T-12 collision
- [ ] T-13 wrong-direction landing
- [ ] T-14 wrong altitude at exit
- [ ] T-15 empty command Enter fast-forward
- [ ] T-16 SIGTSTP ignored
- [ ] T-17 custom playfield
- [ ] T-18 playfield syntax error
- [ ] T-19 prop vs jet timing
- [ ] T-20 fuel exhaustion

Tested by: [name]
Date: YYYY-MM-DD
Build: [commit hash]
Playfields covered: [list]
```

## Regression from Bugs

*As bugs are discovered and fixed, add scenarios that reproduce
each so they don't regress.*

*(None yet — port not started.)*
