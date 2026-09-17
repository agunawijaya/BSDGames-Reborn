# `boggle` — Feature Diff Log

> Detailed comparison between the original 1993 BSD C implementation and the planned spiritual successor port.

---

## Feature Comparison Matrix

| Feature | Original 1993 BSD C Implementation | Planned Spiritual Successor Port | Modernization Rationale |
|---|---|---|---|
| **Board Grid** | 4×4 letter grid (16 sockets). | 4×4 letter grid + optional 5×5 Big Boggle variant. | Expands challenge options while preserving standard 4x4. |
| **Cube Set** | 16 canonical Parker Brothers cubes. | Canonical cubes preserved + international sets. | Preserves original balance and enables multi-language play. |
| **Dictionary Backend** | External `bogdict` file with `bogdict.index`. | Embedded DAWG / Trie structure in binary. | Eliminates build failures and missing dictionary runtime crashes. |
| **Word Search Engine** | Recursive DFS with bitmask pruning (`bog.c`). | High-performance DFS with SIMD/Trie acceleration. | Instantaneous board solving even on large 5x5 boards. |
| **Timer Engine** | POSIX `setitimer` and `SIGALRM` (`timer.c`). | Async event loop / cross-platform monotonic timer. | Portable across Windows, macOS, Linux, and WebAssembly. |
| **Multiplayer Mode** | Single-player terminal session only. | Real-time synchronized WebSocket multiplayer. | Brings the classic party game social experience to the web. |
| **Input Methods** | Text line typing via `getline()`. | Keyboard typing + mouse/touch path tracing. | Greatly enhances accessibility and mobile usability. |
| **Scoring Output** | Percentage of words found vs missed. | Dual display: BSD Percentage + Tournament Points. | Satisfies both puzzle solvers and competitive tournament players. |
| **Batch Mode** | CLI flag `-b` reading stdin words. | Preserved `-b` flag + JSON output format (`--json`).| Seamless integration with automated testing and pipelines. |
