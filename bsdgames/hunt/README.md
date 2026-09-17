# Hunt — BSDGames Reborn

> The legendary multi-player, multi-terminal search-and-destroy arena shooter, originally written by
> **Conrad Huang**, **Kenneth Chung**, and **Greg Couch** at the University of California, San Francisco (1983–1985), distributed in 4.3BSD.

---

## At a Glance

- **Original Title:** *Hunt — a multi-player multi-terminal game*
- **Authors:** Conrad Huang, Kenneth Chung, Greg Couch (Computer Graphics Laboratory, UCSF)
- **Original Release:** 1983–1985 (integrated into 4.3BSD in 1986)
- **Genre:** Real-Time Multiplayer Top-Down Action / Maze Arena Shooter
- **Architecture:** Client-Server model (`hunt` client, `huntd` daemon) over BSD Internet sockets (UDP discovery, TCP game streams)
- **Upstream Source:** [`vattam/BSDGames/tree/master/hunt`](https://github.com/vattam/BSDGames/tree/master/hunt)
- **Port Status:** 🟠 **Documentation Phase (Pre-Porting)**

---

## What Makes Hunt Special?

1. **Pre-Internet Network Deathmatch Pioneer:** Ten years before *Doom* popularized LAN deathmatches, *Hunt* enabled university students across distinct Unix terminals and VAX minicomputers to hunt, stalk, and eliminate each other across a shared maze in real time.
2. **Rich Ballistics & Projectile Physics:** Features single shots (`f`), full-auto bursts (`F`), throwable fragmentation grenades (`g`), bouncing slime canisters (`s`), and proximity tripmines (`m`). Projectiles reflect and ricochet realistically off slanted reflector walls (`/` and `\`).
3. **Dual Client-Daemon Architecture:** A dedicated background driver daemon (`huntd`) maintains master game state, simulates projectile physics at tick intervals, generates procedural mazes, and streams differential screen redraws to clients.
4. **Spectator & Co-op Squad Modes:** Supports passive observation via monitor mode (`-m`) as well as cooperative team play (`-t <team>`), where teammates share scoreboard rankings and cannot friendly-fire with standard munitions.
5. **Autonomous AI Robot ("Otto"):** Includes a built-in algorithmic bot (`otto.c`) capable of independently navigating the maze, cornering human players, dodging incoming projectiles, and returning fire.

---

## Documentation Taxonomy

All documentation is stored in [`docs/`](./docs/):

| Document | Purpose |
|---|---|
| [`about.md`](./docs/about.md) | Historical brochure, UCSF origins, VAX-11/750 lore, and cultural impact. |
| [`how-to-play.md`](./docs/how-to-play.md) | Complete manual: controls, movement, weapon arsenal, cloaking, and team warfare. |
| [`spec.md`](./docs/spec.md) | Reverse specification, packet protocol, projectile trajectories, and entity inventory. |
| [`architecture.md`](./docs/architecture.md) | Deep dive into `huntd` daemon, socket IPC, `select()` event loop, and differential drawing. |
| [`lessons.md`](./docs/lessons.md) | Pedagogical engineering lessons: early Unix networking, packet efficiency, and bot AI. |
| [`port-ideas.md`](./docs/port-ideas.md) | Modernization brainstorm: WebSockets, internet matchmaking lobbies, modern bot leagues. |
| [`diff-log.md`](./docs/diff-log.md) | Original 4.3BSD features vs. modern spiritual successor roadmap. |
| [`notes.md`](./docs/notes.md) | Working development notes, network packet structs, and reflection geometry. |
| [`manpage.md`](./docs/manpage.md) | Annotated mirror of classic `hunt(6)` and `huntd(6)` manual pages. |
| [`lineage.md`](./docs/lineage.md) | Multiplayer deathmatch genealogy: Maze War, Hunt, Netrek, Doom, and Quake. |
| [`test-scenarios.md`](./docs/test-scenarios.md) | Multi-terminal verification scripts, bot stress tests, and QA template. |
| [`references.md`](./docs/references.md) | Citations, archival source links, and historical references. |
| [`decisions/`](./docs/decisions/) | Architecture Decision Records (ADRs) overriding root defaults. |

---

## Upstream Attribution

Original C source is maintained in the [vattam/BSDGames](https://github.com/vattam/BSDGames/tree/master/hunt) repository. Copyright (c) 1983-2003 The Regents of the University of California. Developed at UCSF Computer Graphics Laboratory. All rights reserved. See root [`ATTRIBUTION.md`](../../ATTRIBUTION.md).
