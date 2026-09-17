# `tetris` — Man Page Mirror

> Mirrored and cleaned from the original BSD man page
> `tetris.6.in`, preserving its copyright and attribution.
>
> Source: <https://github.com/vattam/BSDGames/tree/master/tetris/tetris.6.in>

---

## Copyright

```
Copyright (c) 1992, 1993
	The Regents of the University of California.  All rights reserved.

This code is derived from software contributed to Berkeley by
Nancy L. Tinkham and Darren F. Provine.

@(#)tetris.6	8.1 (Berkeley) 5/31/93
```

## Name

`tetris` — the game of tetris

## Synopsis

```
tetris [-ps] [-k keys] [-l level]
```

## Description

The `tetris` command runs a display-based game that must be played on a CRT terminal. The object is to fit the shapes together forming complete rows, which then vanish. When the shapes fill up to the top, the game ends.

You can optionally select a level of play, or custom-select control keys.

The default level of play is 2.

The default control keys are:

| Key | Action |
|---:|---|
| `j` | move left |
| `k` | rotate 1/4 turn counterclockwise |
| `l` | move right |
| `<space>` | drop |
| `p` | pause |
| `q` | quit |

### Options

| Flag | Meaning |
|---|---|
| `-k keys` | Change the default control keys. The `keys` argument must contain the six keys in order (left, rotate, right, drop, pause, quit). Quote any space or tab characters from the shell. Example: `tetris -l 2 -k 'jkl pq'`. The current key settings are displayed at the bottom of the screen during play. |
| `-l level` | Select a level of play (1–9). |
| `-s` | Display the top scores and exit. |
| `-p` | Switch on previewing of the shape that will appear next. |

## Play

At the start of the game, a shape will appear at the top of the screen, falling one square at a time. The speed at which it falls is determined directly by the level: at level 2 the blocks fall twice per second; at level 9 they fall 9 times per second. As the game goes on, things speed up, no matter what the initial selection.

When this shape "touches down" on the bottom of the field, another will appear at the top.

You can move shapes to the left or right, rotate them counterclockwise, or drop them to the bottom by pressing the appropriate keys. As you fit them together, completed horizontal rows vanish, and any blocks above fall down to fill in. When the blocks stack up to the top of the screen, the game is over.

## Scoring

You get one point for every block you fit into the stack, and one point for every space a block falls when you hit the drop key. Dropping the blocks is therefore a good way to increase your score.

Your total score is the product of the level of play and your accumulated points — 200 points on level 3 gives a score of 600.

Each player gets at most one entry on any level, for a total of nine scores in the high scores file. Players who no longer have accounts are limited to one score. Scores over 5 years old are expired. The exception is that the highest score on a given level is always kept, so that following generations can pay homage to those who have wasted serious amounts of time.

The score list is produced at the end of the game. The printout includes each player's overall ranking, name, score, and how many points were scored on what level. Scores which are the highest on a given level are marked with asterisks (`*`).

## Files

| Path | Purpose |
|---|---|
| `@tetris_scorefile@` | High score file. The exact path is substituted at build time. |

## Bugs

The higher levels are unplayable without a fast terminal connection.

## Authors

Adapted from a 1989 International Obfuscated C Code Contest winner by **Chris Torek** and **Darren F. Provine**.

Manual adapted from the original entry written by **Nancy L. Tinkham** and **Darren F. Provine**.

Code for previewing the next shape added by **Hubert Feyrer** in 1999.

## Historical Notes

The program began as an IOCCC entry — code so compact it was intentionally obfuscated — and was later cleaned up and integrated into BSD. The manual still proudly traces that lineage, which explains the terse style and the emphasis on terminal speed as a hard requirement. The preview flag (`-p`) is a later convenience; the original terminal Tetris gave no hint of the next piece.
