# `atc` — References & Sources

> Every historical or technical claim in this game's docs traces
> back to a source listed here.

---

## Primary Sources

- **BSDGames upstream:**
  <https://github.com/vattam/BSDGames/tree/master/atc>
- **Man page `atc.6.in`:**
  <https://github.com/vattam/BSDGames/blob/master/atc/atc.6.in>
- **Source files analysed:**
  - `main.c` (entry, signal setup, game loop)
  - `update.c` (**the tick engine, plane movement, collision**)
  - `struct.h` (data structures)
  - `def.h` (constants and macros)
  - `grammar.y` (yacc grammar for playfield DSL + commands)
  - `lex.l` (lex tokeniser)
  - `input.c` (command completion and input loop; not analysed in
    depth for this pass)
  - `graphics.c` (curses rendering; not analysed in depth)
  - `list.c` (doubly-linked list of planes)
  - `log.c` (score file handling)
  - `tunable.c` (compile-time tunables)
  - `games/*` (17 shipped playfields)
  - `BUGS` (Ed's own 4-line bug list)

## Historical & Cultural Sources

- **Ed James biography** — sparse public information. Known from
  BSD attribution and header comments.
- **UC Berkeley Computer Systems Research Group (CSRG)** — the
  distribution vehicle for BSD. See Marshall Kirk McKusick's
  various essays on BSD history.
- **4.3BSD-Reno and 4.4BSD-Lite release notes** — first
  distributions containing `atc`.
- **Kennedy Approach (Microprose, 1985)** — Wikipedia article and
  Microprose catalogue archives for context.
- **VATSIM Network** — <https://vatsim.net/> — modern virtual ATC.

## Technical Sources

- **Brian W. Kernighan & Dennis M. Ritchie**, *The C Programming
  Language*, 2nd ed. (1988) — general C idioms.
- **W. Richard Stevens**, *Advanced Programming in the Unix
  Environment* (1992) — `signal(2)`, `sigaction(2)`, `setitimer(2)`
  usage patterns.
- **John Levine, Tony Mason, Doug Brown**, *lex & yacc*, 2nd ed.
  (O'Reilly, 1992) — the definitive reference for the tools Ed used.
- **`ncurses` documentation** —
  <https://invisible-island.net/ncurses/>.

## Author Biography

- **Ed James** — UC Berkeley, mid-1980s. Author of `atc` (1986).
  Contact address from the era: `edjames@ucbvax.berkeley.edu`,
  `ucbvax!edjames`. These are historical UUCP-era addresses and
  are not expected to work today.

Little more is publicly documented about Ed James's other work.
The Berkeley UNIX contributor lists include his name in relation
to `atc`; beyond that, information is sparse. `atc` is his
enduring cultural artefact.

## Similar Games / Successors

- **Endless ATC** — <https://endlessatc.com/>
- **Airport Madness** (Big Fat Simulations).
- **Mini Metro** (Dinosaur Polo Club) — spiritual descendant in
  the "route entities under real-time pressure" tradition.

## Citation Style

- Code references use `file:line` format for reproducibility against
  the upstream tree.
- URLs use permalinks or archive.org snapshots for fragile links.

## See Also

- Root [`ATTRIBUTION.md`](../../../ATTRIBUTION.md).
- [`lineage.md`](./lineage.md).
