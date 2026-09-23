# `canfield` — How to Play

> Canfield is a casino solitaire. You do not play for free: every
> deal, every hint, every second of thinking, and every new round
> through the deck costs money. The only way to earn money back is
> to move cards onto the **foundations**.
>
> If you already know solitaire, skip to [Basic rules](#basic-rules).

---

## Canfield for absolute beginners

### What you see on the table

Imagine a card table with four areas:

| Area | Where | What it is |
|---|---|---|
| **Foundations** | Top right, 4 empty slots | Where you finally collect all 52 cards. |
| **Tableau** | Middle, 4 vertical piles | Where you build temporary sequences. |
| **Stock** | Left side | A face-up pile of 13 reserve cards. |
| **Talon** | Below the stock | A small pile that receives cards from the Hand. |
| **Hand** | Hidden off-screen | 31 face-down cards; you draw from it in chunks of 3. |

### The goal

Move **all 52 cards** to the four foundations.

Each foundation must follow the **same suit** and grow upward from a
starting rank called the **base rank**.

### The base rank

The very first card placed on the first foundation is the **base
card**. Its rank becomes the starting rank for **all four**
foundations.

Example: if the base card is **7♠**, every foundation must start
with a **7**:

- Foundation 1: 7♠, 8♠, 9♠, 10♠, J♠, Q♠, K♠, A♠, 2♠ …
- Foundation 2: 7♥, 8♥, 9♥ …
- Foundation 3: 7♦, 8♦, 9♦ …
- Foundation 4: 7♣, 8♣, 9♣ …

After **K** comes **A**, then **2**, and so on — it wraps around.

### Stock vs Talon vs Hand

Think of them like three sources of extra cards:

- **Stock** = a small open deck of 13 cards. You can see and use the
top card any time after you Commit.
- **Talon** = a working pile. Only its top card is usable.
- **Hand** = a big closed deck of 31 cards. You cannot touch it
directly. You must click **Deal Hand → Talon** to move 3 cards from
the Hand onto the Talon.

When the Hand is empty, the Talon is flipped back into the Hand so
you can deal again — but each re-run costs **$5**.

### What is a foundation move?

A **foundation move** is simply moving one card onto a foundation
pile. Every foundation move earns you **$5**.

Example with base rank **7♠**:

| Card you have | Can it go to a foundation? | Why? |
|---|---|---|
| 8♠ | ✅ Yes | Next rank after 7, same suit. |
| 7♥ | ✅ Yes | Same rank as the base card, starts a new foundation. |
| 9♠ | ❌ No | You need 8♠ first. |
| 8♥ | ❌ No | 8♥ belongs in the hearts foundation, but that foundation only starts at 7, so only 7♥ is accepted right now. |

Foundation moves are the **only moves that pay you**. Every other
move just rearranges cards on the table.

### The three betting phases

Canfield is a casino game, so you pay in stages. Think of it like
buying a used car:

| Phase | Cost | What you can do | Analogy |
|---|---|---|---|
| **Buy / Deal** | $13 | Look at the table only. No moves. | See the car from outside. |
| **Inspect** | +$13 (total $26) | Move cards to foundations only. You cannot deal from Hand or move cards between tableaus. | Start the engine, check the lights. |
| **Commit** | +$26 (total $52, or $39 straight from Buy) | All moves unlocked: foundation, tableau, stock, talon, and Deal Hand. | Take the car for a full drive. |

#### Why would you Inspect instead of Committing immediately?

**Inspect is cheap insurance.**

Suppose the deal shows two easy foundation moves. You Inspect, earn
$10, then realize the rest of the cards are stuck. You **Quit** and
lose only **$16** total ($26 paid minus $10 earned).

If you had **Commit**ted immediately, you would have paid **$39** or
**$52** and still been stuck. Inspection lets you test the deal
before risking the full amount.

#### When should you Commit immediately?

- The tableau already connects well.
- You see several foundation moves.
- You are confident the deal is winnable or at least profitable.

### Can you win by Inspection alone?

No. During Inspection the **Hand is locked**. You cannot click **Deal
Hand → Talon**, so you can never reach the 31 hidden cards. Inspect
only lets you play the cards already visible. It is a **trial**, not
a full game.

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
| **Buy-in from deal straight to full game** | **$39** (= $13 + $13 + $26) |
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
4. Choose how to enter the deal:
   - **Inspect** ($13 more) — try foundation moves only. This is
     the cheap trial.
   - **Commit / Buy the game** ($26 more, or $39 total straight
     from the deal) — unlock all moves, including the hand→talon
     deal and tableau-to-tableau moves.
5. Play the highest-priority moves first: anything to foundation
   is money.
6. If you're stuck, type `ht` to deal 3 more cards to the talon.
7. If you need help remembering what's out, toggle `c` — but
   you'll be billed for each unknown card revealed.
8. Consider stopping and quitting if the deal looks bad. After
   Inspect you've paid $26; after Commit you've paid $52.

## Tips (for humans)

- **Inspection is cheap; commitment is expensive.** Spend the
  $13 to inspect the deal (foundation-only moves) before paying
  the $26 to commit. If the deal is obviously good, you can
  commit straight from the initial deal for $39 total instead of
  clicking Inspect then Commit.
- **Foundation moves mean money.** A foundation move is any move
  that places a card onto a foundation pile, earning $5. During
  Inspect, only foundation moves are allowed; you cannot yet move
  cards onto tableau piles or deal from the hand to the talon.
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
