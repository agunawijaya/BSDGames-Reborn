# `monop` — Man Page (annotated)

> The original `monop(6)` man page, reproduced with light
> annotations. Original source: `monop.6.in` in upstream BSDGames.
> Upstream URL:
> <https://github.com/vattam/BSDGames/blob/master/monop/monop.6.in>

---

## NAME

**monop** — Monopoly game

## SYNOPSIS

```
monop [file]
```

`file` is an optional saved-game file to restore.

## DESCRIPTION

`monop` is reminiscent of the Parker Brothers game Monopoly, and
monitors a game between 1 to 9 users.

*It is assumed that the rules of Monopoly are known.*

> **[Note]:** This project's [`how-to-play.md`](./how-to-play.md)
> documents the rules for readers who haven't played before.

The game follows the standard rules, with the exception that, if a
property goes up for auction and there are only two solvent
players, no auction is held and the property remains unowned.

> **[House rule variant]:** This 2-solvent-player skip is unique to
> `monop`. A port should preserve this as an optional variant.

The game, in effect, lends the player money, so it is possible to
buy something which you cannot afford. However, as soon as a person
goes into debt, he must "fix the problem", i.e., make himself
solvent, before play can continue. If this is not possible, the
player's property reverts to his debtee, either a player or the
bank.

A player can resign at any time to any person or the bank, which
puts the property back on the board, unowned.

Any time that the response to a question is a **string**, e.g., a
name, place or person, you can type **?** to get a list of valid
answers.

It is not possible to input a negative number, nor is it ever
necessary.

## A SUMMARY OF COMMANDS

### `quit`
Quit game. Asks if you're sure.

### `print`
Print out the current board. The columns:

- **Name** — first 10 characters of the square name.
- **Own** — number of the owner.
- **Price** — cost of the property.
- **Mg** — `*` if mortgaged.
- **#** — number of railroads/utilities owned OR number of houses.
- **Rent** — current rent (if owned).

### `where`
Where players are. `*` marks the current player.

### `own holdings`
List your own holdings — money, GOJF cards, property.

### `holdings`
Look at anyone's holdings. Prompts for a name. Type `done` to
finish.

### `mortgage`
Mortgage property. Sets up a list of mortgageable property.

### `unmortgage`
Unmortgage. Pays mortgage price + 10 % interest.

### `buy houses`
Sets up a list of monopolies. Asks how many houses for each
property. Uneven builds (>1 house difference within a monopoly)
are rejected.

### `sell houses`
Analogous to `buy`. Sells at half price.

### `card`
Use a get-out-of-jail-free card. Errors if you don't have one or
aren't in jail.

### `pay`
Pay $50 to get out of jail. Puts you on Just Visiting.

### `trade`
Trade with another player. Asks whom, then what each gives up.
Summary + confirmation before commit.

### `resign`
Resign to another player or the bank. All property reverts.

### `save`
Save the game to a file. Confirms overwrite.

### `restore`
Read in a saved game. Leaves the file intact.

### `roll`
Roll the dice. Pressing `<RETURN>` is equivalent.

## AUTHOR

Ken Arnold

## FILES

- **@monop_cardsfile@** — Chance and Community Chest cards
  (compiled from `cards.inp` by `initdeck`).

## BUGS

No command can be given an argument instead of a response to a
query.

> **[Note]:** Modern shells make this a stronger critique — being
> unable to `buy houses baltic 3` from the command line is a UX
> weakness. A port should support batched arguments.

---

## Annotator's addenda

- **Prefix matching.** All commands match by shortest unique
  prefix, e.g., `p` for `print`, `q` for `quit`. When ambiguous
  the game asks.
- **`?` help.** Universal at every string prompt.
- **Doubles.** Roll doubles → extra turn. 3 doubles in a row →
  jail.
- **Pass GO → collect $200.**
- **Income Tax** = 10 % of net worth OR $200 (player's choice).
- **Luxury Tax** = $75 flat.
- **RNG.** `srand(getpid())` at launch. Not user-controllable.
- **Save format.** Binary struct dump. Host-specific and
  non-portable.

## See also

- Rules exposition: [`how-to-play.md`](./how-to-play.md).
- Full spec: [`spec.md`](./spec.md).
- Architecture: [`architecture.md`](./architecture.md).
