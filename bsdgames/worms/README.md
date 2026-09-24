# worms

> **Animated worms slither across your terminal — a curses screensaver classic.**

**Category:** Screensaver / Demo
· **Status:** 🟢 Released (2026-09-24): `fancy-web` port released
· **Original author(s):** Eric P. Scott
· **First released:** 1980 (3BSD)

---

## About This Folder

This folder is the modernised port of **`worms`** from the original BSDGames package. It is a self-contained learning artifact — code + history + design record + technical breakdown.

## Ports

| Port | Style | Status | Summary |
|---|---|:---:|---|
| [`ports/fancy-web/`](./ports/fancy-web/) | fancy-web | 🟢 Released | *Abyssal Worms*: a bioluminescent deep-sea screensaver driven by the unchanged engine (matches the original binary cell for cell), with luminous trails, a plankton WORM field, classic and split views, and procedural sound. Zero raster and audio assets. |

> **Layout note:** the empty game-level `src/`, `tests/` and `data/`
> and the game-level `docs/diff-log.md` predate the multi-port layout of
> [ADR-006](../../docs/decisions/006-multi-port-architecture.md) and
> are left in place. Port code, tests and diff-logs live under
> `ports/<name>/`.

## Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Brochure — authors, publisher, year, cultural notes, bugs |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | How to run and stop the screensaver |
| [`docs/architecture.md`](./docs/architecture.md) | Original C code analysis + animation loop |
| [`docs/lessons.md`](./docs/lessons.md) | Beginner-friendly lessons drawn from the original code |
| [`docs/port-ideas.md`](./docs/port-ideas.md) | Modernisation brainstorm — UI/UX, web demo |
| [`docs/spec.md`](./docs/spec.md) | Reverse-specification of mechanics |
| [`docs/notes.md`](./docs/notes.md) | Working notes |
| [`docs/manpage.md`](./docs/manpage.md) | Mirror + annotation of the original `.6` man page |
| [`docs/diff-log.md`](./docs/diff-log.md) | Feature-by-feature original → port log |
| [`docs/test-scenarios.md`](./docs/test-scenarios.md) | Manual test scripts |
| [`docs/lineage.md`](./docs/lineage.md) | Genre siblings and modern descendants |
| [`docs/references.md`](./docs/references.md) | Sources & citations |

## Running the Port

See [`ports/fancy-web/README.md`](./ports/fancy-web/README.md): `npm start`, then open the printed URL, optionally with `?args=-n 5 -l 32 -d 50`.

```
$ worms -n 5 -l 32 -d 50
```

## Media

See [`media/`](./media/) for screenshots and demos.

## Attribution

Based on the original **`worms`** by Eric P. Scott as shipped in BSDGames. See [`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
