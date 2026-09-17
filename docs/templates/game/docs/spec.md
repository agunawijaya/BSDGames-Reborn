# `<GAME>` — Reverse Specification

> Implementation-independent specification of the game's mechanics,
> extracted from the original C source. **Not from memory** — from
> the code.
>
> This document is the contract that `src/` and `tests/` must honour.

---

## Objective

- **Win condition:** [precise statement]
- **Lose condition:** [precise statement]
- **Draw / stalemate (if any):** [precise statement]

## State Variables

*Every piece of state the game tracks.*

| Variable | Type | Range | Initial | Persisted? |
|---|---|---|---|:---:|
| `score` | int | 0..N | 0 | via high-score file |
| ... | ... | ... | ... | ... |

## Actions / Commands

| Command | Args | Effect | Preconditions |
|---|---|---|---|
| `<cmd>` | [args] | [state change] | [when valid] |
| ... | ... | ... | ... |

## Rules & Invariants

Numbered list of the rules a legal game state must satisfy.

1. ...
2. ...
3. ...

## Difficulty Levels & Setup Configuration

*Every tunable setting, CLI flag, difficulty tier, and map generation knob.*

### Difficulty Modes / Levels
- [Enumerate difficulty modes (e.g. EASY vs HARD, AI depth levels, speed tiers).]
- [What changes across modes: enemy count, timing, AI lookahead, hazard density.]

### Setup & Invariant Bounds
- [Table of CLI flags or setup options: flag, parameter, permitted range, validation rules, rejection errors.]

### Session Replay Semantics
- [What happens on replay: same map vs fresh generation, score retention.]

## Object & Entity Inventory

*For games featuring inventory items, stationary fixtures, or interactive entities (e.g. adventure, roguelikes, board games with pieces).*

| Object / Entity | ID / Enum | Category (Treasure / Tool / Fixture / NPC) | Initial Location | Weight / Size | Properties & State Transitions |
|---|---|---|---|---|---|
| Keys | `KEYS` | Tool | Building (1) | 1 | Unlocks grate at entrance |
| Brass Lantern | `LAMP` | Tool | Building (1) | 1 | Fuel ticks down (330 ticks) |
| ... | ... | ... | ... | ... | ... |

## RNG Usage

*Every place randomness affects state. See also
[`architecture.md`](./architecture.md) §Random Events.*

| Trigger | Distribution | Effect |
|---|---|---|
| ... | ... | ... |

**Seed strategy:** [fresh per run / reproducible from CLI arg / ...]

## Scoring

*Formula(s) for scoring. Reference `how-to-play.md` for the
player-facing version.*

## Termination Conditions

*Every way the game can end.*

1. **Win:** ... (score = ..., state transitions to ...)
2. **Lose:** ...
3. **Quit:** ...
4. **Timeout / turn limit:** ...

## Not in Scope

*Things the original does that this port explicitly won't. Reference
[`port-ideas.md`](./port-ideas.md) for modernisation decisions.*

## Ambiguities in the Original

*Any behaviour in the original that is unclear from reading the
source, and the interpretation this port adopts. Reference
[`diff-log.md`](./diff-log.md) as those decisions materialise.*

## See Also

- [`architecture.md`](./architecture.md)
- [`test-scenarios.md`](./test-scenarios.md)
