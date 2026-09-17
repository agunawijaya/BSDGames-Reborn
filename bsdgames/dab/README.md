# dab

> **Dots and Boxes.** Draw lines, complete boxes, and out-score the
> computer or a friend.

**Category:** Board Games  
**Status:** 🟠 In Progress — documentation done, awaiting language ADR  
**Original author(s):** Christos Zoulas  
**First released:** NetBSD 2003

---

## About This Folder

This folder is the modernised port of **`dab`** from the original
BSDGames package. `dab` is the classic pencil-and-paper game *Dots and
Boxes* implemented for the terminal with a simple AI opponent. It is a
self-contained learning artifact — code + history + design record +
technical breakdown.

## Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Authors, history, screenshots, cultural notes |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | Controls, rules, scoring, tips |
| [`docs/architecture.md`](./docs/architecture.md) | C++ code analysis: board, AI, random events |
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
$ dab
# human vs computer on a 3x3 board

$ dab -p hh 5
# two humans on a 5x5 board
```

## Media

See [`media/`](./media/) for screenshots.

## Attribution

Based on the original **`dab`** by Christos Zoulas as shipped in
BSDGames. See [`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
