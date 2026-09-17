# `canfield` — Manual Test Scenarios

> Human-executable playthrough scripts. When the port is done,
> most of these become automated tests.

---

## Test Environment

- **Terminal:** 80×24 minimum.
- **Platform:** Linux / WSL2 with Debian `bsdgames` package.
- **Build:** *(TBD when port begins.)*

## Smoke & Regression Suite

### T-01 — Launch

**Steps:**
1. Run `canfield`.

**Expected:** Prompt `Do you want instructions for the game?`.

### T-02 — Skip instructions

**Steps:**
1. Type `n` Enter.

**Expected:** Initial deal appears: 4 tableau piles, stock, talon,
foundation slots, and MOVES box on the right.

### T-03 — View instructions

**Steps:**
1. Type `y` Enter.

**Expected:** Instructions text, "push any key when you are
finished" at bottom.

### T-04 — Advance past instructions

**Steps:**
1. Press any key.

**Expected:** Deal appears.

### T-05 — Initial layout: base rank visible

**Steps:**
1. Observe initial deal.

**Expected:** Base rank shown in top-left. First foundation slot
already contains a card of that rank (auto-placed).

### T-06 — Deal 3 from hand to talon

**Steps:**
1. Type `ht`.

**Expected:** Top of talon changes to a new card; card counter
(if visible) updates.

### T-07 — Stock to tableau

**Steps:**
1. Type `s1` (or 2/3/4).

**Expected:** Stock's top card moves to tableau pile 1 if the
move is legal (rank one below top of pile, opposite color).
Illegal moves error and consume no state.

### T-08 — Stock to foundation

**Steps:**
1. Type `sf`.

**Expected:** Stock's top card moves to foundation if it matches
base rank + 1 modulo 13, same suit as an existing foundation.
Illegal moves error.

### T-09 — Talon to tableau

**Steps:**
1. Type `t1` (or 2/3/4).

**Expected:** Talon's top card moves to tableau if legal.

### T-10 — Talon to foundation

**Steps:**
1. Type `tf`.

**Expected:** Talon's top card moves to foundation if legal.

### T-11 — Tableau to tableau (whole pile)

**Steps:**
1. Type `12` (or any pair).

**Expected:** ENTIRE pile 1 moves onto pile 2, if legal.

### T-12 — Tableau to foundation

**Steps:**
1. Type `1f`.

**Expected:** Top of pile 1 moves to foundation if legal.

### T-13 — Card counting toggle ON

**Steps:**
1. Type `c`.

**Expected:** Counting statistics displayed at bottom of screen.
$1 charged for each unknown card revealed.

### T-14 — Card counting toggle OFF

**Steps:**
1. Type `c` again.

**Expected:** Counting stats hidden; no charge.

### T-15 — Card counting re-enable

**Steps:**
1. Type `c` again.

**Expected:** Stats shown; NO re-charge for previously-paid
cards (`paid` bit prevents double-billing).

### T-16 — Betting information view

**Steps:**
1. Type `b`.

**Expected:** Top-right box swaps to show betting statistics
(hand cost, inspection, game, runs, information, thinktime,
wins, worth).

### T-17 — Invalid command

**Steps:**
1. Type `zz`.

**Expected:** Error displayed; game state unchanged; no charge.

### T-18 — Illegal move

**Steps:**
1. Type `s1` when top of stock can't legally go to pile 1.

**Expected:** Error; no state change.

### T-19 — Empty tableau — stock only

**Setup:** Empty a tableau pile.

**Steps:**
1. While stock still has cards: try `t1` to move talon top.

**Expected:** Rejected (empty spaces filled ONLY from stock while
stock has cards).

### T-20 — Empty tableau after stock exhausted

**Setup:** Empty a pile AND exhaust the stock.

**Steps:**
1. Try `t1` to move talon top.

**Expected:** Accepted.

### T-21 — Auto-place base card

**Setup:** Deal starts with a base card.

**Expected:** Foundation already contains that card. Player
never had to type "sf" for it.

### T-22 — Auto-place matching-rank card

**Setup:** During play, a card of base rank becomes available.

**Expected:** Auto-moves to the next empty foundation slot.

### T-23 — Foundation wraparound

**Setup:** Foundation has King on top; next card is Ace of same
suit.

**Steps:**
1. Move Ace to foundation.

**Expected:** Accepted; foundation continues from Ace, 2, 3, ...

### T-24 — Second run through hand costs $5

**Setup:** Deal all cards from hand to talon via `ht`s.

**Steps:**
1. `ht` again after hand is exhausted.

**Expected:** Hand refills from talon; $5 charged.

### T-25 — Foundation credit

**Setup:** Foundation move.

**Expected:** $5 credited to wins.

### T-26 — Thinking time meter

**Setup:** Do nothing for 3+ minutes.

**Steps:**
1. Type any command.

**Expected:** Max $3 charged for that move (cap = `maxtimecharge`).

### T-27 — Quit

**Steps:**
1. Type `q`.
2. Confirm `y`.

**Expected:** Game exits; score written to cfscores file.

### T-28 — Quit cancelled

**Steps:**
1. Type `q`.
2. Answer `n`.

**Expected:** Return to game.

### T-29 — `cfscores` self

**Steps:**
1. Exit `canfield`.
2. Run `cfscores`.

**Expected:** Current user's bankroll printed.

### T-30 — `cfscores` other user

**Steps:**
1. Run `cfscores alice`.

**Expected:** Alice's bankroll printed (or "no record" if
Alice hasn't played).

### T-31 — `cfscores -a`

**Steps:**
1. Run `cfscores -a`.

**Expected:** All users' bankrolls listed.

### T-32 — Win the game

**Setup:** Cards playable to all foundations.

**Steps:**
1. Play until 52 cards on foundations.

**Expected:** Win message; net = wins − all costs; score file
updated.

### T-33 — Terminal too small

**Setup:** Terminal < 80×24.

**Steps:**
1. Launch `canfield`.

**Expected:** In original: possibly garbled draw. In port: refuse
to start with a clear message.

### T-34 — Terminal resize during play

**Setup:** Resize terminal mid-game.

**Expected:** In original: possibly garbled. In port: SIGWINCH
handler redraws.

### T-35 — Simultaneous cfscores + canfield

**Setup:** Play `canfield` in one shell; run `cfscores` in
another (same user).

**Expected:** `cfscores` reads without corrupting the game's
in-progress update.

## Sign-off Template

```
- [ ] T-01 launch
- [ ] T-02 skip instructions
- [ ] T-03 view instructions
- [ ] T-04 advance past instructions
- [ ] T-05 initial layout: base rank
- [ ] T-06 deal 3 (ht)
- [ ] T-07 stock to tableau
- [ ] T-08 stock to foundation
- [ ] T-09 talon to tableau
- [ ] T-10 talon to foundation
- [ ] T-11 tableau to tableau (whole pile)
- [ ] T-12 tableau to foundation
- [ ] T-13 counting toggle on
- [ ] T-14 counting toggle off
- [ ] T-15 counting re-enable (no re-charge)
- [ ] T-16 betting info view
- [ ] T-17 invalid command
- [ ] T-18 illegal move
- [ ] T-19 empty tableau: stock only
- [ ] T-20 empty tableau after stock exhausted
- [ ] T-21 auto-place base card
- [ ] T-22 auto-place matching rank
- [ ] T-23 foundation wraparound
- [ ] T-24 rerun hand costs $5
- [ ] T-25 foundation credit
- [ ] T-26 thinking time cap
- [ ] T-27 quit confirm
- [ ] T-28 quit cancel
- [ ] T-29 cfscores self
- [ ] T-30 cfscores other user
- [ ] T-31 cfscores -a
- [ ] T-32 win the game
- [ ] T-33 terminal too small
- [ ] T-34 terminal resize
- [ ] T-35 concurrent cfscores read

Tested by: [name]
Date: YYYY-MM-DD
Build: [commit hash]
```

## Regression from Bugs

*(None yet — port not started.)*
