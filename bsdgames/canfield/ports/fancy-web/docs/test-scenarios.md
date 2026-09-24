# `canfield` — `fancy-web` port test scenarios

> Port-specific scenarios for manual / automated verification. The engine-level spec tests live in `tests/` and cover the canonical rules; this file covers additive fancy-web behavior.

## Sign-off template

| Scenario | Pass | Notes |
|---|---|---|
| T-01 Initial deal renders | ✅ | `tests/engine.test.ts` |
| T-02 Betting phase buttons | ✅ | `tests/engine.test.ts` |
| T-03 Drag tableau to tableau | ✅ | `tests/gameplay.spec.ts` |
| T-04 Click Deal Hand → Talon (`ht`) | ✅ | `tests/gameplay.spec.ts` |
| T-05 Auto-move base rank | ✅ | `tests/rules.test.ts` |
| T-06 Foundation wrap-around | ✅ | `tests/engine.test.ts` |
| T-07 Empty tableau from stock | ✅ | `tests/rules.test.ts` |
| T-08 Empty tableau from talon after stock empty | ✅ | `tests/rules.test.ts` |
| T-09 Card counting overlay charges | ✅ | `tests/rules.test.ts` |
| T-10 Command bar accepts `s1`, `tf`, etc. | ✅ | `tests/moves.test.ts` + manual |
| T-11 Undo applies $5 penalty | ✅ | `tests/rules.test.ts` |
| T-12 Win / loss / quit detection | ✅ | manual + `tests/rules.test.ts` (loss) |
| T-13 Auto-save / resume | ✅ | `tests/storage.test.ts` |
| T-14 Account Book shows session totals | ✅ | manual |
| T-15 Responsive layout | ✅ | `tests/features.spec.ts` (390×844) + manual desktop |
| T-16 Double-click to foundation | ✅ | `tests/features.spec.ts` |
| T-17 First move in Buy pays Inspect | ✅ | `tests/rules.test.ts` + `tests/features.spec.ts` |
| T-18 Foundation credit after Commit; win = +$208 | ✅ | `tests/rules.test.ts` + `tests/features.spec.ts` |
| T-19 Card counting toggle (`Cflag`) | ✅ | `tests/rules.test.ts` + `tests/features.spec.ts` |
| T-20 Cheat / Sound toggles | ✅ | `tests/features.spec.ts` + `tests/cheat.spec.ts` |
| T-21 Refusals are explained | ✅ | `tests/features.spec.ts` |
| T-22 Command bar is safe to type in | ✅ | `tests/features.spec.ts` |
| T-23 Reset Bankroll | ✅ | `tests/features.spec.ts` |
| T-24 Victory animation | ✅ | `tests/features.spec.ts` + `media/06-victory.png` |
| T-25 Phase notices | ✅ | manual, `media/01-initial-deal.png` |

Signed off 2026-09-24 by the port owner's review session: 57 Vitest tests and 15 Playwright tests green on the release commit of this port (`git log -- .`).

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
1. Start a new game. Bankroll is `$-13` after the deal.
2. Click **Inspect** (+$13). Bankroll becomes `$-26`.
3. Click **Commit** (+$26) and receive `$5` credit for the base card. Bankroll becomes `$-47`.
4. Start another game and click **Commit** straight from Buy.

**Expected:**
- Step 1–3: bankroll updates to `$-13`, `$-26`, `$-47`; moves allowed advance with each phase.
- Step 4: bankroll jumps to `$-47` and all moves unlock immediately.

### T-03 Drag tableau to tableau
**Steps:**
1. Identify a legal downward-alternating-color move.
2. Drag the top pile from one tableau to another.

**Expected:**
- Cards snap to destination if legal.
- Illegal drops leave the board unchanged and show a one-line reason (see T-21).

### T-04 Click Deal Hand → Talon (`ht`)
**Steps:**
1. Commit the game.
2. Click **Deal Hand → Talon**.

**Expected:**
- 3 cards move from hand to talon (or fewer if hand is nearly empty).
- Each recycle after the hand empties costs `$5`.

### T-05 Auto-move base rank
**Steps:**
1. Start a game and Commit.
2. Reveal another card of the base rank (e.g. by moving cards onto foundations or dealing the hand).

**Expected:**
- The card automatically flies to the correct empty foundation pile.
- After Commit, bankroll increases by `$5` for each foundation card moved up.

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

### T-09 Card counting is billed per card (see T-19)
**Steps:**
1. Turn counting ON, deal cards from the hand.

**Expected:**
- Each hand/talon card that becomes visible while ON costs `$1`, once.
- Total counting cost never exceeds `$34`.

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

### T-12 Win / loss / quit detection
**Steps:**
1. Move all 52 cards to foundations, or cycle the hand four times without a successful move, or type `q` and confirm.

**Expected:**
- Win / loss / quit modal appears with final net worth.
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

### T-16 Double-click to foundation
**Steps:**
1. Open `/?seed=11`. Tableau 1 holds a card that can go to a foundation.
2. Double-click it. Then double-click a card that cannot go up.

**Expected:**
- The first card flies to the foundation (drag-and-drop and click-then-click still work too).
- The second shows "That card cannot go to a foundation yet." and nothing moves.

### T-17 First move in Buy pays Inspect
**Steps:**
1. New game (bankroll `-$13`). Make any legal move, e.g. T-16.

**Expected:**
- Bankroll `-$26` (`$13` deal + `$13` Inspect), phase Inspect, notice explains it.
- An illegal move in Buy charges nothing. `ht` stays locked until Commit.

### T-18 Foundation credit after Commit
**Steps:**
1. Commit, then move cards to foundations. Win a game.

**Expected:**
- Cards already up (including the base card) are credited `$5` each at Commit; every later card `+$5`.
- A full win after Commit ends at `+$208` (`52 × $5 - $52`).

### T-19 Card counting toggle
**Steps:**
1. Observe the panel (absent), press **Count** (ON), deal cards, press **Count** (OFF), ON again.

**Expected:**
- Off at the start of every game; no panel while OFF.
- ON: Talon/Hand/Stock counts, talon and hand card by card (`?` for unseen), `$1` per newly visible hand/talon card, cap `$34`.
- Cards paid for are never billed again; cards that became visible while OFF are billed when ON.

### T-20 Cheat and Sound toggles
**Expected:** "Cheat: ON" is green with arrows and glows; "Cheat: OFF" is grey with none. Sound the same.

### T-21 Refusals are explained
**Steps:**
1. Try to drop the talon card on an empty tableau while the stock has cards; try to move a pile into an empty space.

**Expected:** "Empty space: the talon may fill it only after the stock is used up." / "A pile can't be moved into an empty space." (click and drag).

### T-22 Command bar is safe to type in
**Expected:** Typing `ht`, `n`, `u` in the command bar never opens Help, starts a new game or undoes.

### T-23 Reset Bankroll
**Expected:** After confirmation: bankroll `-$13` in a fresh deal, Account Book empty (treated as a new player). *New Game* keeps the running bankroll.

### T-24 Victory animation
**Expected:** On a win, cards leave the foundations, bounce off the bottom edge and leave a trail; "You won!" and the final bankroll stay readable; disabled under `prefers-reduced-motion`.

### T-25 Phase notices
**Expected:** Entering Buy (9 s), Inspect (7 s) and Commit (5 s) shows a dismissible notice; a small "Phase: X" tag stays on the board.

## Known limitations

- The original's end-of-game `showcards()` reveal of all remaining cards is not ported.
- No live URL yet.
