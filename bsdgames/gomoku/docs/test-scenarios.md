# `gomoku` — Manual Test Scenarios

---

## Test Environment

- Terminal: 80×24 minimum for `curses` mode.
- Build: *(TBD)*

## Smoke & Regression Suite

### T-01 — Startup and quit

**Steps:**
1. Launch `gomoku`.
2. Enter `w` when prompted for colour.
3. Enter `quit`.
**Expected:** Clean exit.

### T-02 — First AI move is K10

**Steps:**
1. Launch `gomoku`.
2. Choose `black` (so AI plays White).
3. Play any move (e.g. `H9`).
**Expected:** AI's next move is K10 *if the board is empty apart
from your move* — but since Black just played, K10 may already be
threatened. Actually: launch and choose `white`, so AI is Black and
plays first.
**Corrected steps:**
1. Launch `gomoku`.
2. Choose `white`.
**Expected:** AI (as Black) plays K10 as its first move.

### T-03 — Basic move entry

**Setup:** Interactive game.
**Steps:**
1. At the "move?" prompt, enter `K10`.
**Expected:** Stone placed at K10; screen updates; opponent to
move.

### T-04 — Invalid move rejected

**Steps:**
1. Enter a move like `Z99`.
2. Enter a legal move.
**Expected:** Error message; game continues.

### T-05 — Move onto occupied cell rejected

**Steps:**
1. Enter `K10` twice (either you or AI has already played there).
**Expected:** "Illegal move" — prompt again.

### T-06 — Save and restore

**Steps:**
1. Play ~5 moves.
2. Enter `save`.
3. Enter filename `test.sgf` (or plain text in original format).
4. Quit.
5. Relaunch: `gomoku test.sgf`.
**Expected:** Same board state resumes; next move prompt.

### T-07 — Win detection

**Steps:**
1. In `-u` mode, play out a sequence that ends with Black winning
   horizontally.
**Expected:** Message "Rats! you won" (if you were White) or "Ha ha,
I won" (if you were Black playing AI). Game offers replay.

### T-08 — Diagonal win

**Steps:** Same as T-07 but with a diagonal five.
**Expected:** Win detected.

### T-09 — Tie

**Steps:** *(Practically infeasible manually. Should be a scripted
test with a known move sequence.)*
**Expected:** "Wow! its a tie" message.

### T-10 — Resign

**Steps:**
1. Enter `resign` at prompt.
**Expected:** Game ends. Opponent wins.

### T-11 — User-vs-user mode

**Steps:**
1. Launch `gomoku -u`.
**Expected:** Both players enter moves; no AI participation.

### T-12 — Computer-vs-computer

**Steps:**
1. Launch `gomoku -c`.
**Expected:** AI plays both sides. Game completes without input.

### T-13 — Background mode

**Steps:**
1. Pipe input to `gomoku -b`:
   ```
   printf "white\nK10\n" | gomoku -b
   ```
**Expected:** `gomoku` (playing Black) outputs its move.

### T-14 — Debug output

**Steps:**
1. Launch `gomoku -dd`.
2. Play a few moves.
**Expected:** Verbose logs of combo values printed to stderr.

## AI Regression

### A-01 — Blocks obvious threat

**Setup:** Play 4-in-a-row as user (e.g. `K10 K11 K12 K13`).
**Expected:** AI's next move blocks at K9 or K14.

### A-02 — Wins when given a free winning move

**Setup:** Manoeuvre AI to have an open 4.
**Expected:** AI completes it (win).

### A-03 — Recognises double-threat

**Setup:** Play a position where the *opponent* has two open
threes intersecting (in `-u` mode, then switch to AI).
**Expected:** AI recognises it as forcing / winning; blocks or
plays through.

### A-04 — Tie-break determinism with debug

**Steps:**
1. Launch `gomoku -d` twice with the same input file.
**Expected:** Identical AI moves (RNG not seeded in debug mode).

## Sign-off Template

```
- [ ] T-01 startup and quit
- [ ] T-02 first move K10
- [ ] T-03 basic entry
- [ ] T-04 invalid move
- [ ] T-05 occupied cell
- [ ] T-06 save/restore
- [ ] T-07 horizontal win
- [ ] T-08 diagonal win
- [ ] T-09 tie
- [ ] T-10 resign
- [ ] T-11 user-vs-user
- [ ] T-12 computer-vs-computer
- [ ] T-13 background mode
- [ ] T-14 debug output
- [ ] A-01 blocks threat
- [ ] A-02 completes winning move
- [ ] A-03 recognises double threat
- [ ] A-04 tie-break determinism

Tested by: [name]
Date: YYYY-MM-DD
Build: [commit hash]
```
