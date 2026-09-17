# `canfield` — Local Decisions

> This folder holds **local ADRs (Architecture Decision Records)**
> specific to `canfield`. Project-wide ADRs live at the root
> `docs/adr/`.

Local ADRs are only needed when `canfield` **overrides** or
**refines** a root ADR — for example, if `canfield` picks a
different language than the project default, or if `canfield`
needs a game-specific persistence format.

## Naming convention

`canfield-NNN-brief-slug.md`, e.g.,
`canfield-001-score-file-format.md`.

## Anticipated local ADRs

- **`canfield-001-score-file-format.md`** — JSON, SQLite, or
  signed JSON per-user. Includes schema versioning and location
  under `$XDG_STATE_HOME/canfield/`.
- **`canfield-002-cheat-resistance.md`** — how to preserve the
  "impossible to cheat" property in a per-user world. Options:
  drop the guarantee (single-user machine), HMAC-signed score
  file, remote score service.
- **`canfield-003-multi-variant-engine.md`** — should the port
  ship Klondike/FreeCell/Spider/Yukon from the same engine as
  Canfield?
- **`canfield-004-thinking-meter.md`** — `time()` vs
  `CLOCK_MONOTONIC`; behavior on suspend; cap semantics.
- **`canfield-005-no-money-mode.md`** — should a `--no-money`
  flag exist to disable the betting layer?
- **`canfield-006-undo-and-save.md`** — original has neither.
  Modern users expect both. What are the tradeoffs?

## Status

Empty until the port phase begins. All architectural discussion
lives in [`../port-ideas.md`](../port-ideas.md) and
[`../notes.md`](../notes.md) for now.

## ADR format

Use this template:

```markdown
# ADR canfield-NNN: Title

## Status

Proposed | Accepted | Superseded by ADR canfield-XXX

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
