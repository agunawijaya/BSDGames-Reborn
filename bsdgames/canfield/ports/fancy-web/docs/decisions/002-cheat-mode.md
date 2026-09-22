# ADR-002: Visual Cheat Coach for `canfield` fancy-web

- **Status:** Accepted
- **Date:** 2026-09-22
- **Deciders:** Agun Wijaya (repo owner), Kimi
- **Scope:** Per-game override (`canfield` fancy-web port)

## Context

Canfield's betting phases are confusing for new players: in **Inspect** you can already move tableau cards to foundations, but **Deal Hand** and tableau-to-tableau moves stay locked until **Commit**. During beta testing, players repeatedly tried to click "Deal Hand" while still in Inspect, or tried to drag cards to illegal destinations, and concluded the game was broken.

The original BSDGames binary has no tutorial or hint system beyond the man page. For the fancy-web port we want an optional, non-intrusive teaching aid that explains the rules by showing, not telling. The aid must be toggle-able so experienced players can ignore it, and it must not alter the underlying game rules or economics.

## Options Considered

### Option A — No in-game help beyond text

**Description:** Keep only the phase banner, the How to Play modal, and the command reference.

**Pros:**
- Zero implementation cost.
- Preserves the original "sink or swim" casino feel.

**Cons:**
- Does not solve the observed UX problem; players still misread the phase state.
- Text is slower to parse than a visual cue during a fast-paced solitaire session.

**Suitable when:** The target audience is already familiar with Canfield.

### Option B — Text-based suggestion list

**Description:** Add a sidebar panel that lists the current legal moves as text, e.g. "Move stock 7♣ to Tableau 4".

**Pros:**
- Easy to implement and test.
- Can include detailed reasoning.

**Cons:**
- Players must map text back to the visual table, which is error-prone.
- Adds reading load in a game that is already dense with numbers and symbols.
- Does not leverage the graphical port's main advantage over a terminal.

**Suitable when:** The port targets screen readers or when a graphical overlay is technically impossible.

### Option C — Visual overlay with arrows and glowing targets

**Description:** When Cheat Mode is on, render SVG arrows from every legal source pile to its legal destination, pulse the source and destination piles, and highlight the recommended Inspect/Commit button.

**Pros:**
- Directly connects rules to the visual layout.
- Works for all move types (foundation, tableau, stock, talon).
- Optional toggle respects expert players.

**Cons:**
- Requires DOM measurement and responsive recalculation.
- Too many arrows can look noisy on busy boards.
- Needs its own tests to keep arrows aligned with the game rules.

**Suitable when:** The port has a graphical table and wants to teach without breaking immersion.

### Option D — Full AI solver that plays for the player

**Description:** Run a solver in the background and auto-execute the "best" move each turn.

**Pros:**
- Maximum assistance.

**Cons:**
- Removes player agency and the betting tension that defines Canfield.
- Much larger scope; would need its own ADR and algorithm research.
- Conflicts with the "Teach" pillar — players would watch, not learn.

**Suitable when:** Building a bot or a puzzle generator, not an interactive game.

## Decision

**We chose Option C**, implemented as a toggle-able **Cheat Mode**.

The visual overlay is the best fit for the fancy-web port because it turns the existing casino table into its own tutorial. Arrows and glows answer the two most common beta questions — "where can this card go?" and "should I Inspect or Commit?" — without adding text noise. The toggle keeps the experience faithful for players who already know Canfield.

We deliberately did **not** choose Option D. An auto-player would undermine the game's identity; our goal is coaching, not autopilot.

## Consequences

### Positive

- New players can discover Canfield's unusual phase rules by experimentation.
- The overlay validates the legal-move engine: if an arrow is wrong, the test suite catches it.
- The feature is isolated behind a state flag and a button, so it carries no risk for normal play.

### Negative / Risks

- DOM-based arrow positioning must be recalculated on resize; a missed edge case could misalign arrows.
- The heuristic that ranks moves is simple (foundation > expose card > tableau > deal); it is not a perfect strategy coach.
- Glowing animations could be distracting if left on; the toggle mitigates this.

### Follow-on Work

- Update port `README.md` and `diff-log.md` to document the feature.
- Add e2e coverage for cheat-mode toggle and arrow visibility.
- Future ADR if we extend the heuristic into a full expected-value solver.

## References

- Root [`AGENTS.md`](../../../../AGENTS.md) §1 — project mission (Preserve, Modernize, Teach).
- [`docs/porting-guide.md`](../../../../docs/porting-guide.md) — port workflow and doc taxonomy.
- [`001-tech-stack.md`](./001-tech-stack.md) — React + SVG + Vite rationale.
