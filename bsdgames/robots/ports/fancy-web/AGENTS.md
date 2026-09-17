# AGENTS.md — `robots` `fancy-web` port

For per-game agent context, see
[`../../AGENTS.md`](../../AGENTS.md).

For repository-wide agent instructions and the Universal Port
Contract, see the root
[`AGENTS.md`](../../../../AGENTS.md).

## Port-Specific Notes

- **Tech stack:** TypeScript 5.6 + React 18 + `@react-three/fiber`
  + Three.js 0.169 + `@react-three/postprocessing` + Vite 5.
  **Isometric look via orthographic camera**, all geometry
  procedural (no external asset packs).
- **Build system:** npm.
- **Run dev server:** `npm run dev` (opens on `http://localhost:5173`).
- **Run tests:** `npm test` (watch) or `npm run test:once`.
- **Build production:** `npm run build` → `dist/`.
- **Typecheck only:** `npm run typecheck`.
- **Deploy target:** *(pending — Cloudflare Pages, Vercel, or GitHub Pages likely)*.

## Directory conventions

- `src/game/` — pure game logic (engine, RNG, grid, state types,
  high-score storage). **No React, no Three.js imports here.**
  Testable via Vitest without a DOM.
- `src/entities/` — R3F components for rendering game entities
  (player, robot, pile) + shared `AnimatedGroup` wrapper.
  `AnimatedGroup` provides `StepAnimationContext` that entity
  meshes consume to synchronize sub-animations (e.g. leg swing).
- `src/input/` — keyboard mapping. Isolated from game and
  rendering.
- `src/ui/` — React DOM UI (help panel, modals).
- `src/Game.tsx` — root composition. Holds React state
  (GameState, zoom, waiting, showHelp, highScores, isNewBest)
  and wires everything.
- `scripts/` — one-shot maintenance scripts, not shipped in
  build. Currently contains `capture-screenshots.mjs`
  (Playwright-driven headless Chromium that captures
  `media/*.png`; run `node scripts/capture-screenshots.mjs`
  after `npm run dev` is up).

## Constraints Specific to This Port

- **Fancy aesthetic — Monument Valley reference.** Palette-driven
  procedural 3D geometry rendered isometric. Deliberately breaks
  from the retro terminal palette that the `classic-web` port will
  use. Do not converge the two styles.
- **Two rendering trees, one boundary.** UI overlay (menus, HUD,
  settings, high-score screens) is React DOM. Game world (grid,
  player, robots, piles, particles) is R3F `<Canvas>` (WebGL). Do
  **not** mix — no attempts to render game entities in DOM or to
  render menus inside the R3F Canvas.
- **Game state lives outside React re-render cycle.** Keep the
  authoritative `GameState` in a `useRef` (or a small external
  store) and convert to React state only at UI boundaries.
  Frame-by-frame animation via R3F's `useFrame` hook, not React
  re-renders.
- **Procedural geometry only.** No PNG sprites, no glTF models,
  no external asset packs. All visuals are Three.js box / sphere
  / plane / group meshes composed from code + palette. Style
  consistency is enforced by this constraint.
- **Palette (locked):**
  - Space background: `#050912` (via CSS gradient, also
    Canvas is transparent so backing plate blends with space).
  - Tile top: `#4cc9f0` cyan (also aura + frame emissive color).
  - Backing plate: `#08152a` navy — invisible buffer around
    platform to absorb inward bloom bleed.
  - Player shirt: `#ff3a95` magenta, skin `#f5cba8`, hair
    `#4a2f1c`, pants `#3d4a5e`, shoes `#1a2540`, eye `#0a0a10`.
  - Robot body: `#ffbe0b` yellow with red LEDs `#ff006e` and
    steel-gray `#7c8894` accents.
  - Pile: `#7c8894` steel gray.
  - HUD text: `#f8f9fa` / `#adb5bd`.

  Consolidated in `src/Game.tsx` → `COLORS`, and per-entity in
  `entities/*.tsx`. Change in one place.

- **Bloom is calibrated around a single threshold.** Bloom
  `luminanceThreshold = 0.55`. Any material with emissive
  luminance above that will bloom. Keep tile emissive well below
  (currently `0.12`) or the grid pattern gets washed out by
  inward bloom bleed. Aura emissive is `AURA_BASE_EMISSIVE ×
  haloIntensityForZoom(zoom)` — designed so aura crosses the
  threshold at low zoom (visible planet halo) and drops below at
  high zoom (no silau on tiles during close-range gameplay).
- **Forward-Compatibility Rules** from
  [ADR-005](../../../../docs/decisions/005-target-language-and-ui-stack.md)
  apply here even though ADR-005 doesn't strictly govern fancy
  ports:
  - Hash routing or in-memory routing (no History API).
  - No iframe rendering tricks.
  - Bundle ≤ 500 KB gzipped per route.
  - Offline-first save (localStorage; cloud sync optional and
    additive).
  - No unsupported WKWebView APIs (WebGPU, unfenced
    `SharedArrayBuffer`, background audio while screen locked).
- **Spec compliance is a hard requirement.** Faithful to
  [`../../docs/spec.md`](../../docs/spec.md); any deliberate
  deviation is a port-level ADR under
  [`docs/decisions/`](docs/decisions/).
