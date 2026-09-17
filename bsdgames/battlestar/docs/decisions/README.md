# Architecture Decision Records (ADRs) — `battlestar`

This directory contains Architecture Decision Records specific to the
`battlestar` port.

## ADR Policy

- **Inheritance:** By default, all root decisions in
  [`docs/decisions/`](../../../docs/decisions/) apply to this game.
- **Overrides:** A per-game ADR is created **only** when `battlestar`
  needs to diverge from or specialize a root decision (e.g. curses dogfight
  rendering, save game format, or parser dictionary extensions).
- **Numbering:** Per-game ADRs start from `001-slug.md` and follow the
  template in [`docs/decisions/000-adr-template.md`](../../../docs/decisions/000-adr-template.md).
- **Required Sections:** Status, Context, Options Considered, Decision,
  Consequences.
