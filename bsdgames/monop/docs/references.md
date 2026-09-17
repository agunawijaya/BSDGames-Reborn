# `monop` — References & Sources

---

## Primary Sources

- **BSDGames upstream:**
  <https://github.com/vattam/BSDGames/tree/master/monop>
- **Man page `monop.6`:**
  <https://github.com/vattam/BSDGames/blob/master/monop/monop.6.in>
- **Source files analysed:**
  - `monop.6.in` — full man page.
  - `monop.h` — types, constants, function declarations.
  - `monop.c` — main, player setup, main loop.
  - `monop.def` — global data + `comlist`/`func` tables.
  - `monop.ext` — extern declarations.
  - `execute.c` — command dispatcher, movement.
  - `getinp.c` — unique-prefix parser.
  - `cards.c` — Chance/Community Chest deck handling.
  - `malloc.c` — Chris Kingsley 1982 Caltech allocator.
  - `spec.c`, `trade.c`, `jail.c`, `morg.c`, `houses.c`,
    `prop.c`, `rent.c`, `roll.c`, `print.c`, `misc.c`.
  - `mon.dat`, `prop.dat`, `brd.dat`, `cards.inp`.

## Historical & Cultural Sources

- **The Landlord's Game** (1904) by Elizabeth Magie — the
  political-economic proto-Monopoly. Wikipedia summary:
  <https://en.wikipedia.org/wiki/The_Landlord%27s_Game>.
- **Monopoly (1935)** by Parker Brothers — the direct
  inspiration. Wikipedia summary:
  <https://en.wikipedia.org/wiki/Monopoly_(game)>.
- **Hasbro** — current rights holder for Monopoly.
- **Debian bsdgames trademark policy** — reason `monop` is
  excluded from the Debian package:
  <https://packages.debian.org/bookworm/bsdgames>.

## Technical Sources

- **W. Richard Stevens**, *Advanced Programming in the Unix
  Environment* — for `sbrk(2)`, `fork(2)`, file I/O idioms.
- **Brian W. Kernighan & Dennis M. Ritchie**, *The C Programming
  Language*, 2nd ed. (1988).
- **NetBSD source repository** — long-term maintenance history
  for `monop`.
- **Chris Kingsley's Caltech malloc paper** (1982) — origin
  of `monop`'s bundled `malloc.c`.

## Author Biography

- **Ken Arnold** — Berkeley developer, 1980s. Author of `curses(3)`,
  `rogue`, `snake`, `robots`, `monop`. Widely regarded as one of
  the shapers of early Unix game culture.
  <https://en.wikipedia.org/wiki/Ken_Arnold_(computer_programmer)>.
- **Joseph Samuel Myers** — NetBSD maintainer who inherited
  `monop`; contributed the 1997 Makefrag refactor.
- **Chris Kingsley** — Caltech developer; author of the fast
  allocator bundled in `monop/malloc.c`.
- **Elizabeth Magie** — inventor of *The Landlord's Game*,
  Monopoly's political-economic ancestor.

## Similar / Related Games

- **`atlantic`** — Linux GUI Monopoly clone.
- **`atlantik`** + **`monopd`** — KDE Monopoly.
- **`gtkatlantic`** — GTK Monopoly clone.
- **Monopoly** (Sega Genesis, 1992) — first console version.
- **Monopoly Plus** (2014, Ubisoft, PC/console).
- **Monopoly Madness** (2021, Ubisoft) — action variant.
- **Power Grid** (Rio Grande Games) — better-designed economic
  board game.
- **Acquire** (Avalon Hill) — hotel-chain merger economics.

## Citation Style

- Code references use `file:line` format when needed.
- URLs preferred over local paths; never paste local filesystem
  paths.
- All screenshots in `media/` were captured from a locally-built
  binary on 2026-09-17. See [`diff-log.md`](./diff-log.md) for
  build details.

## Related root documents

- Root [`ATTRIBUTION.md`](../../../ATTRIBUTION.md).
- [`lineage.md`](./lineage.md).

## See also

- [`about.md`](./about.md) — reader intro.
- [`architecture.md`](./architecture.md) — code layout.
- [`port-ideas.md`](./port-ideas.md) — port design.
