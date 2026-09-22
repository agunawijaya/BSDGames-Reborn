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

## Backdrop-per-quadrant

Ships as of 2026-09-22: all seven backdrops (`background_01..07`) are
preloaded. `currentBgState()` picks one via
`hash(qx, qy) mod 7`, so every quadrant has its own sky and revisiting
a quadrant restores the same one. `drawSpaceImage` reads from the
picked state; if that pick isn't loaded yet it falls back to whichever
backdrop *is* loaded (typically 01, the first to arrive).

The picker is intentionally content-agnostic — it varies by quadrant
identity, not by whether the quadrant is hostile / safe / dense. That
was a deliberate first step: I couldn't pre-classify the seven images
without seeing them, and identity-based variety already fixes the
"my sky never changes" complaint.

For a v2 refinement — content-aware mapping — the change site is
`currentBgState()`. Introduce a mood table (`background_02` = hostile,
`background_03` = starbase, etc.) and pick based on
`game.galaxy.quadrants[qy][qx]` contents. Cross-fade over ~15 frames on
warp would sell the transition cinematically.

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
| Content-aware backdrop mapping (mood by quadrant contents) | S | Manual image classification |
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
