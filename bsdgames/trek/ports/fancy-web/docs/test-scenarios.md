# Test Scenarios — `trek/fancy-web`

Manual verification checklist. Automated coverage is in
[`../tests/`](../tests/) (45 tests as of 2026-09-22). This document
covers 17 walk-throughs you should run before releasing a change.

Every scenario has an **expected result** — if the actual behaviour
diverges, that's a bug or a documentation gap.

---

## S1 — Fresh page load

**Steps**

1. Delete `localStorage` (DevTools → Application → Local Storage → clear).
2. Open `index.html` in a modern browser.

**Expected**

- Space backdrop renders immediately (no white/blank flash).
- Title screen shows over the backdrop with three difficulty buttons.
- `NOVICE` / `STANDARD` / `EXPERT` show the klingon count + stardate
  budget as their descriptions.
- Cheat panel is **not** visible by default (opt-in for novices).
- Reference panel **is** visible by default.
- Pressing <kbd>Enter</kbd> or <kbd>Space</kbd> starts a mission.
- Clicking `▶ BEGIN MISSION` also starts.

---

## S2 — First-visit tutorial auto-opens

**Steps**

1. Continue from S1 (localStorage still fresh).
2. Start a novice mission.

**Expected**

- ~400 ms after mission start, the tutorial modal opens on top of the
  scene.
- Modal covers ≥ 800 px tall content, scrollable if viewport is
  small.
- Sections include: The Mission, The Screen (glyph table), Enemy
  Roster (4 rows), The HUD (four panels), Commands (12+ rows),
  Bearing (3×3 clock chart), Views, Winning, Losing, Walk-through,
  Tips.
- Closing with <kbd>Esc</kbd> or <kbd>?</kbd> or clicking `✕ close`
  hides the modal and writes `trek-fancyweb-help-seen: 1`.
- Refreshing the page does **not** re-open the modal (localStorage
  suppresses it).

---

## S3 — Keyboard shortcuts do not collide with commands

**Steps** (in-game, buffer empty unless noted)

1. Type `m`, `o`, `v`, `e` (space) `3`, `2`, <kbd>Enter</kbd>.
2. Type `phaser`, space, `500`, <kbd>Enter</kbd> (only if hostiles).
3. Press <kbd>?</kbd>, then <kbd>Esc</kbd>.
4. Press <kbd>\</kbd> twice.
5. Press <kbd>`</kbd> twice.
6. Press <kbd>V</kbd> (buffer empty), then start typing `move`, press
   <kbd>V</kbd> mid-typing.

**Expected**

- `move 3 2` executes — the `v` in "move" is **not** consumed by the
  V-shortcut (buffer non-empty gate).
- `phaser 500` executes.
- <kbd>?</kbd> opens tutorial modal; <kbd>Esc</kbd> closes it.
- <kbd>\</kbd> toggles the reference panel visibility.
- <kbd>`</kbd> (backtick) toggles the cheat panel visibility.
- <kbd>V</kbd> (empty buffer) switches Tactical ↔ Galaxy Chart.
- <kbd>V</kbd> (mid-command) is appended as a normal letter to the
  buffer, view unchanged.

Regression: `tests/shortcut-conflict.test.js` guards against the
introduction of a new shortcut that collides with a command word.

---

## S4 — Enterprise sprite + shield bubble

**Steps**

1. Start a mission. Note Enterprise position on radar.
2. Type `shields up`.

**Expected**

- Enterprise renders as the `uss_enterprise_top_01.png` sprite,
  saucer facing +X (right).
- Bow appears cleanly on the sector cell centre with a subtle cyan
  drop glow behind.
- Shield bubble is roughly **the width of the sprite** (nacelle to
  nacelle) — you should see the bubble edge outside both warp
  nacelles, not just around the saucer.
- Toggling `shields down` removes the bubble immediately.

---

## S5 — Enemy sprites face the Enterprise

**Steps**

1. Warp into a quadrant containing Klingons (or use a seed where the
   start quadrant is manually populated).
2. Move the Enterprise around within the quadrant using
   `impulse 3` / `impulse 0` / `impulse 6` / `impulse 9`.

**Expected**

- Each Klingon ship's **bow** points at the Enterprise regardless of
  the Enterprise's current sector position.
- Warship, Battlecruiser, and Warbird bows all track correctly
  (their source images have different natural orientations —
  handled by per-type `bowOffset` in `ENEMY_SPRITE_META`).
- The Super-Commander (rare) also tracks.
- Each enemy renders larger than the Warship in proportion to its
  `widthMult` (Warship 2.0 < Battlecruiser 2.5 < Warbird 2.6 <
  Super 2.8).

---

## S6 — Fire a phaser at a hostile

**Steps**

1. Enter a Klingon quadrant. `shields up`.
2. `phaser 500`.

**Expected**

- **Cyan beam** draws from the Enterprise to the Klingon(s).
- Beam has a soft outer glow, a bright core, and an impact flash at
  the terminal end.
- Beam persists ~50 frames (visible for close to a full second).
- Klingon return fire draws a red counter-beam back to the
  Enterprise. Hull decreases if shields absorb everything, otherwise
  shields drop.

---

## S7 — Explosion on a kill

**Steps**

1. Wound a Klingon down to low energy (multiple `phaser 100` shots).
2. Fire the killing shot (`phaser 200` or a `torpedo <bearing>`).

**Expected**

- The moment the kill lands, the Klingon sprite is drawn **fading
  out with a brightness-boost** (not instantly disappearing).
- A radial white/gold flash expands around the target.
- One of `blast_01.svg` or `blast_02.svg` scales up and spins slightly.
- 12 debris sparks radiate outward and fade.
- Total explosion visible for ~1 s.
- After the animation the sector cell is empty.
- Bridge Log shows a red "destroyed" entry naming the Klingon type
  (e.g. "Klingon Battlecruiser K02-1 destroyed").

Regression: this scenario was introduced to fix "enemy disappears
before the beam arrives" — the enemy must remain visually present
until the explosion overtakes its position.

---

## S8 — Warp jumps in the intended direction

**Steps**

1. Start a fresh mission. Note current quadrant, e.g. `4-4`.
2. `move 3 2` — course 3 = North, warp 2.

**Expected**

- Ship moves **up** on the Galaxy Chart (to `4-2`).
- Fresh quadrant populates. Long-range scan of adjacent quadrants
  runs automatically.
- Stardate advances by ~2.
- Energy decreases by `warp² × 10` = 40.

Repeat for `move 9 2` (South), `move 0 3` (East), `move 6 3` (West).
Each should move in the corresponding direction. This test guards
against the y-inversion regression documented in
[`diff-log.md`](./diff-log.md).

---

## S8b — Backdrop changes on warp

**Steps**

1. Note the space backdrop (nebula colours, star density) in the
   starting quadrant.
2. `move 3 2` (warp jump).
3. Compare backdrop after arrival.
4. `move 9 2` back to the starting quadrant.

**Expected**

- After step 2, the backdrop image is **visibly different** — colours,
  cloud shapes, or star density differ from the starting quadrant.
- After step 4, the starting quadrant's backdrop is **the same** as
  in step 1 (deterministic hash of qx,qy).
- If a backdrop is still loading when the pick fires, the renderer
  shows any loaded backdrop rather than a blank navy fill.

## S8c — Painted starbase renders at capital-class scale

**Steps**

1. `lrscan` until a starbase quadrant is discovered.
2. Warp to that quadrant.
3. Observe the starbase sprite on the tactical view.

**Expected**

- Starbase sprite is `starfleet_base.png`, rendered ~6 sector cells
  wide (roughly 60 % of the quadrant's screen height).
- Warm gold drop-glow around the sprite.
- Label `STARFLEET BASE` in Orbitron 11px sits clearly below the
  sprite footprint (not overlapping).
- Any Klingon in the same quadrant is visibly smaller than the base.

## S9 — Docking fully repairs

**Steps**

1. Take some hull damage (`shields down`, sit in a Klingon quadrant
   for a few turns).
2. Warp to a starbase quadrant.
3. Move next to the starbase icon (impulse if needed).
4. `dock`.

**Expected**

- Energy resets to 10000.
- Torpedoes reset to 10.
- Shields reset to 1500 (but not raised — you must `shields up`
  afterwards).
- Hull returns to 100 %.
- All 8 subsystems return to OK.
- Bridge Log entry: "Docked at starbase — resupplied and repaired".

---

## S10 — Win a mission

**Steps**

1. Start Novice.
2. Follow cheat panel top hints (opt in with <kbd>`</kbd> / `▶ cheat`).
3. Play until `Klingons remaining = 0`.

**Expected**

- Bridge Log shows a green "VICTORY" event.
- Game-over overlay appears with the "VICTORY" heading in cyan.
- Statistics line shows kills, hull %, energy, stardate.
- Pressing <kbd>Enter</kbd> or <kbd>Space</kbd> returns to the title
  screen.

---

## S11 — Lose a mission (stardate exhaustion)

**Steps**

1. Start Novice. Ignore cheat hints; wander around scanning.

**Expected**

- After ~40 stardates, the current command triggers a loss.
- Loss reason: "stardate budget exhausted — Federation defeated".
- Game-over overlay: red "DEFEAT" heading, reason, stats.

---

## S12 — View toggle

**Steps**

1. From title screen, start Novice.
2. With empty command buffer, press <kbd>V</kbd>.
3. Press <kbd>V</kbd> again.
4. Click `Galaxy Chart` button in the top bezel.
5. Click `Tactical`.

**Expected**

- <kbd>V</kbd> toggles Tactical ↔ Galaxy Chart.
- Buttons in bezel also toggle. Active button gets a cyan highlight.
- Galaxy Chart shows 8×8 grid with the current quadrant's backdrop
  behind a dark overlay (backdrop matches the last tactical view).
  Scanned quadrants show Klingon counts + starbase markers;
  unscanned quadrants are darkened (fog of war).
- Your quadrant is highlighted cyan with an `E` marker + `YOU`
  label.

---

## S13 — Cheat panel dynamic hints

**Steps**

1. Enable cheat panel (<kbd>`</kbd> or `▶ cheat`).
2. Start a Novice mission.
3. Observe hints across situations:
   - Fresh quadrant, no scans: expect `SCAN` or `EXPLORE` normal hint.
   - Enter Klingon quadrant, shields down: expect `SHIELDS` urgent.
   - Shields up, hostiles alive: expect `PHASER` normal (auto-computed
     energy amount).
   - Adjacent to starbase, hull < 30 %: expect `DOCK` urgent.
   - Low fuel, starbase in current quadrant but not adjacent:
     expect `MOVE-TO-BASE` urgent with impulse bearing.

**Expected**

- Hints re-compute after every executed command.
- Top 5 hints shown; each has a coloured priority border (red
  urgent, cyan normal, dim ok).
- Suggested `cmd` in the hint can be typed verbatim.

---

## S14 — Backdrop image / sprite failure fallback

**Steps** (uses DevTools to simulate)

1. Open Network tab, throttle to "Offline" before load.
2. Refresh page.

**Expected**

- Title screen appears (HTML + CSS still work).
- If images fail entirely, scene canvas shows a dark navy fill
  (`currentBgState()` returns the same failing pick).
- Enterprise still draws as a programmatic vector fallback (from
  `drawEnterprise` fallback path).
- Each Klingon draws as a programmatic vector fallback.
- Starbase falls back to the gold framed cross.
- Stars fall back to the radial-gradient orb (SVG failed → old path).
- The game is still playable — no JS errors.

Restore network and refresh to verify sprites re-load.

---

## S15 — Test suite runs green

**Steps**

```sh
cd bsdgames/trek/ports/fancy-web
node --test tests/*.test.js
```

**Expected**

- 45 / 45 tests pass.
- Total duration under 300 ms.
- No warnings besides stdout logs from the autoplay stress test.

---

## Known limitations (not bugs)

- **Standard / Expert autoplay** loses to stardate exhaustion —
  cheat is an advisor, not an autopilot. A human player following the
  cheat *and* applying priority judgment wins these consistently.
- **Cheat gives no torpedo bearing** when the closest target is on
  the same sector as the Enterprise (dx=dy=0). Real BSD trek can't
  fire torpedoes at yourself anyway; the phaser hint takes over.
- **Long autoplay traces** (100+ turns) can drift into oscillation
  in rare edge cases; the harness cycles through cardinal directions
  after 6 same-command repeats.
