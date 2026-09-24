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
| canfield | 🟢 | Agun (Kimi/Claude) | S | **Released 2026-09-21; finalized 2026-09-24.** Canonical docs checked against `canfield.c` (loss condition, empty-space rules, credit timing incl. base card, `Cflag` counting); `fancy-web` port at Released status (see Port Tracking) |
| cribbage | 🟠 | AntiGravity & Agun | M | Card game; curses pegboard; AI heuristics |
| fish | 🟠 | Agun (Kimi) | S | Docs done; ready to implement (ADR-005 accepted) |
| mille | 🟠 | AntiGravity & Agun | M | Mille Bornes 101-card race; curses multi-window; AI |

## Puzzle & Word Games

| Game | Status | Owner | Complexity | Notes |
|---|:---:|:---:|:---:|---|
| arithmetic | 🟠 | Agun (Kimi) | XS | Docs done; ready to implement (ADR-005 accepted) |
| boggle | 🟠 | AntiGravity & Agun | M | Dictionary + word-find algorithm |
| hangman | 🟢 | Agun (Claude) & Kimi | XS | **Released 2026-09-22** — canonical docs complete + `fancy-web` port at Released status (see Port Tracking). |
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
| trek | 🟠 | Agun (Claude) | L | Docs in progress; `fancy-web` port 🟢 Released 2026-09-22 (see Port Tracking) |
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
| worms | 🟢 | Agun & Claude | XS | **Released 2026-09-24** — canonical docs complete (replay semantics corrected against the original binary, port-style catalog) + `fancy-web` port at Released status (see Port Tracking). |

## Fun / Info

| Utility | Status | Owner | Complexity | Notes |
|---|:---:|:---:|:---:|---|
| fortune | 🟠 | AntiGravity & Agun | S | Random quotes DB; strfile/unstr O(1) indexer; ROT13 |
| countmail | 🟠 | Agun (Kimi) | XS | Docs done; ready to implement (ADR-005 accepted) |
| pom | 🟢 | Agun (Kimi) & Claude | XS | **Released 2026-09-24** — canonical docs complete (spec parsing table, port-style catalog, test scenarios re-verified on the real binary) + `fancy-web` port at Released status (see Port Tracking). |

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
| 🟠 In Progress | 34 (documentation phase; `dm` is docs-only with port skipped per ADR) |
| 🟢 Released | 10 (`robots`, `snake`, `worm`, `gomoku`, `wump`, `atc`, `trek`, `hangman`, `pom`, `worms` — `fancy-web` shipped) |
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
| trek | fancy-web | 🟢 | Agun (Claude) | — | **Released 2026-09-22, finalised 2026-09-22.** *Command Deep Space* identity — cinematic 2D space combat sim, sister port to `atc` in the BSD typed-command simulator collection. Canvas 2D rendering with seven painted deep-space nebulae — one per quadrant, picked via `hash(qx,qy) mod 7` so warping visibly changes the sky and revisiting a quadrant restores the same sky (subtle sine-drift camera float on top). Painted PNG sprites: Enterprise, four Klingon variants (Warship 65%, Battlecruiser 22%, Romulan Warbird 10%, Super-Commander 3%), and capital-class 6-cell Starfleet base — each Klingon rotates its bow to face the Enterprise via per-type bowOffset. Painted SVG star sprite (halo + cross rays + hot core) replaces the programmatic orb. Phaser beam FX with glow + impact flash. Photon torpedo particle trails. Translucent shield bubbles sized to sprite width (nacelle-to-nacelle coverage). Multi-layer explosion FX on kills (fading enemy silhouette + radial gold flash + one of two blast SVGs scaled + spinning + orbiting debris sparks) so target visibly explodes rather than disappearing. Two view modes: Tactical + Galaxy Chart (8×8 with fog-of-war). HUD panels (ship status bars, systems damage, sector contacts, bridge event log) with backdrop-blur glass panel look. Title screen with 3 difficulty presets (Novice 8/40sd, Standard 15/30sd, Expert 25/22sd). Comprehensive tutorial modal (auto-shows first visit) + compact command reference panel (`\`) + dynamic cheat panel (backtick, default OFF at game start) with 12 hint types across urgent/normal/ok tiers. Full BSD trek command grammar with short aliases; keyboard shortcut collision guards (V-key gated behind empty buffer). Faithful engine: 8×8 galaxy of 10×10 quadrants, Klingons distributed with adjacency-safe start, starbases for full resupply on dock, stardate budget as time pressure, 8 damageable subsystems. Vanilla ES modules + Canvas 2D + zero deps + zero build. **45/45 tests pass** (engine + parser + hints + shortcut-conflict + autoplay stress); autoplay verifies 90% novice win rate following cheat verbatim, proving winnability. Docs: README + AGENTS + CLAUDE + diff-log + architecture + test-scenarios + notes + decisions/001-tech-stack. Positioning: BSD 1980 Eric Allman origin of the FTL/Star Sector/Master of Orion genre lineage; generic Federation/Klingon terminology (not Star Trek IP). ✨ Complete pending: content-aware backdrop mood mapping (currently hash-based, v2 would key on quadrant contents), Klingon AI variants, bridge cutaway cinematics, Web Audio SFX, live URL deploy, port-specific screenshots. |
| atc | fancy-web | 🟢 | Agun (Claude) | — | **Released 2026-09-21.** *Control Room 1986* identity — curved CRT phosphor radar (CSS scanlines + rotating radar sweep + range rings + 360° compass card + radar afterglow trails), typed BSD command grammar with live parse hints, ATC radio chatter (subtitles + optional Web Speech TTS voice) with realistic airline callsigns, procedural Web Audio ambient bed + interaction SFX, shift timer + next-tick countdown, 3 built-in sectors (Easy, Default, Killer) ported from Ed James's playfield DSL, METAR-style bezel, animated title screen. **Static help panel + dynamic per-plane cheat sheet** (context-aware hints with waypoint routing to approach line, two-phase collision avoidance, clamped-direction wall guard, time-to-climb hold, glidepath descent). Vanilla ES modules + Canvas 2D + zero deps + zero build step (~2500 LOC across 5 src/ files + index.html shell). **65/65 tests pass** (30 engine + 10 chatter + 14 hints + 5 autoplay + 5 stress + 1 regression). Autoplay stress tests: EASY avg 3.2 planes/shift (best 8-10), DEFAULT avg 2.6. Positioning: BSD typed-radar lineage, not Flight Control touch-drag. ✨ Complete pending: deploy URL + WebGL CRT shader + all 17 canonical sectors + daily-seed leaderboard + delayed commands (`@bN`) + port-specific screenshots. |
| canfield | fancy-web | 🟢 | Agun (Kimi/Claude) | — | **Released 2026-09-22; finalized 2026-09-24.** React 18 + TypeScript + Vite; ~60 KB gzipped. **57/57 Vitest + 15/15 Playwright tests pass**; TypeScript strict. Rules and money follow `canfield.c` (verified against the source): empty-space rules (stock first, talon after the stock is gone, tableau piles never), base-rank-only auto-move (also at deal), talon auto-refill, hand recycled in the same order, fourth-fruitless-pass loss, the first move in Buy pays the `$13` Inspect, `$5` credit per foundation card from Commit on (base card included; a full win nets `+$208`), exact `Cflag` card counting (toggle, `$1` per newly visible hand/talon card, `$34` cap). Casino-table UI (CSS DOM cards, ADR-003) with click / double-click / drag moves, explained refusals, transient phase notices, bouncing-cards victory animation, visual Cheat Mode coach, betting-info box, command bar, Account Book (Reset Bankroll = new player), auto-save/resume, undo with `$5` penalty (purchases not undoable), optional Web Audio SFX, phone-width layout. 6 port screenshots. Five port ADRs (001 tech stack; 002 cheat mode; 003 CSS cards; 004 betting phase/credit model; 005 QoL deviations). URL seed support (`?seed=N`). ✨ Complete pending: deploy live URL + daily-seed leaderboard. |
| adventure | fancy-web | 🟢 | Agun & AntiGravity | *(local server active)* | **Released 2026-09-19; updated 2026-09-20.** High-fidelity 2D Illustrated Point-and-Click Adventure port. Multi-layer HTML5 Canvas 2D + dynamic lighting + procedural Web Audio ambient subterranean soundscape + decoupled headless engine (`src/engine/`). 10/10 canonical tests pass via Node test runner. **Complete 24 high-res digital painting scenes integrated** across all 4 acts: Surface (End of Road, Building Interior, Valley, Slit, Grate), Upper Caverns (Below Grate, Cobble Crawl, Debris Room with Ithildin Elvish script, Sloping Canyon, Bird Chamber, Crystal Bridge, Nugget Room, Hall of the Mountain King with giant serpent, Y2 Cavern), full 6 subtle variants for *All Alike* maze + pirate's dead end treasure chest alcove, and deep endgame encounters (Plover Room emerald grotto, Dragon's Den with sleeping dragon on Persian rug, and The Repository dynamite vault). **Organic precision crop patch overlay architecture** (sub-pixel aligned, soft alpha-feathered patches for Room 3 table items, Room 8 unlocked steel grate opening, and Room 13 perched green songbird) ensuring continuous perspective and shadow integration without whole-background swapping. Full English UI client and visual gallery ([`gallery.html`](../bsdgames/adventure/ports/fancy-web/gallery.html)) with 15 canonical treasures, interactive hotspots, vector auto-mapper with fog-of-war, and dual text/GUI interaction. |
| tetris | fancy-web | 🟠 | Agun (Kimi) | — | Vanilla ES modules + Canvas 2D + zero deps. Functional prototype with 8 board presets (Normal, Tower, Canyon, Wide, Split, Hourglass, Donut, Staircase), configurable starting garbage stack, Marathon/Survival modes, next-piece preview, ghost piece, lock delay, touch controls, and headless smoke tests. Port baseline docs and ADRs in place. Pending: port-specific screenshots + live deploy. |
| hangman | fancy-web | 🟢 | Agun (Claude) & Kimi | — | **Released 2026-09-22.** *Escape the Gallows* identity — reference-asset composition port with 5 themed levels (Pirate's Hold, Alchemist's Laboratory, Pharaoh's Tomb, Vampire's Crypt, Void Vessel), each with its own themed cipher dictionary (~40 words), boss with weakness-word teaser (Kimi-origin novel mechanic), and bespoke death visual. Single-file HTML + inline SVG + CSS animations + vanilla JS (~2900 LOC). Reference-asset composition workflow: 30+ curated PNGs/SVGs/WebP/JPEGs in `references/` embedded via `<img>`, `background-image`, or CSS `mask-image`; procedural generation for wood-grain seams, temple stone courses, torch flames, tesla sparks, sand rain, and cockpit shatter. Per-theme trap mechanics (rising water, full-screen gas fog with `Math.pow` opacity ramp, cinematic sand rain droplets, approaching-vampire silhouette, oxygen dashboard bar green→amber→red). Death scenes: 13 scattered floating pirate bodies (pirate), suffocated alchemist src swap with `:has()`-based positioning (lab), collapsed worker + mummy walk-in from left (temple), Dracula-kills-werewolf with thin moonlight halo (crypt), 100+ procedural cockpit glass crack paths at z-index below cockpit so opaque frame masks off-window cracks (void). Transparent lose overlay so death scenes stay visible; win state adds `win-mode` dim for boss reveal. Two port ADRs (001 tech stack; 002 Escape-the-Gallows narrative hook over Etymology Hangman). ✨ Complete pending: full boss round (weakness word currently only teaser), sound, port-specific screenshots, live URL deploy, classic-mode from `/usr/share/dict/words`. |
| pom | fancy-web | 🟢 | Agun (Claude) | — | **Released 2026-09-24.** *Selene — A Living Moon*, a showcase port with **zero raster assets** (port ADR-002, enforced by a test): every pixel comes from WebGL2/GLSL. Faithful engine port of `pom.c` (Duffett-Smith, 1990 epoch, same parser/tense/phase names), verified **byte-for-byte against 1,534 runs of the real `/usr/games/pom`**; also runs as a terminal `pom`. Ray-traced Moon: surface baked at load from 35 maria lobes + 24 named craters at IAU coordinates plus procedural crater octaves; lunar-Lambert photometry, cast shadows at the terminator, earthshine ∝ Earth's phase, halo radiating from the lit region; the terminator is driven by pom's elongation. Procedural sky (starfield with twinkle, Milky Way with Great Rift, airglow, moonlight wash-out) and nocturne landscape (ranges, mist, headland, rippled mirror lake with moon glade, pines). Scrubber + timelapse + date picker + pom compressed-date field; Moon calendar whose mini Moons use the same shader; upcoming principal phases; feature tooltips; drag-to-rock; high-contrast and reduced-motion modes. Vanilla ES modules + raw WebGL2, zero build (port ADR-001). **29/29 tests** (engine + events + renderer + zero-raster); passes canonical scenarios 1–7 literally. Never assumes a GPU: CPU-only WebGL gets an automatic lite profile (Moon in ~3 s, render-on-demand, zero idle cost), no WebGL gets a text mode where pom still answers; shaders compile in parallel so first-visit D3D11 compiles don't freeze the page. Porting found that canonical scenarios 2–4 used 8-digit args (`yymmddHH`, so the binary rejects them); they were corrected canonically against the real binary. 10 port screenshots in `media/` (incl. no-GPU and text modes). ✨ Complete pending: live URL deploy. |
| sail | fancy-web | 🟢 | Agun (Claude) | — | **Released 2026-09-24.** *Broadside — Wooden Walls*, cinematic procedural 3D with **zero raster assets** (port ADR-002, enforced by `npm run check:raster`). Engine ported function-by-function from the C (`file:line` cited), data tables extracted by script (32 scenarios, 84 ship specs, 8 hit/movement tables); pure, seeded, JSON-serialisable `resolveTurn` ready for a server; eight C bugs fixed and pinned by tests (port ADR-004). Gerstner-wave ocean driven by the engine's wind 0–7 (foam, spindrift, subsurface, glitter, wakes), mood skies with drifting clouds, wind-7 storm with rain and lightning; procedurally lofted and painted ships with gun rows from the data, 3 or 4 masts from `rig4` (port ADR-005), billowing/tearing sails, masts that topple at rig 0, fire through the gun ports, striking/capture flags, sinking and explosions; lit volumetric-looking powder smoke drifting downwind. Turns play as skippable cinematics (over-the-shoulder broadsides, rake shots down the target's length); tactical chart with exact range contours, arcs and ghost helm path; original helm grammar + point-and-click; parchment/brass UI, keyboard-only, Okabe-Ito nation colours, reduced-motion; procedural Web Audio. Single player vs. computer captains; all 22 historical scenarios of 32 staged with 8 moods incl. moonlit night, overcast and lake with a far shore (port ADR-003, amended 2026-09-24). **44/44 node tests** (canonical T-01..T-25 except T-23 engine-level only; AI-vs-AI stress of all 32 scenarios × 8 seeds) + Playwright UI smoke + UI flows (grapple/board/capture, repair, unfoul, defeat, quit, end-screen buttons). 60 fps RTX 4060 Laptop, 56/60 fps High/Low on Intel UHD. Legacy pre-ADR-006 `src/`, `tests/`, `docs/diff-log.md` at game level left untouched. ✨ Complete pending: multiplayer transport, the 10 fictional scenarios, live URL deploy. |
| rain | fancy-web | 🟢 | Agun (Claude) | — | **Released 2026-09-24.** *Rain on Still Water* — the 1980 screensaver as a night pond, **zero raster assets** (port ADR-002, `npm run check:raster`; sound synthesised too). Byte-faithful engine: glibc `random()` reimplemented, the `rain.c` loop on a persistent 80×24 screen, reproducing the three screens captured from the real binary; `-d` parsed like `strtoul`; `-d 0` paced as a 9600-baud line drains. Each ASCII age (`.` `o` `O` ring ring blank) is an impulse into a GPU wave-equation simulation on a conformal log-polar grid (ADR-003/004): rings interfere; crowns, jets, falling streaks tied to engine drops, 0.35 s visual latency shared by both views. Procedural sky (clouds, moon, stars), wooded far bank, lantern bokeh with glitter-column reflections, Fresnel, mist; bloom + filmic grade. Web Audio hiss + per-drop bubble plinks, muted by default. Classic ASCII view and split view (lock-step, verified in the browser). Raw WebGL2, vanilla ES modules, zero build. Degradation ladder High/Low/Lite/Classic (ADR-005): 60 fps on GPU, ≈25 fps CPU-only (SwiftShader), classic view without WebGL. **23/23 node tests + 35/35 Playwright checks.** Docs: README (measured no-GPU numbers) + AGENTS + CLAUDE + diff-log + architecture + test-scenarios + notes + 5 ADRs; 9 screenshots. ✨ Complete pending: listening test of the sound, live URL. |
| worms | fancy-web | 🟢 | Agun (Claude) | — | **Released 2026-09-24.** *Abyssal Worms*: `worms(6)` as a bioluminescent deep-sea screensaver, **zero raster and audio assets** (port ADR-002, enforced by a test). Faithful engine: the nine boundary tables, ring-buffer bodies, ref-counted cells and glibc `random()` (seed 1 = the unseeded original) reproduce screens captured from a binary built from `worms.c` **cell for cell** (7 configs × 4 captures); GNU getopt + `strtoul`/`atoi` with byte-identical errors (31 CLI cases). Smooth glide between grid steps that equals the grid state at step boundaries (ADR-003); eight species for `O * # $ % 0 @ ~` (translucent segmented bodies, Fresnel rim, gut pulse, photophores); worms light the sea floor (light map) and each other, flaring where ref ≥ 2; luminous fading `-t` trails; breathing plankton "WORM" `-f` field eaten letter by letter; marine snow, caustics, burrows; bloom + ACES. Settings with live `-n -l -d -f -t` and a command line, Classic and Split (same engine state), procedural drone/bubbles/crossing chimes (muted by default), idle-fading UI, fullscreen, reduced motion, Low/High with auto-downgrade. Raw WebGL2 + Canvas 2D + Web Audio, vanilla ES modules, zero build; no-GPU → auto Low, no WebGL → classic view. 60 fps at `-n 20 -l 64 -t -f` (RTX 4060). **33/33 tests.** 9 screenshots. Canonical `spec.md` replay semantics corrected (unseeded glibc = deterministic); port-style catalog added to `port-ideas.md`. ✨ Complete pending: listening test of the sound, live URL. |
| trek | procedural-web | 🟢 | Agun (Claude) | — | **Released 2026-09-24 (comparison port).** *Deep Space — Procedural*: head-to-head with `trek/fancy-web` — same engine (galaxy/parser/hints byte-identical, SHA-pinned; engine copied and extended only behind default-off Captain's Override flags, proved identical to a frozen fancy-web engine over 120 seeded games), but **zero raster and audio assets** (port ADR-002, enforced by a test). Vendored Three.js r186 + hand-written GLSL, vanilla ES modules, zero build (port ADR-001): per-quadrant volumetric nebula bake (64 stable skies, auto-exposed, procedural planets in half of them), original lofted ships (Vanguard, Talon, Hammer, Trident, Stingray) with runtime-canvas plating, windows and engines, a 5.6-cell ring starbase, shaded stars with corona/limb darkening/lens flare, phasers with heat shimmer, hex-ripple shields, multi-stage explosions, warp tunnel, holographic galaxy chart with click-to-warp; combat choreography follows the original C after two owner review rounds (phasers from six hull banks at once, one per Klingon, as `phaser.c`; torpedo/impulse/warp come about first); procedural Web Audio (muted by default). Dynamic cheat parity + Captain's Override (`override` / `!`: reveal map, infinite energy/torpedoes, invulnerable shields, freeze clock, one-shot kills, instant warp, resupply; OVERRIDE ACTIVE badge, CHEATED log + end screen). High/Low/Lite + 2D fallback (60 fps RTX 4060; CPU-only Lite ≈ 18 fps in combat; no-WebGL 2D). **77/77 node tests + 23/23 Playwright checks** (GPU, CPU, no-WebGL). `docs/comparison.md` with 7 painted/procedural pairs; 11 screenshots. Canonical scenarios: same coverage as fancy-web (11 pass, 5 differ, 9 need commands the shared engine lacks). ✨ Complete pending: live URL, galactic-core sky type. |

*(Other games' ports will appear here as they are claimed. No
port row = no port started yet; canonical docs at
`bsdgames/<game>/docs/` may still be in progress independently.)*
