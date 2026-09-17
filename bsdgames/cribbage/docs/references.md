# Cribbage — References & Bibliography

Authoritative citations, historical documentation, and source code references for BSD Cribbage.

---

## 1. Upstream Source Code

- **Repository:** [BSDGames on GitHub (vattam/BSDGames)](https://github.com/vattam/BSDGames)
- **Cribbage Source Directory:** [`vattam/BSDGames/tree/master/cribbage`](https://github.com/vattam/BSDGames/tree/master/cribbage)
- **Primary Source Files:**
  - [`crib.c`](https://github.com/vattam/BSDGames/tree/master/cribbage/crib.c) — Main control loop, game state sequencing.
  - [`cards.c`](https://github.com/vattam/BSDGames/tree/master/cribbage/cards.c) — Deck initialization, shuffling, cut logic.
  - [`score.c`](https://github.com/vattam/BSDGames/tree/master/cribbage/score.c) — Combinatorial scoring engine.
  - [`support.c`](https://github.com/vattam/BSDGames/tree/master/cribbage/support.c) — Earl T. Cohen's discard and pegging AI.
  - [`io.c`](https://github.com/vattam/BSDGames/tree/master/cribbage/io.c) — Ken Arnold's curses pegboard renderer and parser.
  - [`cribcur.h`](https://github.com/vattam/BSDGames/tree/master/cribbage/cribcur.h) — Screen coordinates and track macros.
  - [`deck.h`](https://github.com/vattam/BSDGames/tree/master/cribbage/deck.h) — Card and deck structures.
  - [`cribbage.6.in`](https://github.com/vattam/BSDGames/tree/master/cribbage/cribbage.6.in) — Original manual page.

---

## 2. Historical & Cultural Sources

- **Aubrey, John.** *Brief Lives* (c. 1669–1693). Includes biographical sketches of Sir John Suckling
  and recounts his invention of Cribbage and legendary card escapades across 17th-century England.
- **Hoyle, Edmond.** *Mr. Hoyle's Games of Whist, Quadrille, Piquet, Chess, and Back-Gammon, Complete*
  (1742 onwards). Early standardization of scoring sequences and five-card rules.
- **American Cribbage Congress (ACC):** *Official Tournament Rules of the American Cribbage Congress*
  (<https://www.cribbage.org>). Standard modern tournament regulations, skunk standards, and pegging etiquette.
- **Naval History & Heritage Command:** *The USS Tang (SS-306) Cribbage Board Tradition*. Historical
  overview of the "lucky board" tradition in the US Navy Pacific Submarine Fleet.

---

## 3. Technical & Academic References

- **Arnold, Kenneth.** "Screen Updating and Cursor Movement Optimization: A Library Package" (1977/1980),
  *Proceedings of the USENIX Conference*, University of California, Berkeley. The foundational paper
  describing the architecture of the `curses` library.
- **Joy, William.** *Termcap: Terminal Capability Data Base*. UC Berkeley Computer Systems Research Group (CSRG).
- **Rasmussen, Rasmus.** "Optimal Cribbage Discard Strategy: A Monte Carlo Analysis" (2007). In-depth
  combinatorial analysis of average hand and crib yields across all 15 discard combinations.
