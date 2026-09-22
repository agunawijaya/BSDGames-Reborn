# diff-log — `trek / fancy-web`

Feature-by-feature narrative of what was **preserved**, **changed**,
**added**, or **deferred** vs BSD `trek(6)` (Eric Allman, 1980).

---

## Preserved (BSD-faithful)

### Galaxy structure
- 8×8 quadrant galaxy, each quadrant 10×10 sectors.
- Klingons, starbases, and stars distributed randomly.
- Starting quadrant guaranteed klingon-free.

### Ship model
- USS Enterprise, single ship under player control.
- Energy reserve (10 000 initial), photon torpedoes (10 initial),
  shields (max 1500), hull (100%).
- Eight subsystems can be damaged: warp, impulse, phasers, torpedoes,
  shields, sensors, computer, life support.

### Combat
- **Phasers**: fire N energy units, split across all Klingons in
  current quadrant, damage attenuated by distance.
- **Photon torpedoes**: 50 energy + 1 torp per shot; trajectory
  along bearing (0..12 clock face), destroys first thing it hits
  (klingon, star, or unfortunately-placed starbase).
- **Klingon return fire**: when player in same quadrant, all living
  klingons fire back; shields absorb, then hull; may damage
  subsystems.

### Time & win conditions
- Every command consumes stardate.
- Klingons expand while player delays.
- Win: destroy all klingons before stardate budget expires.
- Loss: stardate exhausted / hull destroyed / life support failed /
  energy reserves exhausted.

### Docking
- Adjacent to starbase → full resupply (energy, torps, shields,
  hull, all system damage repaired).

---

## Changed (deliberate deviations)

### Rendering
**BSD:** curses text mode, ASCII grid, letters for ship types.
**Port:** Canvas 2D cinematic space scene — painted nebula backdrop
image with subtle sine-drift "camera float", detailed painted PNG
sprites (Enterprise, four Klingon variants), phaser beam FX with
glow + impact flash, photon torpedo particle trails, translucent
shield bubbles sized to the sprite's true width, multi-layer
explosion FX (fading ship + radial flash + SVG blast + debris
sparks) that plays on kills.

The initial MVP used programmatic vector sprites + a parallax star
field; both were replaced with painted assets during iteration.
Programmatic sprites are still present as a fallback path if the
PNG assets fail to load.

Rationale: user pushback on coordinate-grid-only visuals — needed
richer "actual space" imagery to feel like a space game rather than
Battleship board game. See conversation log 2026-09-21.

### Command interface
**BSD:** terminal input with menu-style prompts.
**Port:** persistent command line at bottom (like `atc` port);
typed commands with live parse feedback in hint line above.

### View modes
**BSD:** srscan / lrscan text output.
**Port:** two persistent views:
- **Tactical** — full-screen combat scene showing current quadrant
- **Galaxy Chart** — 8×8 strategic map with fog-of-war overlay

Toggle via `V` key or top-right buttons.

### Difficulty presets
**BSD:** novice / expert modes with varying klingon counts.
**Port:** three preset tiers on title screen (Novice 8/40sd,
Standard 15/30sd, Expert 25/22sd). Similar shape to BSD.

### Docking safety
**BSD:** docked ships resupply but not repaired system damage.
**Port:** docking clears all subsystem damage (repair yard fantasy)
— simplifies UX for novice players. Documented deviation from
strict BSD behaviour.

---

## Added (not in BSD original)

### Cinematic space visuals
- Painted deep-space nebula backdrop (`references/background_01.jpg`)
  with a slow sine-based camera drift for life
- Detailed painted PNG sprites
  (`references/uss_enterprise_top_01.png`) + four Klingon variants
  (`klingon_top_01.png`, `klingon_battlecruiser_top_01.png`,
  `klingon_super_top_01.png`, `romulan_warbird_top_01.png`)
- Weapons FX (phaser glow, torpedo particle trails, shield bubbles
  sized to sprite width, klingon return-fire flash)
- Multi-layer explosion FX on kills (fading enemy silhouette,
  radial white/gold flash, blast SVG sprite scaled up + rotated,
  orbiting debris sparks)

### HUD panels
Four permanent HUD overlays with backdrop-blur:
- Ship status (shields/hull/energy/torpedo bars with color coding)
- Systems status (8 subsystems with OK/WEAK/DAMAGED states)
- Sector contacts (klingons, starbases, stars in current quadrant)
- Bridge log (rolling event feed, color-coded by tag)

### Title screen
Full-screen intro with difficulty picker + BEGIN MISSION button.
Ambient title glow pulse. Deferred audio start (browser gesture
requirement).

### Event log
Bridge log tracks last ~30 events with stardate + tag color coding:
kills, hits, damage, dock, moves, phaser/torpedo fires. Useful for
after-action review.

### Realistic callsigns / stardate
Stardate randomised 3200-3699 at start (classic Trek stardate
range). USS Enterprise NCC-1701 registry on ship + top bezel.
Federation-generic terminology throughout (no IP references).

### Painted starbase sprite
`references/starfleet_base.png` replaces the programmatic gold cross
that stood in for a Federation refuel station. The station renders
at ~2 cells wide with a warm gold drop-glow — visually reads as a
"safe haven" from a distance, complementing the hostile red glow
around Klingons.

Programmatic cross kept as a fallback path in case the PNG fails to
load.

### Full object roster (post-MVP)

| Object (`CELL`) | Meaning | Visual |
|---|---|---|
| ENTERPRISE | Your ship | Painted PNG (federation cruiser) |
| KLINGON × 4 | Warship / Battlecruiser / Super / Warbird | Painted PNGs per type |
| STARBASE | Federation refuel + repair station | Painted PNG (`starfleet_base.png`) |
| STAR | Navigation obstacle (blocks torpedoes) | Radial gradient orb |
| EMPTY | Vacuum | — |

Non-cell visual layers (weapons + effects): phaser beams, torpedo
projectiles, shield bubbles, klingon return-fire beams, explosion
FX (4-layer: fading ship + flash + blast SVG + debris).

### Enemy roster (four types, not one)
BSD trek treated all Klingons identically. This port distinguishes
four ship classes with distinct sprites, spawn weights, energy pools,
and attack ranges:

| Type | Spawn % | Energy | Attack |
|---|---|---|---|
| Klingon Warship (basic) | 65 % | 200–400 | 25–65 dmg |
| Klingon Battlecruiser | 22 % | 450–700 | 40–90 dmg |
| Romulan Warbird | 10 % | 350–550 | 35–80 dmg |
| Klingon Super-Commander | 3 % | 900–1200 | 70–130 dmg |

Each enemy sprite is rotated so its bow points at the Enterprise,
regardless of the source PNG's native orientation (per-type
`bowOffset` in the render meta table). This makes fights feel
engaged even though the engine underneath is turn-based and
stationary.

### Tutorial modal (comprehensive)
Full-screen intro modal covering: mission overview, screen glyphs,
enemy roster table, HUD panel walkthrough, complete command list,
bearing clock diagram, view modes, win/loss conditions, walk-through
"your first kill", beginner tips. Auto-opens on first visit
(localStorage flag), otherwise available via <kbd>?</kbd> key or
`? help` bezel button.

### Reference panel (compact)
Floating left-side panel with the entire command grammar in
scan-able form — weapons / movement / bearing clock / scans /
defense / special keys. Toggle with <kbd>\\</kbd> or `≡ ref`
bezel button. Default: shown (novices need it more than experts).
Persistent via localStorage.

### Dynamic cheat panel
Floating right-side panel showing priority-sorted hints derived from
the current game state — "SHIELDS · shields up" (urgent), "PHASER ·
phaser 800" (auto-computed for the local hostile mix), "HUNT · move
1.5 3" (routed to nearest known klingon quadrant), etc. Twelve
distinct hint types across three tiers (urgent / normal / ok).
Toggle with backtick or `▶ cheat` bezel button. Default OFF at game
start — opt-in so new players first attempt the raw experience.
Fully unit-tested (`tests/hints.test.js`).

### Keyboard shortcut collision guards
Global shortcuts (<kbd>?</kbd>, <kbd>\\</kbd>, backtick, <kbd>V</kbd>)
were chosen to not collide with any command word. The one exception
(<kbd>V</kbd> in "move") is gated behind an empty-buffer check.
`tests/shortcut-conflict.test.js` cross-checks the shortcut set
against the parser's command table so a future new command that
uses `?`, `\\`, or backtick would fail the build.

### Autoplay stress harness
`tests/autoplay.test.js` drives a full game turn-by-turn, blindly
following the top cheat hint each turn. Reports win rate, kill
counts, and loss reason breakdowns per difficulty. Current baseline:

- **Novice** — 90 % win rate (18 / 20 seeds), avg 7.9 kills/run
- **Standard** — 0 % win rate, avg 11.9 kills/run (nearly clears)
- **Expert** — 0 % win rate, avg 10.1 kills/run

Standard / Expert are meant to be human-only difficulty tiers;
autoplay reaching 12 / 10 avg kills is the honest measure of a
"cheat can carry a novice but requires strategy at higher tiers"
design.

`tests/autoplay-trace.js` is a diagnostic runner —
`node tests/autoplay-trace.js <seed> <difficulty>` prints the full
turn log with hint tags. Useful when diagnosing a specific
regression.

### Playability verification
Autoplay uncovered three real bugs that had to be fixed before the
game was demonstrably winnable:

1. **Engine warp Y-inversion** — `doMove` used `qy - dy` for warp
   jumps (impulse branch used `qy + dy`). Bearing 3 (North) sent the
   ship South. Fixed to `qy + dy`.
2. **Cheat PHASER threshold** — the hint only fired when recommended
   energy ≥ 100. A klingon at low energy could push the recommendation
   below 100, silencing the hint mid-fight. Fixed with a floor of 100.
3. **No EXPLORE hint** — `findNearestKlingonQuadrant` only searched
   scanned quadrants; once local known klingons were cleared, the
   cheat had nothing to say. Added `findNearestUnscannedQuadrant`
   + an `EXPLORE` hint that suggests warping to unmapped territory.

Detailed narratives in the individual commit messages of 2026-09-22.

---

## Deferred (v2+)

- **Klingon AI variety** — the four ship types differ only in stats
  right now. BSD-style tactical variants (aggressive attackers,
  cloaked ambushers, cowardly runners) belong to a v2.
- **Photon trajectory computer** — help the player compute bearing
  to hit a specific sector (BSD `computer` command). Currently the
  `computer` verb is accepted but produces no output.
- **Bridge cutaway scenes** — illustrated bridge interior for major
  moments (game start, victory, defeat, major damage).
- **Web Audio ambience + SFX** — bridge hum, phaser hiss, torpedo
  woosh, hull impact, warp core, victory chime.
- **Damage animation on Enterprise sprite** — visible scars, sparks,
  hull rupture states based on hull %.
- **Long-range sensor scan animation** — sweep effect when scanning.
- **Contextual backdrops** — different `background_XX.jpg` per
  quadrant type (hostile / safe / starbase / dense stars) so the
  visual reflects the sector's state. Seven candidate backdrop images
  are already in `references/`; a `pickBackgroundForQuadrant`
  function would map them contextually.
- **Deploy to live URL** — Cloudflare Pages / Vercel candidate.
- **Port-specific screenshots** for README.

---

## See also

- [`../README.md`](../README.md) — user-facing.
- [`../AGENTS.md`](../AGENTS.md) — agent guardrails.
- [`decisions/001-tech-stack.md`](./decisions/001-tech-stack.md).
- [`../../docs/spec.md`](../../docs/spec.md) — canonical mechanics.
- Sibling: [`atc/ports/fancy-web/`](../../../atc/ports/fancy-web/) — visual language + input paradigm reference.
