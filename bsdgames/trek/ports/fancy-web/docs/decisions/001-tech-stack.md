# ADR 001 — Tech Stack: Vanilla ES Modules + Canvas 2D + Cinematic Sprites

**Status:** Accepted
**Date:** 2026-09-21
**Deciders:** Agun Wijaya, Claude Opus

## Context

The `trek/fancy-web` port must deliver a cinematic space-combat feel —
detailed ship sprites, weapons FX, parallax star fields — while
keeping BSD trek's turn-based typed-command core. Grid-only visuals
(Battleship-style coordinate display) were explicitly rejected as
"kurang visual" during design review.

Root [ADR-005](../../../../../docs/decisions/005-target-language-and-ui-stack.md)
allows a variety of stacks. What suits trek specifically?

## Decision

Vanilla JavaScript (ES modules) + Canvas 2D + programmatic
sprites + CSS for HUD overlays. Deliver as a static site with
`<script type="module">` entry — no build step, no dependencies.

### Module structure

```
src/galaxy.js       # galaxy/quadrant/sector data model + RNG
src/engine.js       # game state, commands, tick, combat
src/parser.js       # command grammar
src/main.js         # DOM + Canvas rendering + input orchestration
```

### Rendering approach

- **Space background canvas** — bottom layer, parallax stars +
  nebula gradients. Slow rightward drift.
- **Scene canvas** — top layer, ship sprites + weapons + effects.
  Redrawn every frame.
- **Strategic canvas** — separate overlay for galaxy map (shown on
  toggle). Static per redraw.
- **HUD panels** — DOM elements with CSS `backdrop-filter: blur`
  for glass-panel look. Updated on state change.

Ship sprites drawn **programmatically** as Canvas 2D paths
(ellipses, rectangles, gradients) — not raster images. Federation
cruiser silhouette for Enterprise, angular bird-of-prey for
Klingons. This keeps the port fully self-contained (no assets to
load) and lets us tune sprite detail without art pipeline overhead.

## Alternatives considered

### A. React + Vite + WebGL (like `robots/ports/fancy-web/`)

WebGL enables 3D ships + particle systems at scale. But trek's
gameplay is turn-based and low-entity-count (≤ 30 klingons total,
~10 stars per quadrant, ≤ 3 klingons per quadrant). Canvas 2D
handles this trivially. React adds framework overhead for state
that's naturally imperative (mutable game object).

**Rejected** — overkill for the entity count.

### B. Three.js 3D bridge scene

Would give a "sit in captain's chair, look at viewscreen" cinematic
feel. But the visual effort would go into environment (bridge
walls, consoles, crew) rather than the gameplay-critical space
combat. And it competes with actual Star Trek game titles which
have far bigger budgets.

**Rejected** — misallocation of visual investment.

### C. Illustrated painted scenes (like `adventure/ports/fancy-web/`)

Painted digital art per scene, layered on canvas. Beautiful but
requires an art pipeline (multi-hour illustrations per scene).
Adventure's scope was linear (24 scenes) which suited this;
trek's scope is stochastic (any of 8×8 = 64 quadrants) which does
not.

**Rejected** — pipeline mismatch.

### D. WebAssembly port of BSD trek C source

Would preserve source-level fidelity. But BSD trek relies on
terminal I/O (curses / TTY) which doesn't translate to browser
without extensive shimming. A JavaScript reimplementation to
`spec.md` is more tractable.

**Rejected** — I/O translation cost.

## Consequences

**Positive:**

- Zero build step, zero dependencies — open `index.html` and play.
- ~2500 LOC total across all modules — reviewable in an afternoon.
- Testable engine (Node `node:test` imports `src/engine.js` and
  `src/parser.js` directly).
- Ship sprites tuneable without art pipeline — change a few numbers
  in `drawEnterprise`/`drawKlingon` to iterate.
- Consistent with `atc` fancy-web port's tech stack pattern.

**Negative:**

- No 3D depth — Canvas 2D is flat. Nebulae + parallax stars
  approximate depth but can't match true 3D.
- Sprite detail limited by drawing complexity. Programmatic sprites
  look "clean" rather than "painted."
- No hot-reload — refresh browser after changes.
- No PWA / offline manifest yet (v2 deferred).

## Migration path (v2)

If v2 needs 3D or richer visuals:

1. Add `package.json` + Vite build.
2. Migrate to TypeScript.
3. Selectively replace canvas 2D with WebGL where it matters
   (weapon trails, damage effects).
4. Keep engine.js and parser.js unchanged — they're
   render-agnostic.

## See also

- Root [ADR-005 Target Language & UI Stack](../../../../../docs/decisions/005-target-language-and-ui-stack.md)
- Root [ADR-006 Multi-Port Architecture](../../../../../docs/decisions/006-multi-port-architecture.md)
- Sibling: `atc/ports/fancy-web/docs/decisions/001-tech-stack.md` (same pattern, different game)
- Sibling: `robots/ports/fancy-web/docs/decisions/001-tech-stack.md` (React + R3F variant)
