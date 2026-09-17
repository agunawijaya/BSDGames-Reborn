# Battlestar — BSDGames Reborn

> A classic stellar-tropical interactive fiction adventure originally written by
> **David W. Horatio Riggle** (1979/1983) on the Cory Hall PDP-11/70 at UC Berkeley.

---

## At a Glance

- **Original Title:** *Battlestar — a tropical adventure game*
- **Author:** David W. Horatio Riggle
- **Original Release:** 1979 / 1983 (4.2BSD)
- **Genre:** Sci-Fi / Tropical Island Interactive Fiction (Parser Adventure)
- **Map Scale:** 275 distinct rooms across a dying Battlestar, deep space orbit, and an uncharted tropical alien world
- **Upstream Source:** [`vattam/BSDGames/tree/master/battlestar`](https://github.com/vattam/BSDGames/tree/master/battlestar)
- **Port Status:** 🟠 **Documentation Phase (Pre-Porting)**

---

## What Makes Battlestar Special?

1. **Space Opera Meets Tropical Island Mystery:** Unlike standard dungeon crawlers, *Battlestar* begins aboard a crumbling starship under bombardment. You awaken in luxurious stateroom #22 wearing silk pajamas, salvage weapons, reach the Viper launch tube, and dogfight Cylon raiders in orbit before crashing onto an enigmatic tropical island filled with ancient magic, wood-elves, and water nymphs.
2. **Dual-World Day / Night Engine:** The world physically transforms every 100 turns (`CYCLE 100`). Locations swap between `dayfile.c` and `nightfile.c`, and item distributions shift between `dayobjs.c` and `nightobjs.c`. Hostile wood-elves stalk the jungle at night, while peaceful native gatherings take place by day.
3. **Compass & Egocentric Relative Navigation:** The parser supports both cardinal compass directions (`north`, `south`, `east`, `west`, `up`, `down`) and subjective relative movement (`ahead`, `back`, `left`, `right`), translating actions through a dynamic facing-angle rotation matrix.
4. **Interactive Space Dogfight Simulation (`fly.c`):** Features a real-time/semi-real-time terminal space dogfight minigame using curses, vector crosshairs, torpedo munitions, and fuel consumption.
5. **Detailed Physical Trauma System:** The player tracks 13 distinct physical injuries (`NUMOFINJURIES 13`), from broken arms and fractured ribs to severed backs and skull fractures, dynamically affecting encumbrance limits and weapon usage.
6. **Multi-Dimensional Tri-Partite Scoring:** Player accomplishment is evaluated across three philosophical axes: **PLEASURE**, **POWER**, and **EGO**, awarding titles ranging from *"Don Juan"* and *"Mr. Roarke"* to *"Klingon"* and *"Sauron the Great"*.

---

## Documentation Taxonomy

All documentation is stored in [`docs/`](./docs/):

| Document | Purpose |
|---|---|
| [`about.md`](./docs/about.md) | Historical brochure, development lore at UC Berkeley, and game pitch. |
| [`how-to-play.md`](./docs/how-to-play.md) | Complete player manual, parser syntax, relative movement guide, and flight controls. |
| [`world-map.md`](./docs/world-map.md) | Mermaid topology diagrams for all 5 sectors + Master 275-Room & Object Directory. |
| [`walkthrough.md`](./docs/walkthrough.md) | Two complete solutions: Shortest Speedrun Path & 350+ Point Grandmaster Victory. |
| [`spec.md`](./docs/spec.md) | Reverse specification extracted from original C source, rules, state, and 64-object inventory. |
| [`architecture.md`](./docs/architecture.md) | Deep analysis of the original C engine, parser grammar, day/night cycles, and dogfight math. |
| [`lessons.md`](./docs/lessons.md) | Pedagogical engineering lessons from the 16-bit PDP-11 Unix era. |
| [`port-ideas.md`](./docs/port-ideas.md) | Modernization brainstorm: modern NLP, color terminal rendering, accessibility. |
| [`diff-log.md`](./docs/diff-log.md) | Original 1983 BSD features vs. modern spiritual successor roadmap. |
| [`notes.md`](./docs/notes.md) | Working development notes, memory layout quirks, and parser edge cases. |
| [`manpage.md`](./docs/manpage.md) | Annotated mirror of the classic `battlestar(6)` manual page. |
| [`lineage.md`](./docs/lineage.md) | Genre siblings, historical predecessors, and modern interactive fiction successors. |
| [`test-scenarios.md`](./docs/test-scenarios.md) | Automated and manual end-to-end playthrough test scripts. |
| [`references.md`](./docs/references.md) | Citations, primary sources, academic papers, and historical archives. |
| [`decisions/`](./docs/decisions/) | Architecture Decision Records (ADRs) overriding root defaults. |

---

## Upstream Attribution

Original C source is maintained in the [vattam/BSDGames](https://github.com/vattam/BSDGames/tree/master/battlestar) repository. Copyright (c) 1983, 1993 The Regents of the University of California. All rights reserved. See root [`ATTRIBUTION.md`](../../ATTRIBUTION.md).
