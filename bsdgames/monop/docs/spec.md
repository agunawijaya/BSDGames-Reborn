# `monop` — Specification

> Formal rules and data specification. Reference this for the
> port's test suite and rules engine.

---

## Board

- 40 squares, indices 0–39.
- Square 0 = **GO**.
- Square 10 = **Jail / Just Visiting** (dual-purpose).
- Square 20 = **Free Parking**.
- Square 30 = **Go to Jail**.
- 22 street properties in 8 color groups.
- 4 railroads (indices 5, 15, 25, 35).
- 2 utilities (indices 12, 28).
- Corner squares: GO, Jail, Free Parking, Go to Jail.
- Card squares: Community Chest (3), Chance (3).
- Tax squares: Income Tax (index 4), Luxury Tax (index 38).

Standard sequence follows the canonical Parker Brothers 1935
Atlantic City board layout. See `brd.dat` in upstream source.

## Color groups (monopolies)

| Group      | House cost | # properties |
|---         |---:|---:|
| Purple     | $50  | 2 |
| Lt. Blue   | $50  | 3 |
| Violet     | $100 | 3 |
| Orange     | $100 | 3 |
| Red        | $150 | 3 |
| Yellow     | $150 | 3 |
| Green      | $200 | 3 |
| Dk. Blue   | $200 | 2 |

Total: 22 street properties.

## Starting conditions

- Each player starts with **$1500**.
- Each player starts on **GO** (square 0).
- Nobody starts with property or GOJF cards.
- Starting player chosen by highest 2d6 roll (ties re-roll).

## Movement

- **Roll 2d6.** Move forward that many squares.
- **Doubles → extra turn.** 3rd double in a row → straight to
  jail. Reset counter on non-double.
- **Pass GO** → collect **$200**.
- **Land on Go to Jail** → move to Jail (do NOT collect $200).

## Property purchase

- **Unowned property landed on:** offered to current player at
  face price (from `prop.dat` / `mon.dat`).
- **Accept:** cost deducted; owner recorded.
- **Refuse:** auction, unless only 2 solvent players remain, in
  which case the property stays unowned (**house rule
  variant**).

## Auctions

- All solvent players (money ≥ 0) bid.
- Highest bid wins; must be ≥ $0.
- Bids in $1 increments (implementation detail).
- Non-participating players bid `0` implicitly.

## Rent

- **Unowned:** $0.
- **Owned, single property:** base rent.
- **Owned, all in color group ("monopoly"):** rent × 2, even
  with no houses.
- **1 house:** rent tier 3.
- **2 houses:** rent tier 4.
- **3 houses:** rent tier 5.
- **4 houses:** rent tier 6.
- **Hotel (5 houses):** rent tier 7.
- **Mortgaged property:** $0.

Railroads:
- Own 1 RR: $25 rent.
- Own 2 RR: $50.
- Own 3 RR: $100.
- Own 4 RR: $200.

Utilities:
- Own 1 utility: rent = 4 × dice.
- Own 2 utilities: rent = 10 × dice.

## Houses

- Buy on **owned monopoly** only.
- Build **evenly**: no property in a group can have >1 house
  more than the least-built in the same group.
- Max **4 houses** per property.
- **5th house = hotel.** Hotel replaces 4 houses (freeing them
  back to the bank supply).
- Original 1935 rules impose bank house/hotel supply limits (32
  houses, 12 hotels); `monop` may or may not enforce these —
  port should verify against `houses.c`.

## Selling houses

- Sell back to bank at **half price**.
- Must sell evenly (same balance rule as buying).

## Mortgages

- **Mortgage value = half of property price** (rounded down).
- **Unmortgage cost = mortgage value + 10 %**.
- Cannot mortgage a property with houses.

## Jail

Entry conditions:
1. Land on "Go to Jail" square (30).
2. Draw "Go to Jail" Chance/Community Chest card.
3. Roll 3 consecutive doubles.

Exit conditions:
1. `pay` — pay $50, exit to Just Visiting.
2. `card` — use GOJF card (if held).
3. `roll` — if doubles, exit and move that many squares. On
   failure, remain in jail (turn ends).
4. After 3 failed rolls, MUST pay $50 or use a card.

## Income Tax (square 4)

- Pay **10 % of net worth** OR **$200**, player's choice.
- Net worth = cash + property face value + house face value.

## Luxury Tax (square 38)

- Pay **$75** flat.

## Chance & Community Chest

- 16 cards each.
- Cards are drawn from the top of the deck, applied, and
  returned to the bottom (except GOJF, which is held by the
  player until used or traded).
- **Card effects** include:
  - Pay/collect fixed amount.
  - Pay/collect from each other player.
  - Move to specific square.
  - Move backwards N squares.
  - Move to nearest railroad or utility.
  - Go to jail.
  - Assess repairs on houses/hotels (per-house fee).
  - Get out of jail free (kept as a card).

## GOJF cards

- 2 in total: 1 Chance, 1 Community Chest.
- Kept in player's inventory (`num_gojf`).
- Can be used, traded, or returned to deck on resignation.

## Trades

- Between 2 players, current player initiating.
- Each side offers:
  - Money.
  - Property (list of).
  - GOJF cards (count of).
- Confirmation required from both sides (or from initiator
  only, in some interpretations).
- Property cannot be traded if mortgaged, unless mortgage is
  transferred with it and 10 % interest paid immediately by
  receiver.

## Debt ("fix the problem")

- Player may **temporarily** go negative in cash.
- Turn cannot end until cash ≥ 0.
- Debt resolution options (via `force_morg()`):
  1. Sell houses back.
  2. Mortgage property.
  3. Trade for cash.
  4. Resign to creditor.
- If no solution exists, forced resignation.

## Resignation

- To a specific player: all property and GOJF cards go to them.
- To the bank: property becomes unowned; GOJF cards return to
  the deck.
- Resigned player is eliminated. Game continues.

## Winning

- Last solvent player wins.
- No explicit win screen in `monop` — game simply ends when only
  one player remains.

## Save file

- Binary struct dump — host and compiler-specific.
- Contains: `play[]`, `mon[]`, `prop[]`, `rr[]`, `util[]`,
  deck state, `player` index, dice counters.
- **Not portable.** A port MUST replace with a schema-based
  format.

## Input grammar

- Commands are matched as **shortest unique prefix**.
- Case insensitive.
- Enter (`<RETURN>`) alone = `roll`.
- `?` at any string prompt lists valid inputs.

## Commands (canonical list)

```
quit, print, where, own holdings, holdings, mortgage,
unmortgage, buy houses, sell houses, card, pay, trade, resign,
save, restore, roll
```

Yes/no commands accept:
```
yes, no, quit, print, where, own holdings, holdings
```

## Constants (from `monop.h`)

| Name    | Value | Meaning |
|---      |---:|---|
| N_MON   | 8    | Number of color groups |
| N_PROP  | 22   | Number of street properties |
| N_RR    | 4    | Number of railroads |
| N_UTIL  | 2    | Number of utilities |
| N_SQRS  | 40   | Total squares |
| MAX_PL  | 9    | Maximum players |
| MAX_PRP | 28   | Total ownable properties (N_PROP+N_RR+N_UTIL) |
| JAIL    | 40   | Jail's virtual square index |

## Random seed

- `srand(getpid())` at launch.
- No user control over seed.
- Port SHOULD add `--seed N` flag for reproducibility.

## Errors and edge cases

- **Duplicate player name:** rejected (case-insensitive).
- **Reserved name `done`:** rejected.
- **Player count 0 or > 9:** rejected; re-prompted.
- **Bid negative:** rejected.
- **Uneven house building:** re-prompted.
- **Mortgage on property with houses:** rejected.
- **Unmortgage without cash:** rejected (falls into debt loop).
- **Save file corrupt/wrong endian:** undefined behavior in
  original. Port MUST detect and error clearly.

## See also

- Rules exposition: [`how-to-play.md`](./how-to-play.md).
- Code structure: [`architecture.md`](./architecture.md).
- Test scripts: [`test-scenarios.md`](./test-scenarios.md).
