# robots

> **Fight off villainous robots by tricking them into destroying each other. You have no weapons — only your wits and a limited teleporter.**

**Category:** Arcade & Action
· **Original author:** Ken Arnold (autobot mode by Christos Zoulas)
· **First released:** 1984 (BSD 4.2 era)

---

## About This Folder

Under [ADR-006](../../docs/decisions/006-multi-port-architecture.md)
each game has two tiers:

1. **Canonical** (this folder's `docs/` and `media/`) — describes
   the game itself and its original C implementation. Written
   once; shared by every port.
2. **Ports** — under [`ports/`](./ports/). Each port is a
   self-contained implementation with its own tech stack,
   author, license, and deploy target.

## Canonical Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Brochure — history, author, why it's fun, bugs |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | Universal rules, controls, tips, scoring, easter eggs |
| [`docs/architecture.md`](./docs/architecture.md) | Original C code analysis — AI, RNG, game loop |
| [`docs/lessons.md`](./docs/lessons.md) | Beginner-friendly lessons drawn from the original code |
| [`docs/port-ideas.md`](./docs/port-ideas.md) | Catalog of possible port directions per style |
| [`docs/spec.md`](./docs/spec.md) | **The contract** every port must honor — reverse-specification of mechanics |
| [`docs/notes.md`](./docs/notes.md) | Working notes |
| [`docs/manpage.md`](./docs/manpage.md) | Mirror + annotation of the original `robots.6` |
| [`docs/test-scenarios.md`](./docs/test-scenarios.md) | Universal scenarios every port must pass |
| [`docs/lineage.md`](./docs/lineage.md) | Genre siblings and modern descendants |
| [`docs/references.md`](./docs/references.md) | Sources & citations |
| [`docs/decisions/`](./docs/decisions/) | Game-level ADRs (rare — apply to all ports) |

*Not applicable to this game:* `walkthrough.md`, `world-map.md`
(procedurally-generated levels, no fixed map).

*Note:* `diff-log.md` moved to port level per ADR-006 revision —
see each port's `docs/diff-log.md`.

## Ports

| Port | Status | Style | Tech | Owner | Live URL |
|---|:---:|---|---|:---:|---|
| [`fancy-web`](./ports/fancy-web/) | 🟢 **Released 2026-09-17** | Isometric 3D "planet in space" — animated walking human, hover-bot enemies, luminous platform, zoom-adaptive halo. See [port README](./ports/fancy-web/README.md). | React 18 + `@react-three/fiber` + Three.js + Vite | Agun | *(pending deploy)* |
| [`fancy-web-remastered`](./ports/fancy-web-remastered/) | 🟢 **Released 2026-09-25** | `fancy-web` remastered — same game, new show: a stadium in deep space that is a bright star from afar; zoom in to floodlights, full stands and a crowd of ~2,000 that cheers every crash, does the wave, sets off fireworks when you clear a level and throws rubbish when you lose. Robots that watch you, a planted-feet walk, crashes in slow motion with chain counters, a teleport arc, a hyperspace jump to a new sky every level, synthesised sound and crowd. `fancy-web` itself is unchanged. See [port README](./ports/fancy-web-remastered/README.md). | React 18 + `@react-three/fiber` + Three.js + Vite (fancy-web's stack) + Web Audio | Agun (Claude) | *(pending deploy)* |
| `classic-web` | 🔴 Unclaimed | Faithful ASCII-in-browser, retro terminal palette | TypeScript + Vite + PWA (per ADR-005) | Reserved for delegation | — |

Contribute a new port by picking a style not yet claimed, following
the [porting guide](../../docs/porting-guide.md) port phase,
and instantiating from
[`docs/templates/port/`](../../docs/templates/port/). First-come
first-serve — see
[ADR-006](../../docs/decisions/006-multi-port-architecture.md) for
naming conventions.

## Media

See [`media/`](./media/) for screenshots of the **original**
BSDGames binary (shared across every port). Port-specific media
lives under each port's own `media/`.

## Attribution

Based on the original **`robots`** by Ken Arnold as shipped in
BSDGames. See [`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
