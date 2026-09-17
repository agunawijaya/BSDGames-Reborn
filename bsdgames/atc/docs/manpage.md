# `atc(6)` — Original Man Page (Annotated)

> Mirror of `atc.6.in` from BSDGames, converted to Markdown.
>
> Upstream source:
> <https://github.com/vattam/BSDGames/blob/master/atc/atc.6.in>

---

```
Copyright (c) 1990, 1993 The Regents of the University of California.
All rights reserved.

This code is derived from software contributed to Berkeley by Ed James.

Redistribution and use in source and binary forms are permitted per the
standard 3-clause BSD license (see atc.6.in for full notice).

Copyright (c) 1986 Ed James. All rights reserved.

@(#)atc.6  8.1 (Berkeley) 5/31/93
```

## NAME

**atc** — air traffic controller game

## SYNOPSIS

```
atc [-u?lstp] [-gf game name] [-r random seed]
```

## DESCRIPTION

`atc` lets you try your hand at the nerve-wracking duties of the
air traffic controller without endangering the lives of millions of
travellers each year. Your responsibilities require you to direct
the flight of jets and prop planes into and out of the flight arena
and airports. The speed (update time) and frequency of the planes
depend on the difficulty of the chosen arena.

## OPTIONS

| Flag | Meaning |
|---|---|
| `-u` | Print the usage line and exit. |
| `-?` | Same as `-u`. |
| `-l` | Print a list of available games and exit. The first game name printed is the default game. |
| `-s` | Print the score list (formerly the Top Ten list). |
| `-t` | Same as `-s`. |
| `-p` | Print the path to the special directory where `atc` expects to find its private files. This is used during the installation of the program. |
| `-g <game>` | Play the named game. If the game listed is not one of the ones printed from the `-l` option, the default game is played. |
| `-f <game>` | Same as `-g`. |
| `-r <seed>` | Set the random seed. The purpose of this flag is questionable. |

## GOALS

Your goal in `atc` is to keep the game going as long as possible.
There is no winning state, except to beat the times of other
players. You will need to: launch planes at airports (by
instructing them to increase their altitude); land planes at
airports (by instructing them to go to altitude zero when exactly
over the airport); and manoeuvre planes out of exit points.

Several things will cause the end of the game. Each plane has a
destination (see information area), and sending a plane to the
wrong destination is an error. Planes can run out of fuel, or can
collide. Collision is defined as adjacency in all three dimensions.
A plane leaving the arena in any other way than through its
destination exit is an error as well.

Scores are sorted in order of the number of planes safe. The other
statistics are provided merely for fun. There is no penalty for
taking longer than another player (except in the case of ties).

**Suspending a game is not permitted.** If you get a talk message,
tough. When was the last time an Air Traffic Controller got called
away to the phone?

## THE DISPLAY

Depending on the terminal you run `atc` on, the screen will be
divided into 4 areas.

- **Radar** — top-left. Shows plane positions, airports, exits,
  beacons, and helper lines.
- **Information area** — right. Shows time, safe count, and per-plane
  status.
- **Input area** — bottom-left. Shows the command being typed.
- **Author area** — bottom-right. Displays `ATC - by Ed James`.

*See [`about.md`](./about.md) §Screenshots and
[`how-to-play.md`](./how-to-play.md) §Reading the Radar for
Markdown-friendly readings of the original ASCII display.*

## INPUT

A command completion interface is built in. At any time, typing
`?` will list possible input characters. Backspace (your erase
character) backs up. Return submits.

Commands split into **Immediate Only** and **Delayable**.

Direction keys around `s`:

```
q w e
a s d
z x c
```

Absolute: `q` = NW (315°), `w` = N (0°), `e` = NE (45°), `d` = E,
`c` = SE, `x` = S, `z` = SW, `a` = W.

Relative: `w` = no turn, `e` = +45°, `q` = -45°.

### IMMEDIATE ONLY COMMANDS

- `a [cd+-] <n>` — Altitude change.
  - `a <n>` — climb/descend to n × 1000 ft.
  - `ac <n>` — climb by n (relative).
  - `ad <n>` — descend by n (relative).
  - `a+` = `ac`, `a-` = `ad`.
- `m` — Mark: display highlighted.
- `i` — Ignore: display dim, no command line.
- `u` — Unmark: same as ignore but auto-mark on delay execution.

### DELAYABLE COMMANDS

- `c [lr]` — Circle.
  - `cl` — Left / counterclockwise.
  - `cr` — Right / clockwise (default).
- `t [l-r+LR] [dir]` — Turn.
  - `t <dir>` — Absolute compass heading.
  - `tl [dir]` / `t- [dir]` — Turn left (default 45°).
  - `tr [dir]` / `t+ [dir]` — Turn right.
  - `tL` — Hard left (90°).
  - `tR` — Hard right (90°).
  - `tt [abe*] <n>` — Turn toward airport / beacon / exit / (`*` = beacon).

### THE DELAY COMMAND

Append `ab <n>` or `@b <n>` to a delayable command to execute when
the plane reaches Beacon `<n>`.

### MARKING, UNMARKING AND IGNORING

Planes are **marked** by default when they enter. This means they
are displayed highlighted. A plane may also be **unmarked** or
**ignored**. An ignored plane is drawn dim with dashes in the
command field. Any command re-runs but the command field returns
to dashes after completion. An unmarked plane behaves like ignored
but auto-switches to marked when a delayed command triggers.

### EXAMPLES

- `atlab1` — Plane A: turn left at Beacon 1.
- `cc` — Plane C: circle.
- `gtte4ab2` — Plane G: turn toward Exit 4 at Beacon 2.
- `ma+2` — Plane M: altitude climb 2 (thousand ft).
- `stq` — Plane S: turn to 315° (NW).
- `xi` — Plane X: ignore.

## OTHER INFORMATION

- Jets move every update; prop planes move every other update.
- All planes turn at most 90° per movement.
- Planes enter at 7000 ft and leave at 9000 ft.
- Planes flying at altitude 0 crash unless over an airport.
- Planes waiting at airports can only be told to take off (climb).
- **Pressing return** (empty command) performs the next update
  immediately — the "fast forward" trick.

## NEW GAMES

The `Game_List` file lists the currently available play fields.
New field description file names must be placed in this file to be
playable. If a player specifies a game not in this file, their
score will not be logged.

The game field description files are broken into two parts.

### Definition Section

Four tunable game parameters, in this order:

```
update = <int>;    # seconds between forced updates
newplane = <int>;  # about the number of updates between new plane entries
width = <int>;
height = <int>;
```

### Layout Section

```
beacon:  (x y) (x y) ... ;
airport: (x y dir) (x y dir) ... ;
exit:    (x y dir) (x y dir) ... ;
line:    [ (x1 y1) (x2 y2) ] [ (x1 y1) (x2 y2) ] ... ;
```

- Beacon: coordinate pair in parens.
- Airport / exit: coordinate + direction letter (one of
  `wedcxzaq`).
- Line: two coordinate pairs in square brackets.

Airports use the direction planes must be going to take off/land.
Exits use the direction planes will be going when they *enter* the
arena.

All statements are `;`-terminated. Comments begin with `#`. Coords
must be in `[0, width-1]` × `[0, height-1]`. Exit coords must lie
on borders; beacons and airports must be inside. Lines must be
horizontal, vertical, or exactly diagonal.

### FIELD FILE EXAMPLE

The default game:

```
# This is the default game.

update = 5;
newplane = 5;
width = 30;
height = 21;

exit:    ( 12  0 x ) ( 29  0 z ) ( 29  7 a ) ( 29 17 a )
         (  9 20 e ) (  0 13 d ) (  0  7 d ) (  0  0 c ) ;

beacon:  ( 12  7 ) ( 12 17 ) ;

airport: ( 20 15 w ) ( 20 18 d ) ;

line:    [ (  1  1 ) (  6  6 ) ]
         [ ( 12  1 ) ( 12  6 ) ]
         ...
```

## FILES

- Special directory containing `Game_List` and the games themselves.
- A scores file (typically `/var/games/atc_score`).

## AUTHOR

**Ed James, UC Berkeley:** `edjames@ucbvax.berkeley.edu`,
`ucbvax!edjames` (both historical addresses).

This game is based on someone's description of the overall flavor
of a game written for some unknown PC many years ago, maybe.

## BUGS

The screen sometimes refreshes after you have quit.

*(Verbatim from the man page. The source tree also ships a `BUGS`
file with four additional items — see
[`about.md`](./about.md) §Making-Of Notes.)*

---

## Historical Notes (Editor's Additions)

- **Ed James signature.** The `ATC - by Ed James` display in the
  radar corner is unusual — most BSD games are anonymous. Ed's own
  copyright (1987) is separately preserved alongside the Regents'.
- **The `-r <seed>` "questionable"** self-critique is a rare bit
  of author transparency. Because `SIGALRM` timing depends on
  kernel scheduling, seed-based replay is not exact.
- **`Game_List` as gatekeeper** — a subtle anti-cheat: only games
  in `Game_List` count toward scores. Prevents easy playfields
  from inflating leaderboards.
- **"Suspending a game is not permitted"** — SIGTSTP and SIGSTOP
  are ignored (`main.c:149-150`). The joke about the phone in the
  man page is deadly serious about the ignored signal.
- **`?` completion** — grammar-driven help. See
  [`architecture.md`](./architecture.md) §The Yacc/Lex Command
  Grammar.
- **Direction letters `wedcxzaq`** — arranged in a circle around
  `s` on the keyboard, matching compass rose. Elegant mnemonic.

## See Also

- [`about.md`](./about.md).
- [`architecture.md`](./architecture.md).
- [`how-to-play.md`](./how-to-play.md).
- [`references.md`](./references.md).
