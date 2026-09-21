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

Visual language: deep space nebulae + parallax stars + programmatic
ship sprites + cyan/amber/red palette. See
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
- **Ship sprites** — programmatic Canvas 2D drawings, not raster
  assets. Enterprise = federation cruiser silhouette
  (saucer + secondary hull + nacelles). Klingon = angular
  bird-of-prey (rebrand-friendly design).
- **Weapons FX:** phaser = cyan beam with glow, torpedo = orange
  particle-trail projectile. Shield hits = translucent bubble.
- **Nebulae** — 4 radial gradient blobs in background (rose, teal,
  gold, purple).
- **Parallax stars** — 3 depth layers, subtle rightward drift.

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
│   └── main.js         # DOM + canvas rendering + input orchestration
├── tests/
│   ├── engine.test.js
│   └── parser.test.js
├── docs/
│   ├── diff-log.md
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
