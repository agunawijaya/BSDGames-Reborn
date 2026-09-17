# AGENTS.md — `robots` `fancy-web` port

For per-game agent context, see
[`../../AGENTS.md`](../../AGENTS.md).

For repository-wide agent instructions and the Universal Port
Contract, see the root
[`AGENTS.md`](../../../../AGENTS.md).

## Port-Specific Notes

- **Tech stack:** TypeScript 5.6 + React 18 + @react-three/fiber
  (Three.js) + Vite 5. **Isometric look via orthographic camera**,
  all geometry procedural (no external asset packs).
- **Build system:** npm.
- **Run dev server:** `npm run dev` (opens on `http://localhost:5173`).
- **Run tests:** `npm test` (watch) or `npm run test:once`.
- **Build production:** `npm run build` → `dist/`.
- **Typecheck only:** `npm run typecheck`.
- **Deploy target:** *(pending — Cloudflare Pages, Vercel, or GitHub Pages likely)*.

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
- **Palette (locked):** background `#0d1b2a`, tile top `#4cc9f0`,
  tile side `#3a86a8`, player `#f72585`, robot `#ffbe0b`, pile
  `#7c8894`, danger flash `#ff006e`, text `#f8f9fa` / `#adb5bd`.
  Consolidated in `src/Game.tsx` → `COLORS` const. Change there,
  not per-component.
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
