# ADR-001: Tech Stack — TypeScript + React + SVG + Vite

- **Status:** Accepted
- **Date:** 2026-09-17
- **Deciders:** Agun Wijaya (port author)
- **Scope:** Port-level — applies only to
  `bsdgames/gomoku/ports/fancy-web/`.

## Context

Per
[ADR-006 (multi-port architecture)](../../../../../../docs/decisions/006-multi-port-architecture.md),
each port picks its own stack. This ADR records the choice for
the `gomoku` `fancy-web` port.

Gomoku is a turn-based board game — 19 × 19 grid, 361 possible
placements, no real-time physics, no continuous animation, no
per-frame simulation. The rendering task is: draw a grid + up to
361 circles + optional accent elements. That is exactly what
SVG was designed for.

Target profile:

- **Aesthetic:** Traditional Japanese gomoku / go board — kaya-wood
  surface, black grid ink, slate + clamshell stones, vermillion
  last-move mark. See [`../../AGENTS.md`](../../AGENTS.md) →
  *Palette (locked)*. (An earlier iteration used a dark slate
  palette; superseded on 2026-09-17 per user feedback — see the
  `2026-09-17 palette update` entry in
  [`../diff-log.md`](../diff-log.md).)
- **Platform:** Any modern browser. **No GPU required** (unlike
  the sibling `robots/fancy-web` R3F port, which needs WebGL).
  Should be playable on low-end phones + old laptops without a
  discrete GPU.
- **Interaction:** click / tap intersection, plus keyboard input
  matching the original's `K10` notation.
- **Multiplayer:** hot-seat 2-player + vs AI. Online play
  deferred.
- **Bundle target:** ≤ 150 KB gzipped.

## Options Considered

### Option A — TypeScript + React + SVG + Vite (chosen)

**Description:** Native browser SVG for the board (grid lines,
stone circles, labels, hoshi dots, win-line highlight). React
manages the game state + input; SVG elements are React
components. Vite bundles.

**Pros:**

- **Crisp at any zoom.** SVG is vector — one element per stone,
  the browser rasterizes at native pixel density.
- **Smallest bundle of the shortlist.** No `three.js`, no
  physics engine, no game engine. Just React + a bit of DOM +
  our source. Realistic target ≤ 150 KB gzipped.
- **Accessibility comes for free.** SVG `<title>` and `<desc>`
  elements are read by screen readers. Every stone can announce
  its position; the board can announce its layout on demand.
- **No GPU needed.** Board is composed by the layout / paint
  pipeline, not the compositor's texture stage. Runs identically
  on integrated graphics and even software-rendered browsers.
- **React state model is a perfect fit.** Board state is a small
  immutable array; each move produces a new state; React
  re-renders the changed intersection. No `useRef` /
  imperative-mutation dance needed.
- **CSS animations are enough.** Stone drop-in (opacity + scale
  transition), win-line pulse (dash-array animation) — all
  declarable in CSS without an animation library.
- **Debugging is trivial.** Inspect any stone in DevTools; it's
  an `<circle>` with data attributes.

**Cons:**

- **Not aesthetically flashy.** Gomoku is a board game; there's
  no wide halo, no particles, no dramatic camera. The visual
  drama has to come from typography, color, and small motion
  cues.
- **Won't share visual toolkit with the `robots/fancy-web`
  R3F port.** That's fine — the mechanic warrants a different
  visual approach; forcing 3D would be showy without payoff.

### Option B — TypeScript + React + Canvas 2D + Vite

**Description:** Like the `snake` / `worm` fancy-web ports.
Board painted onto a `<canvas>` element frame by frame.

**Pros:**

- Reuses the visual toolkit already proven on `snake` and
  `worm`.
- Full control over per-pixel rendering.

**Cons:**

- Canvas is rasterized — needs re-render on resize / zoom to stay
  crisp; SVG scales for free.
- Every stone is a manual `arc()` call rather than a
  component that React manages. State reconciliation gets
  worse for a game that only redraws on turn changes.
- Accessibility is worse — Canvas is opaque to screen readers by
  default; would need parallel ARIA-labelled DOM stack.
- Small bundle-size win vs SVG is offset by the extra hand-
  rolled draw code.

**Suitable when** the game has fast per-frame animation (snake,
worm) — but gomoku doesn't.

### Option C — R3F 3D board (reuse robots stack)

**Description:** 3D board with tilted orthographic camera.
Stones as hemispheres or thick discs. Reuse
`@react-three/fiber`, `@react-three/postprocessing` from robots.

**Pros:**

- Stack already validated in `robots/fancy-web`.
- Could look dramatic — polished wooden 3D board with lit
  stones.

**Cons:**

- **Overkill.** A 2D board rendered in 3D adds bundle weight
  (~200 KB gzipped for three.js + friends) and a WebGL
  dependency for zero mechanic benefit.
- Excludes users on low-end / no-GPU devices for no reason.
- 3D perspective on a 2D game can hurt readability (stones far
  from camera look smaller / less clickable).

### Option D — Plain HTML / DOM grid

**Description:** CSS Grid with a `<div>` per intersection.

**Pros:**

- Zero framework needed.

**Cons:**

- Drawing the *lines* of a Go board via CSS is fiddly — grid
  lines pass *through* the intersections, not around them. SVG's
  `<line>` elements are the natural primitive.
- No easy way to draw the win-line highlight cleanly.

## Decision

**Option A — TypeScript + React + SVG + Vite.**

The board is composed of grid lines, dot marks, and circles. SVG
was designed for exactly this. Zero-GPU accessibility and a small
bundle are bonuses that fall out of the primitive fit; they
aren't the reason for choosing SVG, but they lock the choice in.

Reusing the R3F stack from `robots/fancy-web` was considered and
rejected — the port catalogue is more useful showcasing
*different* tech per game shape than forcing a single stack
onto every port.

## Consequences

### Positive

- Small bundle (target ≤ 150 KB gzipped) — every browser + every
  device.
- Native accessibility — SVG titles + descriptions handled by
  screen readers.
- Deploy target open — Vercel / Cloudflare Pages / GitHub Pages
  all serve static assets equally well.
- Simple mental model — React re-renders on state change; SVG
  reflects the current state.

### Negative / Risks

- Aesthetic drama must come from typography and micro-animation
  rather than bloom / particles. Requires taste + restraint.
- No shared toolkit reuse — the `snake`/`worm` Canvas 2D helpers
  don't apply here. That's fine at 4 total ports; would revisit
  if the catalogue grows past 8-10 fancy-web ports and shared
  primitives emerge.

### Follow-on Work

- Phase 1: scaffold + docs (this batch).
- Phase 2: game engine (rules, legal moves, win detection) + coord
  system + tests.
- Phase 3: SVG board renderer + hot-seat play + move history.
- Phase 4: heuristic AI ported from
  [`../../../docs/architecture.md`](../../../docs/architecture.md).
- Phase 5: verification (tests, typecheck, build, Playwright
  screenshots) + release commit.

## References

- Root [ADR-005 — Reference language & UI stack](../../../../../../docs/decisions/005-target-language-and-ui-stack.md)
  — Forward-Compatibility Rules apply voluntarily.
- Root [ADR-006 — Multi-port architecture](../../../../../../docs/decisions/006-multi-port-architecture.md).
- Canonical [`../../../docs/architecture.md`](../../../docs/architecture.md)
  — source of the heuristic AI to port.
- Canonical [`../../../docs/spec.md`](../../../docs/spec.md) — the
  rules contract.
