# `canfield` — `fancy-web` port test scenarios

> Port-specific scenarios for manual / automated verification. The engine-level spec tests live in `tests/` and cover the canonical rules; this file covers additive fancy-web behavior.

## Sign-off template

| Scenario | Pass | Notes |
|---|---|---|
| T-01 Initial deal renders | ☐ | |
| T-02 Betting phase buttons | ☐ | |
| T-03 Drag tableau to tableau | ☐ | |
| T-04 Click stock to talon (`ht`) | ☐ | |
| T-05 Auto-move base rank | ☐ | |
| T-06 Foundation wrap-around | ☐ | |
| T-07 Empty tableau from stock | ☐ | |
| T-08 Empty tableau from talon after stock empty | ☐ | |
| T-09 Card counting overlay charges | ☐ | |
| T-10 Command bar accepts `s1`, `tf`, etc. | ☐ | |
| T-11 Undo applies $5 penalty | ☐ | |
| T-12 Win detection + fanfare | ☐ | |
| T-13 Auto-save / resume | ☐ | |
| T-14 Account Book shows session totals | ☐ | |
| T-15 Responsive layout | ☐ | |

---

## Scenarios

### T-01 Initial deal renders
**Steps:**
1. Open the app.
2. Observe the table.

**Expected:**
- 4 tableau piles, each with 1 face-up card.
- 1 stock pile with 1 face-up card (top of 13).
- 1 talon pile with 1 face-up card (top of 3).
- 1 foundation pile with the base card.
- Bankroll shows `$-13` (initial deal cost).

### T-02 Betting phase buttons
**Steps:**
1. Click **Buy** ($13).
2. Click **Inspect** (+$13).
3. Click **Commit** (+$26).

**Expected:**
- Bankroll updates to `$-13`, then `$-26`, then `$-52`.
- Moves allowed advance with each phase.

### T-03 Drag tableau to tableau
**Steps:**
1. Identify a legal downward-alternating-color move.
2. Drag the top pile from one tableau to another.

**Expected:**
- Cards snap to destination if legal.
- Illegal drops bounce back with a visual shake.

### T-04 Click stock to talon (`ht`)
**Steps:**
1. Click the stock pile.

**Expected:**
- 3 cards move from hand to talon (or fewer if hand is nearly empty).
- Each click beyond the first pass costs `$5`.

### T-05 Auto-move base rank
**Steps:**
1. Start a game.
2. Reveal another card of the base rank.

**Expected:**
- The card automatically flies to the correct foundation pile.
- Bankroll increases by `$5`.

### T-06 Foundation wrap-around
**Steps:**
1. Build a foundation up to King.
2. Place an Ace of the same suit on top.

**Expected:**
- Ace is accepted and foundation continues growing.

### T-07 Empty tableau from stock
**Steps:**
1. Clear a tableau pile.
2. While stock still has cards, click the empty space.

**Expected:**
- Top card of stock moves into the empty tableau.

### T-08 Empty tableau from talon after stock empty
**Steps:**
1. Exhaust the stock.
2. Clear a tableau pile.
3. Click the empty space.

**Expected:**
- Top card of talon can now fill the empty tableau.

### T-09 Card counting overlay charges
**Steps:**
1. Toggle card counting.
2. Reveal several unknown cards.

**Expected:**
- Each newly revealed unknown card costs `$1`.
- Total card-counting cost is capped at `$34`.

### T-10 Command bar accepts original grammar
**Steps:**
1. Type `s1`, `tf`, `ht`, `c`, `b`, `q` into the command bar.

**Expected:**
- Each command executes as in the original terminal game.
- Invalid commands show an error without state change.

### T-11 Undo applies $5 penalty
**Steps:**
1. Make a move.
2. Press `u` or Ctrl+Z.

**Expected:**
- Last move is reversed.
- Bankroll decreases by `$5`.

### T-12 Win detection + fanfare
**Steps:**
1. Move all 52 cards to foundations.

**Expected:**
- Win modal appears with final net worth.
- Win fanfare plays if sound is on.
- Session is recorded in Account Book.

### T-13 Auto-save / resume
**Steps:**
1. Make several moves.
2. Reload the browser.

**Expected:**
- Game state restores exactly.

### T-14 Account Book shows session totals
**Steps:**
1. Finish or quit a few games.
2. Open Account Book.

**Expected:**
- Each session listed with wins, spend, and net.
- Total net worth displayed.

### T-15 Responsive layout
**Steps:**
1. Resize browser to portrait mobile width.
2. Resize to landscape tablet width.

**Expected:**
- Table remains usable; cards and buttons reflow.
- No overlapping or clipped controls.
