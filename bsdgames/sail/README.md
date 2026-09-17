# sail

> **Wooden ships and iron men. Take command of a Napoleonic-era Man of War, judge the weather gage, hold the line of battle, and let loose the terrible destruction of your broadsides — all while sharing a tmpfile with three other captains.**

**Category:** Board Games (multi-process naval simulation)
· **Status:** 🟠 In Progress (documentation phase)
· **Original author:** Dave Riggle (first version, PDP-11/70, fall 1980)
· **Rewrites:** Ed Wang (1981, 1983), Craig Leres (portability)
· **Based on:** Avalon Hill's *Wooden Ships and Iron Men* by S. Craig Taylor
· **First BSD release:** ~1988 (`@(#)sail.6 8.3 (Berkeley) 6/1/94`)

---

## About This Folder

The modernised port of **`sail`** — a Napoleonic naval combat
simulator with real-time multi-user gameplay via *shared temp
file* — one of the earliest multi-user games in Unix. See
[`docs/about.md`](./docs/about.md) for the full story.

## Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Brochure — Dave Riggle, Avalon Hill lineage, wooden ships era |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | Movement, shot types, boarding, crew quality |
| [`docs/architecture.md`](./docs/architecture.md) | Player/driver split, tmpfile IPC, `flock()` via `link()` trick |
| [`docs/lessons.md`](./docs/lessons.md) | Multi-process IPC, hard link locking, shared state |
| [`docs/port-ideas.md`](./docs/port-ideas.md) | Internet multiplayer, richer 3D, campaign, AI captains |
| [`docs/spec.md`](./docs/spec.md) | Formal spec: 32 scenarios, 4 shots, 5 crew levels, movement rules |
| [`docs/notes.md`](./docs/notes.md) | Working notes |
| [`docs/manpage.md`](./docs/manpage.md) | Mirror + annotation of `sail.6` (very long historical doc) |
| [`docs/diff-log.md`](./docs/diff-log.md) | Feature-by-feature original → port log |
| [`docs/test-scenarios.md`](./docs/test-scenarios.md) | Manual playthrough scripts |
| [`docs/lineage.md`](./docs/lineage.md) | Multi-user gaming lineage; Avalon Hill → sail → naval sims |
| [`docs/references.md`](./docs/references.md) | Sources & citations |

*Not applicable:* `walkthrough.md`, `world-map.md` — every
scenario has different geography; no single walkthrough.

## Running the Port

*(Not implemented yet — pending platform/language ADRs.)*

## Media

See [`media/`](./media/) — 3 screenshots (scenario menu, ship
selection, Hornblower and the Natividad) captured via
[`docs/scripts/capture-screenshots.sh`](../../docs/scripts/capture-screenshots.sh).

## Attribution

Based on the original **`sail`** by Dave Riggle (~1980), with
rewrites by Ed Wang (1981, 1983) and Craig Leres. Game concept
from Avalon Hill's *Wooden Ships and Iron Men* by **S. Craig
Taylor**. See [`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
