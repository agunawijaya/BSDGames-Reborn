# `gomoku(6)` — Original Man Page (Annotated)

> Mirror of `gomoku.6` from BSDGames, converted to Markdown.
>
> Upstream source:
> <https://github.com/vattam/BSDGames/blob/master/gomoku/gomoku.6>

---

```
Copyright (c) 1994
    The Regents of the University of California. All rights reserved.

This code is derived from software contributed to Berkeley by
Ralph Campbell.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the conditions of the standard
3-clause BSD license are met. Full notice: see gomoku.6.

@(#)gomoku.6  8.2 (Berkeley) 8/4/94
```

## NAME

**gomoku** — game of 5 in a row

## SYNOPSIS

```
gomoku [-bcdu] [-D debugfile] [inputfile]
```

## DESCRIPTION

`gomoku` is a two-player game where the object is to get five in a
row horizontally, vertically or diagonally on a 19 by 19 grid. By
convention, black always moves first.

With no arguments, `gomoku` will display a playing board and prompt
for moves from the user. Valid moves are a letter for the column
and a number for the row of an empty board location.

Entering `quit` or `resign` will end the game. You can save the
current state of the game by entering `save` and supplying a file
name when prompted. The optional file `inputfile` can be used to
restore a saved game.

## OPTIONS

| Option | Meaning |
|---|---|
| `-b` | **Background mode.** Input moves are read from standard input, the computer picks a move, and prints it to standard output. The first input line should be either `black` or `white` to specify whether `gomoku` has the first move or not respectively. This option was intended for game tournaments where a referee program handles the board display and pits one program against another. |
| `-c` | **Computer versus computer.** `gomoku` will play a game against itself. This is mostly used for testing. |
| `-d` | **Debug.** Print debugging information. Repeating this option more than once yields more detailed information. |
| `-D` *debugfile* | Print debug information to `debugfile` instead of standard output. |
| `-u` | **User versus user.** This is mostly used for testing. |

## AUTHOR

Ralph Campbell

## ACKNOWLEDGEMENTS

The board display routines were based on the `goref` program written
by Peter Langston.

---

## Historical Notes (Editor's Additions)

- **`goref`** — the ancestor board-display program by Peter
  Langston. Not widely available today.
- **`-b` background mode** — a striking early example of a game
  designed for programmatic play. The IEEE / IOI competitions of
  that era used similar CLI-driven "referee + two programs"
  architectures.
- **`-u` user-vs-user** — the man page describes it as "mostly used
  for testing," but it is genuinely useful for hot-seat play. This
  makes `gomoku` one of the few BSDGames titles with real hot-seat
  multiplayer.
- **`-c` computer-vs-computer** — self-play. Useful for regression
  testing of the AI: play two copies with different seeds, verify
  neither crashes.
- **First-move convention** — "Black always moves first" is
  universal in gomoku. The AI always plays K10 (centre) as its
  first move.
- **Board notation** — columns skip `I` to avoid confusion with
  `1`. Familiar to chess players (who skip nothing) but a small
  point of confusion for beginners.

## See Also

- [`about.md`](./about.md) — brochure and history.
- [`architecture.md`](./architecture.md) — how the AI works
  internally.
- [`references.md`](./references.md) — citations.
