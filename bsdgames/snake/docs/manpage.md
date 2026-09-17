# `snake(6)` — Original Man Page (Annotated)

> Mirror of `snake.6.in` from BSDGames.
>
> Upstream source:
> <https://github.com/vattam/BSDGames/blob/master/snake/snake/snake.6.in>

---

```
Copyright (c) 1980, 1993
    The Regents of the University of California. All rights reserved.

Redistribution and use in source and binary forms are permitted per
the standard 3-clause BSD license (see snake.6.in for full notice).

@(#)snake.6  8.1 (Berkeley) 5/31/93
```

## NAME

**snake**, **snscore** — display chase game

## SYNOPSIS

```
snake [-w width] [-l length] [-t]
snscore
```

## DESCRIPTION

`snake` is a display-based game which must be played on a CRT
terminal. The object of the game is to make as much money as
possible without getting eaten by the snake. The `-l` and `-w`
options allow you to specify the length and width of the field. By
default the entire screen is used. The `-t` option makes the game
assume you are on a slow terminal.

You are represented on the screen by an `I`. The snake is 6 squares
long and is represented by `s`'s with an `S` at its head. The money
is `$`, and an exit is `#`. Your score is posted in the upper left
hand corner.

## CONTROLS

You can move around using the same conventions as `vi(1)`: the `h`,
`j`, `k`, and `l` keys work, as do the arrow keys.

Other possibilities include:

- **`sefc`** — These keys are like `hjkl` but form a directed pad
  around the `d` key.
- **`HJKL`** — These keys move you all the way in the indicated
  direction to the same row or column as the money. This does *not*
  let you jump away from the snake, but rather saves you from
  having to type a key repeatedly. The snake still gets all his
  turns.
- **`SEFC`** — Likewise for the upper case versions on the left.
- **`ATPB`** — These keys move you to the four edges of the screen.
  Their position on the keyboard is the mnemonic, e.g. `P` is at
  the far right of the keyboard.
- **`x`** — This lets you quit the game at any time.
- **`p`** — Points in a direction you might want to go.
- **`w`** — Space warp to get out of tight squeezes, at a price.

To earn money, move to the same square the money is on. A new `$`
will appear when you earn the current one. As you get richer, the
snake gets hungrier. To leave the game, move to the exit (`#`).

A record is kept of the personal best score of each player. Scores
are only counted if you leave at the exit, getting eaten by the
snake is worth nothing.

As in pinball, matching the last digit of your score to the number
which appears after the game is worth a bonus.

To see who wastes time playing snake, run `snscore`.

## FILES

- `_PATH_RAWSCORES` — database of personal bests
- `_PATH_LOGFILE` — log of games played

## BUGS

When playing on a small screen, it's hard to tell when you hit the
edge of the screen.

The scoring function takes into account the size of the screen. A
perfect function to do this equitably has not been devised.

---

## Historical Notes (Editor's Additions)

- **"Snake gets hungrier as you get richer"** in the DESCRIPTION
  is flavour text. Mechanically, the snake always moves one
  square per turn toward you. There is no speed change.
- **`snscore`** — one of the earliest examples of a "companion
  utility" alongside a game. Very Unix.
- **The pinball reference** points to the era's real-world reward
  culture: score-matching bonuses were an arcade / pinball
  standard.
- **The 6-segment snake** is fixed length in this game. This is a
  significant divergence from the modern "Nokia snake" where the
  snake grows as it eats. The BSD `snake` is *older* by 15 years
  and different by design.
- **"Slow terminal" (`-t`)** — reflects that 9600 baud (or slower)
  was common. `-t` suppresses intermediate frame updates so
  characters don't lag.
- **`vi`-style controls (hjkl)** — the *lingua franca* of BSD
  games. If you learned `vi`, you already knew how to play the
  entire BSDGames catalogue.
- **The score file** was shared across all users of a Unix
  machine — hence `snscore` as a "hall of fame" (and shame) for
  the lab.

## See Also

- [`about.md`](./about.md).
- [`architecture.md`](./architecture.md).
- [`references.md`](./references.md).
