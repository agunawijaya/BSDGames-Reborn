# Mille — References & Bibliography

Authoritative documentation, patent citations, and upstream source references for BSD Mille (*Mille Bornes*).

---

## 1. Upstream Source Code

- **Repository:** [BSDGames on GitHub (vattam/BSDGames)](https://github.com/vattam/BSDGames)
- **Mille Source Directory:** [`vattam/BSDGames/tree/master/mille`](https://github.com/vattam/BSDGames/tree/master/mille)
- **Key Source Files:**
  - [`mille.c`](https://github.com/vattam/BSDGames/tree/master/mille/mille.c) — Main entry point, turn scheduling, signal handlers.
  - [`mille.h`](https://github.com/vattam/BSDGames/tree/master/mille/mille.h) — Constants, card enums, screen window declarations.
  - [`comp.c`](https://github.com/vattam/BSDGames/tree/master/mille/comp.c) — Ken Arnold's AI heuristic decision engine.
  - [`move.c`](https://github.com/vattam/BSDGames/tree/master/mille/move.c) — Action dispatch, card legality verification, Coup-fourré.
  - [`print.c`](https://github.com/vattam/BSDGames/tree/master/mille/print.c) — Multi-window curses management (`Board`, `Miles`, `Score`).
  - [`init.c`](https://github.com/vattam/BSDGames/tree/master/mille/init.c) — 101-card deck construction and shuffling.
  - [`end.c`](https://github.com/vattam/BSDGames/tree/master/mille/end.c) — Hand scoring logic, bonus tabulation, match termination.
  - [`save.c`](https://github.com/vattam/BSDGames/tree/master/mille/save.c) & [`varpush.c`](https://github.com/vattam/BSDGames/tree/master/mille/varpush.c) — Game state persistence.
  - [`mille.6`](https://github.com/vattam/BSDGames/tree/master/mille/mille.6) — Original UNIX troff manual page.

---

## 2. Historical & Game Design References

- **Dujardin, Edmond.** *Mille Bornes: Le Jeu du Grand Prix* (1954), Arcachon, France. Original rules
  codification, card artwork design, and Coup-fourré mechanics.
- **Parker Brothers, Inc.** *Mille Bornes: The Great French Card Game — Rules of Play* (1962),
  Salem, Massachusetts. First official North American English edition.
- **Dorr, Wallie.** *Touring: The Famous Automobile Card Game* (1906), Wallie Dorr Co. / Parker Brothers.
  The mechanical precursor introducing distance and hazard cards.

---

## 3. Systems Programming & Technical References

- **Arnold, Kenneth.** "Screen Updating and Cursor Movement Optimization: A Library Package" (1977/1982),
  *Proceedings of the USENIX Conference*, University of California, Berkeley. Founding paper describing
  `curses` subwindows (`newwin()`), virtual screens, and terminal refresh optimization.
- **Computer Systems Research Group (CSRG):** *4.2 Berkeley Software Distribution (4.2BSD)*,
  University of California, Berkeley (August 1983). The first major BSD release to include `mille`
  in `/usr/games`.
