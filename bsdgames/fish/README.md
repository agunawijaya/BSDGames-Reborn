# fish

> **Go Fish.** Ask, draw, collect books, and try to beat the computer.

**Category:** Card Games  
**Status:** 🟠 In Progress — documentation done, awaiting language ADR  
**Original author(s):** Muffy Barkocy  
**First released:** BSD 4.3 (1990)

---

## About This Folder

This folder is the modernised port of **`fish`** from the original
BSDGames package. `fish` is the classic children's card game *Go Fish*
played against the computer. It is a self-contained learning artifact
— code + history + design record + technical breakdown.

## Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Authors, history, screenshots, cultural notes |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | Controls, rules, scoring, tips |
| [`docs/architecture.md`](./docs/architecture.md) | C code analysis: game loop, AI, RNG |
| [`docs/lessons.md`](./docs/lessons.md) | Beginner-friendly lessons from the original code |
| [`docs/port-ideas.md`](./docs/port-ideas.md) | Modernisation brainstorm |
| [`docs/spec.md`](./docs/spec.md) | Reverse-specification of mechanics |
| [`docs/notes.md`](./docs/notes.md) | Working notes |
| [`docs/manpage.md`](./docs/manpage.md) | Mirror + annotation of the original `.6` man page |
| [`docs/diff-log.md`](./docs/diff-log.md) | Original → port feature log |
| [`docs/test-scenarios.md`](./docs/test-scenarios.md) | Manual playthrough scripts |
| [`docs/lineage.md`](./docs/lineage.md) | Genre siblings and modern descendants |
| [`docs/references.md`](./docs/references.md) | Sources & citations |

## Running the Port

*(Add build/run instructions once implementation exists.)*

```
$ fish
Would you like instructions (y or n)? n

Your hand is: A 3 7 7 J
You ask me for: 7
I have 2 7's.
You get another guess!
```

## Media

See [`media/`](./media/) for screenshots.

## Attribution

Based on the original **`fish`** by Muffy Barkocy as shipped in
BSDGames. See [`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
