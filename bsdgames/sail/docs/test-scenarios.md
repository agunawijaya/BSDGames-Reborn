# `sail` — Manual Test Scenarios

> Human-executable playthrough scripts.

---

## Test Environment

- **Terminal:** 80×24 minimum.
- **Platform:** Linux / WSL2. Requires `sail` binary.
- **Build:** *(TBD)*.

## Smoke & Regression Suite

### T-01 — Startup and scenario menu

**Steps:**
1. Launch `sail`.
**Expected:** Scenario menu listing 32 scenarios.

### T-02 — Choose scenario 21 (Hornblower and the Natividad)

**Steps:**
1. Enter `21`.
**Expected:** Confirmation `Hornblower and the Natividad`. Ship
selection prompt.

### T-03 — Ship selection

**Steps:**
1. Enter `0` (British Lydia).
**Expected:** Game begins; driver process forks.

### T-04 — Screen layout

**Steps:**
1. Observe main screen.
**Expected:** Sea grid + wind vane + ship status panel + move
prompt.

### T-05 — First movement

**Steps:**
1. At `move (7, 4):` prompt, type `3`.
**Expected:** Ship moves 3 squares forward on next poll cycle.

### T-06 — Left turn

**Steps:**
1. Type `l3`.
**Expected:** Ship turns left, then moves 3 forward.

### T-07 — Compound movement

**Steps:**
1. Type `r1r1r2`.
**Expected:** Right, 1 forward, right, 1 forward, right, 2
forward.

### T-08 — Turn into wind

**Steps:**
1. Position facing so left turn would face wind.
2. Type `l1l4`.
**Expected:** `Movement Error; Helm: l1l`.

### T-09 — Drift

**Steps:**
1. Don't move forward for 2 turns.
**Expected:** `'` appears in move prompt indicating drift.

### T-10 — Full sails

**Steps:**
1. Set sails to full.
**Expected:** Ship glyph becomes uppercase (`B0` instead of
`b0`).

### T-11 — Load double shot

**Setup:** At load menu.
**Steps:**
1. Load double.
**Expected:** Load shows `D*` (loading); 2 turns later `D`
(ready).

### T-12 — Fire broadside

**Setup:** Loaded, target in range.
**Steps:**
1. Fire port broadside.
**Expected:** Hit or miss reported; damage applied to target.

### T-13 — Chain shot demasting

**Setup:** Load chain; enemy in range 3.
**Steps:**
1. Fire.
**Expected:** Damage to enemy rigging only.

### T-14 — Stern rake

**Setup:** Fire down enemy stern axis.
**Expected:** Damage multiplier applied; larger effect than
non-rake shot.

### T-15 — Enemy fires back

**Setup:** In range of enemy broadside.
**Expected:** Damage report on your ship after turn resolution.

### T-16 — Damage tracking

**Setup:** Take some hits.
**Steps:**
1. Observe ship status.
**Expected:** Hull, crew, guns, or rigging decreases.

### T-17 — Repairs

**Setup:** Have damage.
**Steps:**
1. Wait through several turns.
**Expected:** Damage counters increase by 2 per 3 turns.

### T-18 — Enemy surrender

**Setup:** Reduce enemy to listing hulk.
**Expected:** Enemy glyph becomes `!<num>`.

### T-19 — Enemy sinks

**Setup:** Enemy at listing hulk state.
**Expected:** Random chance of `~<num>` and eventual
destruction.

### T-20 — Enemy captured

**Steps:**
1. Board and win.
**Expected:** Enemy nation changes to your nation; number
becomes `&`, `'`, etc.

### T-21 — Fouling

**Setup:** Collide with enemy ship.
**Expected:** Both ships marked fouled; neither can move.

### T-22 — Boarding

**Setup:** Fouled with enemy.
**Steps:**
1. Send boarding parties.
**Expected:** Casualty count applied to both crews.

### T-23 — Multi-player join

**Setup:** Game in progress; second player launches.
**Steps:**
1. Second player selects same scenario.
**Expected:** Second player syncs (slowly) and joins.

### T-24 — Score display

**Steps:**
1. Launch `sail -s`.
**Expected:** Top ten sailors listed.

### T-25 — Score with logins

**Steps:**
1. Launch `sail -s -l`.
**Expected:** Top ten sailors + login names.

## Sign-off Template

```
- [ ] T-01 startup and menu
- [ ] T-02 scenario selection
- [ ] T-03 ship selection
- [ ] T-04 screen layout
- [ ] T-05 first movement
- [ ] T-06 left turn
- [ ] T-07 compound movement
- [ ] T-08 turn into wind
- [ ] T-09 drift
- [ ] T-10 full sails
- [ ] T-11 load double
- [ ] T-12 fire broadside
- [ ] T-13 chain shot demasting
- [ ] T-14 stern rake
- [ ] T-15 enemy fires back
- [ ] T-16 damage tracking
- [ ] T-17 repairs
- [ ] T-18 enemy surrender
- [ ] T-19 enemy sinks
- [ ] T-20 enemy captured
- [ ] T-21 fouling
- [ ] T-22 boarding
- [ ] T-23 multi-player join
- [ ] T-24 score display
- [ ] T-25 score with logins

Tested by: [name]
Date: YYYY-MM-DD
Build: [commit hash]
Scenarios tested: [list]
```

## Regression from Bugs

*(None yet — port not started.)*
