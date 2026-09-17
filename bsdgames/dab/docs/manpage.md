# `dab` — Man Page Mirror

Original source: `BSDGames-master/dab/dab.6`.

---

## NAME

**dab** — Dots and Boxes game

## SYNOPSIS

```
dab [-aw] [-n ngames] [-p <c|h><c|h>] [xdim [ydim]]
```

## DESCRIPTION

`dab` is a game where each player tries to complete the most boxes. A
turn consists of putting one border of a box; the player setting the
fourth and final border of a box gets the point for the box and has
another turn.

## OPTIONS

| Option | Description |
|---|---|
| `-a` | Don't use the alternate character set. |
| `-n ngames` | Play `ngames` games. |
| `-p <c\|h><c\|h>` | Select computer (`c`) or human (`h`) for each player. |
| `-w` | Wait for a character press between games. |
| `xdim ydim` | Board size in boxes. |

## CONTROLS

- `hjkl` — move cursor.
- `uybn` — diagonal cursor movement.
- `Space` — draw edge.
- `Ctrl-L` / `Ctrl-R` — redraw.
- `q` — quit.

## SEE ALSO

Elwyn R. Berlekamp, *The Dots and Boxes Game: Sophisticated Child's
Play*, A K Peters, 2000.

## AUTHORS

Christos Zoulas.

## Annotation

- The cursor moves on a grid of dots; the diagonal keys switch between
  the even and odd rows of that grid.
- The computer player uses a simple but effective closure-based
  strategy.
