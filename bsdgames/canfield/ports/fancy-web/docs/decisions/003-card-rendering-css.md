# ADR-003: Card Rendering — CSS Divs Supersede SVG-Only Constraint

- **Status:** Accepted
- **Date:** 2026-09-24
- **Deciders:** Agun Wijaya (port author)
- **Scope:** Port-level — applies only to `bsdgames/canfield/ports/fancy-web/`.

## Context

ADR-001 chose "TypeScript + React + SVG + Vite" and described cards as native SVG shapes. During implementation the cards were built from styled `<div>`/`<span>` elements instead. The only SVG in `src/` is the cheat-overlay arrow layer. This ADR records why the SVG-only card constraint was relaxed and what was gained and lost.

## Options Considered

### Option A — Keep SVG-only cards (rejected)

**Description:** Replace the current CSS card component with SVG `<rect>` + `<text>` cards.

**Pros:**

- Matches the literal wording of ADR-001.
- Crisper at extreme zoom levels.

**Cons:**

- Requires rewriting `Card.tsx`, `Pile.tsx`, drag image cloning, and all card animations.
- Stacking, absolute positioning, hover lifts, and drag ghosts are far more verbose in SVG than in CSS.
- The original ADR's accessibility argument is weaker: the app already uses `data-testid`, `aria-label`, and textual rank/suit labels; SVG `<title>` is not the only accessible path.

### Option B — Accept CSS cards, keep SVG for overlays (chosen)

**Description:** Cards remain DOM elements styled with CSS; SVG is used only for the cheat-overlay arrows and any future vector chrome.

**Pros:**

- Faster to iterate and maintain.
- CSS transitions/animations for hover, drag, and flying cards work without SVG coordinate math.
- Drag image cloning (whole-pile ghost) is trivial with DOM nodes.
- Bundle size remains small; no SVG library is needed.

**Cons:**

- Slight crispness loss at very high zoom compared to pure SVG.
- ADR-001 must be superseded for the card-rendering detail.

## Decision

**Option B.** The *spirit* of ADR-001 — a small, accessible, browser-native stack — is preserved. The *mechanism* for individual cards is DOM/CSS rather than SVG, which is a better fit for the pile-stacking and drag-and-drop interactions this port uses.

## Consequences

### Positive

- Less code and simpler animations.
- Easier responsive layout; cards resize with CSS media queries and container units.
- Drag-and-drop ghost images naturally show the full pile.

### Negative / Risks

- Need to update README and ADR-001 references that claim "SVG cards".
- Future ports that want vector scaling can still choose SVG; this decision is port-local.

## References

- Port [ADR-001 — Tech Stack](./001-tech-stack.md).
- Root [ADR-006 — Multi-port architecture](../../../../../../docs/decisions/006-multi-port-architecture.md).
