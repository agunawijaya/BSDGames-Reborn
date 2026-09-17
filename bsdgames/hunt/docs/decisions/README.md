# Architecture Decision Records (ADRs) — `hunt`

This directory contains Architecture Decision Records specific to the
`hunt` port.

## ADR Policy

- **Inheritance:** By default, all root decisions in
  [`docs/decisions/`](../../../docs/decisions/) apply to this game.
- **Overrides:** A per-game ADR is created **only** when `hunt`
  needs to diverge from or specialize a root decision (e.g. WebSocket protocol,
  tick rate synchronization, or bot behavior upgrades).
- **Numbering:** Per-game ADRs start from `001-slug.md` and follow the
  template in [`docs/decisions/000-adr-template.md`](../../../docs/decisions/000-adr-template.md).
