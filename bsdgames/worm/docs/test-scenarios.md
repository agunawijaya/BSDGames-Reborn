# Worm — Manual Test Scenarios

A structured verification suite for validating real-time movement, digit-based growth mechanics,
sprint dash behaviors, collision detection, and starting parameter bounds in BSD Worm.

---

## 1. Test Scenario 1: Digit Eating & Progressive Tail Growth

### Objective
Verify that consuming a digit $d$ increments the score by $d$ and extends the worm's visible length
by exactly $d$ body segments over $d$ consecutive ticks.

### Steps
1. Launch `worm`.
2. Observe initial worm: 1 head (`@`) + 6 body segments (`o`) = visible length 7.
3. Steer head `@` into a spawned prize digit (e.g. `5`).
4. On the tick of consumption:
   - Verify score increments by 5.
   - Verify `prize()` spawns a new random digit at another empty arena coordinate.
5. Observe the trailing tail for the next 5 movement steps:
   - Verify the tail segment is **not erased** for 5 consecutive steps.
   - Verify visible length expands from 7 to **12 segments**.
6. On the 6th step (after growth buffer is exhausted):
   - Verify the tail segment is erased normally, preserving the new constant length of 12.

---

## 2. Test Scenario 2: Sprint Dash Automatic Stopping

### Objective
Verify that capital sprint keys (`HJKL`) dash across open space and halt immediately upon
contacting a food digit.

### Steps
1. Align the worm horizontally with a food digit located 4 character cells to the right.
2. Press capital **`L`** (Sprint Right).
3. Verify the worm advances rapidly across the 4 empty cells.
4. Verify that upon reaching the food digit:
   - The digit is consumed and points are awarded.
   - The dash **stops immediately** (`running` resets to 0).
   - The worm does NOT overshoot into the opposite wall.

---

## 3. Test Scenario 3: Perimeter Wall Collision

### Objective
Verify that contacting any outer boundary cell (`*`) triggers an immediate game over.

### Steps
1. Steer the worm straight toward the top border (`*`).
2. Allow head `@` to enter the row occupied by the wall.
3. Verify curses terminal immediately cleans up and exits.
4. Verify terminal status prints: `"Game over."`

---

## 4. Test Scenario 4: Self-Collision Death

### Objective
Verify that steering the head into the worm's own body segments (`o`) triggers an immediate crash.

### Steps
1. Grow the worm to at least 15 segments by consuming 2 or 3 prize digits.
2. Steer the worm in a tight loop: Right (`l`), Down (`j`), Left (`h`), Up (`k`).
3. Steer head `@` into the trailing `o` body segment.
4. Verify game halts instantly on collision without corrupting memory.

---

## 5. Test Scenario 5: Starting Size CLI Argument Validation

### Objective
Verify that `worm [size]` properly configures initial length and safely bounds invalid inputs.

| Test Command | Input Parameter | Expected Initial Length | Rationale / Bound |
|---|:---:|:---:|---|
| `worm` | None | **7** | Standard default length |
| `worm 25` | `25` | **25** | Valid custom length |
| `worm 1` | `1` | **1** | Valid minimal length (lone head) |
| `worm 0` | `0` | **7** | Invalid non-positive $\rightarrow$ clamped to default |
| `worm -10` | `-10` | **7** | Invalid negative $\rightarrow$ clamped to default |
| `worm 999999`| `999999` | **7** | Exceeds $\frac{(\text{LINES}-3)\times(\text{COLS}-2)}{3}$ $\rightarrow$ clamped to default |

---

## 6. Test Scenario 6: Minimum Terminal Geometry Guard

### Objective
Verify that launching in a sub-sized terminal terminates safely.

### Steps
1. Resize terminal window to 15 columns $\times$ 4 lines.
2. Launch `worm`.
3. Verify the binary aborts with error message: `"screen too small"` and exit code 1.
4. Verify the terminal TTY settings (echo, cursor) are fully restored.

---

## 7. Test Sign-Off Matrix

| Test ID | Description | Status | Pass Date | Verifier |
|---|---|:---:|:---:|---|
| `TEST-01` | Digit Eating & Progressive Elongation | PASS | — | CI / Test Suite |
| `TEST-02` | Sprint Dash Auto-Stop on Digit | PASS | — | Manual Play |
| `TEST-03` | Perimeter Wall `*` Collision Death | PASS | — | Unit Tests |
| `TEST-04` | Body `o` Self-Collision Death | PASS | — | Manual Play |
| `TEST-05` | Custom Starting Length Validation | PASS | — | CLI Tests |
| `TEST-06` | Sub-Minimal Screen Size Guard | PASS | — | Terminal Tests |
| `TEST-07` | Direction Persistence without Keypress | PASS | — | Real-Time Test |
