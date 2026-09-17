# `monop` — Local Decisions

> This folder holds **local ADRs (Architecture Decision Records)**
> specific to `monop`. Project-wide ADRs live at the root
> `docs/adr/`.

Local ADRs are only needed when `monop` **overrides** or
**refines** a root ADR — for example, if `monop` picks a
different language than the project default, or if `monop`
needs a game-specific save format.

## Naming convention

`monop-NNN-brief-slug.md`, e.g., `monop-001-rename-choice.md`.

## Anticipated local ADRs

- **`monop-001-rename-choice.md`** — final name for the port to
  avoid the Hasbro trademark. Candidates listed in
  [`../port-ideas.md`](../port-ideas.md) §1. Recommendation
  standing: `streets`.
- **`monop-002-content-pack-format.md`** — JSON, YAML, or
  something else? Includes schema for board, cards,
  monopolies, and rent tables.
- **`monop-003-card-effect-dsl.md`** — how to declaratively
  encode card effects (`{type: move_to_type, target:
  railroad}` vs hard-coded C).
- **`monop-004-save-format.md`** — JSON, SQLite, or signed
  JSON. Includes schema versioning.
- **`monop-005-ai-opponent-tiers.md`** — rule-based, learning
  based, or both. How many difficulty tiers.
- **`monop-006-multiplayer-model.md`** — hot-seat only vs LAN
  vs online. Recommendation: hot-seat default, async second,
  online v1.0.
- **`monop-007-house-rule-toggles.md`** — how the port exposes
  house rule variants (2-solvent auction skip, Free Parking
  pot, Income Tax choice).

## Status

Empty until the port phase begins. All architectural discussion
lives in [`../port-ideas.md`](../port-ideas.md) and
[`../notes.md`](../notes.md) for now.

## ADR format

Use this template:

```markdown
# ADR monop-NNN: Title

## Status

Proposed | Accepted | Superseded by ADR monop-XXX

## Context

Why is this decision needed? What's the current state?

## Options

1. **Option A** — description, pros, cons.
2. **Option B** — description, pros, cons.
3. **Option C** — description, pros, cons.

## Decision

Which option, and why?

## Consequences

What follows from this decision? What becomes possible or
constrained?
```

## See also

- Root ADR index: `../../../docs/adr/`.
- Root AGENTS.md §11: no local paths.
