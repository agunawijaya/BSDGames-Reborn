# wump

> **Hunt the Wumpus — navigate a hazardous underground cave network through sensory cues and slay the beast with crooked arrows.**

**Category:** Puzzle & Word Games  
· **Status:** 🟠 In Progress (Pre-port Documentation Phase)  
· **Original author(s):** Dave Taylor (BSD C port, 1989/1993); original concept by Gregory Yob (1973)  
· **First released:** 1973 (original BASIC), 1989 (BSD Unix port)

---

## About This Folder

This folder is the modernised port of **`wump`** from the original BSDGames package. It is a self-contained learning artifact containing historical context, reverse-engineered mechanical specifications, architectural flowcharts, pedagogical lessons drawn from the original C codebase, modernisation brainstorms, and comprehensive test scenarios.

## Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Brochure — authors, history, People's Computer Company, cultural notes, and bugs |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | Manual, sensory cues, arrow trajectory mechanics, tips, and difficulty |
| [`docs/walkthrough.md`](./docs/walkthrough.md) | Strategic deductive playthroughs: solving procedural caves and the classical benchmark |
| [`docs/world-map.md`](./docs/world-map.md) | Topological graph modeling: Dodecahedron vs. procedural GCD-based cave graphs |
| [`docs/architecture.md`](./docs/architecture.md) | Original C code analysis, game loop, AI logic, and probabilistic hazard hooks |
| [`docs/lessons.md`](./docs/lessons.md) | Beginner-friendly lessons drawn from the original code (GCD cycles, pointer loops) |
| [`docs/port-ideas.md`](./docs/port-ideas.md) | Modernisation brainstorm — gameplay, soundscape, graphical/TUI UX, multiplayer |
| [`docs/spec.md`](./docs/spec.md) | Implementation-independent reverse specification of mechanics and invariants |
| [`docs/notes.md`](./docs/notes.md) | Working notes and design scratchpad |
| [`docs/manpage.md`](./docs/manpage.md) | Mirror + annotation of the original `wump.6` man page |
| [`docs/diff-log.md`](./docs/diff-log.md) | Feature-by-feature original → port tracking log |
| [`docs/test-scenarios.md`](./docs/test-scenarios.md) | Manual playthrough scripts and hazard verification scenarios |
| [`docs/lineage.md`](./docs/lineage.md) | Genre siblings, Hunt the Wumpus history, and modern descendants |
| [`docs/references.md`](./docs/references.md) | Academic, historical, and technical citations |

## Running the Port

*(Implementation phase will follow the approval of pre-port documentation.)*

```bash
$ wump [options]
```

## Media

See [`media/`](./media/) for screenshots, topological diagrams, and asciicast demos.

## Attribution

Based on the original **`wump`** contributed to Berkeley by Dave Taylor (Intuitive Systems) as shipped in BSDGames. Concept originally designed by Gregory Yob. See [`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
