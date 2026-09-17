# `sail` — References & Sources

---

## Primary Sources

- **BSDGames upstream:**
  <https://github.com/vattam/BSDGames/tree/master/sail>
- **Man page `sail.6`:**
  <https://github.com/vattam/BSDGames/blob/master/sail/sail.6>
- **Source files analysed:**
  - `sail.6` — the exhaustive man page (essay-like)
  - `main.c` — dispatcher
  - `sync.c` — locking magic (surveyed)
  - `pl_main.c`, `dr_main.c` — process entries
  - Scenario data in `game.c`, `parties.c`, `globals.c` (surveyed)

## Historical & Cultural Sources

- **Avalon Hill's *Wooden Ships and Iron Men*** by S. Craig
  Taylor (1974). The direct boardgame inspiration.
- **C.S. Forester** — Hornblower series (recommended in `sail.6`).
- **Alexander Kent** — Bolitho series.
- **Captain Frederick Marryat** — 19th century naval novels.
- **Patrick O'Brian** — Aubrey-Maturin series.
- **The Age of Sail** — general historical context.

## Technical Sources

- **W. Richard Stevens**, *Advanced Programming in the Unix
  Environment* (1992) — `link(2)`, `unlink(2)`, `fork(2)`, file
  I/O.
- **Brian W. Kernighan & Dennis M. Ritchie**, *The C Programming
  Language*, 2nd ed. (1988).
- **`ncurses` documentation**.
- **`man link(2)`** — POSIX hard link semantics.

## Author Biography

- **Dave Riggle** — Berkeley developer; wrote `sail` in 1980
  while at Berkeley. Public biographical information sparse.
  Known primarily as the author of this game.
- **Ed Wang** — Berkeley contributor who rewrote `sail` twice
  (1981, 1983). Public biographical information sparse.
- **Craig Leres ("Captain Happy")** — Berkeley developer; made
  `sail` portable. Later prominent in the BSD networking
  community (co-author of `libpcap` and `tcpdump`).
- **S. Craig Taylor** — game designer at Avalon Hill; created
  *Wooden Ships and Iron Men* (1974). Prolific board game
  designer.
- **Jeff Cohen** — author of "pubcaves"; credited with the
  `link()`-lock technique.

## Similar / Related Games

- **Age of Sail** series (Talonsoft, 1996 onward).
- **Naval Action** (Game-Labs, 2016).
- **Ultimate Admiral: Age of Sail** (Game-Labs).
- **Empire: Total War** (Creative Assembly, 2009).
- **Close Action** (Clash of Arms board game).

## Citation Style

- Code references use `file:line` format.
- URLs use permalinks / archive.org snapshots.

## See Also

- Root [`ATTRIBUTION.md`](../../../ATTRIBUTION.md).
- [`lineage.md`](./lineage.md).
