# `snake` — Manual Test Scenarios

---

## Test Environment

- Terminal: 24×80 minimum, larger recommended.
- Build: *(TBD)*

## Smoke & Regression Suite

### T-01 — Startup and quit

**Steps:**
1. Launch `snake`.
2. Press `x`.
**Expected:** Clean exit; no score recorded.

### T-02 — Small field via flags

**Steps:**
1. Launch `snake -w 20 -l 10`.
**Expected:** Field is 20 columns × 10 lines.

### T-03 — Field too small

**Steps:**
1. Launch `snake -w 3 -l 3`.
**Expected:** Error: "screen too small for a fair game." Exit.

### T-04 — Move player

**Steps:**
1. Launch `snake`.
2. Press `l` (right).
**Expected:** `I` moves right; snake head moves one step toward
you.

### T-05 — Collect money

**Steps:**
1. Navigate onto the `$`.
**Expected:** Score increases by `chunk`; new `$` appears
elsewhere (not on exit, not on you, not in status area).

### T-06 — Reach exit

**Steps:**
1. Navigate onto the `#`.
**Expected:** Game ends with score display. `cashvalue = chunk ×
loot / 25`. Bonus-digit prompt displayed.

### T-07 — Get eaten

**Steps:**
1. Move toward the snake.
2. Let it catch you.
**Expected:** Death message; score = 0.

### T-08 — Long move (uppercase)

**Steps:**
1. Note money's column and your column.
2. Press `L` (uppercase L).
**Expected:** Player moves right *once* toward money's column
(actually: moves the full distance in one command, but snake
gets a corresponding number of turns).

### T-09 — Edge jump

**Steps:**
1. Press `P` (right edge).
**Expected:** Player at right-most legal column.

### T-10 — Spacewarp

**Steps:**
1. Note current score / loot.
2. Press `w`.
**Expected:** Player teleports to a random empty cell. Penalty
increases by 10% of current loot.

### T-11 — Point hint

**Steps:**
1. Press `p`.
**Expected:** A directional hint character appears briefly.

### T-12 — Bonus digit

**Steps:**
1. Play a game to completion (reach exit).
2. Note last digit of score.
**Expected:** A single digit is displayed; if it matches, bonus
applied.

### T-13 — `snscore` sub-tool

**Steps:**
1. After playing several games (some ending at exit).
2. Run `snscore`.
**Expected:** List of top scores by user.

### T-14 — Repeat with digit prefix

**Steps:**
1. Press `5`, then `l`.
**Expected:** Player moves right up to 5 times (subject to walls
and snake proximity); snake responds each time.

### T-15 — Slow-terminal mode

**Steps:**
1. Launch `snake -t`.
2. Play a few moves.
**Expected:** No intermediate frames; only final positions shown.

## RNG Determinism (Port-Specific)

### R-01 — Seed reproducibility

**Setup:** Port supports `--seed <n>`.
**Steps:**
1. Two runs with `--seed 42`.
**Expected:** Identical initial placement of player, money, exit,
snake.

### R-02 — Money placement rules

**Steps:**
1. Manoeuvre so player, exit, and status area are on the "obvious"
   money slot.
2. Collect several `$`s.
**Expected:** New money never appears on you, the exit, or the
status area.

## Sign-off Template

```
- [ ] T-01 startup and quit
- [ ] T-02 small field
- [ ] T-03 field too small
- [ ] T-04 move player
- [ ] T-05 collect money
- [ ] T-06 reach exit
- [ ] T-07 get eaten
- [ ] T-08 long move
- [ ] T-09 edge jump
- [ ] T-10 spacewarp
- [ ] T-11 point hint
- [ ] T-12 bonus digit
- [ ] T-13 snscore
- [ ] T-14 repeat prefix
- [ ] T-15 slow-terminal mode
- [ ] R-01 seed reproducibility
- [ ] R-02 money placement rules

Tested by: [name]
Date: YYYY-MM-DD
Build: [commit hash]
```
