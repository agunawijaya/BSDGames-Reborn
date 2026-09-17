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

## Board & Grid

- 🟢 **Grid dimensions 60 × 22.** Matches canonical `spec.md` §State
  Variables. Encoded as `GRID_WIDTH` / `GRID_HEIGHT` in
  `src/game/state.ts`.
- 🟠 **Cell rendering.** Original renders characters `@` (player),
  `+` (robot), `*` (pile) in a terminal. This port renders each
  cell as a procedural 3D tile (box geometry) via `@react-three/fiber`
  (Three.js), viewed through an orthographic camera at ~30° for
  isometric perspective. Cell logical positions are identical;
  visual representation is a Monument Valley-style modernization.
- 🟠 **Tile visuals.** Each tile is a `boxGeometry` with slight
  gap for grid visibility, cyan `#4cc9f0` top face, darker
  `#3a86a8` side faces via `meshStandardMaterial` under
  directional + ambient lighting. Original had no concept of
  depth — cells were flat characters.
- 🟠 **Camera.** Orthographic at position `[35, 35, 35]` looking
  at origin, zoom tuned so the full 60×22 grid fits the viewport
  with padding. Fixed for gameplay; may drift subtly for polish.
  Original had no camera — the game filled the terminal.

## Tech Stack Pivot (2026-09-17 afternoon)

- 🔵 **Pivot from react-konva (Canvas 2D) to @react-three/fiber
  (WebGL 3D orthographic).** See
  [`docs/decisions/001-tech-stack.md`](decisions/001-tech-stack.md)
  §Revision Note for full reasoning. Game logic files unchanged;
  only rendering-layer files (`Game.tsx`, `package.json`, this
  ADR) were affected.

## Visual Polish (post-Phase-3)

- 🔵 **Bloom post-processing** via `@react-three/postprocessing`
  — emissive surfaces (tiles, robot/player LEDs) bleed into
  surrounding pixels. Produces a "planet halo in space" effect:
  the cyan platform reads as a self-luminous celestial body from
  a distance, with a soft glow that extends beyond its edges.
  Params: `intensity 0.75`, `luminanceThreshold 0.35`,
  `radius 0.8`, `mipmapBlur true`.
- 🔵 **Solid backing plate** under the tile grid (`0a1428` navy,
  slightly larger than grid) — prevents CSS starfield from
  showing through gaps between tiles. Adds subtle depth from
  isometric angle.
- 🔵 **CSS + Three.js dual starfield** — CSS SVG data-URL layer
  behind the Canvas (350 static stars, seeded), plus a
  Three.js `<points>` cluster of 1200 points in the scene for
  subtle depth (both visible through empty space around
  platform).

## Player & Robot Positions

*(To be filled as the engine is implemented in Phase 2.)*

## Robot AI

*(To be filled as AI is implemented in Phase 2.)*

## Random Events

*(To be filled — robot placement, teleport target selection.)*

## Input

- 🟢 **hjkl + yubn movement** — vi-style 8-direction movement per
  spec §Actions/Commands, case-insensitive lower-case.
- 🟢 **Arrow keys** — cardinal only, alias for `h`/`j`/`k`/`l`.
- 🟠 **Numpad / number-row 1-9** — modernization. Original ncurses
  version varied; roguelike convention is
  ```
    7 8 9
    4 5 6
    1 2 3
  ```
  Adopted here. `5` = skip turn (same as `.` / space).
- 🟠 **`w` = safe-wait, animated turn-by-turn** — deviation from
  spec §Special commands. Original `w` is risky (may kill you)
  and resolves all turns synchronously. This port binds `w` to
  the safe-wait behavior described in spec's `>` command
  (stops one turn before a robot would land), *and* plays each
  wait turn out visibly (~180 ms per turn via `setInterval`) so
  the player can see each step. See
  [`decisions/002-safe-wait-deviation.md`](decisions/002-safe-wait-deviation.md).
  Any keypress interrupts the running wait. Canonical risky `w`
  semantics remain available in the engine module as
  `waitUntilResolved`; batched safe-wait as `safeWait`.
- 🟢 **`>`** — alias for safe-wait (matches canonical spec).
- 🔵 **`t` teleport** — spec-conformant (unlimited uses, uniform
  random empty cell).
- 🔵 **`?`** — added: toggle help panel (port-only affordance).
- 🔵 **`+` / `−` / mouse wheel** — added: zoom in / out (port-only
  affordance).

## Scoring & High Scores

*(To be filled. High score persistence via localStorage — a
platform translation of the original score file.)*

## Termination

*(To be filled.)*

## Sound

*(Planned as an **added** feature — 🔵. Requires a port-level ADR
before landing.)*

## Modernization Additions (per port-level ADRs)

*(None yet. Each addition beyond the canonical spec must be
approved via an ADR in `docs/decisions/` and referenced here.)*

## Removed / Deferred

*(None yet.)*

---

**This log is updated as each feature is implemented.** A port's
diff-log is often more read than any other port doc — it is the
story of how the port chose to solve the problems the spec sets.
