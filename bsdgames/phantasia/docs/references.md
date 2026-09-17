# `phantasia` — References & Sources

> Every historical or technical claim traces back to a source
> listed here.

---

## Primary Sources

- **BSDGames upstream:**
  <https://github.com/vattam/BSDGames/tree/master/phantasia>
- **Man page `phantasia.6`:**
  <https://github.com/vattam/BSDGames/blob/master/phantasia/phantasia.6>
- **Source files analysed:**
  - `main.c` — entry, main loop, arg parsing
  - `phantasia.6` — man page
  - `phantstruct.h`, `phantdefs.h`, `phantglobs.h` — data
    structures and constants (surveyed)
  - `main.c:1-30` — Estes's disclaimer
  - `phantglobs.c` — global tables (character types, spells)
  - `fight.c`, `interplayer.c`, `setup.c`, `monsters.asc`
    (surveyed for architecture, not deeply)

## Historical & Cultural Sources

- **Bell Labs / AT&T Unix history** — Marshall Kirk McKusick's
  essays, *The Unix Programming Environment* (Kernighan & Pike,
  1984), *Coders at Work* (Seibel, 2009).
- **Richard Bartle's MUD1 history** — <https://mud.co.uk/richard/>.
- **PLATO Empire** — Wikipedia article and Brian Dear's *The
  Friendly Orange Glow* (2017).
- **D&D history** — Gary Gygax's essays; countless retrospectives.
- **Modern MMO history** — J. C. Herz's *Joystick Nation* (1997);
  countless post-mortems.

## Technical Sources

- **W. Richard Stevens**, *Advanced Programming in the Unix
  Environment* (1992) — for `flock(2)`, file I/O patterns.
- **Brian W. Kernighan & Dennis M. Ritchie**, *The C Programming
  Language*, 2nd ed. (1988).
- **`ncurses` documentation** — for the modern terminal I/O.
- **SQLite documentation** — for reference on file-based DBs
  (successors to `phantasia`'s approach).

## Author Biography

- **Edward A. Estes** — AT&T Bell Labs, ~1986. Public
  biographical information is scarce. His name appears on
  `phantasia` and a few smaller Unix utilities of the period.
  Contemporary Bell Labs contributors of the era include names
  well-known in Unix history (Thompson, Ritchie, Kernighan,
  Pike, Allen, etc.); Estes worked in the same environment but
  did not pursue a similar public profile.

- **Joseph Samuel Myers** — long-term BSDGames maintainer for
  Linux; his headers appear in later phantasia files, including
  `Makefrag` (1997-2001 dates). Active in the GCC community.

## Similar Games / Successors

- **DikuMUD family** — <https://en.wikipedia.org/wiki/DikuMUD>
- **NetHack** — <https://www.nethack.org/>
- **Kingdom of Loathing** — <https://www.kingdomofloathing.com/>
- **EVE Online** — <https://www.eveonline.com/>

## Citation Style

- Code references use `file:line` format.
- URLs use permalinks / archive.org snapshots where fragile.

## See Also

- Root [`ATTRIBUTION.md`](../../../ATTRIBUTION.md).
- [`lineage.md`](./lineage.md).
