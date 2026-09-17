# `canfield` — How to Play

> If you've never played solitaire before, consult a solitaire
> instruction book first. Canfield's rules are dense.

---

## The layout

- **Foundations (4).** Top-right of screen. Each grows upward in
  suit from a **base rank** (determined by the first card).
- **Base rank display.** Top-left, shows the rank all four
  foundations must start on.
- **Tableau (4 piles).** Middle. Grow downward in alternating
  colors.
- **Stock (1 card visible).** Left side. Face-up card available
  to be played onto a foundation or tableau. Empty spaces in
  tableau are filled *only* from the stock.
- **Talon (1 card visible).** Below stock. Top card of the pile
  from `ht` deals. Available to foundation or tableau.
- **Hand (invisible).** The face-down remainder. `ht` deals 3
  cards from hand → talon.

## Commands (typed at `Move:` prompt)

| Command | Meaning |
|---|---|
| `s1`, `s2`, `s3`, `s4` | Stock → tableau pile 1–4. |
| `sf` | Stock → foundation (auto-picks the right one). |
| `t1`, `t2`, `t3`, `t4` | Talon → tableau pile 1–4. |
| `tf` | Talon → foundation. |
| `12`, `13`, `14`, `21`, ... | Tableau → tableau (whole pile moved). |
| `1f`, `2f`, `3f`, `4f` | Tableau → foundation. |
| `ht` | Hand → talon (deal 3 cards). |
| `c` | Toggle card counting on/off. |
| `b` | Show betting information (top-right box swaps). |
| `q` | Quit; asks confirmation. |

## Basic rules

1. **Tableau builds down in alternating colors.**
   E.g., a red 8 goes on a black 9.
2. **Foundations build up in suit** from the base rank
   (wrap-around: ..., J, Q, K, A, 2, 3, ...).
3. **Move a whole pile at a time** when building tableau to
   tableau — not just the top card.
4. **Empty tableau space** may be filled *only from the stock*,
   never from another tableau or the talon (unless the stock is
   exhausted — then talon is allowed).
5. **`ht` deals 3 cards at a time** from hand → talon. Only the
   top card is playable. When the hand is exhausted, running
   through again costs $5.
6. **Foundation base cards auto-move** when they become available.
   You never have to type "sf" for the very first Ace-equivalent.

## The betting rules

Canfield's economic model is what makes this port unique:

| Charge | Amount |
|---|---:|
| Initial deal (dealing the hand) | $13 |
| Inspection (foundation-only moves allowed) | +$13 |
| Buying the game (unlocks all moves) | +$26 |
| Each re-run through the hand after the first | $5 |
| Each unknown card revealed by counting | $1 |
| Max counting cost per session | $34 |
| Thinking time | $1 per minute |
| Max thinking-time charge per move | $3 |
| **Credit per card reaching foundation** | +$5 |

**Break-even point:** you need **~10 cards** onto foundations to
recoup the $52 buy-in. Statistically, that's roughly a coin flip
on any given deal — before counting the meter charge for
thinking time.

## A typical session

1. Launch `canfield`. It asks about instructions; press `n` if
   you know the rules.
2. Initial deal appears. Cards on tableau and one card each on
   stock and talon.
3. Look at the base rank in the top-left. Every foundation
   starts there.
4. Play the highest-priority moves first: anything to foundation
   is money.
5. If you're stuck, type `ht` to deal 3 more cards to the talon.
6. If you need help remembering what's out, toggle `c` — but
   you'll be billed for each unknown card revealed.
7. Consider stopping and quitting if the deal looks bad. You've
   already paid $13; quitting now doesn't cost the $26 for full
   commitment.

## Tips (for humans)

- **Inspection is cheap; commitment is expensive.** Spend the
  $13 to inspect the deal (foundation-only moves) before paying
  the $26 to commit.
- **Priority order for moves:**
  1. Foundation moves first (they pay $5).
  2. Tableau moves that reveal a hidden card.
  3. Stock moves that unblock a tableau space.
- **Card counting pays off** if the game is close. Otherwise it's
  just a $34 tax.
- **Watch the thinking-time meter.** Don't stare — decide and
  move.
- **Take notes on the base rank.** Each deal has a different one;
  your foundation targets shift accordingly.

## Common questions

**Q: What's the difference between Canfield and Klondike?**
A: Canfield has 4 tableau piles (Klondike has 7), 3-cards-at-a-time
dealing (Klondike varies), an auto-placing base rank (Klondike
starts foundations at Ace), and — in this port — a betting economy.

**Q: What's the win rate?**
A: Roughly 3% for expert play. Canfield is notoriously hard.

**Q: How does `cfscores` work?**
A: `cfscores` (no args) prints your account balance. `cfscores
user` prints a specific user's. `cfscores -a` prints everyone's.

**Q: Can I cheat by editing the score file?**
A: The man page's BUGS section says "It is impossible to cheat" —
because the score file is owned by the games group and world-
unwritable in the original setup. A port MUST replace this with
per-user files.

**Q: Can I save mid-game?**
A: No. Canfield doesn't have save/restore. Games are
one-sitting.

## See also

- Full command reference: [`manpage.md`](./manpage.md).
- Code walkthrough: [`architecture.md`](./architecture.md).
- Test scenarios: [`test-scenarios.md`](./test-scenarios.md).
