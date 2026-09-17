# AGENTS.md — Worm Agent Instructions

This file contains instructions specific to the `bsdgames/worm` folder.
It inherits from and defers to the root [AGENTS.md](../../AGENTS.md).

---

## 1. Scope and Mission

`bsdgames/worm` is the modern spiritual successor port of BSD `worm`,
originally authored in 1980 by **Michael Toy** at UC Santa Cruz and UC Berkeley.

Our objectives for this game:
1. **Preserve:** Retain authentic growing worm mechanics (real-time movement, `@` head,
   `o` body segments, food digits `1`..`9` providing variable growth, `HJKL` sprint dashes,
   and strict wall/self-collision death).
2. **Modernize:** Upgrade the terminal UI to high-resolution Unicode block borders and
   segmented snake glyphs, implement dynamic tick-rate acceleration curves, add obstacle
   mazes, and introduce competitive local and online multiplayer arena modes (*Slither.io* style).
3. **Teach:** Demystify early 1980 real-time UNIX action programming: `SIGALRM` timer interrupts,
   non-blocking terminal I/O, doubly linked list queue management for snake bodies, and
   collision detection via screen character buffer interrogation (`winch()`).

---

## 2. Applicable Standards

- Root ADRs in `docs/decisions/` apply unless overridden in `docs/decisions/`.
- No local filesystem paths anywhere in documentation or code (see root `AGENTS.md` §11).
- Use upstream GitHub links: `https://github.com/vattam/BSDGames/tree/master/worm/...`
- All diagrams must be Mermaid.
- Documentation adheres strictly to the taxonomy defined in root `AGENTS.md` §6.

---

## 3. Key Upstream Source Files

| Upstream File | Role & Relevance |
|---|---|
| `worm.c` | Monolithic C source: main game loop, signal handlers, doubly linked list, curses rendering |
| `worm.6` | Original BSD UNIX troff manual page |
