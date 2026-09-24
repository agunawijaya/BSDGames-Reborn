# ADR-004: Betting Phase and Credit Model

- **Status:** Accepted
- **Date:** 2026-09-24
- **Deciders:** Agun Wijaya (port author)
- **Scope:** Port-level — applies only to `bsdgames/canfield/ports/fancy-web/`.

## Context

The original `canfield(6)` uses an implicit betting flow: the first board move triggers the `$13` inspection charge, and the first `ht` (hand-to-talon) prompts the player to buy the game for `$26`, at which point all foundation cards already on the foundation are credited at `$5` each. This port replaces the implicit `y/n` prompts with explicit **Buy / Inspect / Commit** buttons. That change makes the phase/credit model visible, but several implementation details had to be decided explicitly.

## Options Considered

### Option A — Exact original meter: implicit charges on first move and first `ht` (rejected)

**Description:** Keep the original `startedgame` / `infullgame` flags. Charge inspection on the first board move; charge game and credit foundations on the first `ht`.

**Pros:**

- Most faithful to `canfield.c`.

**Cons:**

- Incompatible with explicit phase buttons; a player could click Commit without ever making a board move, which the original never allowed.
- Harder to explain in the UI: players see buttons but the money moves on an unrelated action.

### Option B — Explicit phases with lazy foundation credit (chosen)

**Description:** Three explicit phases: **Buy** (no board moves), **Inspect** (all moves except `ht`), **Commit** (all moves). Foundation cards are credited only when the game is bought (Commit), at `$5 × cards already up`. Per-move foundation credits happen only after Commit.

**Pros:**

- Matches the explicit button UI.
- Matches the original's net result: Commit costs `$39` total and credits the base card plus any cards already moved up.
- Prevents earning money in Buy without paying anything.

**Cons:**

- The `$13` inspection charge is no longer triggered by the first board move; it is triggered by the Inspect button. The net cost is identical, but the timing differs.
- A player can Inspect, make foundation moves, and then quit without ever paying the `$26` game fee — same as the original, because foundation credits are only granted at Commit.

## Decision

**Option B.** The explicit phase model is a deliberate UX modernization. The *economic outcome* (what the player pays and what they can earn) matches the original: break-even is reached at roughly 10 cards on foundations including the base card.

## Consequences

### Positive

- Clear UI state machine.
- No unintended money generation in Buy phase.
- Foundation credits are atomic at Commit, simplifying undo and history.

### Negative / Risks

- Requires documenting that Inspect allows all board moves except `ht`, not "foundation moves only" as an earlier draft claimed.
- Canonical `spec.md` needs a matching update (the spec described an "Inspection unlock +$13" standalone purchase).

## References

- Upstream `canfield.c` `movecard()` lines ~1478–1538.
- Canonical [`../../../docs/spec.md`](../../../docs/spec.md).
