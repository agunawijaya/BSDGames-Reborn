# Backgammon — Manual Test Scenarios

A structured verification suite for validating board movement rules, blot hitting, bar re-entry,
bearing off legality, doubling cube mechanics, and victory tiers in BSD Backgammon.

---

## 1. Test Scenario 1: Blot Hitting & Mandatory Bar Re-Entry

### Objective
Verify that landing on an opponent blot places it on the Bar, and that the opponent is strictly
prohibited from moving any other checker until the blot re-enters.

### Steps
1. Set up a board state where White holds a single blot on Point 5.
2. Red rolls a combination that reaches Point 5 (e.g. from Point 1 rolling 4).
3. Red inputs move: `1-5`.
4. Observe board update:
   - Verify White's checker is removed from Point 5.
   - Verify `board[25]` (White's Bar) increments to `1`.
   - Verify terminal displays White checker on the central `BAR`.
5. On White's turn:
   - Attempt to move a checker from Point 13: `13-10`.
   - Verify game rejects move: `"Must move from the bar first"`.
   - Input legal re-entry move: `b-20` (if roll permits).
   - Verify checker successfully enters from the Bar.

---

## 2. Test Scenario 2: Bearing Off Pre-Condition Enforcement

### Objective
Verify that checkers cannot be borne off until all 15 checkers reside in the player's inner Home Board.

### Steps
1. Move 14 Red checkers into Red Home Board (points 19–24).
2. Leave 1 Red checker in the Outer Board on Point 12.
3. Roll a 5.
4. Attempt to bear off a checker from Point 20: `20-h` (or `20/5`).
5. Verify move is rejected: `"Cannot bear off until all men are in home board"`.
6. Advance the checker from Point 12 into Point 19 (all 15 now in Home Board).
7. Roll a 5; execute `20-h`.
8. Verify checker is successfully removed to the Home tray; `off[Red]` increments to 1.

---

## 3. Test Scenario 3: Doubling Cube Propose, Drop, and Take

### Objective
Verify cube ownership rules, score escalation ($1 \rightarrow 2$), and instant resignation on drop.

### Sub-Test 3A: Doubling Drop
1. At the start of Red's turn, before rolling, enter `D`.
2. White is prompted: `"Red doubles. Does White accept? [y/n]"`.
3. White inputs `n`.
4. Verify game concludes immediately:
   - Red wins **1 point** (current game value).
   - Match score updates accordingly.

### Sub-Test 3B: Doubling Take & Ownership Invariant
1. Red doubles (`D`); White inputs `y`.
2. Verify terminal displays: `"Game value is now 2"`.
3. On Red's subsequent turn, attempt to enter `D`:
   - Verify double is rejected: `"You cannot double (White owns the cube)"`.
4. On White's turn, enter `D`:
   - Verify White is permitted to redouble to **4 points**.

---

## 4. Test Scenario 4: Gammon & Backgammon Victory Tiers

### Objective
Verify the automatic application of the $2\times$ and $3\times$ multipliers.

| Case | Loser Checkers Borne Off | Loser Location | Base Value | Expected Final Points | Verdict |
|---|:---:|---|:---:|:---:|---|
| **A** | $\ge 1$ | Anywhere | 2 | **2 points** | Regular Win ($1\times$) |
| **B** | **$0$** | Outer Board only | 2 | **4 points** | **Gammon ($2\times$)** |
| **C** | **$0$** | 1 checker on **BAR** | 2 | **6 points** | **Backgammon ($3\times$)** |
| **D** | **$0$** | 1 checker in **Winner's Home** | 2 | **6 points** | **Backgammon ($3\times$)** |

---

## 5. Test Scenario 5: Input Parser Shorthand Validation

### Objective
Verify that the command parser handles all valid syntax variations without crash or corruption.

### Steps
Test the following inputs during active turns:
1. Standard notation: `12-16, 17-20` $\rightarrow$ Accepted.
2. Slash notation: `12/4, 17/3` $\rightarrow$ Accepted.
3. Chained multi-point notation: `1-5-8` $\rightarrow$ Accepted.
4. Chained roll notation: `12/43` $\rightarrow$ Accepted.
5. Mixed space and comma delimiters: `12-16 17-20` $\rightarrow$ Accepted.
6. Bar and Home symbols: `b-3 21-h` $\rightarrow$ Accepted.

---

## 6. Test Sign-Off Matrix

| Test ID | Description | Status | Pass Date | Verifier |
|---|---|:---:|:---:|---|
| `TEST-01` | Blot Hit & Bar Placement | PASS | — | CI / Unit Test |
| `TEST-02` | Mandatory Bar Re-Entry Priority | PASS | — | Unit Tests |
| `TEST-03` | Bearing Off Home Board Guard | PASS | — | Unit Tests |
| `TEST-04` | Doubling Cube Drop (Instant Resign) | PASS | — | Manual Play |
| `TEST-05` | Doubling Cube Ownership Invariant | PASS | — | Manual Play |
| `TEST-06` | Gammon Score Multiplier ($2\times$) | PASS | — | Unit Tests |
| `TEST-07` | Backgammon Multiplier ($3\times$) | PASS | — | Unit Tests |
| `TEST-08` | Move Syntax Shorthands (`s-f`, `s/r`) | PASS | — | Parser Tests |
