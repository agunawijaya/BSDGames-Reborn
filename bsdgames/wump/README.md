# wump

> **Hunt the Wumpus — navigate a hazardous underground cave network through sensory cues and slay the beast with crooked arrows.**

**Category:** Puzzle & Word Games  
· **Status:** 🟢 Released (2026-09-18 — canonical docs complete + `fancy-web` port at Released status)  
· **Original author(s):** Dave Taylor (BSD C port, 1989/1993); original concept by Gregory Yob (1973)  
· **First released:** 1973 (original BASIC), 1989 (BSD Unix port)

---

## About This Folder

This folder is the modernised port of **`wump`** from the original BSDGames package. It is a self-contained learning artifact containing historical context, reverse-engineered mechanical specifications, architectural flowcharts, pedagogical lessons drawn from the original C codebase, modernisation brainstorms, and comprehensive test scenarios.

## Ports

| Port | Style | Tech Stack | Status | Live Link |
|---|---|---|:---:|---|
| [`ports/fancy-web/`](./ports/fancy-web/) | `fancy-web` | Canvas 2D + Web Audio API + Pure Node Engine | 🟢 Released | Open [`ports/fancy-web/index.html`](./ports/fancy-web/index.html) |

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
| [`ports/fancy-web/docs/diff-log.md`](./ports/fancy-web/docs/diff-log.md) | Feature-by-feature original → port tracking log |
| [`docs/test-scenarios.md`](./docs/test-scenarios.md) | Manual playthrough scripts and hazard verification scenarios |
| [`docs/lineage.md`](./docs/lineage.md) | Genre siblings, Hunt the Wumpus history, and modern descendants |
| [`docs/references.md`](./docs/references.md) | Academic, historical, and technical citations |

## Running the Port

Open [`ports/fancy-web/index.html`](./ports/fancy-web/index.html) in any modern web browser. No build steps or servers required.

To run automated engine tests:
```bash
$ cd ports/fancy-web
$ npm test
```

## Media

See [`media/`](./media/) for original BSD binary screenshots, and [`ports/fancy-web/media/`](./ports/fancy-web/media/) for live port captures.

## Attribution

Based on the original **`wump`** contributed to Berkeley by Dave Taylor (Intuitive Systems) as shipped in BSDGames. Concept originally designed by Gregory Yob. See [`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
