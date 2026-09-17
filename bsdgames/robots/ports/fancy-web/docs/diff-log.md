# `robots` `fancy-web` — Diff Log

Feature-by-feature narrative of choices made in this port versus
the original BSDGames `robots`. The canonical
[`../../docs/spec.md`](../../../docs/spec.md) is the contract;
this log explains how this port implements or deliberately
diverges from it.

**Legend:**

- 🟢 **Kept** — behaves as the original (with platform translation
  where noted).
- 🟠 **Modernized** — platform / UX translation preserving
  spec-level behavior.
- 🔵 **Added** — new behavior not in the original spec (requires
  a port-level ADR).
- 🔴 **Removed** — original behavior deliberately absent (requires
  a port-level ADR).

---

## Board & Grid

- 🟢 **Grid dimensions 60 × 23.** Matches canonical `spec.md`
  §State Variables (`X_FIELDSIZE = 60`, `Y_FIELDSIZE = 23`).
  Encoded as `GRID_WIDTH` / `GRID_HEIGHT` in `src/game/state.ts`.
- 🟠 **Cell rendering.** Original renders characters `@` (player),
  `+` (robot), `*` (pile) in a terminal. This port renders each
  cell as a procedural 3D tile (`boxGeometry`) via
  `@react-three/fiber` (Three.js) under an orthographic camera at
  approximately 30° tilt for isometric perspective. Cell logical
  positions are identical to the spec; the visual representation
  is a Monument-Valley-style modernization.
- 🟠 **Tile visuals.** Tiles use `meshStandardMaterial` cyan
  `#4cc9f0` with a small emissive term (`0.12`) that keeps the
  surface bright without crossing the bloom threshold. Gaps of
  `0.1` world units between tiles give the grid pattern its lines.
- 🟠 **Backing plate.** A dark navy `#08152a` slab (`GRID + 6` in
  X and Z) sits below the tiles. Because the Canvas is
  transparent, this plate is what prevents CSS starfield from
  showing through tile gaps, and it soaks up any inward bloom
  bleed from the aura ring so the tiles stay crisp.
- 🔵 **Perimeter frame — removed.** An earlier prototype had a
  thin bright emissive ring at the platform edge. The user
  requested its removal (small edge glow bled onto the outermost
  tile row, causing local silau). The aura plate alone now
  supplies the halo.

## Camera & View

- 🟠 **Isometric orthographic camera** at `[40, 40, 40]` looking
  at the origin. Zoom ranges from `8` (fully out — "planet from
  afar") to `55` (close, follow-player).
- 🔵 **Spawn zoom** starts at `MIN_ZOOM = 8` so the game opens
  with a cinematic reveal of the platform floating in the
  starfield. Restart resets zoom to spawn; level advance does
  not.
- 🔵 **Follow-player at high zoom.** Below zoom `20` the camera
  looks at the grid origin. Between `20` and `30` it lerp-blends
  its target toward the player's world position. Above `30` the
  camera fully follows the player, keeping them centered even
  when the grid overflows the viewport.
- 🔵 **Smooth zoom / target lerp** — a `useFrame` in
  `CameraController` lerps both the camera's `.zoom` and its
  look-target every frame, so zoom-button presses and
  player-follow retargeting animate rather than snap.
- 🔵 **Zoom controls** — `+` / `−` / `=` keys, mouse wheel, and
  on-screen `+` / `−` buttons all trigger `ZOOM_STEP = 1.2`
  multiplicative zoom.

## Space Atmosphere

- 🔵 **CSS starfield** — a seeded-random SVG data-URL painted onto
  the root `div` background sits behind the transparent Canvas.
  ~350 stars, positioned via a deterministic Mulberry32 seed so
  reloads produce identical starfields (no distracting
  reshuffling).
- 🔵 **Aura plate + planet halo.** A very-large emissive slab
  (`GRID + 14` × `GRID + 14`, cyan emissive `2.2 × haloIntensity`)
  sits below the backing plate. The plate's center is occluded
  by the backing plate; only the ring extending 4 units past the
  backing plate is visible from above. That ring plus bloom
  bleed produces the wide, soft planet-halo effect.
- 🔵 **Zoom-attenuated halo.** Aura emissive intensity is a
  function of zoom (`haloIntensityForZoom`): `1.0` at zoom `8`,
  falling linearly to `0.08` at zoom `55`. When the player zooms
  in, the aura's brightness drops below the bloom threshold
  (`0.55`), the halo silently fades out, and gameplay-close view
  is free of glare on the tiles. When the player zooms out, the
  halo returns to its full "planet in space" strength.
- 🔵 **Bloom post-processing** via `@react-three/postprocessing`.
  Params: `intensity 1.2`, `luminanceThreshold 0.55`, `radius 0.9`,
  `mipmapBlur true`. Robot LED / player emblem emissives stay
  above threshold at all zoom levels, so they always glow;
  aura crosses the threshold only at low-to-mid zoom.

## Player Character

- 🔵 **Human silhouette** (see `entities/Player.tsx`). A
  minimalist voxel human — shoes, denim legs, magenta shirt,
  bare-arm cylinders, skin-tone spherical head, dark hair
  cap, small dark eyes on the +Z face. Palette chosen for
  gameplay clarity (magenta player accent) plus vibrant
  self-illumination (small emissive term on shirt and skin,
  well below bloom threshold).
- 🔵 **Animated walk cycle.** Legs and arms are wrapped in pivot
  groups at the hip and shoulder. A shared
  `StepAnimationContext` (provided by `AnimatedGroup`) exposes
  `isMoving` to the mesh. During movement, an internal
  `walkPhase` ref advances continuously with time; leg rotation
  = `sin(walkPhase) × 0.55 rad`, arms swing counter-phase at
  65 % amplitude. When idle, targets fall to `0` and the
  rotations lerp back to a rest pose. Because `walkPhase` is
  continuous (not derived from step-progress), interrupted or
  rapid successive steps chain smoothly instead of resetting.
- 🔵 **Facing rotation.** `AnimatedGroup` sets its Y rotation
  toward `atan2(dx, dz)` on every step, then lerps toward that
  angle each frame. Both the player and robots therefore face
  the direction they're moving.
- 🔵 **Step arc.** Body Y position traces a parabolic hop
  (`4·p·(1-p)·stepHeight`) during each step, on top of the
  linear X/Z lerp. Player stepHeight `0.12`, step duration
  `340 ms` — long enough that the walk cycle is visible.

## Robots

- 🟢 **Robot AI** — spec-conformant Chebyshev step. Each robot
  moves 1 cell toward the player using
  `sign(playerX - robotX)`, `sign(playerY - robotY)` per turn.
- 🟢 **Collision resolution.** If two robots land on the same
  cell, both die and a scrap pile forms (spec §Turn Order §4b).
  A robot moving onto an existing pile also dies (pile persists).
- 🔵 **Robot IDs (rendering only).** Each robot carries a stable
  `id` field so the React reconciler can preserve identity
  across turns. IDs are assigned at level init and preserved in
  `advanceRobots` — engine invariants unchanged, ID is a
  rendering-layer convenience.
- 🔵 **Hover-bot silhouette.** Robots are rendered as
  yellow-and-red hover bots (see `entities/Robot.tsx`):
  metallic hover disc with a red under-glow, yellow torso and
  shoulder pauldrons, glowing red visor slit, small antenna
  with an emissive tip. The visor + LED emissives cross the
  bloom threshold, so each robot has a small localized glow
  regardless of zoom.
- 🔵 **Robot facing** — robots rotate to face the direction they
  moved on the last turn. Slightly slower rotation lerp than
  the player (`rotationSpeed 14` vs. `18`) for a more mechanical
  feel.
- 🔵 **Robot step arc.** Same parabolic hop as the player but
  much smaller (`stepHeight 0.06`, step duration `240 ms`) —
  reads as a subtle hover bob during a step rather than a
  human-scale footstep.

## Piles

- 🟢 **Pile as obstacle.** Piles form where robots collide and
  are permanent for the level. Stepping onto a pile kills the
  player; a robot moving onto a pile is destroyed and the pile
  persists.
- 🟠 **Pile visuals.** Rendered as 5 tumbled, deterministically
  rotated steel-gray box fragments (see `entities/Pile.tsx`).
  The rotation seed is derived from the pile's grid position so
  a given pile looks the same across re-renders (no visual
  shuffling per frame).

## Input

- 🟢 **hjkl + yubn movement** — vi-style 8-direction movement per
  spec §Actions/Commands, case-insensitive.
- 🟢 **Arrow keys** — cardinal only, alias for `h`/`j`/`k`/`l`.
- 🟠 **Numpad / number-row 1-9** — modernization following the
  roguelike convention:
  ```
    7 8 9
    4 5 6
    1 2 3
  ```
  `5` = skip turn (same as `.` / space).
- 🟠 **`w` = safe-wait, animated turn-by-turn.** Deviation from
  spec §Special commands. Original `w` is risky (may kill you)
  and resolves all turns synchronously. This port binds `w` to
  the safer semantics of spec's `>` command (stops one turn
  before a robot would land), *and* plays each wait turn out
  visibly at ~180 ms per turn via `setInterval`. Any keypress
  interrupts the running wait. Canonical risky-`w` semantics
  remain available in the engine module as `waitUntilResolved`
  (unused here); batched safe-wait as `safeWait`. See
  [`decisions/002-safe-wait-deviation.md`](decisions/002-safe-wait-deviation.md).
- 🟢 **`>`** — alias for safe-wait (matches canonical spec §`>`).
- 🟢 **`t` teleport** — spec-conformant (unlimited uses, uniform
  random empty cell).
- 🔵 **`?`** — toggle help panel (port-only affordance).
- 🔵 **`+` / `−` / `=` / mouse wheel** — zoom in / out (port-only
  affordance).

## Scoring

- 🟢 **`+10` per robot destroyed.** Matches spec `ROB_SCORE`.
- 🟢 **Wait bonus.** Increments by 1 per robot destroyed while
  the safe-wait loop is active; applied to the running score
  when the level clears.
- 🔴 **`+600` level-4 bonus** (spec §Scoring, only in `-a`
  autobot mode) — not implemented; the port is human-play only.
- 🟠 **High-score persistence via localStorage.** Modern
  replacement for the original binary score file. Implemented in
  `src/game/highScores.ts` (a small `HighScoreEntry` list, top
  10, sorted by score, saved once per death via a
  `useEffect` on `state.status === 'dead'`). Death modal shows
  the top 5 and highlights the current run if it made the
  leaderboard, plus a "🏆 New high score!" banner when
  `qualifiesForLeaderboard` returns true.

## Termination

- 🟢 **Player death.** On collision (stepping onto or being
  stepped on by a robot or a pile), status becomes `dead`.
  Modal shows "AARRrrgghhhh…" plus final score and offers
  restart.
- 🟢 **No win condition.** Score at time of death is the
  result.
- 🟠 **Level clear.** When all robots on the level are
  destroyed, status becomes `level-clear` and a modal offers
  advance to the next level.

## Sound

*(Planned as an **added** feature — 🔵. Not yet implemented.
Would require a port-level ADR before landing.)*

## Modernization Additions (per port-level ADRs)

- [ADR-001 — Tech stack (TypeScript + React + @react-three/fiber)](decisions/001-tech-stack.md)
- [ADR-002 — `w` binds to safe-wait, not risky wait](decisions/002-safe-wait-deviation.md)

## Release milestone — 2026-09-17

🟢 **Released.** All Universal Port Contract baseline items
(README + AGENTS + CLAUDE + diff-log + working src + tests +
port-specific media, plus attribution) satisfied. Progress
dashboard updated to reflect Released status for both the port
and the game.

## Verification (as of 2026-09-17 evening)

- ✅ **Engine tests:** 33/33 pass (`grid.test.ts` 6 cases,
  `engine.test.ts` 27 cases covering initGame, movePlayer, robot
  AI, collisions, teleport, safeWait, waitUntilResolved,
  nextLevel, score progression). Run with
  `npm run test:once`.
- ✅ **TypeScript typecheck** clean under strict mode
  (`npm run typecheck`). Zero errors, zero warnings.
- ✅ **Production build** succeeds via `npm run build`.
  Output: `dist/assets/index-*.js` at **289 KB gzipped**
  (1,055 KB raw). This is well under the ADR-005
  Forward-Compatibility bundle budget of 500 KB gzipped per
  route.
- ✅ **`w` = level-clear discontinuity fix.** During
  verification, one engine test (`movePlayer › moves the player
  by the direction delta`) surfaced a subtle bug: `advanceRobots`
  returned `level-clear` when the state's robot array was empty
  at the start of the turn, even if there had never been any
  robots to clear. Fixed by guarding
  `if (survivors.length === 0 && state.robots.length > 0)`.
- ✅ **4 port-specific screenshots** captured via a Playwright
  script (`scripts/capture-screenshots.mjs`) that drives a
  headless Chromium against the running dev server:
  1. `media/01-spawn.png` — spawn view at max zoom out (halo
     dominant, platform reads as a distant planet).
  2. `media/02-gameplay.png` — mid-zoom gameplay (robots
     visible, halo softer).
  3. `media/03-follow-player.png` — high-zoom follow-player
     view (halo faded, tiles crisp, player centered).
  4. `media/04-help.png` — help panel modal.
  Screenshots embedded in the port `README.md`.

## Removed / Deferred

- **Media capture** — port-specific screenshots and a short
  gameplay GIF/`asciicast` are the last remaining item on the
  Released checklist. Requires a running browser session (out of
  scope for tooling; must be captured by the port owner).
- **Deployment** — a live URL is required for ✨ Complete but
  is out of scope for the code-only work. A `dist/` bundle
  ready to publish to Vercel / Cloudflare Pages /
  GitHub Pages exists after `npm run build`.
- **Sound effects** — planned as an additive port feature; a
  future port-level ADR should scope this before landing.

---

**This log is the story of how the port chose to solve the
problems the spec sets.** Update it every time a design decision
is made or reversed.
