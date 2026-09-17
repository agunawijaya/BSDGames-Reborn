# `monop` — Manual Test Scenarios

> Human-executable playthrough scripts. When the port is done,
> most of these become automated tests; some remain manual because
> they involve human trading and negotiation.

---

## Test Environment

- **Terminal:** 80×24 minimum.
- **Platform:** Linux / WSL2. Requires a built `monop` binary
  (see [`diff-log.md`](./diff-log.md) for build steps if working
  from upstream directly).
- **Build:** *(TBD once port begins.)*

## Smoke & Regression Suite

### T-01 — Launch

**Steps:**
1. Run `monop`.

**Expected:** Prompt `How many players?`.

### T-02 — Enter 2 players

**Steps:**
1. Enter `2`.
2. Enter `Alice`.
3. Enter `Bob`.

**Expected:** Starting rolls displayed; higher-roll player goes
first; both have $1500 on GO.

### T-03 — Duplicate name rejected

**Steps:**
1. Enter `2`.
2. Enter `Alice`.
3. Enter `alice` (case-insensitive dup).

**Expected:** Rejection; re-prompted.

### T-04 — Reserved name `done` rejected

**Steps:**
1. Enter `2`.
2. Enter `done`.

**Expected:** Rejection; re-prompted.

### T-05 — Player count > 9 rejected

**Steps:**
1. Enter `10`.

**Expected:** Rejection or clamped; re-prompted.

### T-06 — `?` help lists 16 commands

**Steps:**
1. At `-- Command:` prompt, type `?`.

**Expected:** Comma-separated list of the 16 commands + RETURN.

### T-07 — Unique-prefix `p` → `print`

**Steps:**
1. Type `p`.

**Expected:** Board printed.

### T-08 — Ambiguous prefix `pa` → `pay`

**Steps:**
1. Type `pa`.

**Expected:** `pay` invoked (if not in jail, appropriate
error).

### T-09 — Roll and land on unowned property

**Steps:**
1. `roll`.
2. Land on unowned property.

**Expected:** Buy prompt. Y/N.

### T-10 — Buy property

**Steps:**
1. From T-09, `yes`.

**Expected:** Cash reduced by property price; property owned.

### T-11 — Refuse to buy → auction (3+ solvent players)

**Setup:** 3-player game.

**Steps:**
1. Land on unowned; refuse.

**Expected:** Auction prompt for all solvent players.

### T-12 — Refuse to buy → auction skipped (2 solvent players)

**Setup:** 2-player game.

**Steps:**
1. Land on unowned; refuse.

**Expected:** Property stays unowned; no auction — this is the
**house rule variant**.

### T-13 — Doubles → extra turn

**Steps:**
1. Roll doubles (mock via known seed if possible).

**Expected:** After landing resolution, prompt again for same
player.

### T-14 — 3 doubles → jail

**Steps:**
1. Roll doubles 3 times consecutively.

**Expected:** Player teleported to jail.

### T-15 — Land on "Go to Jail"

**Steps:**
1. Move onto square 30.

**Expected:** Move to jail (square 40); no $200 collected.

### T-16 — Draw Chance card

**Steps:**
1. Land on Chance square.

**Expected:** Card drawn; effect applied; ruler `------`
separators visible.

### T-17 — Draw Community Chest card

**Steps:**
1. Land on Community Chest square.

**Expected:** Card drawn; effect applied.

### T-18 — Pass GO

**Steps:**
1. Move past square 0.

**Expected:** $200 credited.

### T-19 — Land on GO exactly

**Steps:**
1. Land on square 0.

**Expected:** $200 credited (standard rule).

### T-20 — Buy houses evenly

**Setup:** Own a monopoly.

**Steps:**
1. `buy houses`.
2. Attempt to buy 3 houses on one property + 0 on others.

**Expected:** Rejection with message about even builds.

### T-21 — Buy houses (valid)

**Steps:**
1. Buy 1 house on each property.

**Expected:** House count incremented; cash reduced.

### T-22 — Sell houses at half price

**Steps:**
1. `sell houses`.

**Expected:** Cash increased by half of original price.

### T-23 — Mortgage a property

**Steps:**
1. `mortgage`.

**Expected:** Cash increased by half price; `Mg` flag set on
`print`.

### T-24 — Unmortgage (with cash)

**Steps:**
1. `unmortgage`.

**Expected:** Cash decreased by mortgage price + 10 %.

### T-25 — Mortgage rejected on property with houses

**Steps:**
1. Own property with houses.
2. `mortgage`.

**Expected:** Rejection with explanation.

### T-26 — Trade property

**Steps:**
1. `trade` between Alice and Bob.
2. Alice offers Baltic Ave; Bob offers $100.

**Expected:** Trade confirmed and executed; ownership swaps;
cash transferred.

### T-27 — Debt loop

**Setup:** Roll onto expensive owned property; cannot pay rent.

**Expected:** `force_morg()` kicks in; asks player to sell,
mortgage, or resign.

### T-28 — Resign to player

**Steps:**
1. `resign`.
2. Choose creditor.

**Expected:** All property and GOJF cards transfer to creditor.

### T-29 — Resign to bank

**Steps:**
1. `resign`.
2. Choose bank.

**Expected:** Property becomes unowned; GOJF cards return to
deck.

### T-30 — Save

**Steps:**
1. `save`.
2. Enter filename.

**Expected:** Confirmation; file created on disk.

### T-31 — Restore via command-line argument

**Steps:**
1. `monop savefile.dat`.

**Expected:** State restored to the point of save.

### T-32 — Restore command mid-game

**Steps:**
1. `restore`; enter filename.

**Expected:** State replaced; play continues.

### T-33 — GOJF card usage

**Setup:** Player in jail with GOJF.

**Steps:**
1. `card`.

**Expected:** Card consumed; player exits jail to Just
Visiting.

### T-34 — Pay $50 for jail

**Setup:** Player in jail.

**Steps:**
1. `pay`.

**Expected:** $50 deducted; exit jail.

### T-35 — Roll doubles to exit jail

**Setup:** Player in jail.

**Steps:**
1. `roll` doubles.

**Expected:** Exit jail; move that many squares.

### T-36 — 3rd failed roll in jail → forced pay

**Setup:** Player in jail; roll 3 non-doubles.

**Expected:** Forced to pay $50 or use card on 3rd attempt.

### T-37 — Income Tax option

**Steps:**
1. Land on square 4.

**Expected:** Prompt to choose $200 or 10 % of net worth.

### T-38 — Luxury Tax

**Steps:**
1. Land on square 38.

**Expected:** $75 deducted flat.

### T-39 — Win condition

**Setup:** All other players resign or go bankrupt.

**Expected:** Game ends; last player declared winner (implicit).

### T-40 — Print columns

**Steps:**
1. `print`.

**Expected:** Columns: Name (10 chars), Own, Price, Mg, #,
Rent. Two-column layout on 80-column terminal.

### T-41 — `where` marks current player

**Steps:**
1. `where`.

**Expected:** `*` next to current player's row.

### T-42 — `holdings` with `done` to exit

**Steps:**
1. `holdings`.
2. Enter player name.
3. Enter `done`.

**Expected:** List displayed then loop exits.

### T-43 — Empty command = roll

**Steps:**
1. Press `<RETURN>` at `-- Command:` prompt.

**Expected:** Dice rolled (equivalent to `roll`).

### T-44 — Quit with `y`

**Steps:**
1. `quit`.
2. `y`.

**Expected:** Program exits cleanly.

### T-45 — Quit with `n`

**Steps:**
1. `quit`.
2. `n`.

**Expected:** Return to command prompt.

## Sign-off Template

```
- [ ] T-01 launch
- [ ] T-02 enter 2 players
- [ ] T-03 duplicate name rejected
- [ ] T-04 reserved name `done` rejected
- [ ] T-05 player count > 9 rejected
- [ ] T-06 `?` help
- [ ] T-07 unique-prefix `p` → `print`
- [ ] T-08 ambiguous prefix `pa` → `pay`
- [ ] T-09 roll and land on unowned
- [ ] T-10 buy property
- [ ] T-11 refuse → auction (3+ solvent)
- [ ] T-12 refuse → auction skipped (2 solvent) [house rule]
- [ ] T-13 doubles → extra turn
- [ ] T-14 3 doubles → jail
- [ ] T-15 land on Go to Jail
- [ ] T-16 draw Chance
- [ ] T-17 draw Community Chest
- [ ] T-18 pass GO
- [ ] T-19 land on GO exactly
- [ ] T-20 buy houses evenly
- [ ] T-21 buy houses valid
- [ ] T-22 sell houses half price
- [ ] T-23 mortgage
- [ ] T-24 unmortgage
- [ ] T-25 mortgage rejected on housed property
- [ ] T-26 trade
- [ ] T-27 debt loop
- [ ] T-28 resign to player
- [ ] T-29 resign to bank
- [ ] T-30 save
- [ ] T-31 restore via command-line
- [ ] T-32 restore command mid-game
- [ ] T-33 GOJF card usage
- [ ] T-34 pay $50 for jail
- [ ] T-35 roll doubles to exit jail
- [ ] T-36 3rd failed roll → forced pay
- [ ] T-37 income tax option
- [ ] T-38 luxury tax
- [ ] T-39 win condition
- [ ] T-40 print columns
- [ ] T-41 where marks current player
- [ ] T-42 holdings with done
- [ ] T-43 empty command = roll
- [ ] T-44 quit with y
- [ ] T-45 quit with n

Tested by: [name]
Date: YYYY-MM-DD
Build: [commit hash]
```

## Regression from Bugs

*(None yet — port not started.)*
