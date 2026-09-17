# arithmetic

> **Drill yourself on simple arithmetic.** Addition, subtraction,
> multiplication, division — with a teacher that remembers your weak
> spots.

**Category:** Puzzle & Word Games  
**Status:** 🟠 In Progress — documentation done, awaiting language ADR  
**Original author(s):** Eamonn McManus (Trinity College Dublin)  
**First released:** BSD 4.3 (1989)

---

## About This Folder

This folder is the modernised port of **`arithmetic`** from the
original BSDGames package. `arithmetic` is a flash-card-style drill
for basic math. It asks problems, waits for answers, and biases future
questions toward the numbers you get wrong. It is a self-contained
learning artifact — code + history + design record + technical
breakdown.

## Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Authors, history, screenshots, cultural notes |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | Controls, tips, scoring |
| [`docs/architecture.md`](./docs/architecture.md) | C code analysis: game loop, penalty system, RNG |
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
$ arithmetic
3 + 4 =   7
Right!
8 - 2 =   6
Right!
```

## Media

See [`media/`](./media/) for screenshots.

## Attribution

Based on the original **`arithmetic`** by Eamonn McManus as shipped in
BSDGames. See [`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
