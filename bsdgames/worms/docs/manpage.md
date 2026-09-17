# `worms` — Man Page Mirror + Annotation

> Mirror of the original `.6` man page with modern commentary.

---

## Name

`worms` — animate worms on a display terminal.

## Synopsis

```sh
worms [-ft] [-d delay] [-l length] [-n number]
```

## Description

A Unix version of the DEC-2136 program `worms`. The program animates worms on the terminal screen.

## Options

- `-f` — Make a "field" for the worm(s) to eat.
- `-t` — Make each worm leave a trail behind it.
- `-d delay` — Delay in milliseconds between each update (`1`–`1000`). Reasonable values are `20`–`200`; default is `0`.
- `-l length` — Length of each worm; default is `16`.
- `-n number` — Number of worms; default is `3`.

## Annotation

The man page lists the flags but does not explain the circular queue body model, the reference grid, or the boundary orientation tables. Those implementation details are covered in [`architecture.md`](./architecture.md).

## See Also

- [`how-to-play.md`](./how-to-play.md)
- [`architecture.md`](./architecture.md)
- [`spec.md`](./spec.md)
