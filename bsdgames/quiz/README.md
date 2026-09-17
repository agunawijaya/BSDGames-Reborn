# quiz

> **Random knowledge tests.** Pick a subject, answer questions, learn
> obscure facts.

**Category:** Puzzle & Word Games  
**Status:** 🟠 In Progress — documentation done, awaiting language ADR  
**Original author(s):** Jim R. Oldroyd, Keith Gabryelski  
**First released:** BSD 4.3 (1991)

---

## About This Folder

This folder is the modernised port of **`quiz`** from the original
BSDGames package. `quiz` is a data-driven trivia drill: it reads
question files organized by categories and asks the player to supply
one category from another. It is a self-contained learning artifact —
code + history + design record + technical breakdown.

## Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Authors, history, screenshots, cultural notes |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | Controls, rules, scoring, tips |
| [`docs/architecture.md`](./docs/architecture.md) | C code analysis: parsing, game loop, data files |
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
$ quiz
Subjects:
...
$ quiz victim killer
President?
Lincoln
Right!
```

## Media

See [`media/`](./media/) for screenshots.

## Attribution

Based on the original **`quiz`** by Jim R. Oldroyd and Keith
Gabryelski as shipped in BSDGames. See
[`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
