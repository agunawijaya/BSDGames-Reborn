# ADR-001: Tech Stack — TypeScript + React + SVG + Vite

- **Status:** Accepted — card rendering superseded by [ADR-003](./003-card-rendering-css.md) (cards are CSS DOM elements; SVG is used for overlays)
- **Date:** 2026-09-21
- **Deciders:** Agun Wijaya (port author)
- **Scope:** Port-level — applies only to `bsdgames/canfield/ports/fancy-web/`.

## Context

Per [ADR-006 (multi-port architecture)](../../../../../../docs/decisions/006-multi-port-architecture.md), each port picks its own stack. This ADR records the choice for the `canfield` `fancy-web` port.

Canfield is a turn-based card game. The rendering task is: draw up to 52 cards in several piles, plus UI chrome for bankroll, betting buttons, command input, account book, and card-counting overlay. Cards need crisp rendering at any zoom and smooth CSS transitions for flips and slides.

Target profile:

- **Aesthetic:** Victorian Saratoga Springs casino table — green felt, gold trim, chip stacks.
- **Platform:** Any modern browser. No GPU required.
- **Interaction:** drag-and-drop, click, touch, plus keyboard command grammar matching the original.
- **Bundle target:** ≤ 200 KB gzipped.

## Options Considered

### Option A — TypeScript + React + SVG + Vite (chosen)

**Description:** Native browser SVG for cards (rectangles, text, suit symbols). React manages game state and renders the table chrome. Vite bundles.

**Pros:**

- **Crisp at any zoom.** SVG cards scale perfectly on retina displays and mobile.
- **CSS animations are enough.** Card flips, slides, and chip bounces are simple CSS transforms.
- **Accessible.** SVG `<title>` elements label each card; the table structure is semantic DOM.
- **React fits the chrome-heavy UI.** Bankroll, betting panel, command bar, account book, and help panel are natural component hierarchies.
- **Small bundle.** No three.js, no physics engine, no game engine. Just React + DOM + our source.

**Cons:**

- Not as flashy as a WebGL casino scene.
- More overhead than a single-file Canvas port for a simple card game.

### Option B — TypeScript + Canvas 2D + Vite

**Description:** Like the `snake` / `worm` / `wump` fancy-web ports. Cards painted onto `<canvas>`.

**Pros:**

- Reuses the visual toolkit already proven on other ports.
- Full control over per-pixel rendering.

**Cons:**

- Canvas is rasterized — needs re-render on resize / zoom to stay crisp; SVG scales for free.
- Hit-testing dragged cards is manual.
- Accessibility is worse — Canvas is opaque to screen readers by default.
- The UI chrome (bankroll, buttons, account book) still needs DOM, so Canvas does not simplify the stack.

### Option C — React + WebGL / R3F

**Description:** 3D casino table with cards as 3D meshes, physics-based dragging.

**Pros:**

- Visually dramatic.

**Cons:**

- Overkill for a card game. Adds hundreds of KB of bundle and a GPU dependency.
- Excludes low-end / no-GPU devices for no mechanic benefit.
- Drag-and-drop in 3D is harder to make accessible.

## Decision

**Option A — TypeScript + React + SVG + Vite.**

Cards are vector shapes with text and simple transforms — SVG was designed for exactly this. React handles the surrounding UI chrome naturally. The result is a small, accessible, responsive casino table without WebGL overhead.

## Consequences

### Positive

- Small bundle, any browser, any device.
- Native accessibility for cards and piles.
- Deploy target open — Vercel / Cloudflare Pages / GitHub Pages all serve static assets equally well.

### Negative / Risks

- Visual drama must come from palette, typography, and micro-animation rather than 3D.
- No shared toolkit reuse with the Canvas-based ports; that's acceptable per ADR-006.

## References

- Root [ADR-005 — Reference language & UI stack](../../../../../../docs/decisions/005-target-language-and-ui-stack.md).
- Root [ADR-006 — Multi-port architecture](../../../../../../docs/decisions/006-multi-port-architecture.md).
- Canonical [`../../../docs/spec.md`](../../../docs/spec.md) — the rules contract.
