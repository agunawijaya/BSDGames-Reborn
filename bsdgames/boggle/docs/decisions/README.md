# Architecture Decision Records (ADRs) — `boggle`

This directory contains Architecture Decision Records specific to the
`boggle` port.

## ADR Policy

- **Inheritance:** By default, all root decisions in
  [`docs/decisions/`](../../../docs/decisions/) apply to this game.
- **Overrides:** A per-game ADR is created **only** when `boggle`
  needs to diverge from or specialize a root decision (e.g. embedded dictionary format,
  curses vs raw ANSI grid display, or network multiplayer scoring).
- **Numbering:** Per-game ADRs start from `001-slug.md` and follow the
  template in [`docs/decisions/000-adr-template.md`](../../../docs/decisions/000-adr-template.md).
