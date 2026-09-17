# random

> **A probabilistic line filter and random exit-code generator.**

**Category:** Utility / Filter
· **Status:** 🟠 In Progress
· **Original author(s):** Guy Harris (Network Appliance Corp.)
· **First released:** 1994 (4.4BSD-Lite)

---

## About This Folder

This folder is the modernised port of **`random`** from the original BSDGames package. It is a self-contained learning artifact — code + history + design record + technical breakdown.

## Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Brochure — authors, publisher, year, cultural notes, bugs |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | Manual, tips, examples |
| [`docs/architecture.md`](./docs/architecture.md) | Original C code analysis + RNG |
| [`docs/lessons.md`](./docs/lessons.md) | Beginner-friendly lessons drawn from the original code |
| [`docs/port-ideas.md`](./docs/port-ideas.md) | Modernisation brainstorm — UI/UX, APIs, sampling |
| [`docs/spec.md`](./docs/spec.md) | Reverse-specification of mechanics |
| [`docs/notes.md`](./docs/notes.md) | Working notes |
| [`docs/manpage.md`](./docs/manpage.md) | Mirror + annotation of the original `.6` man page |
| [`docs/diff-log.md`](./docs/diff-log.md) | Feature-by-feature original → port log |
| [`docs/test-scenarios.md`](./docs/test-scenarios.md) | Manual test scripts |
| [`docs/lineage.md`](./docs/lineage.md) | Genre siblings and modern descendants |
| [`docs/references.md`](./docs/references.md) | Sources & citations |

## Running the Port

*(Add build/run instructions once implementation exists.)*

```
$ cat words.txt | random 10
```

## Media

See [`media/`](./media/) for screenshots and demos.

## Attribution

Based on the original **`random`** by Guy Harris as shipped in BSDGames. See [`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
