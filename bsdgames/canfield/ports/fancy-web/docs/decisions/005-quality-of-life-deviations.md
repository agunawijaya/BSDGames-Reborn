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

**Decision:** Option C. Undo restores the previous board state and charges a flat `$5` from that prior state's bankroll. Purchases (Inspect, Commit, and the automatic Inspect on the first move) cannot be undone, so Undo is never a refund.

### 2. Persistent bankroll across sessions

#### Option A — Per-game bankroll (original `this` / `game` / `total` reset each hand)

**Pros:** Matches original accounting.

**Cons:** A browser app feels better when your running balance survives closing the tab. The original had a shared `cfscores` file for this purpose.

#### Option B — Carry bankroll across New Game, record every finished or abandoned session (chosen)

**Pros:** One running balance; Account Book shows history; abandoning a game is recorded as a quit session.

**Cons:** Slightly different from the original's three-scope accounting (`this`, `game`, `total`).

**Decision:** Option B. `New Game` mid-session records the current game as abandoned and deals a new hand, carrying the bankroll forward.

### 3. Card-counting information display

#### Option A — Exact original counting (chosen)

`Cflag` toggles the feature (off at the start of every game). The first 18 dealt cards start visible and paid. While it is on, every hand or talon card that becomes visible and has not been paid costs `$1` (`$34` maximum); cards that became visible while it was off are billed when it is switched on; nothing is billed twice. The panel shows the Talon/Hand/Stock counts and the talon and hand card by card, `?` for cards never seen.

**Pros:** Faithful to `canfield.c` (`showstat()`, `usedtalon()`, `movetotalon()`); no information leak.

**Cons:** Plainer than a full 52-card grid.

#### Option B — 52-cell seen-grid (built first, rejected)

**Cons:** It marked the 18 pre-paid cards as known, which revealed the identity of the 12 face-down stock cards for free, and it billed cards the player was already looking at. Removed.

**Decision:** Option A. `Count: ON/OFF` is a real toggle.

### 4. `cfscores` persistence

#### Option A — Server-side score file

**Pros:** Cross-device scores.

**Cons:** Requires backend; original was a local setgid file, not a cloud service.

#### Option B — Browser `localStorage` per-user (chosen)

**Pros:** Works offline, no backend, no permissions issues.

**Cons:** Scores are tied to one browser profile; corrupt storage must be handled gracefully.

**Decision:** Option B. The app validates storage and falls back to a fresh record on corruption.

### 5. Reset Bankroll

#### Option A — No reset; clear `localStorage` by hand

**Cons:** A shared laptop has no in-app way to start a new player.

#### Option B — A *Reset Bankroll* button (chosen)

After confirmation it zeroes the bankroll, erases the Account Book and any saved game, and deals a fresh hand (`-$13`). It means "new player". *New Game* keeps the running bankroll and the history.

### 6. Interaction and presentation additions

- **Double-click** a playable top card to send it to a foundation, alongside drag-and-drop and click-to-select (rejected: click-to-select only, which needs two clicks for the most common move).
- **Refusals are explained** (empty-space rules, locked Deal Hand, a card that cannot go up) instead of silently ignored (rejected: silence, which players read as a broken game).
- **Phase notices** replace a permanent phase banner; a small `Phase: X` tag remains (rejected: permanent banner, noise once read).
- **Victory animation** (bouncing cards, DOM + `requestAnimationFrame`, no Canvas; disabled under `prefers-reduced-motion`).
- **Cheat / Sound / Count are labelled toggles** (`ON` green, `OFF` grey, `aria-pressed`).

## Decision Summary

- Undo: flat `$5` penalty, restores prior board state.
- Bankroll: persistent across New Game; abandoned games recorded.
- Counting: exact `Cflag` behaviour (toggle, `$1` per newly visible hand/talon card, `$34` cap, no leak); panel only while ON.
- Reset Bankroll = new player (bankroll and Account Book cleared); New Game keeps them.
- Double-click to foundation, explained refusals, transient phase notices, victory animation, labelled toggles.
- `cfscores`: `localStorage` with corruption fallback.

## References

- Upstream `canfield.c` `Cflag`, `showstat()`, and `cfscores` logic.
- Canonical [`../../../docs/spec.md`](../../../docs/spec.md).
