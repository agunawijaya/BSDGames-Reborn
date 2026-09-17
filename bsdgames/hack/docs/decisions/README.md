# Architecture Decision Records (ADRs) — `hack`

This directory contains Architecture Decision Records specific to the
`hack` port.

## ADR Policy

- **Inheritance:** By default, all root decisions in
  [`docs/decisions/`](../../../docs/decisions/) apply to this game.
- **Overrides:** A per-game ADR is created **only** when `hack`
  needs to diverge from or specialize a root decision (e.g. cloud-shared
  bones server, modern ANSI color schemes, or optional graphical tilesets).
- **Numbering:** Per-game ADRs start from `001-slug.md` and follow the
  template in [`docs/decisions/000-adr-template.md`](../../../docs/decisions/000-adr-template.md).
