# AGENTS.md — `hunt` Context

This file provides context for AI agents working specifically on the
`bsdgames/hunt/` directory.

The **single source of truth** for repository-wide standards is the root
[`AGENTS.md`](../../AGENTS.md). **Read the root `AGENTS.md` completely
before doing any work.**

---

## 1. Game Identity

- **Program:** `hunt` & `huntd` (real-time multiplayer terminal arena shooter)
- **Authors:** Conrad Huang, Kenneth Chung, Greg Couch (Computer Graphics Lab, UCSF)
- **Year:** 1983–1985 / 1986 (4.3BSD release)
- **Category:** Arcade & Action (Real-Time Multiplayer)
- **Upstream Source:** [`vattam/BSDGames/tree/master/hunt`](https://github.com/vattam/BSDGames/tree/master/hunt)

---

## 2. Mandatory Taxonomy & Standards

As an arcade multiplayer action game:
1. Standard 15-document suite required. `walkthrough.md` and `world-map.md` are omitted as per §6.1 (maze is procedurally generated at runtime).
2. [`docs/spec.md`](./docs/spec.md) must feature the **Complete Weapon, Munition & Hazard Inventory Table** detailing single shots, bursts, grenades, mines, slime, reflectors, and electrical walls.
3. [`docs/how-to-play.md`](./docs/how-to-play.md), [`docs/spec.md`](./docs/spec.md), and [`docs/architecture.md`](./docs/architecture.md) must cover the dual-process architecture (`hunt` vs `huntd`), command-line flags (`-m`, `-t`, `-p`, `-b`, `-f`, `-c`), and multiplayer setup topologies.
4. Strictly NO local filesystem paths anywhere. Use upstream URLs or relative links only.

---

## 3. Port Status

- **Current status:** 🟠 canonical docs (42 corrections pending, see below);
  [`ports/fancy-web/`](./ports/fancy-web/) 🟢 Released (2026-09-24).
- **Owner:** AntiGravity & Agun (canonical docs); Agun (Claude) for `ports/fancy-web`.
- **Before trusting `docs/spec.md`:** the port verified the C source and
  found 42 places where the canonical docs disagree with it (maze size,
  weapon table, mirrors, walls, mines, slime, scoring, authors, …). Each
  one is in [`ports/fancy-web/docs/notes.md` §3](./ports/fancy-web/docs/notes.md#3-canonical-doc-discrepancies)
  with `file:line` evidence and a proposed fix. The C source wins.

```
hunt/
├── docs/             canonical documentation (see README)
├── media/            text mock-ups (not captures of the program; notes §3 #39)
└── ports/
    └── fancy-web/    Hunt — Ricochet (see its AGENTS.md)
```
