# Port Decisions

This directory holds Architecture Decision Records (ADRs) specific
to the `<GAME>` `<PORT-NAME>` port.

## Inheritance

Root ADRs (in the repo-level `docs/decisions/`) set defaults for
every port in every game. Per-game ADRs (in
`bsdgames/<GAME>/docs/decisions/`, rare) override root defaults for
this game across all its ports. Port-level ADRs (here) override
both — but only for this specific port.

Silence at any level = defer to the level above.

## When to write a port-level ADR

- **Any deliberate deviation from the canonical
  [`../../../../docs/spec.md`](../../../../docs/spec.md).** Silent
  deviation is a review-blocker per the Universal Port Contract
  (ADR-006).
- Non-trivial tech choices that a future maintainer of this port
  would need the reasoning behind (framework selection, rendering
  approach, state model, networking transport, etc.).
- Additive features beyond the canonical spec — multiplayer, cloud
  save, alternate modes — with their rationale and consequences.

## When *not* to write a port-level ADR

- Choices already covered by root or per-game ADRs — defer.
- Trivial implementation details a diff-log entry can cover.
- Anything that changes the canonical spec — that requires a PR to
  the canonical spec itself, not a port-level workaround.

## Format

Follow the ADR template at
[`../../../../../../docs/decisions/000-adr-template.md`](../../../../../../docs/decisions/000-adr-template.md).
Required sections: **Status / Context / Options Considered /
Decision / Consequences**. Options analysis is mandatory — it is
what makes the ADR pedagogical, not just a decision log.

Numbering is per-port (starts from `001-<slug>.md`) and
independent from the game and root numbering.

## Empty is fine

If this port makes no decisions that override defaults, the folder
stays empty. That itself is a valid state — do not create ADRs to
document non-decisions.
