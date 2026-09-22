# Port Notes — `trek/fancy-web`

Freeform development notes: things I want the next session (or the
next contributor) to know that don't belong in a spec, an ADR, or
the diff-log.

---

## Asset naming convention

All art lives under `references/` and follows:

- **Ship sprites**: `<faction>_<class>_top_<seq>.<ext>` — e.g.
  `klingon_battlecruiser_top_01.png`. `top` = top-down orientation.
  `<seq>` allows multiple candidates so we can A/B without renaming.
- **Backdrops**: `background_<NN>.<ext>` — currently NN = 01..07.
- **Effects**: `blast_<NN>.svg` — vector so they scale cleanly.
- **Stations**: `<faction>_<type>.<ext>` — `starfleet_base.png`.

The loader in `main.js` hard-codes the exact filename it uses. Adding
a second option isn't automatic — deliberate choice, so we don't ship
a mystery sprite pick per-play. To swap in a variant, edit the `.src`
assignment.

## Adding a new backdrop

To move from "single backdrop" to "one backdrop per quadrant type",
the change lives in `main.js#drawSpaceImage`. Instead of always
drawing `bgImage`, take the current `game.ship.quadrant` and dispatch:

```js
function pickBackdropForQuadrant(q) {
  if (q.klingons > 0) return backgrounds.hostile;
  if (q.starbases > 0) return backgrounds.starbase;
  if (q.stars >= 5) return backgrounds.starfield;
  return backgrounds.deepspace;
}
```

Currently the file has seven backgrounds staged (`background_01`..
`background_07`). Only `background_01` is loaded. To activate:

1. Preload the additional images alongside `bgImage`.
2. Introduce the picker keyed on quadrant contents.
3. Fade-cross-fade transitions between backdrops when the ship warps
   (blend factor over ~15 frames).

Left as a v2 item because the current single backdrop reads well
enough and the added complexity doesn't have a matching payoff yet.

## Cheat panel default

Default OFF at game start (localStorage default `'0'`). Rationale:
new players should attempt the raw experience first — the cheat is
generous enough that leaving it on trivialises the discovery arc.
Opt-in via `▶ cheat` bezel button or the backtick key.

If the autoplay stress test starts failing after a design change,
first confirm the cheat hasn't drifted (many hint tests in
`hints.test.js`), then re-run `tests/autoplay-trace.js <seed>
<difficulty>` to see the turn-by-turn command flow.

## Y-axis inversion — the bug that keeps threatening to come back

BSD trek convention: bearing 3 = North (up on screen). Game
coordinate system: `qy` grows downward. `bearingToVector` in
`engine.js` returns `{ dy: -sin(rad) }` — negative dy for North. That
matches game coord: North (`bearing=3`) yields `dy=-1`, and we want
`qy` to decrease. So the movement formula is:

```js
newQy = qy + dy * distance;   // NOT qy - dy * distance
```

The impulse branch always used `+ dy`. The warp branch had a
subtraction — introduced by an out-of-context comment about "y
flipped (game convention)" that mis-remembered the direction of the
flip. Removing the minus fixed the most gameplay-critical bug in the
port.

`tests/hints.test.js#bearingClock` pins the four cardinals to keep
this from regressing.

## Explosion FX layering

All four explosion layers are drawn in the same `explosionFx.forEach`
pass because they share the sector-cell centre. Draw order matters:

1. Fading enemy silhouette (background — appears "underneath" the
   flash)
2. Radial white/gold flash
3. Blast SVG (foreground, spins)
4. Debris sparks (topmost)

The blast SVG index is chosen deterministically per cell — `((cx +
cy) / 50) % 2` — so re-entering a quadrant where a klingon just died
doesn't randomly change which blast is playing on a subsequent hit.

Explosion duration is 55 frames. Phaser beam duration is 50 frames
(bumped from 40). The explosion FX peaks a few frames after the beam
fades, which reads as "beam lands → target detonates".

## Torpedo delay

Torpedo `explosionFx` entries start with `t = -15` so the projectile
visibly travels most of the way to the target before the explosion
fires. Rendering ignores negative `t` entries. That number was tuned
by eye on a 60 fps loop; if the render loop is throttled (background
tab) the offset stays proportionally correct.

## Autoplay stress test flakiness

The autoplay test creates games with sequential seeds 1..N. Rare
seeds produce genuinely unwinnable-by-autoplay scenarios (single
Super-Commander adjacent to spawn, Enterprise starts with no
starbases in an easy warp). Current thresholds (`≥ 70 %` novice
win rate) have room for the occasional bad seed. If a change trips
below 70 %, expand the sample to 50 seeds before declaring
regression.

## Deferred v2 features by expected effort

| Feature | Effort | Blocks |
|---|---|---|
| Contextual backdrops per quadrant type | S | — |
| Klingon AI variety (aggressive / cloaked / runner) | M | Engine cheat re-tuning |
| Web Audio ambience + weapon SFX | M | User audio-consent gesture |
| Bridge cutaway scenes on major events | L | New illustration set |
| Damaged Enterprise sprite variants | L | Painted asset set |
| `computer` verb — trajectory calculator | S | Small UI panel |
| Deploy to live URL | S | Static host account |

None of these are load-bearing for the current release baseline.

## Testing tips

- **Fastest sanity check** — `node --test tests/*.test.js` (~ 250 ms).
- **Playability check** — same command; the autoplay stress test
  runs 45 seeds and reports.
- **Regression on one specific seed** — `node
  tests/autoplay-trace.js <seed> <difficulty>` prints the turn log.
  If the trace stops making forward progress, either the cheat has a
  bug or the engine has a bug that stalls the autoplay's fallback
  loop.

## Sibling ports

- [`atc/ports/fancy-web/`](../../../atc/ports/fancy-web/) — the visual
  language sibling. If you're adjusting HUD styling here, mirror it
  in atc so the "typed-command simulator" duo stays visually
  consistent.
- [`robots/ports/fancy-web/`](../../../robots/ports/fancy-web/) — the
  R3F sibling. If you're considering swapping trek to Three.js for
  cheaper 3D effects, that port shows the pattern.
