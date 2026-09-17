# `trek` — Manual Test Scenarios

> Human-executable playthrough scripts for validating gameplay,
> command parsing, event scheduling, and difficulty scaling.

Automated tests live under `../tests/`. This file is for the
human eye.

---

## Test Environment

- **Terminal:** 80×24 minimum.
- **Platform:** Linux / WSL2 (primary), macOS.
- **Build:** *(TBD)*.

## Smoke & Regression Suite

### T-01 — Startup and length prompt

**Steps:**
1. Launch `trek`.
2. Observe `* * * S T A R T R E K * * *` banner.
3. Press Enter at "Press return to continue."

**Expected:** Prompt for game length (short/medium/long/restart).

### T-02 — Complete setup flow

**Steps:**
1. Type `short` at length prompt.
2. Type `novice` at skill prompt.
3. Type a password.

**Expected:** Mission briefing prints Klingon count, starbase
coordinates, phaser energy per kill.

### T-03 — Short-range scan

**Setup:** Fresh game at Command prompt.
**Steps:** Type `srscan` (or just `s`).

**Expected:** 10×10 sector map + status panel (stardate,
condition, position, warp, energy, torpedoes, shields, Klingons
left, time left, life support).

### T-04 — Long-range scan

**Steps:** Type `lrscan` (or `l`).

**Expected:** 3×3 grid of surrounding quadrants with Klingon /
base / star counts.

### T-05 — Command completion via `?`

**Steps:** Type `?` at Command prompt.

**Expected:** List of valid commands.

### T-06 — Ambiguous prefix

**Steps:** Type `s` at Command prompt.

**Expected:** Ambiguity between `srscan`, `shield`, `status` —
prompt for disambiguation.

### T-07 — Warp movement

**Steps:**
1. `warp 5`.
2. `move` with course and distance.

**Expected:** Enterprise moves; energy consumed; possibly new
quadrant entered; potentially attacked on arrival if Klingons.

### T-08 — Phaser attack

**Setup:** Enter a quadrant with Klingons.
**Steps:** `phasers automatic 500` (or manual).

**Expected:** Phaser fire message; Klingon damage or destruction;
counter-attack in `attack()`.

### T-09 — Torpedo attack

**Steps:** `torpedo <course>`.

**Expected:** Torpedo fires; hits target on trajectory; damage
reported.

### T-10 — Dock at starbase

**Setup:** Enterprise adjacent to `#` in current quadrant.
**Steps:** `dock`.

**Expected:** Condition changes to DOCKED; energy, torpedoes,
shields regenerated; devices repair over time.

### T-11 — Damage system

**Setup:** Take some hits.
**Steps:** `damages`.

**Expected:** List of 14 devices with repair times.

### T-12 — Cloaking device

**Steps:** `cloak up`.

**Expected:** Cloak on; energy drain per stardate.

### T-13 — Shields

**Steps:** `shields down`, then `shields up`.

**Expected:** Shield state toggles; energy cost when raised.

### T-14 — Emergency help

**Setup:** Take damage.
**Steps:** `help`.

**Expected:** "Starbase responds"; 3 rematerialization attempts;
if successful, dock at starbase.

### T-15 — Self-destruct

**Steps:** `destruct`, provide password.

**Expected:** L_DSTRCT loss condition; Klingons in adjacent
sectors killed.

### T-16 — Save and restart

**Steps:**
1. `dump savefile`.
2. `terminate`, `y` to another game.
3. At length prompt: `restart`, provide filename.

**Expected:** Game state restored to point of dump.

### T-17 — Klingon victory (win)

**Setup:** Novice short game, methodical Klingon hunting.
**Expected:** All Klingons destroyed; win screen; score computed.

### T-18 — Time exhaustion (lose)

**Setup:** Play very slowly.
**Expected:** L_NOTIME loss.

### T-19 — Energy exhaustion

**Setup:** Warp back and forth pointlessly.
**Expected:** L_NOENGY loss when energy < shupengy + stopengy.

### T-20 — Supernova death

**Setup:** Wait for `E_SNOVA` event in current quadrant.
**Expected:** L_SNOVA loss.

### T-21 — Warp 10

**Steps:** `warp 10`, then `move`.

**Expected:** L_TOOFAST loss.

### T-22 — Ram command

**Steps:** `ram` at course of adjacent Klingon.

**Expected:** Direct collision; damage to both.

### T-23 — Klingon surrender / capture

**Setup:** Damaged Klingon.
**Steps:** `capture`.

**Expected:** Klingon surrenders (probabilistic); captives added
to brig; `Game.captives` incremented.

### T-24 — Distress call handling

**Setup:** Wait for `E_ISSUE` event.

**Expected:** Message printed; if SSradio broken, event marked
E_HIDDEN.

### T-25 — Impulse engines

**Steps:** `impulse <course> <distance>`.

**Expected:** Slower than warp; less energy; same result.

## Sign-off Template

```
- [ ] T-01 startup and length prompt
- [ ] T-02 complete setup flow
- [ ] T-03 short-range scan
- [ ] T-04 long-range scan
- [ ] T-05 command completion `?`
- [ ] T-06 ambiguous prefix
- [ ] T-07 warp movement
- [ ] T-08 phaser attack
- [ ] T-09 torpedo attack
- [ ] T-10 dock at starbase
- [ ] T-11 damage system
- [ ] T-12 cloaking device
- [ ] T-13 shields
- [ ] T-14 emergency help
- [ ] T-15 self-destruct
- [ ] T-16 save and restart
- [ ] T-17 win (Klingon victory)
- [ ] T-18 lose (time)
- [ ] T-19 lose (energy)
- [ ] T-20 lose (supernova)
- [ ] T-21 lose (warp 10)
- [ ] T-22 ram command
- [ ] T-23 Klingon surrender
- [ ] T-24 distress call
- [ ] T-25 impulse engines

Tested by: [name]
Date: YYYY-MM-DD
Build: [commit hash]
Skill × Length coverage: [list]
```

## Regression from Bugs

*As bugs are fixed, add scenarios that reproduce each so they
don't regress.*

*(None yet — port not started.)*
