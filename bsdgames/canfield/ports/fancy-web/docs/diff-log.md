# `canfield` — `fancy-web` diff log

> Running narrative of what was kept, added, changed, or removed from the canonical `../../docs/spec.md` for this port.

## 2026-09-21 — Initial port scaffold

**Kept from spec:**
- Full 52-card deck and initial deal layout (4 tableau, 13 stock, base card foundation, 3 talon, 31 hand).
- Base-card rule: first foundation card sets rank for all foundations.
- Tableau build: down by rank, alternating color; whole pile moves as unit.
- Foundation build: up by suit, wraps around after King.
- Empty-tableau fill rules: stock first, then talon after stock exhausted.
- Auto-move base-rank cards to foundation.
- Original command grammar: `s#`, `sf`, `t#`, `tf`, `##`, `#f`, `ht`, `c`, `b`, `q`.
- Betting economics: `$13 / $13 / $26 / $5 / $1 / $1 per minute` with `$3` thinking-time cap per move.
- `cfscores` companion reinterpreted as the in-browser Account Book.

**Added:**
- Click-to-select card movement (primary pointer interaction).
- Touch controls for mobile.
- Undo with a `$5` penalty (original had no undo).
- Auto-save and resume via `localStorage`.
- Deterministic seeded deals via URL `?seed=N`.
- Daily seed challenge mode.
- Optional Web Audio sound effects (card flip, chip clink, invalid buzz, win fanfare).
- Responsive layout for portrait and landscape.
- Account Book with session history, net worth graph, and statistics.

**Changed:**
- Command input is now a visible retro command bar with live parse hints, instead of a full-screen terminal prompt.
- Card counting toggle now renders as an overlay grid of seen cards, charging `$1` per unknown card revealed (same cost as original).
- `cfscores` is no longer a separate binary; it is a read-only view inside the same web app.

**Removed:**
- Shared setgid score file. Modern port uses per-browser `localStorage`.
- Curses terminal rendering. Replaced by SVG casino table.
- `time(NULL)` RNG. Replaced by deterministic seeded PRNG.

**Why:** Canfield's identity is the betting economy and the casino feel. The fancy-web port preserves that tension while making the game playable on modern devices with modern input methods.

## 2026-09-22 — Interaction and UX hardening

**Changed:**
- Removed the fragile drag-and-drop prototype; click-to-select is now the sole pointer interaction. It avoids accidental moves and plays better with stacked cards.
- Added a prominent phase banner (Buy / Inspect / Commit) so the betting flow is obvious before any move.
- Made `.pile-slot` dimensions dynamic based on card count and stack direction, preventing tableau cards from visually overlapping the stock/talon row.
- Added `data-testid` attributes to every pile, making e2e selectors resilient to layout changes.
- Improved help-modal readability:
  - unselected tab buttons now use a dark felt background with cream text;
  - command table uses cleaner borders and spacing;
  - modal content has a styled vertical scrollbar when it overflows.

**Why:** Play-testers were clicking stock/talon and seeing nothing happen because the old fixed-size tableau slots spilled over the lower rows. The phase banner and clearer help also reduce confusion about why "Deal Hand" is disabled before Commit.

## 2026-09-22 — Deal Hand clarity and vertical spacing

**Changed:**
- Phase banner and betting hint now explicitly say that **Deal Hand → Talon** is locked until Commit, so players don't expect it in Inspect.
- Increased `.table-area` row gap and lowered `.pile-label` position so pile labels no longer visually crowd the cards in the row below.

**Why:** Beta feedback showed players could move tableau→foundation in Inspect and assumed the game was already in Commit, then wondered why Deal Hand stayed disabled.

## 2026-09-22 — Cheat Mode (visual coach)

**Added:**
- Toggle-able **Cheat Mode** button in the Controls panel.
- `legalMoveHints()` and `recommendedPhaseAction()` helpers in the game engine.
- `CheatOverlay` component that draws SVG arrows from legal sources to destinations.
- Glowing source/target rings on piles when Cheat Mode is active.
- Native HTML5 drag-and-drop on source cards in Cheat Mode; dropping on a legal target executes the move.
- Pulsing green highlight on the BettingPanel **Inspect** or **Commit** button when the coach recommends that phase action.
- Port-level ADR: `docs/decisions/002-cheat-mode.md`.
- Unit tests in `tests/cheat.test.ts` and e2e coverage in `tests/cheat.spec.ts`.

**Why:** Beta players kept trying Deal Hand before Commit and dragging cards to illegal destinations. A visual coach answers "where can I move?" and "when should I commit?" without adding text clutter.

## 2026-09-22 — Commit-from-buy fix

**Changed:**
- `advancePhase()` now takes an explicit target (`inspect` | `commit`) instead of always stepping sequentially.
- **Commit button is now enabled in Buy phase.** Clicking it charges the full `$39` ($13 deal + $13 inspection + $26 game) and jumps straight to Commit, unlocking Deal Hand and all tableau moves immediately.
- Betting hint, phase banner, and `HowToPlay` updated to say Buy offers both Inspect ($13 trial) and Commit ($39 full unlock).
- Unit + e2e tests updated for the new `advancePhase` signature and the new commit-from-buy path.

**Why:** The banner already told players they could Commit from Buy, but the button was disabled, forcing an unwanted Inspect step. This fixes the inconsistency and restores the intended choice: trial cheaply, or buy in fully.

## 2026-09-22 — Beginner-friendly canonical how-to-play

**Changed:**
- Rewrote canonical [`../../docs/how-to-play.md`](../../docs/how-to-play.md) with a new **“Canfield for absolute beginners”** section at the top.
- Added plain-language explanations of foundations, base rank, stock, talon, hand, and foundation moves — with a concrete example table.
- Added the “used-car” analogy for Buy / Inspect / Commit phases.
- Explained why Inspect is useful as cheap insurance, and why you cannot win from Inspection alone.

**Why:** Play-testers who had never played casino solitaire found the original doc too terse. The new doc teaches the game before listing the command reference.

## 2026-09-22 — Whole-pile drag visual feedback and any-card grab

**Changed:**
- `Pile` now tracks an `isDragging` state while its top card is being dragged.
- All cards in a dragged pile receive the `.dragging` class, lifting them slightly (`translateY(-8px)`) and adding a larger shadow.
- The `.pile-slot` itself gets a gold border during drag so the source pile is clearly highlighted.
- `Card` now accepts an `onDragEnd` prop so the visual state resets reliably.
- **Any face-up card in a pile can now start a drag** — not only the top card. The underlying move is still the whole pile, matching Canfield rules, but the grab handle feels like Solitaire Windows.
- **Custom drag image:** when dragging starts, `Pile` clones its entire DOM and passes it to `dataTransfer.setDragImage()` so the browser drag ghost shows the full stack, not just the clicked card.
- **Custom drag image restricted to tableau piles.** Stock and talon only show the single dragged card as their ghost, since they are single-card sources.
- **Cheat mode suppresses all visuals for empty tableau targets.** Both the target glow and the CheatOverlay arrows pointing to empty tableau slots are filtered out. Empty slots remain valid drops, but they no longer light up.

**Why:** Play-testers expected Klondike-style grab-from-anywhere dragging. Canfield still moves whole piles, but the UX now lets you grab any exposed card as the handle while visually showing that the entire pile moves. The follow-up tweaks remove misleading visual clutter for stock/talon and empty tableau targets.

## 2026-09-24 — Rule and economics hardening after QC review

**Changed:**
- Empty-tableau fill rules now match `canfield.c`: stock may fill an empty tableau while the stock exists; talon may fill it only after the stock is exhausted; a tableau pile may **never** move into an empty tableau.
- Auto-move is restricted to **base-rank cards only** (opening new foundations), not every legal foundation card.
- Auto-move now runs at the end of the initial deal.
- Hand recycle order fixed: the same triples replay in the same order on each pass (removed an erroneous `.reverse()`).
- Talon auto-refills from the hand when it empties, matching the original's pre-prompt behavior.
- Loss condition implemented: the fourth fruitless pass through the hand ends the game.
- Betting credit model switched to **lazy credit at Commit**: foundation cards are credited only when the game is bought, at `$5 × cards up` (including the base card). No board moves are allowed in Buy phase.
- Inspect phase now allows **all** moves except `ht` (hand-to-talon), matching the original's betting instructions.
- Thinking time is no longer charged for illegal or no-op moves.
- `betting-info` resets the thinking-time clock so repeated `b` presses do not double-charge.
- Undo restores the prior board state and charges a flat `$5` from that restored state.
- Bankroll is now persistent across `New Game`; abandoning a game records a quit session.
- Resuming a saved game resets the thinking-time clock so idle gaps are not billed.
- `localStorage` corruption no longer crashes the app.
- Command bar focus now blocks global `h`/`n`/`u` shortcuts.
- `q` now confirms before quitting and records a `quit` session.
- Illegal moves now show a visible error message and a brief shake.
- `b` now opens a live betting-info breakdown panel.
- Mobile layout improved: board keeps usable height, sidebar is constrained.
- Bankroll chip tooltips now explain red/white/blue chip values.

**Added:**
- New regression suite `tests/rules.test.ts` covering empty-tableau rules, base-rank auto-move, phase/credit behavior, recycle order, talon refill, loss condition, and thinking-time/undo accounting.
- Port-level ADRs:
  - `003-card-rendering-css.md` — why cards are CSS DOM rather than SVG shapes.
  - `004-betting-phase-and-credit-model.md` — explicit Buy/Inspect/Commit phases and lazy foundation credit.
  - `005-quality-of-life-deviations.md` — undo, persistent bankroll, counting grid, and `localStorage` `cfscores`.

**Removed / corrected claims:**
- README no longer claims "29/29 tests" (now 44), "SVG cards" (cards are CSS DOM), or "every move charged exactly as the original" (the exact timing of phase/credit is modernized; the economic outcome is preserved).

**Why:** A QC review against the original `canfield.c` showed several rule and economics divergences. This pass fixes the blockers and documents the deliberate deviations that remain.

## 2026-09-22 — Global drag-and-drop, flying-card animation, and URL seed fix

**Changed:**
- Drag-and-drop is now active in **normal mode**, not only in Cheat Mode. Top cards of legal sources are draggable to legal targets.
- Click handler ignores the spurious click that follows a successful drag, so click-to-select still works.
- Added `FlyingCard` animation: cards that reach a foundation (including auto-moves) now fly visibly from source to destination (~450 ms).
- Bankroll chips now show a tooltip explaining the red/white/blue indicators.
- `HowToPlay` now includes a dedicated "three betting phases" section and a note that not every Canfield deal is winnable.
- App now reads `?seed=N` from the URL so tests, screenshots, and shared challenges are reproducible.

**Why:** Players expect drag-and-drop as a primary interaction, not a cheat-only feature. The flying-card animation makes auto-moves readable. The URL seed fix removes hidden flakiness in tests that relied on `?seed=`.
