# Architecture — `trek/fancy-web`

How the port is structured, layer by layer. Companion to
[`spec.md`](../../docs/spec.md) (BSD-lineage mechanics contract) and
[`diff-log.md`](./diff-log.md) (deviation narrative).

---

## High-level shape

```
┌──────────────────────────────────────────────────────────────┐
│  index.html                                                  │
│  • DOM shell + CSS-only HUD panels                           │
│  • Two <canvas> layers (space backdrop + combat scene)       │
│  • Title screen, tutorial modal, reference + cheat panels    │
└──────────────────┬───────────────────────────────────────────┘
                   │  <script type="module" src="src/main.js">
                   ▼
┌──────────────────────────────────────────────────────────────┐
│  src/main.js — orchestration                                 │
│  • DOM refs, input handling, view-toggle keybind             │
│  • Asset loading (backdrops, ship sprites, blast SVGs)       │
│  • Render loop (bg, scene, HUD)                              │
│  • Effect FX (phaser, torpedo, klingon fire, explosion)      │
│  • localStorage persistence (help-seen, ref, cheat)          │
└──────────────────┬─────────────────────────┬─────────────────┘
                   │                         │
                   ▼                         ▼
┌───────────────────────────┐  ┌──────────────────────────────┐
│  src/engine.js            │  │  src/hints.js                │
│  • Game state factory     │  │  • Priority-sorted hint list │
│  • Command execution      │  │  • Bearing / warp helpers    │
│  • Phaser + torpedo math  │  │  • Search adjacent quadrants │
│  • Klingon return fire    │  │  • Explore-when-blind logic  │
│  • Win / loss detection   │  │                              │
└──────────┬────────────────┘  └──────────────────────────────┘
           │
           ▼
┌───────────────────────────┐
│  src/galaxy.js            │
│  • Galaxy factory + RNG   │
│  • Quadrant population    │
│  • Enemy roster + stats   │
└───────────────────────────┘
           ▲
           │
┌──────────┴────────────────┐
│  src/parser.js            │
│  • Command grammar        │
│  • Alias handling (p/t/m) │
│  • Inline help table      │
└───────────────────────────┘
```

**No framework, no build step, no dependencies.** Loaded straight from
`file://` or any static host.

---

## File responsibilities

### `src/galaxy.js`

- `GALAXY_SIZE`, `QUADRANT_SIZE`, `CELL`, `ENEMY`, `ENEMY_STATS`,
  `DIFFICULTY` constants — the shared vocabulary.
- `createGalaxy(rng, difficulty)` — seeds an 8×8 galaxy summary
  (klingon count / starbase count / star count per quadrant, plus the
  stardate budget). Never populates individual sectors — quadrants
  become fully materialised only when the player enters them (or an
  `lrscan` peeks at them).
- `populateQuadrant(galaxy, qx, qy, rng, enterprisePos?)` — builds the
  10×10 sector grid, distributing klingons, starbase, and stars into
  random empty cells. Klingon spawn draws a random enemy type from
  `SPAWN_WEIGHTS` — 65 % warship, 22 % battlecruiser, 10 % warbird,
  3 % super-commander — and pulls its energy pool + attack range from
  `ENEMY_STATS`.
- Deterministic Mulberry32 RNG so the same seed reproduces the same
  galaxy.

### `src/engine.js`

- `createGame(opts)` — the state factory. Reserves a klingon-free
  starting quadrant, sets initial ship (energy 10000, torpedoes 10,
  shields down, hull 100 %, all systems OK), and populates the start
  quadrant.
- `executeCommand(game, cmd)` — the single mutation entry point. All
  commands (`phaser`, `torpedo`, `move`, `srscan`, `lrscan`, `dock`,
  `shields*`, `damages`, `computer`, `quit`) route through here.
- Combat routines (`doPhaser`, `doTorpedo`) attach diagnostic info to
  the returned `effects` array so the renderer can draw beams,
  trajectories, and — crucially — explosions at destroyed cells
  even though the engine has already removed those ships from the
  sector map. See §Effect payload contract below.
- Klingons return fire at the end of every offensive command
  (`klingonReturnFire`) — attack range per-enemy type, distance
  attenuation, shields absorb before hull, subsystem damage roll.
- Win / loss detection is centralised — `endWin` / `endLoss` flip the
  right flags and push an event to the log.
- `snapshot(game)` — a shallow-cloned view over the ship, current
  quadrant, galaxy, and recent events. All renderers + hint computers
  read from snapshots so they never mutate live state.

### `src/parser.js`

- `parseCommand(text)` — regex-free, character-by-character verb
  dispatch. Accepts short aliases (`p`, `t`, `m`, `sr`, `lr`, `d`, `s`,
  `c`, `q`, `h`, `?`).
- `HELP_TOKENS` — inline command reference used by the `help`
  command (distinct from the full tutorial modal in `index.html`).
- `describeCommand(cmd)` — pretty prints a parsed command for hint
  display.

### `src/hints.js`

- `computeHints(snap)` — pure function producing a priority-sorted
  hint array (`urgent` → `normal` → `ok`).
- 12 hint types across three tiers:
  urgent — `SHIELDS`, `DOCK`, `MOVE-TO-BASE`, `RUN-TO-BASE`, `NO-BASE`,
  `FUEL-DOCK`, `FUEL`, `TIME`;
  normal — `PHASER`, `TORPEDO`, `REPAIR`, `SCAN`, `HUNT`, `EXPLORE`,
  `CONSERVE`;
  ok — `READY`.
- `bearingClock(dx, dy)` converts a `(dx, dy)` direction into a BSD
  trek clock-face bearing (0=E, 3=N, 6=W, 9=S). Used both for hint
  routing and for on-screen tooltips.
- `findNearestKlingonQuadrant` and `findNearestUnscannedQuadrant` fall
  back to each other so the cheat never says "READY" while
  klingons remain elsewhere in the galaxy.

### `src/main.js`

- Boots on `DOMContentLoaded`, fits canvases, buffers difficulty
  buttons, wires input handlers, installs the render loop.
- **Asset loading:** background image, one Enterprise sprite, four
  enemy sprites, two blast SVGs. Each has an `onload`/`onerror` gate
  and a programmatic fallback (or "sit dark until ready") so a slow
  network never blocks gameplay.
- **Render loop:** every animation frame paints (a) the space
  backdrop with subtle sine drift, (b) the combat scene (ships,
  shields, weapons, explosions), and (c) if visible, the strategic
  chart. HUD panels are DOM — they update on `renderHUD()` which is
  called after each executed command (turn-based; no per-frame HUD
  churn).
- **Effect FX:** four transient FX kinds — phaser beam, torpedo
  projectile, klingon return-fire flash, and multi-layer explosion.
  See §Effect payload contract and §Explosion animation.

---

## Effect payload contract

The engine mutates state instantly (turn-based, no in-flight state),
but the renderer needs to visibly play out the shot before showing
consequences. So `executeCommand` returns an `effects` array whose
entries carry all the info the renderer needs *after* the mutation
has already happened.

### Phaser

```js
{ type: 'phaser', energy: 500,
  damages: [
    { target: 'K02-1', sx: 3, sy: 3, damage: 240, destroyed: false, type: 'warship' },
    { target: 'K02-2', sx: 6, sy: 4, damage: 180, destroyed: true,  type: 'battlecruiser' },
  ] }
```

- `sx, sy` — where the beam should terminate (the target's last
  sector position).
- `destroyed` — was this target killed by the shot? renderer uses this
  to spawn an explosion FX.
- `type` — which enemy sprite the explosion FX should draw fading out.

### Torpedo

```js
{ type: 'torpedo', bearing: 3.5,
  trail: [{ x: ..., y: ... }, ...],
  hit: { sx: 5, sy: 4, cell: CELL.KLINGON } | null,
  miss: false,
  destroyedKlingon: { sx: 5, sy: 4, type: 'warship' } }  // present only on kill
```

- The `hit` object is enough to draw the trajectory; `destroyedKlingon`
  is attached only when the shot actually destroyed a target so the
  renderer can spawn an explosion at that exact cell.

### Klingon fire

```js
{ type: 'klingonFire', from: [sx, sy], damage: 60, hullDamage: 20 }
```

- The renderer draws a red beam from `from` to the Enterprise's
  current cell and flashes an impact.

---

## Explosion animation

Duration: 55 frames (~0.9 s at 60 fps). Renderer maintains an
`explosionFx` list; each entry has `{ sx, sy, type, t, duration }`.
For torpedoes `t` starts at −15 so the projectile visibly reaches the
target before the flash. Four visual layers, all drawn on the scene
canvas:

1. **Fading enemy silhouette** — the destroyed ship's original sprite
   in its native orientation, opacity 1 → 0 over frames 0–22, painted
   with a canvas `filter: brightness(1.4) contrast(1.2)` for a
   flash-on-hull look.
2. **Radial white/gold flash** — radial gradient peaking around frame
   10, expanding as `0.4 → 1.2 × targetWidth`.
3. **Blast SVG sprite** — one of `references/blast_01.svg` or
   `blast_02.svg`, chosen deterministically per cell. Scale 0.35 → 1.25
   over the tail, slight spin, fades from `alpha=1` (life<0.5) to `0`
   (life=1.0). Both SVGs have their black background rects set to
   `fill-opacity: 0` so they composite cleanly.
4. **Twelve orbiting debris sparks** — small warm-tinted dots
   spiralling outward from the impact.

Phaser beam lifetime bumped from 40 → 50 frames so the beam is still
visible when the explosion buildup starts. Otherwise the shot would
appear to already have faded when the enemy explodes.

---

## Coordinate systems

- **Quadrant coord (`qx`, `qy`)**: 0..7 each. `qy` grows southward
  (screen-down).
- **Sector coord (`sx`, `sy`)**: 0..9 each, inside a quadrant.
- **Bearing (clock face)**: 0=East, 3=North, 6=West, 9=South. Used by
  `move`, `torpedo`, `impulse`. Fractional bearings work
  (e.g. `1.5` = NE).
- **Radians (canvas rendering)**: 0=+X, +π/2=+Y (down). Sprite rotation
  in `drawKlingon` combines `atan2(dy, dx)` with a per-sprite
  `bowOffset` (`ENEMY_SPRITE_META`) so every ship's bow points at the
  Enterprise regardless of source-image orientation.

`bearingToVector` (engine) and `bearingClock` (hints) are inverses of
each other and share the same y-down convention. Regression tests in
`tests/hints.test.js` pin the cardinal directions to prevent the
kind of y-inversion bug that made the ship warp backwards
(see [`diff-log.md`](./diff-log.md) §Playability verification).

---

## Rendering layers (z-order, low → high)

```
z=1  #space-bg canvas       backdrop image + subtle drift
z=2  #scene canvas          ships, shields, weapons, explosions,
                            corner labels
z=3  #strategic overlay     8×8 galaxy chart (when active)
z=10 .hud panels            ship status / systems / sector / log
z=12 #cmd-panel             command console
z=15 #top-bezel             ship tag + view + help buttons
z=20 #ref-panel, #cheat-panel  floating side panels
z=100 #title-screen         intro + difficulty picker
z=200 #game-over            end-of-mission overlay
z=250 #help-overlay         full tutorial modal
```

---

## Persistence

`localStorage` keys:

| Key | Default | Purpose |
|---|---|---|
| `trek-fancyweb-help-seen` | absent | Auto-open tutorial on first visit only |
| `trek-fancyweb-ref-visible` | `'1'` | Compact command reference panel |
| `trek-fancyweb-cheat-visible` | `'0'` | Dynamic cheat panel (default off) |

Everything else — current game, difficulty, view mode — is
per-session and lost on refresh (matches the "trek is a shift" mental
model that BSD trek established).

---

## Testing

```
tests/
├── engine.test.js             # Galaxy, commands, win/loss (17 tests)
├── parser.test.js             # Verb + alias parsing (11 tests)
├── hints.test.js              # Priority ladder + bearing math (10 tests)
├── shortcut-conflict.test.js  # Guards V-key gate (4 tests)
└── autoplay.test.js           # Stress: novice/standard/expert (3 tests)
```

Run: `node --test tests/*.test.js`.

The **autoplay stress test** is the load-bearing playability guardrail
— it drives a full game turn-by-turn using only the top cheat hint,
so any regression in engine mechanics, hint quality, or command
routing shows up as a sharp win-rate drop. Current baseline:

- Novice: 90 % win rate (18/20)
- Standard: avg 11.9 kills / run (autoplay loses to stardate)
- Expert: avg 10.1 kills / run

`autoplay-trace.js` is a standalone diagnostic (not a test) —
`node tests/autoplay-trace.js <seed> <difficulty>` prints the turn
log so you can inspect why a specific seed loses.

---

## See also

- [`../README.md`](../README.md) — user-facing description
- [`../AGENTS.md`](../AGENTS.md) — agent guardrails
- [`diff-log.md`](./diff-log.md) — every deviation from BSD trek
- [`decisions/001-tech-stack.md`](./decisions/001-tech-stack.md) — why
  vanilla ES modules + Canvas 2D
- [`test-scenarios.md`](./test-scenarios.md) — manual verification
  checklist
- [`../../docs/spec.md`](../../docs/spec.md) — canonical mechanic
  contract (all ports must honour)
