# `canfield` — Specification

> Formal rules for reference by the port's test suite.

---

## Deck

- **52 cards**, standard suits (spades, clubs, hearts, diamonds),
  standard ranks (Ace=1, ..., King=13).
- **Colors:** spades and clubs = black; hearts and diamonds = red.

## Initial deal

1. Shuffle 52-card deck.
2. Deal 1 card to each of 4 tableau piles (face up).
3. Deal 13 cards to the **stock** (only top visible).
4. The **base card** = the very next card. Place it on the first
   foundation slot. This is the "base rank" all foundations
   start on.
5. Deal 3 cards to the **talon** (only top visible).
6. Remaining 31 cards go to the **hand** (face down).

## Piles

| Pile | Initial size | Visible |
|---|---:|---|
| Foundation × 4 | 0 (except base) | Top only |
| Tableau × 4 | 1 | All |
| Stock | 13 | Top only |
| Talon | 3 | Top only |
| Hand | 31 | None |

## Move rules

### Tableau build
- Downward by rank, alternating color.
- Whole pile must move as a unit (not just top card).

### Foundation build
- Upward by rank, same suit.
- Wraps around: `..., J, Q, K, A, 2, 3, ...` — meaning after King
  comes Ace, and foundations continue growing.

### Empty tableau
- May be filled **only from the stock** — while the stock has
  cards.
- After the stock is exhausted, tableau spaces may be filled from
  the talon; the player may keep spaces empty until convenient.

### Auto-move
- The **base card** (and any subsequent card of the same rank
  when it becomes available) auto-moves to foundation. Player
  never has to type "sf" for these.

## Commands

At the `Move:` prompt, the player types a 1–2 character command:

| Command | Effect |
|---|---|
| `s#` (#=1..4) | Move top of stock to tableau pile #. |
| `sf` | Move top of stock to foundation. |
| `t#` (#=1..4) | Move top of talon to tableau pile #. |
| `tf` | Move top of talon to foundation. |
| `##` (##=12,13,14,21,23,24,31,32,34,41,42,43) | Move whole tableau pile A onto tableau pile B. |
| `#f` (#=1..4) | Move top of tableau pile to foundation. |
| `ht` | Hand → talon: deal 3 cards from hand to top of talon. |
| `c` | Toggle card counting display. |
| `b` | Show betting-info box. |
| `q` | Quit; asks confirmation. |

Invalid moves display an error and do not consume time / money.

## Betting economics

| Charge | Amount |
|---|---:|
| Initial deal | $13 |
| Inspection unlock | +$13 |
| Full-game unlock | +$26 |
| Re-run hand after first | $5 each |
| Card counting: per unknown card revealed | $1 |
| Card counting: max per session | $34 |
| Thinking time | $1 per minute |
| Thinking time: max per move | $3 |
| **Credit per card reaching foundation** | +$5 |

Total possible spend on inspection + game = $13 + $13 + $26 = $52.

**Break-even:** need 10+ cards on foundation, minus meter charges.

## Score persistence

- Each user has a persistent bankroll.
- Original: shared setgid file `/var/games/canfield.scores`,
  indexed by UID.
- Modern port MUST use per-user files.

## `cfscores` companion

- Invocation: `cfscores` (self), `cfscores <user>`, `cfscores -a`.
- Prints wins, spend, net for the target.
- Does not modify state; read-only.

## Winning

- All 52 cards moved to foundations = game won.
- Player may quit at any time — remaining cards forfeit; only
  cards already on foundation counted.

## Losing

- No mechanical loss condition. Player is losing money when the
  meter costs exceed foundation credits.

## Constants (from `canfield.c`)

| Name | Value | Meaning |
|---|---:|---|
| `decksize` | 52 | Deck size |
| `stockcnt` (initial) | 13 | Stock starts at 13 |
| `taloncnt` (per `ht`) | 3 | Cards dealt from hand per `ht` |
| `costofhand` | 13 | Initial deal price |
| `costofinspection` | 13 | Inspection unlock |
| `costofgame` | 26 | Full-game unlock |
| `costofrunthroughhand` | 5 | Re-run cost |
| `costofinformation` | 1 | Per-card counting cost |
| `secondsperdollar` | 60 | 1 second/60 → $1/minute |
| `maxtimecharge` | 3 | Max $ per move for thinking |
| `valuepercardup` | 5 | Foundation credit |

## Random seed

- `srand(time(NULL))` at launch (in original).
- Port SHOULD add `--seed N` for reproducible deals.

## Errors and edge cases

- **Invalid command** — echoed with error, ignored.
- **Illegal move** — echoed with error, ignored.
- **Hand exhausted mid-`ht`** — deal whatever remains (1 or 2
  cards).
- **Terminal resize** — undefined in original; port MUST handle.
- **Score file corrupt** — original may crash; port MUST detect.

## See also

- Rules exposition: [`how-to-play.md`](./how-to-play.md).
- Code structure: [`architecture.md`](./architecture.md).
- Test scripts: [`test-scenarios.md`](./test-scenarios.md).
