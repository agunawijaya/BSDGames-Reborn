# AGENTS.md — `hack` Context

This file provides context for AI agents working specifically on the
`bsdgames/hack/` directory.

The **single source of truth** for repository-wide standards is the root
[`AGENTS.md`](../../AGENTS.md). **Read the root `AGENTS.md` completely
before doing any work.**

---

## 1. Game Identity

- **Program:** `hack` (the Dungeons of Doom roguelike)
- **Authors:** Jay Fenlason, Kenny Woodland, Mike Thome, Jon Payne (original); Andries Brouwer (CWI expansion)
- **Year:** 1982–1985 / 1986 (4.3BSD release)
- **Category:** Adventure & RPG (Procedural Roguelike)
- **Upstream Source:** [`vattam/BSDGames/tree/master/hack`](https://github.com/vattam/BSDGames/tree/master/hack)

---

## 2. Mandatory Taxonomy & Standards

Because `hack` is a procedural roguelike with emergent AI, dynamic dungeon floors, and item/monster inventories:

1. **Both Conditional Documents Are Required in Procedural Form:**
   - [`docs/walkthrough.md`](./docs/walkthrough.md): Must feature the **Universal Ascendant Protocol** (systematic phase-by-phase survival guide from D1 to Amulet retrieval and surface ascension).
   - [`docs/world-map.md`](./docs/world-map.md): Must feature the **Dungeon Architecture & Generation Engine** (depth zones, room/corridor BSP synthesis, shop/vault templates, and Master Monster/Feature Directory).
2. **Entity & Monster Inventory:**
   - [`docs/spec.md`](./docs/spec.md) must feature the **Complete 58-Monster Table** detailing symbols, levels, AC, attacks, and special behaviors, plus item categories.
3. **Difficulty Levels & Setup Configuration:**
   - All documentation files (`spec.md`, `how-to-play.md`, `architecture.md`, `about.md`) must cover character class selection (Tourist, Speleologist, Fighter, Knight, Cave-man, Wizard), bones level toggles, runtime flags, and wizard debugging mode.
4. **No Local Paths:**
   - Strictly avoid local filesystem paths. All code references must use upstream GitHub URLs (`https://github.com/vattam/BSDGames/tree/master/hack/<file>#L...`) or relative paths.
