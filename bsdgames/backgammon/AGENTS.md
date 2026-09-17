# AGENTS.md — Backgammon Agent Instructions

This file contains instructions specific to the `bsdgames/backgammon` folder.
It inherits from and defers to the root [AGENTS.md](../../AGENTS.md).

---

## 1. Scope and Mission

`bsdgames/backgammon` is the modern spiritual successor port of BSD `backgammon`
and `teachgammon`, originally authored in 1980 by **Alan Char** at UC Berkeley.

Our objectives for this game:
1. **Preserve:** Keep authentic Backgammon tournament regulations (24 points, 15 checkers
   per side, bar re-entry, bearing off, Crawford rule support, doubling cube mechanics,
   and triple-point Backgammons).
2. **Modernize:** Provide a rich terminal UI with authentic triangular point rendering
   using Unicode box and block drawing characters, local hot-seat and online WebSocket multiplayer,
   and contemporary AI upgrades (from Alan Char's original heuristics up to neural network
   evaluators inspired by TD-Gammon and GNU Backgammon).
3. **Teach:** Retain the spirit of `teachgammon` as a first-class interactive tutorial system
   that demystifies backgammon concepts: pip counting, hitting probabilities, prime construction,
   and doubling equity.

---

## 2. Applicable Standards

- Root ADRs in `docs/decisions/` apply unless overridden in `docs/decisions/`.
- No local filesystem paths anywhere in documentation or code (see root `AGENTS.md` §11).
- Use upstream GitHub links: `https://github.com/vattam/BSDGames/tree/master/backgammon/...`
- All diagrams must be Mermaid.
- Documentation adheres strictly to the taxonomy defined in root `AGENTS.md` §6.

---

## 3. Key Upstream Source Files

| Upstream Directory & File | Role & Relevance |
|---|---|
| `backgammon/main.c` | Top-level game loop, turn sequencing, argument parsing (`-pr`, `-pw`, `-pb`) |
| `backgammon/move.c` | Move generation, legal move checks, computer move selection |
| `common_source/back.h` | Shared constants, `board[26]` array definition, player state structures |
| `common_source/board.c` | ASCII board rendering routines (`wrboard()`, `wrbsub()`) |
| `common_source/fancy.c` | High-speed terminal cursor positioning using `termcap` |
| `common_source/odds.c` | Real-time dice roll probability and hitting odds calculator |
| `common_source/table.c` | Odds lookup matrix for 36 possible dice outcomes |
| `teachgammon/teach.c` | Interactive tutorial driver and practice match coordinator |
| `teachgammon/ttext1.c` | Rules of play, movement, and bearing off tutorial text |
| `teachgammon/ttext2.c` | Advanced doubling cube and hitting strategy lessons |
| `backgammon/backgammon.6.in` | Original BSD UNIX troff manual page |
