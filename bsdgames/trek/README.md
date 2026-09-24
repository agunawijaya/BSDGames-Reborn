# trek

> **Captain, you have the conn. Kill the Klingons before your time runs out — or your energy — or your fuel — or your shields — or your crew — or the negative energy barrier — or a supernova. Or all of the above at once.**

**Category:** Simulation & Strategy
· **Status:** 🟠 In Progress (documentation phase)
· **Original author:** Eric Allman (UC Berkeley, 1976 C version); lineage tracing back to Mike Mayfield's BASIC and multiple FORTRAN implementations from 1971–1975
· **First released:** 1980 (4BSD)

---

## About This Folder

This folder is the modernised port of **`trek`** — Eric Allman's
seminal Star Trek combat simulation — from the original BSDGames
package. Eric Allman later became famous as the creator of
**`sendmail`**. `trek` is his early work, and it shows the same
appetite for elaborate, state-heavy systems programming.

## Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Brochure — Eric Allman, provenance chain, cultural weight |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | 23 commands, 14 devices, difficulty modes |
| [`docs/architecture.md`](./docs/architecture.md) | Command dispatch, event scheduler, snapshot-based time-warp, difficulty |
| [`docs/lessons.md`](./docs/lessons.md) | Command tables, event scheduling, longjmp for game-over |
| [`docs/port-ideas.md`](./docs/port-ideas.md) | Modernisation: 3D view, richer AI, multiplayer, campaign |
| [`docs/spec.md`](./docs/spec.md) | Formal state (galaxy, ship, events), 13 lose codes, RNG |
| [`docs/notes.md`](./docs/notes.md) | Working notes |
| [`docs/manpage.md`](./docs/manpage.md) | Mirror + annotation of `trek.6.in` |
| [`docs/diff-log.md`](./docs/diff-log.md) | Feature-by-feature original → port log |
| [`docs/test-scenarios.md`](./docs/test-scenarios.md) | Manual playthrough scripts |
| [`docs/lineage.md`](./docs/lineage.md) | The provenance chain (1971 → 1976 → 1980 → today) |
| [`docs/references.md`](./docs/references.md) | Sources & citations |

*Not applicable to this game:* `walkthrough.md`, `world-map.md` —
`trek` is a procedurally generated galaxy (8×8 quadrants × 10×10
sectors) so there is no fixed map or single-solution walkthrough.

## Ports

- [`ports/procedural-web/`](./ports/procedural-web/) — *Deep Space — Procedural*: same engine as `fancy-web`, but every visual and sound generated from code (zero raster assets); adds the Captain's Override cheat layer and a head-to-head [comparison](./ports/procedural-web/docs/comparison.md).

## Running the Port

*(Not implemented yet — pending platform/language ADRs.)*

## Media

See [`media/`](./media/) for 5 screenshots (startup, mission briefing,
srscan, lrscan, damages) captured via
[`docs/scripts/capture-screenshots.sh`](../../docs/scripts/capture-screenshots.sh).

## Attribution

Based on the original **`trek`** by **Eric Allman** at UC Berkeley
(1976 C version). Descended through a long line of BASIC / FORTRAN
Star Trek games starting with Mike Mayfield (1971). See
[`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
