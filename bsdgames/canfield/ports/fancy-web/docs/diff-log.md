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

## 2026-09-22 — Global drag-and-drop, flying-card animation, and URL seed fix

**Changed:**
- Drag-and-drop is now active in **normal mode**, not only in Cheat Mode. Top cards of legal sources are draggable to legal targets.
- Click handler ignores the spurious click that follows a successful drag, so click-to-select still works.
- Added `FlyingCard` animation: cards that reach a foundation (including auto-moves) now fly visibly from source to destination (~450 ms).
- Bankroll chips now show a tooltip explaining the red/white/blue indicators.
- `HowToPlay` now includes a dedicated "three betting phases" section and a note that not every Canfield deal is winnable.
- App now reads `?seed=N` from the URL so tests, screenshots, and shared challenges are reproducible.

**Why:** Players expect drag-and-drop as a primary interaction, not a cheat-only feature. The flying-card animation makes auto-moves readable. The URL seed fix removes hidden flakiness in tests that relied on `?seed=`.
