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
**Port:** Canvas 2D cinematic space scene — parallax star field
(3 depth layers), painted nebula backdrops, programmatic ship
sprites (Enterprise as federation cruiser silhouette, Klingons as
angular birds-of-prey), phaser beam FX with glow + impact flash,
photon torpedo particle trails, shield bubble effects.

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
- Rich painted nebulae (rose, teal, gold, purple)
- Detailed ship sprites drawn programmatically (no raster assets)
- Weapons FX (phaser glow, torpedo particle trails, shield bubbles)
- Deep space parallax with subtle drift

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

---

## Deferred (v2+)

- **Klingon AI variety** — currently all klingons behave identically.
  BSD-style variants (aggressive, cloaked, cowardly) belong to a v2.
- **Photon trajectory computer** — help the player compute bearing
  to hit a specific sector (BSD `computer` command).
- **Bridge cutaway scenes** — illustrated bridge interior for major
  moments (game start, victory, defeat, major damage).
- **Web Audio ambience + SFX** — bridge hum, phaser hiss, torpedo
  woosh, hull impact, warp core, victory chime.
- **Damage animation on Enterprise sprite** — visible scars, sparks,
  hull rupture states based on hull %.
- **Long-range sensor scan animation** — sweep effect when scanning.
- **Auto-play stress tests** — verify game is winnable across many
  random seeds (following the atc port's pattern).
- **Deploy to live URL** — Cloudflare Pages / Vercel candidate.
- **Port-specific screenshots** for README.

---

## See also

- [`../README.md`](../README.md) — user-facing.
- [`../AGENTS.md`](../AGENTS.md) — agent guardrails.
- [`decisions/001-tech-stack.md`](./decisions/001-tech-stack.md).
- [`../../docs/spec.md`](../../docs/spec.md) — canonical mechanics.
- Sibling: [`atc/ports/fancy-web/`](../../../atc/ports/fancy-web/) — visual language + input paradigm reference.
