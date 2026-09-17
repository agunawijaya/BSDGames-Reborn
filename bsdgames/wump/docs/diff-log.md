# `wump` — Original → Port Diff Log

> Feature-by-feature tracking log of what is kept, changed, added, removed,
> and reinterpreted between the original BSD C version and the BSDGames Reborn port.

---

## Legend

- 🟩 **Kept** — Identical or mechanically faithful to the original C code.
- 🟨 **Changed** — Same core feature, updated for modern ergonomics or display.
- 🟦 **Added** — New feature not present in original BSD `wump`.
- 🟥 **Removed** — Deprecated or obsolete subsystem dropped.
- 🟪 **Reinterpreted** — Original concept fundamentally redesigned.

---

## Feature Log

| # | Feature | Status | Notes |
|:--:|---|:---:|---|
| 1 | **Cave Graph Generation** | 🟩 | Kept Dave Taylor's $\gcd$ coprime Hamiltonian cycle + random chords generator. |
| 2 | **Sensory Proximity System** | 🟩 | Exact mathematical distance checks: Bats (1 hop), Pits (1 hop), Wumpus (2 hops). |
| 3 | **Arrow Ballistics & Deflection** | 🟩 | Kept 5-hop cap, bowstring snap (20% at hop 3), flight decay (60% at hop 4), and random ricochet mechanics. |
| 4 | **Pit Survival Outcrop** | 🟩 | Preserved the $2/12$ ($16.67\%$) chance of surviving a pit stumble. |
| 5 | **Wumpus Disturbance State** | 🟩 | Preserved `lastchance` alertness accumulation on missed shots and 1-in-6 wall bump awakening. |
| 6 | **Terminal UI / Presentation** | 🟨 | Modernized from linear teletype scrolling prompts to structured multi-pane TUI layout. |
| 7 | **Instruction Pager** | 🟥 | Dropped `fork()` / `execl()` invocation of external `/bin/sh -c $PAGER` reading `/usr/share/games/wump.info`. Native inline display used. |
| 8 | **Setgid Privilege Dropping** | 🟥 | Dropped `setregid(getgid(), getgid())` as obsolete Unix multi-user security cruft. |
| 9 | **Interactive Auto-Mapping** | 🟦 | Added optional in-terminal live topological graph visualizer to relieve players of manual scrap-paper mapping. |
| 10 | **Deterministic Seed Support** | 🟦 | Added `--seed <int>` flag for reproducible challenge runs, regression testing, and daily puzzles. |
| 11 | **Classical Mode Flag** | 🟦 | Added `--classic` flag to force Gregory Yob's symmetric 1973 dodecahedron cave topology. |
| 12 | **Screen Reader Accessibility** | 🟦 | Added `--screen-reader` mode outputting raw stream text without ANSI art boxes or visual layout barriers. |

---

## Narrative

During pre-port reverse engineering, we discovered that `wump` is exceptionally well-suited for modern spiritual reinvention. Its core mechanics (indirect spatial inference, 2-hop stench triangulation, and crooked-arrow ballistics) are timeless.

The greatest hurdle for modern players in the original was the cognitive load of paper-mapping in an era where graphical screens are ubiquitous. By keeping the pure graph mechanics identical (🟩) while introducing an optional auto-cartography pane and deterministic daily seed runs (🟦), we preserve the intellectual challenge while removing the friction of 1970s teletype interfaces.

---

## Cross-References

- [`spec.md`](./spec.md) — The authoritative mechanical contract.
- [`port-ideas.md`](./port-ideas.md) — High-level brainstorming for future enhancements.
- [`architecture.md`](./architecture.md) — Technical breakdown of the original C implementation.
