# `hangman` — Manual Test Scenarios

> Human-executable playthrough scripts. Run these before releases.
>
> Automated tests live under [`../tests/`](../tests/). This file is for
> the human eye.

---

## Test Environment

- **Terminal:** minimum 80×24.
- **Platform:** Linux / macOS / Windows with WSL.
- **Build:** build the port according to the root language ADR.

## Regression Suite

### T-01 — Smoke test

**Setup:** Fresh install; default dictionary present.
**Steps:**
1. Launch `hangman` with no arguments.
2. Observe the noose, labels, and a dashed word.
3. Press `Ctrl-D` to quit.
**Expected:** Clean exit; terminal restored.

### T-02 — Basic gameplay

**Setup:** Launch `hangman`.
**Steps:**
1. Guess a common vowel, e.g. `e`.
2. Observe it appears in either the word or the guessed list.
3. Guess a clearly wrong letter, e.g. `z`.
**Expected:** Correct letters reveal in `Known`; wrong letters appear in guessed list and draw a body part.

### T-03 — Win condition

**Setup:** Launch `hangman`.
**Steps:**
1. Guess letters until the word is fully revealed.
**Expected:** `endgame()` prints "You got it!" and asks "Another word?".

### T-04 — Loss condition

**Setup:** Launch `hangman`.
**Steps:**
1. Guess seven wrong letters.
**Expected:** The full hang-man is drawn; `endgame()` prints "Sorry, the word was ..."; the correct word is revealed.

### T-05 — Custom dictionary

**Setup:** Create a small word list `custom.txt` with known lowercase words.
**Steps:**
1. Launch `hangman -d custom.txt`.
2. Play a few rounds.
**Expected:** All chosen words come from `custom.txt`.

### T-06 — Minimum word length

**Setup:** Launch `hangman -m 10`.
**Steps:**
1. Play one round and reveal the word (win or lose).
**Expected:** The word length is at least 10.

## Feature-Specific Scenarios

### F-01 — RNG word selection

**Setup:** Use a custom dictionary with many words.
**Steps:**
1. Play 20 rounds.
2. Record chosen words.
**Expected:** Words vary and all come from the dictionary. (Exact distribution is non-uniform due to random-byte-seek bias; this is known.)

## Multiplayer Scenarios

N/A for the original. Add scenarios here if multiplayer is implemented.

## Regression from Bugs

*As bugs are fixed, add a scenario that reproduces the bug so it
 doesn't regress.*

### R-YYYYMMDD — [bug slug]

Bug reference: [issue link]  
Repro steps: ...  
Expected after fix: ...

## Sign-off Template

Once all scenarios pass:

```
- [ ] T-01 smoke
- [ ] T-02 basic gameplay
- [ ] T-03 win condition
- [ ] T-04 loss condition
- [ ] T-05 custom dictionary
- [ ] T-06 minimum word length
- [ ] F-01 RNG word selection
Tested by: [name]
Date: YYYY-MM-DD
Build: [commit hash]
```
