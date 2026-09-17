# AGENTS.md — Cribbage Agent Instructions

This file contains instructions specific to the `bsdgames/cribbage` folder.
It inherits from and defers to the root [AGENTS.md](../../AGENTS.md).

---

## 1. Scope and Mission

`bsdgames/cribbage` is the modern spiritual successor port of BSD `cribbage`,
originally written in 1980 by **Earl T. Cohen** and **Ken Arnold** at UC Berkeley.

Our objectives for this game:
1. **Preserve:** Keep authentic English Cribbage rules (standard 6-card two-player,
   121-point long board or 61-point short board, pegging to 31, hand & crib scoring,
   "his heels", and "his nobs").
2. **Modernize:** Provide a rich terminal UI (Unicode wood grain, double peg tracks,
   card art) and modern web/desktop GUI, hot-seat and WebSocket internet multiplayer,
   and configurable AI difficulty levels (from Earl Cohen's original greedy heuristics
   up to MCTS / minimax equity analysis).
3. **Teach:** Demystify early 1980 terminal screen management via Ken Arnold's `curses`,
   combinatorial card scoring (15s, runs, pairs, flushes), and rule-based heuristic AI.

---

## 2. Applicable Standards

- Root ADRs in `docs/decisions/` apply unless overridden in `docs/decisions/`.
- No local filesystem paths anywhere in documentation or code (see root `AGENTS.md` §11).
- Use upstream GitHub links: `https://github.com/vattam/BSDGames/tree/master/cribbage/...`
- All diagrams must be Mermaid.
- Documentation adheres strictly to the taxonomy defined in root `AGENTS.md` §6.

---

## 3. Key Upstream Source Files

| Upstream File | Role & Relevance |
|---|---|
| `crib.c` | Game lifecycle, hand dealing, crib ownership rotation, winner declaration |
| `cards.c` | Deck representation, shuffling, card cutting, deal management |
| `score.c` | Hand evaluation: 15s, pairs, runs, flushes, Jack starter rules |
| `support.c` | Earl Cohen's AI decision logic: pegging choices and crib discards |
| `io.c` & `cribcur.h` | Ken Arnold's curses pegboard renderer, peg track matrix, input parsing |
| `deck.h` | Card rank, suit, value constants, and data types |
| `cribbage.6.in` | Original BSD UNIX man page |
