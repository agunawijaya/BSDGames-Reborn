# adventure

> **Colossal Cave Adventure — Explore the subterranean labyrinth of Colossal Cave, solve ancient puzzles, and recover 15 legendary treasures in the foundational masterpiece of interactive fiction.**

**Category:** Adventure & RPG  
· **Status:** 🟠 In Progress (Pre-port Documentation Phase)  
· **Original author(s):** Will Crowther (1975–1976), Don Woods (1976–1977); C translation by Jim Gillogly (1977/1993)  
· **First released:** 1976 (PDP-10 FORTRAN), 1977 (C port)

---

## About This Folder

This folder contains the documentation, reverse-engineered specifications, architectural analyses, and modernization design for **`adventure`** (Colossal Cave Adventure / ADVENT). As the foundational ancestor of the interactive fiction and text adventure genres, this folder serves as a self-contained learning artifact and living textbook.

## Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Brochure — Crowther & Woods, Bedquilt Cave mapping, ARPANET spread, bugs & cultural lore |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | Player manual, two-word parser vocabulary, magic words (`xyzzy`, `plugh`), and scoring tiers |
| [`docs/walkthrough.md`](./docs/walkthrough.md) | Dual Walkthrough: Shortest Victory Path AND Maximum-Score (350-point Grandmaster) Path |
| [`docs/world-map.md`](./docs/world-map.md) | Complete Mermaid maps of Colossal Cave (Surface, Hall of Mists, Mazes, Deep Caverns) |
| [`docs/architecture.md`](./docs/architecture.md) | C architecture analysis, command dispatcher, glorkz database, dwarf AI, and state machine |
| [`docs/lessons.md`](./docs/lessons.md) | Pedagogical lessons: text virtualization, two-word parsing, state bitmasks, and PRNG hashes |
| [`docs/port-ideas.md`](./docs/port-ideas.md) | Modernization brainstorm: natural language parser, auto-mapping, soundscapes, accessibility |
| [`docs/spec.md`](./docs/spec.md) | Implementation-independent mechanical specification, state variables, rules, and scoring |
| [`docs/notes.md`](./docs/notes.md) | Working scratchpad and historical version comparisons (Crowther 350 vs Woods vs 430) |
| [`docs/manpage.md`](./docs/manpage.md) | Cleaned-up Markdown mirror and historical annotations of the original `adventure.6` man page |
| [`docs/diff-log.md`](./docs/diff-log.md) | Feature-by-feature tracking log between original C/Fortran and modernized port |
| [`docs/test-scenarios.md`](./docs/test-scenarios.md) | Manual playthrough verification scripts (puzzles, dragons, dwarves, pirate, endgame) |
| [`docs/lineage.md`](./docs/lineage.md) | Genre tree: from Colossal Cave to Zork, MUD1, Infocom, Rogue, and modern narrative games |
| [`docs/references.md`](./docs/references.md) | Primary sources, interviews, historical archives, and academic literature |

## Running the Port

*(Implementation phase will follow the completion and approval of pre-port documentation.)*

```bash
$ adventure [saved-file]
```

## Media

See [`media/`](./media/) for historical maps, terminal transcripts, and diagram artifacts.

## Attribution

Based on the original **`adventure`** written in Fortran by Will Crowther and Don Woods, translated to C by Jim Gillogly at The Rand Corporation, and contributed to Berkeley for the BSDGames distribution. See [`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
