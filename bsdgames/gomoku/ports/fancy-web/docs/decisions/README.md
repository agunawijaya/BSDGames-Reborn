# Port Decisions

This directory holds Architecture Decision Records (ADRs) specific
to the `gomoku` `fancy-web` port.

## Existing ADRs

- [`001-tech-stack.md`](./001-tech-stack.md) — TypeScript + React
  + SVG + Vite. Rationale for the SVG choice over Canvas / WebGL.

## Inheritance

Root ADRs set defaults for every port in every game. Per-game
ADRs override root defaults for `gomoku` across all its ports.
Port-level ADRs (here) override both — but only for
`gomoku/fancy-web` specifically.

## When to write a port-level ADR

- **Any deliberate deviation from the canonical
  [`../../../docs/spec.md`](../../../docs/spec.md).** Silent
  deviation is a review-blocker per the Universal Port Contract
  (ADR-006).
- Non-trivial tech choices (framework selection, rendering
  approach, AI algorithm choice, etc.).
- Additive features beyond the canonical spec — undo, puzzle
  mode, online multiplayer — with rationale and consequences.

## Format

Follow the ADR template at
[`../../../../../../docs/decisions/000-adr-template.md`](../../../../../../docs/decisions/000-adr-template.md).
Required sections: **Status / Context / Options Considered /
Decision / Consequences**.
