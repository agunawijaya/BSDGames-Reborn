# pom

> **Display the phase of the moon.** Useful for picking software
> release dates and predicting managerial behaviour.

**Category:** Fun / Info  
**Status:** 🟢 Released (2026-09-24): canonical docs complete, `fancy-web` port released  
**Original author(s):** Keith E. Brandt (1984); updated by Paul Janzen (1998)  
**First released:** NetBSD (BSD 4.3)

---

## About This Folder

This folder is the modernised port of **`pom`** from the original
BSDGames package. `pom` calculates the current phase of the moon from
the system clock (or a user-supplied date) using the algorithms from
*Practical Astronomy with Your Calculator*. It is a self-contained
learning artifact — code + history + design record + technical
breakdown.

## Ports

| Port | Style | Status | Summary |
|---|---|:---:|---|
| [`ports/fancy-web/`](./ports/fancy-web/) | fancy-web | 🟢 Released | *Selene — A Living Moon*: a ray-traced procedural Moon over a lake at night, driven by the original algorithm (byte-exact against the real binary). Moon calendar, timelapse, zero raster assets. |

> **Layout note:** the empty game-level `src/` and `tests/` and the
> game-level `docs/diff-log.md` predate the multi-port layout of
> [ADR-006](../../docs/decisions/006-multi-port-architecture.md) and
> have been left in place. Port code, tests and diff-logs live under
> `ports/<name>/`.

## Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Authors, history, screenshots, cultural notes |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | How to run it and interpret output |
| [`docs/architecture.md`](./docs/architecture.md) | C code analysis and astronomical algorithm |
| [`docs/lessons.md`](./docs/lessons.md) | Beginner-friendly lessons from the original code |
| [`docs/port-ideas.md`](./docs/port-ideas.md) | Modernisation brainstorm |
| [`docs/spec.md`](./docs/spec.md) | Reverse-specification of behaviour |
| [`docs/notes.md`](./docs/notes.md) | Working notes |
| [`docs/manpage.md`](./docs/manpage.md) | Mirror + annotation of the original `.6` man page |
| [`docs/diff-log.md`](./docs/diff-log.md) | Original → port feature log |
| [`docs/test-scenarios.md`](./docs/test-scenarios.md) | Manual test scripts |
| [`docs/lineage.md`](./docs/lineage.md) | Genre siblings and modern descendants |
| [`docs/references.md`](./docs/references.md) | Sources & citations |

## Running the Port

See [`ports/fancy-web/README.md`](./ports/fancy-web/README.md)
(`npm start`, then open the printed URL; `npm run pom -- <arg>` for the
terminal version).

```
$ pom
The Moon is Waxing Crescent (23% of Full)

$ pom 20261031
Sat 2026 Oct 31 00:00:00 (WIB):  The Moon will be Full
```

## Media

See [`media/`](./media/) for screenshots.

## Attribution

Based on the original **`pom`** by Keith E. Brandt as shipped in
BSDGames. See [`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
