# `monop` — How to Play

> A complete practical guide. If you've never played Monopoly on
> paper, everything you need is here. If you've played Monopoly
> for 30 years, skip to §"The 16 commands" and §"House rules that
> differ from Hasbro".

---

## Setting up

1. Launch the binary: `monop` (or `monop savefile` to restore).
2. **Enter number of players** (1–9). One player is legal — the
   game will run — but useless without at least two.
3. **Enter each player's name.** Names must be unique
   (case-insensitive). `done` is a reserved word — you cannot
   name a player `done`.
4. The game asks each player to **roll two dice for starting
   position**. Highest roll goes first. Ties re-roll.
5. Every player starts with **$1500** on **GO**.

## The 16 commands

At the `-- Command:` prompt, type any of:

| # | Command | Effect |
|--:|---|---|
| 0 | `quit` | Exit the game (asks for confirmation). |
| 1 | `print` | Print the full 40-square board with rents/owners. |
| 2 | `where` | Show every player's location. |
| 3 | `own holdings` | Show your money, GOJF cards, and properties. |
| 4 | `holdings` | Show any player's holdings (prompts for name). |
| 5 | `mortgage` | Mortgage owned property at half price. |
| 6 | `unmortgage` | Unmortgage — pays mortgage + 10 % interest. |
| 7 | `buy houses` | Buy houses on a monopoly you own. |
| 8 | `sell houses` | Sell houses back to the bank. |
| 9 | `card` | Use a Get-Out-Of-Jail-Free card. |
|10 | `pay` | Pay $50 to leave jail. |
|11 | `trade` | Trade property/money/cards with another player. |
|12 | `resign` | Resign to another player or the bank. |
|13 | `save` | Save the current game to a file. |
|14 | `restore` | Restore a saved game. |
|15 | `roll` | Roll the dice and advance. |
| — | `<RETURN>` | Same as `roll`. |

**Unique-prefix matching:** `p` → `print`, `q` → `quit`, `pa` →
`pay`. Where a prefix is ambiguous, the game asks you to
disambiguate. Type `?` at any prompt to see the list.

## A typical turn

1. Prompt appears: `Alice (1) (cash $1500) on === GO ===` then
   `-- Command:`.
2. Press `<RETURN>` or type `roll`.
3. The game rolls 2d6 (`roll is 4, 3` for example) and moves you
   forward.
4. **If you land on a special square**, the resolution is
   automatic:
   - **Property (unowned):** you're offered to buy it. If you
     refuse, an auction opens between all solvent players — with
     the special exception below.
   - **Property (owned):** rent is deducted automatically.
   - **Community Chest / Chance:** the top card is drawn and its
     effect applied.
   - **Income Tax:** pay 10 % of your net worth or $200
     (whichever is less). Original 1980 rules: player chooses.
   - **Luxury Tax:** pay $75.
   - **Go to Jail:** move to Jail; do not pass GO; do not collect
     $200.
   - **Just Visiting / Free Parking:** nothing happens.
5. **If you rolled doubles**, you get another turn — unless it's
   your 3rd double, in which case you go directly to jail.
6. **Debt check:** if you're now in the negative, you MUST resolve
   it before ending your turn (see "Debt" below).
7. Turn ends; next player.

## Buying property

- Land on unowned property → prompt: *"Do you wish to buy?"*.
- Type `yes` → property becomes yours; cost deducted.
- Type `no` → **auction** among solvent players.
- If only 2 solvent players remain, the auction is **skipped** and
  the property stays unowned (this is the house-rule variant).

## Auctions

- Highest bidder wins.
- Minimum bid is $0 (some versions require $1).
- Non-solvent players (in debt) may not bid.
- Auction ends when no player raises.

## Monopolies and houses

- A **monopoly** = owning all properties of the same color group.
- Once you have a monopoly, rent doubles even without houses.
- `buy houses` builds houses **evenly** across the color group.
  Attempting to build unevenly (more than 1 house difference within
  a color group) triggers a warning and prompts you to re-input.
- **Max houses per property:** 4. Buying a 5th house builds a
  **hotel** (which occupies the 4 house-slots plus 1).
- **House cost** varies by color group (see the man page /
  `mon.dat`):
  - Brown/Light-Blue: $50/house.
  - Pink/Orange: $100/house.
  - Red/Yellow: $150/house.
  - Green/Dark-Blue: $200/house.

## Mortgaging

- `mortgage` any owned property (with no houses) at half price.
- `unmortgage` costs mortgage price + 10 % interest.
- Mortgaged property earns no rent.

## Jail

- Land on "Go to Jail" square, roll 3 doubles, or draw the "Go to
  Jail" card → you go to jail.
- From jail, on your turn you can:
  1. `roll` — if you roll doubles, you're out (and move). Otherwise
     stay. After 3 failed rolls, you MUST pay $50 or use a card.
  2. `pay` — pay $50, get out, become "Just Visiting".
  3. `card` — use a Get-Out-Of-Jail-Free card (if held).

## Trading

- `trade` starts a negotiation with another named player.
- Each player specifies what they give up: money, property,
  Get-Out-Of-Jail-Free cards.
- Summary displayed for confirmation before commit.

## Debt: "fix the problem"

- You can spend beyond your cash — the game lets you go negative
  temporarily.
- BUT: your turn will not end until you're solvent again.
- Options to fix the problem:
  1. Sell houses back to the bank (`sell houses`).
  2. Mortgage property (`mortgage`).
  3. Trade for cash with another player (`trade`).
  4. **Resign** to your creditor — game ends for you.
- If you cannot become solvent, you must `resign`. All property
  passes to your creditor (a player or the bank); GOJF cards
  return to the deck.

## Saving and restoring

- `save` prompts for a filename; overwrites confirmed.
- `restore` prompts for a filename; leaves the file intact.
- You can also `monop savefile` at launch to restore directly.
- Note: the save file format is **binary, host-specific**. Do not
  expect it to survive an OS or compiler change. Modern ports
  should use JSON or SQLite.

## Winning

- Last solvent player wins.
- No explicit "you won!" screen — the game just ends when only one
  player remains.
- No high-score table.

## House rules that differ from Hasbro

1. **2-solvent-player auction skip** — as described above.
2. **Free Parking** = nothing (Hasbro rules are the same; many
   houses play with money accumulating there, but `monop`
   follows the printed rules).
3. **Income Tax** in the 1980 code lets you *choose* $200 or
   10% — some later official rules mandate a choice or the fixed
   $200.
4. **No trading during another player's turn** in some variants;
   `monop` allows a player to `trade` on their own turn.

## Tips (for humans)

- **The oranges and reds are king.** These color groups get the
  most landings statistically because Jail is a magnet. Prioritize
  them.
- **Build the 3rd house.** Rent multipliers jump the most between
  2 and 3 houses.
- **Trade for monopolies early.** Once anyone builds a monopoly,
  the game accelerates.
- **Don't cash out too early.** Mortgaging a property halves your
  future rent income; only do it if you're desperate.
- **Save often.** A 4-player game can run 3+ hours; save between
  significant events (buys, trades) so you can restore if the
  session is interrupted.

## Common questions

**Q: Can `monop` play as an AI opponent?**
A: No. It only enforces rules; no strategic decisions are made by
the program.

**Q: Can I play remotely, with players on different terminals?**
A: No — `monop` is single-terminal only. `phantasia` and `hunt`
are the BSDGames multi-terminal titles.

**Q: Is monop deterministic given a seed?**
A: No — `srand(getpid())` seeds randomness at launch. There is no
seed control.

**Q: How long does a game take?**
A: 60–180 minutes typical. `save`/`restore` exists because of
this.

**Q: Can I cheat by editing the save file?**
A: The save file is binary and host-specific, but yes — a
determined player could modify it. There's no checksum.

## See also

- Full command reference: [`manpage.md`](./manpage.md).
- Code walkthrough: [`architecture.md`](./architecture.md).
- Test scenarios: [`test-scenarios.md`](./test-scenarios.md).
