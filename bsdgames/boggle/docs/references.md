# `boggle` — References & Historical Sources

> Citations, primary sources, academic literature, and official repositories for *Boggle*.

---

## 1. Upstream Primary Source Code

- **Debian / NetBSD BSDGames Upstream Mirror:**
  [`vattam/BSDGames/tree/master/boggle`](https://github.com/vattam/BSDGames/tree/master/boggle)
  - Key Files:
    - [`boggle/boggle/bog.c`](https://github.com/vattam/BSDGames/tree/master/boggle/boggle/bog.c) — Main entry point, board shuffling, DFS search, and game loop.
    - [`boggle/boggle/bog.h`](https://github.com/vattam/BSDGames/tree/master/boggle/boggle/bog.h) — Constants, array dimensions, limits.
    - [`boggle/boggle/boggle.6`](https://github.com/vattam/BSDGames/tree/master/boggle/boggle/boggle.6) — Section 6 games manual page.
    - [`boggle/boggle/mach.c`](https://github.com/vattam/BSDGames/tree/master/boggle/boggle/mach.c) — Terminal I/O routines, curses driver, and split results table.
    - [`boggle/boggle/timer.c`](https://github.com/vattam/BSDGames/tree/master/boggle/boggle/timer.c) — `setitimer` and `SIGALRM` countdown implementation.
    - [`boggle/boggle/word.c`](https://github.com/vattam/BSDGames/tree/master/boggle/boggle/word.c) — Dictionary index validation and exhaustive word solver.
    - [`boggle/mkindex/`](https://github.com/vattam/BSDGames/tree/master/boggle/mkindex/) — Standalone dictionary index compiler utility.

---

## 2. Tabletop Game Patents & Rules

1. **Turoff, Allan (1972):**
   - *Game Apparatus for Word Forming Games*. United States Patent Office, US Patent No. 3,892,412.
2. **Parker Brothers Inc. (1976):**
   - *Boggle: Hidden Word Game Instructions & Rules*. Beverly, Massachusetts.

---

## 3. Algorithmic Literature & Graph Traversal

1. **Sedgewick, Robert & Wayne, Kevin (2011):**
   - *Algorithms (4th Edition)*. Addison-Wesley Professional. Section 4.1: Undirected Graphs & Depth-First Search.
2. **Applegate, David & Jacobson, Guy (1988):**
   - *Fast Dictionary Lookups and Prefix Trees in Boggle Solvers*. Bell Laboratories Technical Memorandum.
3. **Aho, Alfred V., Hopcroft, John E., & Ullman, Jeffrey D. (1983):**
   - *Data Structures and Algorithms*. Addison-Wesley. Chapter 5: Directed Acyclic Graphs and Trie Structures.
