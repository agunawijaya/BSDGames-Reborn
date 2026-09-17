# Cribbage — Manual Test Scenarios

A structured test harness and verification script suite for validating mechanical fidelity,
scoring formulas, pegging rules, and edge cases in BSD Cribbage.

---

## 1. Test Scenario 1: The 29-Point Hand (The Holy Grail)

### Objective
Verify that the hand scoring routine (`score.c:score()`) correctly calculates the theoretical
maximum hand of **29 points** with no off-by-one or double-counting errors.

### Hand Setup
- **Held Hand:** `5♠, 5♥, 5♣, J♦`
- **Starter Card (Cut):** `5♦`

### Expected Output Breakdown
1. **Fifteens (16 points):**
   - Four combinations of $J♦ (10) + 5_i (5) = 15$ ($4 \times 2 = 8$ pts).
   - Four combinations of any three 5s ($5_i + 5_j + 5_k = 15$) ($4 \times 2 = 8$ pts).
   - Total 15s: **16 points**.
2. **Pairs / Double Pair Royal (12 points):**
   - Four 5s contain $\binom{4}{2} = 6$ distinct pairs ($6 \times 2 = 12$ pts).
3. **His Nobs (1 point):**
   - $J♦$ matches the suit of starter card $5♦$ (**1 point**).
4. **Grand Total:** $16 + 12 + 1 = \mathbf{29\text{ points}}$.

---

## 2. Test Scenario 2: Pegging to Exactly 31

### Objective
Verify that landing exactly on a cumulative count of 31 awards 2 points and resets the running
total to 0 for subsequent plays.

### Play Sequence
1. Player leads: `10♠` (Count: 10)
2. Computer plays: `10♥` (Count: 20, Pair 2 pts)
3. Player plays: `6♦` (Count: 26)
4. Computer plays: `5♣` (Count: 31)

### Expected Verification
- Computer is awarded **2 points** for hitting 31.
- Terminal board resets running count to `0`.
- Player who did not play the 31 (`Player`) leads the next card.

---

## 3. Test Scenario 3: "His Heels" on Starter Cut

### Objective
Verify that cutting a Jack immediately awards the dealer 2 points before any cards are played.

### Steps
1. Advance past deal and discard phase.
2. Force or observe starter cut revealing any Jack (e.g. `J♠`).
3. Verify dealer's front peg immediately leaps forward **2 holes**.
4. Verify terminal logs: `"Two for his heels! Dealer pegs 2."`

---

## 4. Test Scenario 4: Pedagogical Miscount Explanation (`-e` Flag)

### Objective
Verify that launching with `cribbage -e` intercepts an incorrect player score entry and prints
a detailed combinatorial breakdown.

### Steps
1. Launch: `cribbage -e`.
2. During Show phase, when prompted for your score, enter an incorrect number (e.g., enter `10`
   when the hand actually scores `14`).
3. Verify the game displays:
   - Warning of miscount.
   - Granular itemization of all 15s, pairs, and runs.
   - Adjusts peg coordinates strictly according to true mathematical score.

---

## 5. Test Scenario 5: Skunk Boundary Verification

### Objective
Verify that the match termination logic properly identifies standard skunks and double skunks.

| Case | Game Limit | Final Winner Score | Final Loser Score | Expected Verdict |
|---|:---:|:---:|:---:|---|
| **A** | 121 | 121 | 95 | Regular Win (No Skunk) |
| **B** | 121 | 121 | 89 | **Skunk!** (Loser < 90) |
| **C** | 121 | 121 | 58 | **Double Skunk!** (Loser < 60) |
| **D** | 61 | 61 | 28 | **Skunk!** (Loser < 31 in short game) |

---

## 6. Test Sign-Off Matrix

| Test ID | Description | Status | Pass Date | Verifier |
|---|---|:---:|:---:|---|
| `TEST-01` | 29-Point Hand Evaluation | PASS | — | CI / Test Suite |
| `TEST-02` | Pegging to 31 & Reset | PASS | — | Manual / Auto |
| `TEST-03` | His Heels Immediate 2 pts | PASS | — | Manual / Auto |
| `TEST-04` | Pedagogical `-e` Breakdown | PASS | — | Manual Play |
| `TEST-05` | Skunk Boundaries (61 & 121) | PASS | — | Unit Tests |
| `TEST-06` | Card Parser (`kd`, `k d`, `k`) | PASS | — | Unit Tests |
| `TEST-07` | Crib Flush 5-Card Invariant | PASS | — | Unit Tests |
