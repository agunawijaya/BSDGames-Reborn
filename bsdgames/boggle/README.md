# Boggle — BSDGames Reborn

> The classic 4x4 word search game with countdown timer, dictionary validation, and recursive exhaustive word finding, originally contributed to 4.4BSD by **Barry Brachman** (1988/1993).

---

## At a Glance

- **Original Title:** *Boggle — a word search game*
- **Author:** Barry Brachman
- **Original Release:** 1988 (contributed to 4.4BSD in June 1993)
- **Genre:** Puzzle / Word Game
- **Board Grid:** 4×4 letter grid (16 authentic Parker Brothers letter cubes)
- **Timer:** Standard 3-minute countdown (180 seconds, configurable via `-t`)
- **Upstream Source:** [`vattam/BSDGames/tree/master/boggle`](https://github.com/vattam/BSDGames/tree/master/boggle)
- **Port Status:** 🟠 **Documentation Phase (Pre-Porting)**

---

## What Makes Boggle Special?

1. **Authentic 16-Die Physics:** Recreates the physical 1970s Parker Brothers Boggle dice distribution, randomly shaking the cubes into the 16 grid sockets and picking one of the six faces per die.
2. **Recursive Backtracking Word Solver:** Implements an exhaustive depth-first search (DFS) algorithm with adjacency constraints and pruning to discover all valid English words on the board.
3. **High-Performance Dictionary Indexing (`mkindex`):** Precomputes a 26-letter binary index (`bogdict.index`) to achieve sub-millisecond dictionary lookups across tens of thousands of words without consuming excessive memory.
4. **Real-Time Asynchronous Countdown:** Uses Unix timer signals (`SIGALRM`) to update an unobtrusive countdown clock while the user types words in raw terminal mode.
5. **Post-Game Analysis & Word Breakdown:** Compares the player's submitted words against the computer's exhaustive word solver, printing both words found and words missed along with an exact hit percentage.

---

## Documentation Taxonomy

All documentation is stored in [`docs/`](./docs/):

| Document | Purpose |
|---|---|
| [`about.md`](./docs/about.md) | Historical context, Barry Brachman's implementation, and gameplay brochure. |
| [`how-to-play.md`](./docs/how-to-play.md) | Player manual, scoring mechanics, command-line arguments, and strategy. |
| [`spec.md`](./docs/spec.md) | Reverse specification, formal invariants, board cube inventory, and dictionary lookup. |
| [`architecture.md`](./docs/architecture.md) | Deep dive into DFS graph search, timer signals, terminal raw mode, and index structure. |
| [`lessons.md`](./docs/lessons.md) | Pedagogical engineering lessons: DFS on graphs, indexed binary search, and Unix signals. |
| [`port-ideas.md`](./docs/port-ideas.md) | Modernization brainstorm: online multiplayer, modern wordlists, GUI/TUI upgrades. |
| [`diff-log.md`](./docs/diff-log.md) | Original BSD C features vs. modern spiritual successor enhancements. |
| [`notes.md`](./docs/notes.md) | Working development notes, cube frequency tables, and memory structures. |
| [`manpage.md`](./docs/manpage.md) | Annotated mirror of the classic `boggle(6)` Unix manual page. |
| [`lineage.md`](./docs/lineage.md) | Word game lineage from physical board games to Wordle and Scramble. |
| [`test-scenarios.md`](./docs/test-scenarios.md) | End-to-end verification scripts, batch mode validation, and QA template. |
| [`references.md`](./docs/references.md) | Historical citations, primary sources, and algorithmic references. |
| [`decisions/`](./docs/decisions/) | Architecture Decision Records (ADRs) overriding root defaults. |

---

## Upstream Attribution

Original C source is maintained in the [vattam/BSDGames](https://github.com/vattam/BSDGames/tree/master/boggle) repository. Copyright (c) 1993 The Regents of the University of California. Derived from software contributed by Barry Brachman. All rights reserved. See root [`ATTRIBUTION.md`](../../ATTRIBUTION.md).
