# AGENTS.md — `trek / fancy-web`

Port-specific instructions for AI agents on the `trek` fancy-web port.
Read the game-level [`../../AGENTS.md`](../../AGENTS.md) and root
[`../../../../AGENTS.md`](../../../../AGENTS.md) first.

## Port style

**fancy-web** per [ADR-006](../../../../docs/decisions/006-multi-port-architecture.md):
web-first, cinematic visual reimagining. Aesthetics may deviate from
BSD source; core mechanics must not.

## Identity anchor

**"Command Deep Space"** — turn-based space combat with cinematic
2D visuals. Sister port to
[`atc/ports/fancy-web`](../../../atc/ports/fancy-web/) — together
they form the *BSD typed-command simulator* pair (atc = radar
controller, trek = ship captain).

Visual language: painted deep-space nebula backdrops (seven images,
one per quadrant) + painted PNG ship sprites + painted SVG star +
capital-class Starfleet base sprite + cyan/amber/red palette. See
[`docs/decisions/001-tech-stack.md`](./docs/decisions/001-tech-stack.md).

## Engine mechanics — do not deviate

Faithful to BSD trek per [`../../docs/spec.md`](../../docs/spec.md):

- **Galaxy:** 8×8 quadrants, each 10×10 sectors.
- **Ship:** USS Enterprise. Energy pool (10000 initial). Torpedoes 10.
  Shields 1500 max. Hull 100%.
- **Systems:** warp, impulse, phasers, torpedoes, shields, sensors,
  computer, life support. Each can take damage.
- **Turn-based:** every command consumes stardate. Klingons respond
  when player is in their quadrant.
- **Combat:**
  - Phaser: fire N energy units, split across all klingons in
    quadrant; damage attenuates with distance.
  - Torpedo: consumes 50 energy + 1 torp. Trajectory at bearing
    0..12 (clock face convention).
- **Docking:** adjacent to starbase → full resupply (energy, torps,
  shields, hull, systems reset).
- **Win:** all klingons destroyed.
- **Loss:** stardate exhausted / hull destroyed / life support failed
  / energy exhausted.

Run `node --test tests/` after any engine change.

## Command grammar

Full grammar in `src/parser.js`. Verbs + short aliases:
- `phaser` / `p` — fire phasers
- `torpedo` / `t` — fire torpedo
- `move` / `m` — warp/impulse move
- `srscan` / `sr`, `lrscan` / `lr` — scans
- `damages` / `d` — damage report
- `dock` — dock at starbase
- `shields` / `s` — up/down/transfer
- `computer` / `c` — trajectory calc
- `help` / `?`, `quit` / `q`

## Visual guardrails

- **Palette:** cyan `#00d4ff`, amber `#ffb14f`, red `#ff3838`,
  gold `#ffd76a`, dark navy void. No pink/pastel.
- **Fonts:** Orbitron for headings/HUD labels, Share Tech Mono for
  body text.
- **Ship sprites** — painted PNG assets in `references/` (Enterprise +
  four Klingon variants). Each Klingon sprite has a per-type
  `bowOffset` in `ENEMY_SPRITE_META` so the ship rotates its bow at
  the Enterprise regardless of the source PNG's natural orientation.
  Programmatic vector fallbacks kept for offline / asset-fail paths.
- **Starbase sprite** — painted PNG `starfleet_base.png`, rendered
  6-cell wide (capital-class scale, visibly dwarfs Klingon warships).
- **Star sprite** — painted SVG `star_yellow.svg` (halo + cross rays
  + hot core). Programmatic radial-gradient fallback kept.
- **Weapons FX:** phaser = cyan beam with glow, torpedo = orange
  particle-trail projectile. Shield hits = translucent bubble sized
  to the sprite's true width (nacelle-to-nacelle for Enterprise,
  proportional to `widthMult` for Klingons).
- **Explosion FX on kills:** four visual layers (fading enemy
  silhouette + radial gold flash + one of two blast SVGs
  scaled + spinning + orbiting debris sparks). Deterministic per-cell
  choice of blast_01 vs blast_02.
- **Backdrops** — seven painted images `background_01..07`, all
  preloaded. `currentBgState()` picks one via `hash(qx, qy) mod 7`
  so warping changes the sky and revisiting a quadrant restores the
  same sky. Do not revert to programmatic nebulae or parallax
  starfields — the painted backdrops are load-bearing for scene
  coherence.

## What NOT to do

- Do not add real Star Trek IP references (specific ships beyond
  Enterprise, real character names, official Federation insignia).
  Port uses generic terminology only, matching BSD trek's originals.
- Do not switch to real-time (BSD trek is strictly turn-based).
- Do not remove the typed-command interface — it's core identity.
- Do not add RPG progression (character leveling, crew skills) — trek
  is a strategic sim, not an RPG.

## File map

```
trek/ports/fancy-web/
├── index.html          # shell + CSS + <script type="module">
├── src/
│   ├── galaxy.js       # 8×8 galaxy + quadrant + sector model
│   ├── engine.js       # game state, commands, tick, combat
│   ├── parser.js       # command grammar parser
│   ├── hints.js        # priority-sorted cheat hint computer
│   └── main.js         # DOM + canvas rendering + input orchestration
├── references/
│   ├── background_01..07.*         # painted quadrant backdrops
│   ├── uss_enterprise_top_01.png
│   ├── klingon_top_01.png          # warship
│   ├── klingon_battlecruiser_top_01.png
│   ├── klingon_super_top_01.png
│   ├── romulan_warbird_top_01.png
│   ├── starfleet_base.png
│   ├── star_yellow.svg             # painted star sprite
│   └── blast_01.svg, blast_02.svg  # explosion sprites
├── tests/
│   ├── engine.test.js              # 17 tests
│   ├── parser.test.js              # 11 tests
│   ├── hints.test.js               # 10 tests
│   ├── shortcut-conflict.test.js   # 4 tests
│   ├── autoplay.test.js            # 3 stress tests
│   └── autoplay-trace.js           # standalone diagnostic
├── docs/
│   ├── diff-log.md
│   ├── architecture.md
│   ├── test-scenarios.md
│   ├── notes.md
│   └── decisions/
│       ├── README.md
│       └── 001-tech-stack.md
├── AGENTS.md
├── CLAUDE.md
└── README.md
```

## See also

- [`README.md`](./README.md) — user-facing.
- [`docs/diff-log.md`](./docs/diff-log.md) — deviation narrative.
- Root [ADR-002 Porting Philosophy](../../../../docs/decisions/002-porting-philosophy.md).
- Sibling [`atc/ports/fancy-web/`](../../../atc/ports/fancy-web/) — visual + input paradigm cross-reference.
