# `gomoku` — References & Sources

---

## Primary Sources

- **BSDGames upstream:**
  <https://github.com/vattam/BSDGames/tree/master/gomoku>
- **Man page `gomoku.6`:** <https://github.com/vattam/BSDGames/blob/master/gomoku/gomoku.6>
- **Source files analysed:**
  - `main.c` (entry point, game loop, debug shell)
  - `gomoku.h` (types, constants)
  - `bdinit.c` (board and frame initialisation)
  - `bdisp.c` (curses display; not analysed in depth)
  - `pickmove.c` (**the AI**; the main study focus)
  - `makemove.c` (move application; not analysed in depth)
  - `stoc.c` (coordinate conversion; trivial)

## Historical & Cultural Sources

- **Gomoku on Wikipedia** — game history, rules, variants.
  <https://en.wikipedia.org/wiki/Gomoku>
- **Renju** — <https://en.wikipedia.org/wiki/Renju>
- **L. Victor Allis, 1994.** *Searching for Solutions in Games
  and Artificial Intelligence*. PhD dissertation, University of
  Limburg. Proof that gomoku is a first-player win.
- **Peter Langston** — profile / interviews on Lucasfilm's `ballblazer`
  and other work; the `goref` program is his.
  <https://en.wikipedia.org/wiki/Peter_Langston>
- **Gomocup** — <https://gomocup.org/> for the modern competitive
  scene.

## Technical Sources

- **Brian W. Kernighan & Dennis M. Ritchie**, *The C Programming
  Language*, 2nd ed. (1988) — for K&R vs. ANSI style.
- **David Gomberg**, various AI textbooks — for context on
  heuristic evaluation.
- **`ncurses` documentation** — for the modern equivalent of the
  API used here.

## Author Biographies

- **Ralph Campbell** — Berkeley programmer, later at Sun
  Microsystems; contributor to BSD games and utilities. Public
  bio scarce; occasional references in early BSD contributor
  lists.
- **Peter Langston** — pioneer of computer music at Bell Labs;
  worked on Lucasfilm's *Ballblazer*. Wrote `goref`.

## Similar Engines / Successors

- **Yixin** — <http://petr.lastovicka.sweb.cz/gomoku_en.htm> (or
  various redistributions).
- **Katagomo** — GitHub repository for the AlphaZero-inspired
  gomoku engine.
- **Gomocup archives** — contains many open-source engines from
  the annual competition.

## Citation Style

- Code references use `file:line` format for reproducibility.
- URLs should be permalinks or archive.org snapshots if fragile.

## See Also

- Root [`ATTRIBUTION.md`](../../../ATTRIBUTION.md).
- [`lineage.md`](./lineage.md).
