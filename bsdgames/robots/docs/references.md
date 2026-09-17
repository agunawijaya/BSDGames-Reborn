# `robots` — References & Sources

> Every historical or technical claim made in this game's docs
> traces back to a source listed here.

---

## Primary Sources

- **BSDGames upstream:**
  <https://github.com/vattam/BSDGames/tree/master/robots>
- **Man page `robots.6.in`:** <https://github.com/vattam/BSDGames/blob/master/robots/robots.6.in>
- **Source files analysed:**
  - `main.c` (main entry, argument parsing)
  - `robots.h` (constants, types, prototypes)
  - `make_level.c` (level generation)
  - `play_level.c` (per-level game loop)
  - `move_robs.c` (robot AI, collision, scoring)
  - `rnd_pos.c` (RNG, random empty cell)
  - `auto.c` (autobot mode — not analysed in depth)

## Historical & Cultural Sources

- **Ken Arnold** biography and work — Wikipedia article, various
  interviews about `curses` and `rogue` development.
  <https://en.wikipedia.org/wiki/Ken_Arnold_(programmer)>
- **`curses` library history** — <https://en.wikipedia.org/wiki/Curses_(programming_library)>
- **BSD history and the 4.2BSD release (1983)** — Marshall Kirk
  McKusick, various essays.
- **Chase (BASIC game, 1977)** — from *Basic Computer Games*
  (David Ahl, 1978), also known as *101 BASIC Computer Games*.
  Documents the pre-`robots` design lineage.
- **`gnobots2`** — GNOME Games source and history.
  <https://wiki.gnome.org/Apps/Robots>

## Technical Sources

- **Brian W. Kernighan & Dennis M. Ritchie**, *The C Programming
  Language*, 2nd ed. (1988) — for K&R vs. ANSI style, and general
  C idioms.
- **W. Richard Stevens**, *Advanced Programming in the Unix
  Environment* (1992) — for `signal(2)`, `setjmp(3)`, `getpid(2)`
  usage patterns.
- **`ncurses` documentation** — <https://invisible-island.net/ncurses/>
  for the modern equivalent of the API used here.

## Author Biographies

- **Ken Arnold** — profile on ACM,
  <https://amturing.acm.org/> (co-authored *The Java Programming
  Language*).
- **Christos Zoulas** — NetBSD developer profile,
  <https://netbsd.org/>.

## Similar Games / Successors

- **gnobots2 documentation** — GNOME Games manual for the modern
  descendant.
- **Design of *Into the Breach*** — interview with Justin Ma and
  Matthew Davis (Subset Games) about telegraphed enemy movement.
  (Manifestly influenced by the same idiom.)

## Citation Style

- Direct code references use `file:line` format for reproducibility
  against the upstream repo.
- URLs should be permalinks where possible (Wayback Machine
  archives if links may rot).

## See Also

- Root [`ATTRIBUTION.md`](../../../ATTRIBUTION.md) for repo-wide
  attribution rules.
- [`lineage.md`](./lineage.md) for genealogy discussion.
