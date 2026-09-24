# ADR-005: Quality-of-Life Deviations from Original `canfield(6)`

- **Status:** Accepted
- **Date:** 2026-09-24
- **Deciders:** Agun Wijaya (port author)
- **Scope:** Port-level — applies only to `bsdgames/canfield/ports/fancy-web/`.

## Context

A browser port of a 1980 curses game necessarily changes some auxiliary mechanics. This ADR bundles the small but deliberate deviations that are not covered by the phase/credit ADR.

## Options Considered

### 1. Undo

#### Option A — No undo (original behavior)

**Pros:** Most faithful.

**Cons:** One misclick in a click-to-select UI is much more punishing than a typo in a terminal command. Players expect undo in modern solitaire.

#### Option B — Free undo (chosen alternative considered)

**Pros:** Friendliest.

**Cons:** Removes the casino "every decision costs" tension.

#### Option C — Undo with a flat `$5` penalty (chosen)

**Pros:** Keeps tension; cheap enough for misclicks; expensive enough to discourage infinite undo-loops.

**Cons:** Not in the original.

**Decision:** Option C. Undo restores the previous board state and charges a flat `$5` from that prior state's bankroll.

### 2. Persistent bankroll across sessions

#### Option A — Per-game bankroll (original `this` / `game` / `total` reset each hand)

**Pros:** Matches original accounting.

**Cons:** A browser app feels better when your running balance survives closing the tab. The original had a shared `cfscores` file for this purpose.

#### Option B — Carry bankroll across New Game, record every finished or abandoned session (chosen)

**Pros:** One running balance; Account Book shows history; abandoning a game is recorded as a quit session.

**Cons:** Slightly different from the original's three-scope accounting (`this`, `game`, `total`).

**Decision:** Option B. `New Game` mid-session records the current game as abandoned and deals a new hand, carrying the bankroll forward.

### 3. Card-counting information display

#### Option A — Exact original counting (mark first 18 dealt as paid; charge for newly-visible talon/hand cards while toggle is on)

**Pros:** Faithful to `canfield.c`.

**Cons:** The original display is a textual hand/talon/stock count and a grid of card positions. A browser overlay can be richer.

#### Option B — 52-cell seen-grid plus hand/stock/talon counts, charge only for face-up cards not yet counted (chosen)

**Pros:** Richer visual feedback; the first 18 dealt cards are still free, so the early-game cost matches the original.

**Cons:** Does not track "cards that became visible while the toggle was on" with the same granularity; some later-game charges may differ slightly.

**Decision:** Option B. The pedagogical value of a full seen-grid outweighs the minor divergence in exact timing of information charges.

### 4. `cfscores` persistence

#### Option A — Server-side score file

**Pros:** Cross-device scores.

**Cons:** Requires backend; original was a local setgid file, not a cloud service.

#### Option B — Browser `localStorage` per-user (chosen)

**Pros:** Works offline, no backend, no permissions issues.

**Cons:** Scores are tied to one browser profile; corrupt storage must be handled gracefully.

**Decision:** Option B. The app validates storage and falls back to a fresh record on corruption.

## Decision Summary

- Undo: flat `$5` penalty, restores prior board state.
- Bankroll: persistent across New Game; abandoned games recorded.
- Counting: 52-cell seen-grid; first 18 dealt cards free.
- `cfscores`: `localStorage` with corruption fallback.

## References

- Upstream `canfield.c` `Cflag`, `showstat()`, and `cfscores` logic.
- Canonical [`../../../docs/spec.md`](../../../docs/spec.md).
