# Backgammon — References & Bibliography

Authoritative citations, academic papers, tournament rules, and upstream source references
for BSD Backgammon and Teachgammon.

---

## 1. Upstream Source Code

- **Repository:** [BSDGames on GitHub (vattam/BSDGames)](https://github.com/vattam/BSDGames)
- **Backgammon Directory:** [`vattam/BSDGames/tree/master/backgammon`](https://github.com/vattam/BSDGames/tree/master/backgammon)
- **Primary Source Modules:**
  - [`common_source/back.h`](https://github.com/vattam/BSDGames/tree/master/backgammon/common_source/back.h) — Board state definitions and constants.
  - [`common_source/board.c`](https://github.com/vattam/BSDGames/tree/master/backgammon/common_source/board.c) — ASCII board layout renderer.
  - [`common_source/fancy.c`](https://github.com/vattam/BSDGames/tree/master/backgammon/common_source/fancy.c) — Termcap cursor motion routines.
  - [`common_source/odds.c`](https://github.com/vattam/BSDGames/tree/master/backgammon/common_source/odds.c) — Real-time 36-outcome probability calculator.
  - [`common_source/check.c`](https://github.com/vattam/BSDGames/tree/master/backgammon/common_source/check.c) — Move legality validation.
  - [`backgammon/main.c`](https://github.com/vattam/BSDGames/tree/master/backgammon/backgammon/main.c) — Main game driver and turn scheduler.
  - [`backgammon/move.c`](https://github.com/vattam/BSDGames/tree/master/backgammon/backgammon/move.c) — Input parsing and heuristic AI move engine.
  - [`teachgammon/teach.c`](https://github.com/vattam/BSDGames/tree/master/backgammon/teachgammon/teach.c) — Interactive tutorial coordinator.
  - [`backgammon/backgammon.6.in`](https://github.com/vattam/BSDGames/tree/master/backgammon/backgammon/backgammon.6.in) — Original troff manual page.

---

## 2. Foundational Game Literature & Theory

- **Magriel, Paul.** *Backgammon* (1976), Quadrangle / The New York Times Book Co. Revered by grandmasters
  as the definitive treatise on prime construction, anchor holding, and doubling cube equity.
- **Jacoby, Oswald & Crawford, John R.** *The Backgammon Book* (1970), Viking Press. Influential text
  codifying tournament doubling rules and match play standards.
- **Hoyle, Edmond.** *A Short Treatise on the Game of Backgammon* (1743), London. The earliest modern
  codification of rules, probability calculations, and opening roll conventions.
- **World Backgammon Federation (WBGF):** *International Backgammon Tournament Rules*
  (<https://wbgf.info>). Official international regulations governing clocks, cubes, and disputes.

---

## 3. Artificial Intelligence & Computing Milestones

- **Berliner, Hans.** "Backgammon computer program beats world champion" (1979), *Nature*, Vol. 287,
  pp. 760–761. Detailed retrospective on the BKG 9.8 match in Monte Carlo.
- **Tesauro, Gerald.** "Temporal Difference Learning and TD-Gammon" (1995), *Communications of the ACM*,
  Vol. 38, No. 3, pp. 58–68. Foundational paper on reinforcement learning from self-play.
- **Char, Alan.** BSD Backgammon & Teachgammon (1980), Computer Systems Research Group (CSRG),
  University of California, Berkeley.
