# AGENTS.md — Mille Agent Instructions

This file contains instructions specific to the `bsdgames/mille` folder.
It inherits from and defers to the root [AGENTS.md](../../AGENTS.md).

---

## 1. Scope and Mission

`bsdgames/mille` is the modern spiritual successor port of BSD `mille`,
originally written in 1982 by **Ken Arnold** at UC Berkeley based on Edmond Dujardin's
1954 card game *Mille Bornes*.

Our objectives for this game:
1. **Preserve:** Keep authentic Mille Bornes rules (101-card deck, 7-card hand, race to 700
   or 1000 miles, maximum of two 200-mile cards per hand, full scoring rules including
   Safe Trip, Delayed Action, Extension, Shut-Out, and the reactive Coup-fourré mechanic).
2. **Modernize:** Upgrade the terminal presentation to rich Unicode Art Deco cards and
   vintage dashboard gauges, support local hot-seat and online WebSocket multiplayer (including
   classic 4-player 2v2 partnership mode), and introduce configurable AI difficulty tiers.
3. **Teach:** Demystify early 1982 multi-window `curses` window management, card probability
   bookkeeping (`Numseen` array tracking), and event-driven reactive interrupts in turn-based games.

---

## 2. Applicable Standards

- Root ADRs in `docs/decisions/` apply unless overridden in `docs/decisions/`.
- No local filesystem paths anywhere in documentation or code (see root `AGENTS.md` §11).
- Use upstream GitHub links: `https://github.com/vattam/BSDGames/tree/master/mille/...`
- All diagrams must be Mermaid.
- Documentation adheres strictly to the taxonomy defined in root `AGENTS.md` §6.

---

## 3. Key Upstream Source Files

| Upstream File | Role & Relevance |
|---|---|
| `mille.c` | Program entry point, signal handlers, main play loop |
| `mille.h` | Core data structures, card types (`C_25`..`C_RIGHT_WAY`), scoring constants |
| `comp.c` | Ken Arnold's computer AI decision logic, card valuation (`V_VALUABLE`) |
| `move.c` | Player input validation, card execution, play vs discard dispatch |
| `print.c` | Multi-window curses renderer (`Board`, `Miles`, `Score` windows) |
| `init.c` | Deck generation (101 cards), initial deal (7 cards each) |
| `end.c` | Hand conclusion, bonus scoring, match winner evaluation (5,000 points) |
| `save.c` & `varpush.c` | State persistence and binary serialization |
| `mille.6` | Original BSD UNIX troff manual page |
