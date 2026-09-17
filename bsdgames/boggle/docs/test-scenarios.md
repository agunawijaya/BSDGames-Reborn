# `boggle` — Test Scenarios & Verification Scripts

> Test scenarios, batch mode regression tests, and quality sign-off templates for *Boggle*.

---

## Scenario 1: Fixed Board Adjacency & Word Verification

### Objective
Verify that `boggle` correctly parses, validates, and accepts legitimate adjacent words while rejecting non-adjacent or invalid words on a fixed 16-character board.

### Execution
Run `boggle` with a predetermined board specification:
```bash
# Board layout:
# p o r t
# a b l e
# s p e c
# t e s t
boggle portable spectest
```

### Steps & Verification
1. Press `<space>` to begin.
2. Enter words:
   - `port` (Expected: accepted, valid horizontal sequence 0-1-2-3).
   - `able` (Expected: accepted, valid horizontal sequence 4-5-6-7).
   - `spec` (Expected: accepted, valid horizontal sequence 8-9-10-11).
   - `test` (Expected: accepted, valid horizontal sequence 12-13-14-15).
   - `plot` (Expected: accepted, valid sequence `p`(0)-`l`(6)-`o`(1)-`t`(3)).
   - `xyz` (Expected: rejected, letters not present on board).
   - `post` (Expected: accepted, valid sequence `p`(0)-`o`(1)-`s`(8)-`t`(12)).
   - `pot` (Expected: accepted, valid sequence `p`(0)-`o`(1)-`t`(3)).
3. Press `^D` to finish round early.
4. Verify that results show `Words you found` containing `port`, `able`, `spec`, `test`, `plot`, `post`, `pot`.

---

## Scenario 2: Batch Mode Solver Verification

### Objective
Verify that `boggle -b` acts as a deterministic filter for candidate wordlists.

### Script
```bash
cat << 'EOF' > /tmp/test_words.txt
port
able
banana
test
computer
spec
EOF

boggle -b portablespectest < /tmp/test_words.txt
```

### Expected Output
```text
port
able
test
spec
```
*(Notice `banana` and `computer` are excluded because they cannot be formed on the board).*

---

## Scenario 3: Minimum Word Length Enforcement

### Objective
Verify that `-w <minlength>` strictly suppresses words shorter than the threshold.

### Steps
1. Launch with minimum word length 5:
   ```bash
   boggle -w 5 portablespectest
   ```
2. Enter `port` (4 letters).
   - Expected Result: Word is rejected with an error bell / message indicating minimum length of 5.
3. Enter `stable` (6 letters: `s`-`t`-`a`-`b`-`l`-`e`).
   - Expected Result: Accepted.

---

## Scenario 4: Timer Countdown & Clock Display

### Objective
Verify that pressing `<Enter>` on an empty input line displays remaining time.

### Steps
1. Launch `boggle -t 60`.
2. Press `<space>` to begin.
3. Wait 10 seconds.
4. Press `<Enter>` with an empty line.
   - Expected Result: Display prints `0:50` (or remaining seconds in `M:SS` format).
5. Wait until 60 seconds expire.
   - Expected Result: Game automatically jumps to `timesup:` scoring screen without requiring further keystrokes.

---

## QA Sign-Off Template

```text
================================================================================
BOGGLE TEST RUN SIGN-OFF
================================================================================
Platform: [ Linux / macOS / Windows WSL2 ]
Binary Version: [ bsdgames-reborn v0.1.0 ]
Date of Test: [ YYYY-MM-DD ]
Tester: [ Contributor Name / Agent ID ]

[ ] Scenario 1: Fixed Board Adjacency & Word Verification ....... PASS / FAIL
[ ] Scenario 2: Batch Mode Solver Verification .................. PASS / FAIL
[ ] Scenario 3: Minimum Word Length Enforcement ................. PASS / FAIL
[ ] Scenario 4: Timer Countdown & Clock Display ................. PASS / FAIL

Comments:
________________________________________________________________________________
```
