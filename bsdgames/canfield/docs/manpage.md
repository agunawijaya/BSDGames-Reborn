# `canfield` — Man Page (annotated)

> The original `canfield(6)` man page, reproduced with light
> annotations. Original source: `canfield.6.in` in upstream
> BSDGames. Upstream URL:
> <https://github.com/vattam/BSDGames/blob/master/canfield/canfield/canfield.6.in>

---

## NAME

**canfield**, **cfscores** — the solitaire card game canfield

## SYNOPSIS

```
canfield
cfscores [-a] [user]
```

## DESCRIPTION

If you have never played solitaire before, it is recommended that
you consult a solitaire instruction book. In Canfield, tableau
cards may be built on each other downward in alternate colors. An
entire pile must be moved as a unit in building. Top cards of the
piles are available to be played on foundations, but never into
empty spaces.

Spaces must be filled from the stock. The top card of the stock
also is available to be played on foundations or built on tableau
piles. After the stock is exhausted, tableau spaces may be filled
from the talon and the player may keep them open until he wishes
to use them.

Cards are dealt from the hand to the talon by threes and this
repeats until there are no more cards in the hand or the player
quits. To have cards dealt onto the talon the player types
**ht** for his move. Foundation base cards are also automatically
moved to the foundation when they become available.

The command **c** causes **canfield** to maintain card counting
statistics on the bottom of the screen. When properly used this
can greatly increase one's chances of winning.

## BETTING

The rules for betting are somewhat less strict than those used in
the official version of the game.

- The initial deal costs **$13**.
- You may quit at this point or **inspect** the game.
- Inspection costs **$13** and allows you to make as many
  moves as possible without moving any cards from your hand to
  the talon. (The initial deal places three cards on the talon;
  if all these cards are used, three more are made available.)
- Finally, if the game seems interesting, you must pay the final
  installment of **$26**.
- At this point you are credited at the rate of **$5** for each
  card on the foundation; as the game progresses you are credited
  with **$5** for each card that is moved to the foundation.
- Each run through the hand after the first costs **$5**.
- The card counting feature costs **$1** for each unknown card
  that is identified. If the information is toggled on, you are
  only charged for cards that became visible since it was last
  turned on. Thus the maximum cost of information is **$34**.
- Playing time is charged at a rate of **$1 per minute**.

## `cfscores`

With no arguments, the program **cfscores** prints out the current
status of your canfield account.

If a **user** name is specified, it prints out the status of that
user's canfield account.

If the **-a** flag is specified, it prints out the canfield
accounts for all users that have played the game since the
database was set up.

## FILES

- `<gamesdir>/canfield` — the game itself.
- `<gamesdir>/cfscores` — the database printer.
- `<scorefile>` — the database of scores.

> **[Note]:** In the original BSD deployment, `<gamesdir>` is
> `/usr/games` and `<scorefile>` is `/var/games/canfield.scores`.
> A modern port should use per-user data directories.

## BUGS

**It is impossible to cheat.**

> **[Annotator's note]:** This is the shortest and most amusing
> BUGS section in all of BSDGames. It refers to the setgid score
> file that only the game can update — users cannot edit their
> own balance. A modern port should replace this mechanism with
> per-user files (making cheating trivially possible on your own
> machine) or with cryptographic signing (preserving the
> guarantee in a multi-user context).

## AUTHORS

Originally written: **Steve Levine**.

Further random hacking by: **Steve Feldman**, **Kirk McKusick**,
**Mikey Olson**, and **Eric Allman**.

> **[Attribution detail]:** From the source comment header:
> - Originally written: Steve Levine.
> - Converted to use curses and debugged: Steve Feldman.
> - Card counting: Kirk McKusick and Mikey Olson.
> - User interface cleanups: Eric Allman and Kirk McKusick.
> - Betting by Kirk McKusick.

---

## Annotator's addenda

- **10-command grammar.** All commands are 1 or 2 characters. No
  chording, no special keys, no arrow navigation. Everything
  types cleanly on a VT100.
- **Instructions-first prompt.** The first thing the game asks
  is whether you want instructions. Instructions are ~30 lines
  of prose.
- **No save/restore.** Games are one-sitting.
- **Terminal size.** Original assumes 80×24. Doesn't handle
  resize.

## See also

- Rules exposition: [`how-to-play.md`](./how-to-play.md).
- Full spec: [`spec.md`](./spec.md).
- Architecture: [`architecture.md`](./architecture.md).
- **cribbage(6)**, **fish(6)**, **mille(6)** — other BSDGames
  card games.
