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
| wump | 🟢 | AntiGravity & Agun | S | **Released 2026-09-18** — canonical docs complete + `fancy-web` port at Released status (see Port Tracking). |

## Arcade & Action

| Game | Status | Owner | Complexity | Notes |
|---|:---:|:---:|:---:|---|
| hunt | 🟠 | AntiGravity & Agun | XL | Real-time multiplayer; internet redesign |
| robots | 🟢 | Agun | S | Released 2026-09-17 — canonical docs complete + `fancy-web` port at Released status (see Port Tracking). |
| snake | 🟢 | Agun | S | Released 2026-09-17 — canonical docs complete + `fancy-web` port at Released status (see Port Tracking). |
| tetris | 🟠 | Agun | S | Docs done; `fancy-web` port in progress — non-rectangular boards + Survival mode |
| worm | 🟠 | AntiGravity & Agun | S | Growing worm; Michael Toy (1980); digit food 1-9; SIGALRM |

## Simulation & Strategy

| Game | Status | Owner | Complexity | Notes |
|---|:---:|:---:|:---:|---|
| atc | 🟠 | Agun (Claude) | L | Docs done; `fancy-web` port 🟢 Released 2026-09-21 (see Port Tracking) |
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
| 🟠 In Progress | 37 (documentation phase; `dm` is docs-only with port skipped per ADR) |
| 🟢 Released | 6 (`robots`, `snake`, `worm`, `gomoku`, `wump`, `atc` — `fancy-web` shipped) |
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
| wump | fancy-web | 🟢 | Agun & AntiGravity | *(pending deploy)* | **Released 2026-09-18.** Standalone HTML5 Canvas 2D + Web Audio API + decoupled engine (`src/engine.js`). 11/11 automated unit tests pass via Node test runner; zero runtime dependencies; no build step. Faithful spec engine (Dodecahedron + Dave Taylor GCD procedural caves, hazard exclusivity, pit outcrop 2/12 survival, bat chaining, crooked arrow decays, deflections, and ricochets). Tolkien Moria / Doors of Durin visual theme: glowing Ithildin runes, organic progressive white wind reveal drafts with sequential pauses, slow detailed bats, glowing moss, and procedural Web Audio Moria drone and SFX. 5 live port screenshots captured and embedded in port README. |
| atc | fancy-web | 🟢 | Agun (Claude) | — | **Released 2026-09-21.** *Control Room 1986* identity — curved CRT phosphor radar (CSS scanlines + rotating radar sweep + range rings + 360° compass card + radar afterglow trails), typed BSD command grammar with live parse hints, ATC radio chatter (subtitles + optional Web Speech TTS voice) with realistic airline callsigns, procedural Web Audio ambient bed + interaction SFX, shift timer + next-tick countdown, 3 built-in sectors (Easy, Default, Killer) ported from Ed James's playfield DSL, METAR-style bezel, animated title screen. **Static help panel + dynamic per-plane cheat sheet** (context-aware hints with waypoint routing to approach line, two-phase collision avoidance, clamped-direction wall guard, time-to-climb hold, glidepath descent). Vanilla ES modules + Canvas 2D + zero deps + zero build step (~2500 LOC across 5 src/ files + index.html shell). **65/65 tests pass** (30 engine + 10 chatter + 14 hints + 5 autoplay + 5 stress + 1 regression). Autoplay stress tests: EASY avg 3.2 planes/shift (best 8-10), DEFAULT avg 2.6. Positioning: BSD typed-radar lineage, not Flight Control touch-drag. ✨ Complete pending: deploy URL + WebGL CRT shader + all 17 canonical sectors + daily-seed leaderboard + delayed commands (`@bN`) + port-specific screenshots. |
| adventure | fancy-web | 🟢 | Agun & AntiGravity | *(local server active)* | **Released 2026-09-19; updated 2026-09-20.** High-fidelity 2D Illustrated Point-and-Click Adventure port. Multi-layer HTML5 Canvas 2D + dynamic lighting + procedural Web Audio ambient subterranean soundscape + decoupled headless engine (`src/engine/`). 10/10 canonical tests pass via Node test runner. **Complete 24 high-res digital painting scenes integrated** across all 4 acts: Surface (End of Road, Building Interior, Valley, Slit, Grate), Upper Caverns (Below Grate, Cobble Crawl, Debris Room with Ithildin Elvish script, Sloping Canyon, Bird Chamber, Crystal Bridge, Nugget Room, Hall of the Mountain King with giant serpent, Y2 Cavern), full 6 subtle variants for *All Alike* maze + pirate's dead end treasure chest alcove, and deep endgame encounters (Plover Room emerald grotto, Dragon's Den with sleeping dragon on Persian rug, and The Repository dynamite vault). **Organic precision crop patch overlay architecture** (sub-pixel aligned, soft alpha-feathered patches for Room 3 table items, Room 8 unlocked steel grate opening, and Room 13 perched green songbird) ensuring continuous perspective and shadow integration without whole-background swapping. Full English UI client and visual gallery ([`gallery.html`](../bsdgames/adventure/ports/fancy-web/gallery.html)) with 15 canonical treasures, interactive hotspots, vector auto-mapper with fog-of-war, and dual text/GUI interaction. |
| tetris | fancy-web | 🟠 | Agun (Kimi) | — | Vanilla ES modules + Canvas 2D + zero deps. Functional prototype with 8 board presets (Normal, Tower, Canyon, Wide, Split, Hourglass, Donut, Staircase), configurable starting garbage stack, Marathon/Survival modes, next-piece preview, ghost piece, lock delay, touch controls, and headless smoke tests. Port baseline docs and ADRs in place. Pending: port-specific screenshots + live deploy. |

*(Other games' ports will appear here as they are claimed. No
port row = no port started yet; canonical docs at
`bsdgames/<game>/docs/` may still be in progress independently.)*
