# Progress Dashboard

Status of all 43 programs. Update this when you claim, start,
progress, or release a game.

**Status legend:**

- 🔴 **Unclaimed** — no one working on it yet.
- 🟡 **Claimed** — someone has claimed but not started work.
- 🟠 **In Progress** — actively being worked on.
- 🟢 **Released** — meets baseline: `README + about + how-to-play +
  manpage + working src + tests`.
- ✨ **Complete** — all 14 docs + full test coverage + polished.

**Complexity (rough):**

- **XS** — < 1 day
- **S** — 1–3 days
- **M** — 3–7 days
- **L** — 1–3 weeks
- **XL** — 3–6 weeks

---

## Adventure & RPG

| Game | Status | Owner | Complexity | Notes |
|---|:---:|:---:|:---:|---|
| adventure | 🟠 | AntiGravity & Agun | L | Fixed map — walkthrough + world-map required |
| battlestar | 🟠 | AntiGravity & Agun | L | Fixed map — walkthrough + world-map required |
| hack | 🟠 | AntiGravity & Agun | XL | Roguelike; procedural map; ancestor of NetHack |
| phantasia | 🟠 | Agun (Claude) | XL | Docs done (screenshots pending). Multi-user persistent — networking design required |

## Board Games

| Game | Status | Owner | Complexity | Notes |
|---|:---:|:---:|:---:|---|
| backgammon | 🟠 | AntiGravity & Agun | M | 30 checkers; doubling cube; teachgammon; odds engine |
| dab | 🟠 | Agun (Kimi) | S | Docs done; ready to implement (ADR-005 accepted) |
| gomoku | 🟢 | Agun | M | Released 2026-09-17 — canonical docs complete + `fancy-web` port at Released status (see Port Tracking). |
| monop | 🟠 | Agun (Claude) | M | Docs done; ready to implement (ADR-005 accepted). Hot-seat 2–9 players (trademark rename required) |
| sail | 🟠 | Agun (Claude) | L | Docs done; ready to implement (ADR-005 accepted). Multi-process fork(); consider network multiplayer redesign |

## Card Games

| Game | Status | Owner | Complexity | Notes |
|---|:---:|:---:|:---:|---|
| canfield | 🟠 | Agun (Claude) | S | Docs done; ready to implement (ADR-005 accepted). Curses solitaire with `cfscores` sidecar |
| cribbage | 🟠 | AntiGravity & Agun | M | Card game; curses pegboard; AI heuristics |
| fish | 🟠 | Agun (Kimi) | S | Docs done; ready to implement (ADR-005 accepted) |
| mille | 🟠 | AntiGravity & Agun | M | Mille Bornes 101-card race; curses multi-window; AI |

## Puzzle & Word Games

| Game | Status | Owner | Complexity | Notes |
|---|:---:|:---:|:---:|---|
| arithmetic | 🟠 | Agun (Kimi) | XS | Docs done; ready to implement (ADR-005 accepted) |
| boggle | 🟠 | AntiGravity & Agun | M | Dictionary + word-find algorithm |
| hangman | 🟠 | Kimi | XS | Docs done; ready to implement (ADR-005 accepted) |
| quiz | 🟠 | Agun (Kimi) | S | Docs done; ready to implement (ADR-005 accepted) |
| wump | 🟠 | AntiGravity & Agun | S | Hunt the Wumpus — procedural cave |

## Arcade & Action

| Game | Status | Owner | Complexity | Notes |
|---|:---:|:---:|:---:|---|
| hunt | 🟠 | AntiGravity & Agun | XL | Real-time multiplayer; internet redesign |
| robots | 🟢 | Agun | S | Released 2026-09-17 — canonical docs complete + `fancy-web` port at Released status (see Port Tracking). |
| snake | 🟢 | Agun | S | Released 2026-09-17 — canonical docs complete + `fancy-web` port at Released status (see Port Tracking). |
| tetris | 🟠 | Agun | S | Docs done; ready to implement (ADR-005 accepted) |
| worm | 🟠 | AntiGravity & Agun | S | Growing worm; Michael Toy (1980); digit food 1-9; SIGALRM |

## Simulation & Strategy

| Game | Status | Owner | Complexity | Notes |
|---|:---:|:---:|:---:|---|
| atc | 🟠 | Agun (Claude) | L | Docs in progress. Real-time simulation; multiple concurrent entities |
| trek | 🟠 | Agun (Claude) | L | Docs in progress. Star Trek simulation; complex state |
| wargames | 🟠 | Agun (Kimi) | XS | Docs done; ready to implement (ADR-005 accepted) |

## Cryptography / Text-Transform

| Utility | Status | Owner | Complexity | Notes |
|---|:---:|:---:|:---:|---|
| caesar | 🟠 | Agun | XS | Docs done; ready to implement (ADR-005 accepted) |
| morse | 🟠 | Agun | XS | Docs done; ready to implement (ADR-005 accepted) |
| pig | 🟠 | Agun | XS | Docs done; ready to implement (ADR-005 accepted) |
| wtf | 🟠 | Agun (Kimi) | XS | Docs done; ready to implement (ADR-005 accepted) |

## Math / Number

| Utility | Status | Owner | Complexity | Notes |
|---|:---:|:---:|:---:|---|
| factor | 🟠 | Agun | XS | Docs done; ready to implement (ADR-005 accepted) |
| number | 🟠 | Agun | XS | Docs done; ready to implement (ADR-005 accepted) |
| primes | 🟠 | Agun | XS | Docs done; ready to implement (ADR-005 accepted) |
| random | 🟠 | Agun | XS | Docs done; ready to implement (ADR-005 accepted) |

## Display Toys

| Toy | Status | Owner | Complexity | Notes |
|---|:---:|:---:|:---:|---|
| banner | 🟠 | Agun | XS | Docs done; ready to implement (ADR-005 accepted) |
| bcd | 🟠 | Agun | XS | Docs done; ready to implement (ADR-005 accepted) |
| ppt | 🟠 | Agun | XS | Docs done; ready to implement (ADR-005 accepted) |
| rain | 🟠 | Agun | XS | Docs done; ready to implement (ADR-005 accepted) |
| worms | 🟠 | Agun | XS | Docs done; ready to implement (ADR-005 accepted) |

## Fun / Info

| Utility | Status | Owner | Complexity | Notes |
|---|:---:|:---:|:---:|---|
| fortune | 🟠 | AntiGravity & Agun | S | Random quotes DB; strfile/unstr O(1) indexer; ROT13 |
| countmail | 🟠 | Agun (Kimi) | XS | Docs done; ready to implement (ADR-005 accepted) |
| pom | 🟠 | Agun (Kimi) | XS | Docs done; ready to implement (ADR-005 accepted) |

## Administration

| Program | Status | Owner | Complexity | Notes |
|---|:---:|:---:|:---:|---|
| dm | 🟠 | Agun (Claude) | S | Docs-only; port **skipped** by ADR `dm-001` (obsolete use case). Deep historical docs preserve the ideas |

---

## Summary

| Status | Count |
|---|---:|
| 🔴 Unclaimed | 0 |
| 🟡 Claimed | 0 |
| 🟠 In Progress | 40 (documentation phase; `dm` is docs-only with port skipped per ADR) |
| 🟢 Released | 3 (`robots`, `snake`, `gomoku` — `fancy-web` shipped 2026-09-17) |
| ✨ Complete | 0 |
| **Total** | **43** |

---

## Port Tracking (per [ADR-006](./decisions/006-multi-port-architecture.md))

Ports use first-come-first-serve ownership. Claim a port here
before starting implementation work. See
[ADR-006 §Port Naming Conventions](./decisions/006-multi-port-architecture.md)
for the naming rules and reserved slugs.

**Legend:**

- 🔴 **Unclaimed** — no one working on this port yet.
- 🟡 **Claimed** — a contributor has reserved the slot but hasn't started.
- 🟠 **In Progress** — active implementation.
- 🟢 **Released** — meets the port baseline (README + AGENTS + CLAUDE + diff-log + working src + tests + port-specific media + passes canonical `test-scenarios.md`).
- ✨ **Complete** — polished, live URL published, all optional docs filled.

| Game | Port | Status | Owner | Live URL | Notes |
|---|---|:---:|:---:|---|---|
| robots | fancy-web | 🟢 | Agun | *(pending deploy)* | **Released 2026-09-17.** React 18 + `@react-three/fiber` + Three.js (isometric 3D orthographic) + Vite. 33/33 engine tests pass; TypeScript strict; production bundle 289 KB gzipped. Full spec engine, animated human player with walk cycle, hover-bot enemies, luminous platform with zoom-adaptive planet halo, safe-wait turn-by-turn, follow-player camera at high zoom, localStorage top-10 leaderboard. 4 port-specific screenshots captured via Playwright + embedded in port README. Two port ADRs (001 tech stack, 002 safe-wait deviation). ✨ Complete pending: deploy live URL + sound (needs port ADR). |
| robots | classic-web | 🔴 | — | — | Reserved for delegation to another agent (Codex / Deepseek). TypeScript + Vite + PWA per ADR-005 reference stack. |
| snake | fancy-web | 🟢 | Agun (Claude) | — | Released 2026-09-17. Single-file Canvas 2D + vanilla JS (~1900 LOC). 8 cosmetic themes, eagle/owl state-machine chaser, apple collection, edge escape, localStorage best-score. Vite + TS + PWA deferred to v2 per port ADR `fancy-web-003`. |
| worm | fancy-web | 🟢 | Agun (Claude) | — | Released 2026-09-17. Growing worm (BSD spec faithful: progressive growth, chained score bonus, walls lethal). Numbered apples 1-9 with size+color+digit encoding. 8 themes reused from snake port. Settings row: Classic/Fast/Progressive tick rate. Single-file HTML ~1500 LOC. |
| gomoku | fancy-web | 🟢 | Agun | *(pending deploy)* | **Released 2026-09-17; palette shift + port docs finalised 2026-09-18.** React 18 + TypeScript + native SVG + Vite. 47/47 tests pass (11 coords + 22 engine + 14 AI); TypeScript strict; production bundle **49.66 KB gzipped** (no WebGL, no GPU required — playable on any modern browser incl. low-end mobile). Full 19×19 board, spec-compliant free-gomoku rules, heuristic AI (pattern scoring: five/open-four/closed-four/open-three) + hot-seat 2-player mode. Undo, resign, new game, swap sides, move history, SVG win-line pulse animation. Traditional Japanese board aesthetic — kaya honey wood, black grid ink, matte-slate + clamshell stones, vermillion cinnabar last-move mark (rationale in port diff-log). One port ADR (001 tech stack); port `docs/test-scenarios.md` (20 scenarios) and `docs/notes.md` in place. ✨ Complete pending: deploy live URL. |

*(Other games' ports will appear here as they are claimed. No
port row = no port started yet; canonical docs at
`bsdgames/<game>/docs/` may still be in progress independently.)*
