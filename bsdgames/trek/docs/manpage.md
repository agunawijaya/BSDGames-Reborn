# `trek(6)` — Original Man Page (Annotated)

> Mirror of `trek.6.in` from BSDGames, converted to Markdown.
>
> Upstream source:
> <https://github.com/vattam/BSDGames/blob/master/trek/trek.6.in>

---

```
Copyright (c) 1980, 1993 The Regents of the University of California.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted per the standard 3-clause BSD license
(see trek.6.in for full notice).

@(#)trek.6  8.2 (Berkeley) 12/30/93
```

## NAME

**trek** — trekkie game

## SYNOPSIS

```
trek [[-a] file]
```

## DESCRIPTION

`trek` is a game of space glory and war. Below is a summary of
commands. For complete documentation, see *Trek* by Eric Allman.

If a filename is given, a log of the game is written onto that
file. If the `-a` flag is given before the filename, that file is
appended to, not truncated.

The game will ask you what length game you would like. Valid
responses are `short`, `medium`, and `long`. You may also type
`restart`, which restarts a previously saved game. You will then
be prompted for the skill, to which you must respond `novice`,
`fair`, `good`, `expert`, `commodore`, or `impossible`. You should
normally start out with a `novice` and work up.

In general, throughout the game, if you forget what is appropriate
the game will tell you what it expects if you just type in a
question mark.

## AUTHOR

Eric Allman

## SEE ALSO

`@docdir@/trek.me` (extended documentation).

## COMMAND SUMMARY

- **`abandon`** — Abandon ship.
- **`capture`** — Attempt to capture a Klingon (surrender).
- **`cloak up/down`** — Cloaking device on/off.
- **`computer <request>`** — Ask the onboard computer.
- **`damages`** — Damage report.
- **`destruct`** — Self-destruct (password required).
- **`dock`** — Dock at adjacent starbase.
- **`help`** — Emergency: call starbase for transporter.
- **`impulse <course> <distance>`** — Impulse engines.
- **`lrscan`** — Long-range scan.
- **`move <course> <distance>`** — Warp move (alias).
- **`phasers automatic <amount>`** — Auto-fire phasers.
- **`phasers manual <amt1> <course1> <spread1> ...`** — Manual
  phaser fire.
- **`torpedo <course> [yes/no <angle>]`** — Fire photon torpedo.
- **`ram <course> <distance>`** — Deliberate ramming.
- **`rest <time>`** — Advance time without moving.
- **`shell`** — Escape to shell (see NOTES).
- **`shields up/down`** — Shield control.
- **`srscan [yes/no]`** — Short-range scan.
- **`status`** — Status only.
- **`terminate yes/no`** — End current game.
- **`undock`** — Undock from starbase.
- **`visual <course>`** — Optical scan in direction.
- **`warp <warp_factor>`** — Set warp factor.

---

## Historical Notes (Editor's Additions)

- **`shell` command** — listed in the man page but not present in
  `Comtab[]` in `play.c`. Historical drift. Port skips it.
- **The dry man page title** — *"trekkie game"* — Eric's
  characteristic laconic humour.
- **"See *Trek* by Eric Allman"** — refers to a separate
  documentation file `trek.me` in `nroff` format. Contains full
  gameplay explanation. Not always installed.
- **The `restart` option at the length prompt** — allows loading
  a saved game via `dump`. Save format is version-fragile.
- **`?` as universal help** — mentioned generically; works at every
  prompt.
- **The absence of a BUGS section** — unusual for BSD games.
  Compare to `atc`'s explicit BUGS file. Either Eric Allman was
  confident, or the bugs were too many to list.

## Additional Command Details (from source, not in man page)

- **`cloak up/down`** shares a code path with `shield` (see
  `Comtab[]`), passing `-1` as `value2` to distinguish. Same
  parser semantics.
- **`status`** is `srscan` with `value2 = -1` — just prints the
  right-hand panel without the map.
- **`ram <course> <distance>`** is `dowarp(1)` — same code as
  `move`/`warp` but with the "collide is intentional" flag set.
- **`dump <file>`** writes a raw snapshot. `restart` at startup
  reads it back.
- **`terminate`** invokes `myreset` which calls `longjmp(env, 1)`
  — a non-local exit to the "Another game?" prompt in `main`.

## See Also

- [`about.md`](./about.md).
- [`how-to-play.md`](./how-to-play.md).
- [`architecture.md`](./architecture.md).
- [`references.md`](./references.md).
