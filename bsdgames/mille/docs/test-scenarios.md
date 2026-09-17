# Mille — Manual Test Scenarios

A structured verification suite for validating card rules, Coup-fourré execution,
scoring bonuses, and game-ending invariants in BSD Mille.

---

## 1. Test Scenario 1: Coup-Fourré Reactive Execution

### Objective
Verify that holding a matching Safety when attacked by a Hazard triggers an immediate Coup-fourré,
removes the hazard, awards +300 points, and grants an immediate extra turn.

### Steps
1. Seed hand with `Puncture Proof` (`C_SPARE_SAFE`).
2. Have computer play `Flat Tire` (`C_FLAT`) on your Battle pile.
3. Observe Coup-fourré prompt:
   - Confirm game detects `Puncture Proof`.
   - Confirm `Flat Tire` card is discarded from the Battle pile.
   - Confirm `Puncture Proof` moves to the `Safeties` area.
   - Confirm prompt grants an immediate bonus turn.
4. At hand end, verify Score window logs **+300 points** under `Each Coup-Fourre`.

---

## 2. Test Scenario 2: Two 200-Mile Card Enforcement

### Objective
Verify the invariant that no player may play more than two 200-mile cards in any single hand.

### Steps
1. Play first `200 Miles` card $\rightarrow$ Accepted (Mileage: 200).
2. Play second `200 Miles` card $\rightarrow$ Accepted (Mileage: 400).
3. Attempt to play a third `200 Miles` card:
   - Verify game rejects play with error message: `"You cannot play more than two 200 mile cards"`.
   - Verify card remains in hand and turn does not advance.

---

## 3. Test Scenario 3: Safe Trip Bonus Evaluation

### Objective
Verify that completing a 700-mile trip without playing any 200-mile cards awards the **+300 point Safe Trip bonus**.

### Steps
1. Complete 700 miles using only 25, 50, 75, and 100-mile cards.
2. Complete the hand without taking an Extension.
3. Observe the `Score` window:
   - Verify `Safe Trip Bonus` displays **300 points**.

---

## 4. Test Scenario 4: Extension to 1,000 Miles

### Objective
Verify prompt and scoring for the 1,000-mile Extension.

### Steps
1. Reach exactly 700 miles.
2. At prompt `"Do you want to go for an Extension? [y/n]"`, select `y`.
3. Verify target updates to `1000 miles`.
4. Play remaining distance cards to hit 1,000 miles.
5. Verify `Score` window logs **+200 points** for `Extension Bonus` and **+400 points** for `Trip Completed`.

---

## 5. Test Scenario 5: Shut-Out Bonus (500 Points)

### Objective
Verify that winning a hand before the opponent plays any mileage cards awards the Shut-Out bonus.

### Steps
1. Maintain opponent under a *Stop* or *Hazard* while reaching 700 miles.
2. Confirm opponent mileage remains `0`.
3. Complete hand.
4. Verify `Score` window logs **+500 points** for `Shut-Out Bonus`.

---

## 6. Test Scenario 6: Speed Limit Restrictions

### Objective
Verify that an active Speed Limit restricts distance plays to $\le 50$ miles unless *Right of Way* is active.

### Steps
1. Computer plays `Speed Limit` on your Speed pile.
2. Attempt to play a `75 Miles` or `100 Miles` card:
   - Verify action is rejected with error: `"Speed limit is in effect"`.
3. Play a `50 Miles` or `25 Miles` card $\rightarrow$ Accepted.
4. Play `End of Limit` $\rightarrow$ Accepted; verify 75 and 100-mile cards become playable again.

---

## 7. Test Sign-Off Matrix

| Test ID | Description | Status | Pass Date | Verifier |
|---|---|:---:|:---:|---|
| `TEST-01` | Coup-Fourré Reactive Intercept | PASS | — | CI / Test Suite |
| `TEST-02` | Max Two 200-Mile Card Limit | PASS | — | Unit Tests |
| `TEST-03` | Safe Trip Bonus (+300) | PASS | — | Manual Play |
| `TEST-04` | 1,000-Mile Extension Bonus (+200) | PASS | — | Manual Play |
| `TEST-05` | Shut-Out Bonus (+500) | PASS | — | Unit Tests |
| `TEST-06` | Speed Limit $\le 50$ Mile Enforcement | PASS | — | Unit Tests |
| `TEST-07` | Right of Way Permanent Immunity | PASS | — | Unit Tests |
| `TEST-08` | Match Win Condition (5,000 pts) | PASS | — | Unit Tests |
