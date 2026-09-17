# `gomoku` `fancy-web` — Port-Level Test Scenarios

Per [root `AGENTS.md` §6.2](../../../../AGENTS.md), a port-level
`test-scenarios.md` is **conditional** — it's required when the
port adds features beyond the canonical spec. This port adds
several: undo, hot-seat mode switch mid-game, side swap against
the AI, keyboard cursor, animated win-line, click / tap input,
localStorage resume, and a mode toggle in the sidebar.

The **canonical** scenarios at
[`../../../docs/test-scenarios.md`](../../../docs/test-scenarios.md)
describe the *original binary's* curses/text prompts (`quit`,
`save`, `move?`, colour choice, etc). This document mirrors the
same intents but adapts each to how a user actually drives them
here — with a mouse, a keyboard, or a touch.

Every scenario below is designed to be runnable by a human against
`npm run dev` on `http://localhost:5173`, or by an agent driving
Playwright against the same dev server.

---

## PT-01 — Startup and empty board

**Steps:**
1. `npm run dev`, open `http://localhost:5173`.

**Expected:**
- Kaya-wood board renders with 19 × 19 grid, black grid ink, black
  hoshi dots at the 9 star points, warm-brown column/row labels
  (A–T skipping I, 1–19).
- Sidebar shows **To move: ● Black**, **Mode: Vs AI** selected,
  **You: Black · swap sides**, **Controls: Undo / Resign
  disabled, New game enabled**, **Move history: No moves yet**.
- No console errors.

## PT-02 — First AI move is K10

**Setup:** Vs-AI mode, human = White (click "swap sides").

**Steps:** none — swap triggers the AI as Black to move first.

**Expected:**
- AI plays K10 as its opening move (spec invariant, mirrors
  canonical T-02).
- Move history: `1. K10`; the vermillion ring appears on the K10
  intersection.

## PT-03 — Place a stone via click

**Setup:** Empty board, Vs-AI, human = Black.

**Steps:**
1. Click intersection K10.

**Expected:**
- Black stone drops onto K10 with a short `scale(0.4) → scale(1)`
  animation (~180 ms).
- Vermillion ring highlights K10.
- Move history: `1. K10`.
- After ~500 ms the AI responds with a stone somewhere adjacent
  (heuristic AI).

## PT-04 — Placing on an occupied intersection is a no-op

**Setup:** Any board with at least one stone.

**Steps:**
1. Click on an occupied intersection.

**Expected:**
- No new stone is placed.
- Move counter and history unchanged.
- No error dialog — silent rejection (spec: "illegal move").

## PT-05 — Placing outside the grid is a no-op

**Setup:** Empty board.

**Steps:**
1. Click just outside the outer grid line (still inside the wood
   frame).

**Expected:**
- No stone placed. `board.tsx`'s bounds-check via
  `col >= 0 && col < BOARD_SIZE` rejects the click.

## PT-06 — Undo one move

**Setup:** Play three moves in hot-seat mode.

**Steps:**
1. Click **Undo** (or Ctrl+Z).

**Expected:**
- The most recent stone is removed.
- Move history shrinks by one row (or one cell of the last row).
- The vermillion last-move ring re-appears on the previous move.
- Turn indicator flips back one colour.

## PT-07 — Undo all the way to empty

**Setup:** 5+ moves played.

**Steps:**
1. Click **Undo** repeatedly.

**Expected:**
- Each click removes one stone. Once at zero, **Undo** disables.
- Board is empty; sidebar returns to the "Click any intersection
  to begin." status.

## PT-08 — Undo disabled at start

**Setup:** Empty board (fresh new game).

**Expected:**
- **Undo** button is greyed out (`disabled`).

## PT-09 — New game resets state

**Setup:** Mid-game with at least one move played.

**Steps:**
1. Click **New game**.

**Expected:**
- Board clears to empty; move history empties.
- Turn returns to Black, status returns to "To move".
- Mode selection is preserved.

## PT-10 — Resign

**Setup:** Play at least one move (Resign requires ≥1 move
because the original engine disallowed resigning move-zero).

**Steps:**
1. Click **Resign**.

**Expected:**
- Status card switches to "Result: ● [other colour] wins by
  resignation" in vermillion.
- No further moves can be placed (board disabled, cursor:
  not-allowed).

## PT-11 — Horizontal 5-in-a-row wins

**Setup:** Hot-seat mode. Play stones so Black gets F10, G10,
H10, J10, K10 (skipping I as per label convention — internal
columns 5–9, row 9).

**Expected:**
- After the fifth stone drops, the winning line pulses in
  vermillion from F10 to K10.
- Status card switches to "**Black wins!** 5-in-a-row after N
  moves."

## PT-12 — Vertical, diagonal (↘), diagonal (↗) wins

**Setup + steps + expected:** same as PT-11 but on a vertical
column, a `↘` diagonal, and a `↗` diagonal. All four directions
must trigger win detection (regression against the
`DIRECTIONS = [[1,0],[0,1],[1,1],[1,-1]]` scan in
`src/game/engine.ts`).

## PT-13 — Overline (6+ in a row) also wins

**Setup:** Hot-seat, play 6 consecutive Black stones in a row.

**Expected:**
- Win triggers at the 5th stone (spec: "first to five"). If a
  test somehow constructs a 6th consecutive stone without
  triggering earlier win detection (contrived), it still counts
  as a win — free-gomoku rules per canonical spec.

## PT-14 — AI blocks an obvious threat

**Setup:** Vs-AI, human = Black. Play three Black stones in a
horizontal row so Black threatens open-four next move.

**Expected:**
- AI's next move blocks one end of the three (defensive
  heuristic — pattern score for open-three is 1,500).

## PT-15 — Mode switch mid-game

**Setup:** Play a few moves in Vs-AI mode.

**Steps:**
1. Click **Hot-seat** in the sidebar Mode card.

**Expected:**
- Mode toggle updates — "Hot-seat" highlighted in dark-brown ink,
  "Vs AI" reverts to cream.
- AI stops responding. Both colours are now human-driven.
- Turn indicator continues from wherever it was.

## PT-16 — Swap sides against AI

**Setup:** Vs-AI, empty board, human = Black (default).

**Steps:**
1. Click "**You: Black · swap sides**".

**Expected:**
- Label updates to "**You: White · swap sides**".
- AI immediately plays K10 as Black's opening.

## PT-17 — Move history renders in pairs

**Setup:** Play 5+ moves.

**Expected:**
- Move history renders as `1. K10  L11 / 2. J10  M11 / ...` in
  a monospace font.
- Last cell shows `—` if the last move is Black without a White
  reply yet.
- Scroll appears past 400 px height.

## PT-18 — Palette matches AGENTS.md locked palette

**Steps:**
1. Load the app.
2. Compare rendered pixels against the palette locked in
   [`../AGENTS.md`](../AGENTS.md) → *Palette (locked)*.

**Expected:**
- Board surface `#e8c184`, frame `#a06d3d`, grid `#2a1e10`,
  hoshi `#1a1210`, labels `#5a4530`.
- Vermillion `#c23b22` on last-move ring, win line, "New game"
  button, "Wins!" text.
- Cream sidebar cards `#f5efe0` on border `#c9b48a`.
- Body tabletop `#d4b58e`.

## PT-19 — Responsive: narrow viewport

**Steps:**
1. Resize the window below 800 px wide.

**Expected:**
- `.game-layout` switches to single-column (board on top, sidebar
  below).
- Move history caps at 240 px scroll.
- Board still fits (`viewBox` keeps it responsive).

## PT-20 — No pageerror or console.error during a full game

**Setup:** Automated (Playwright).

**Steps:**
1. Play a full game to completion (win or resign) through the
   Playwright capture-screenshots script.

**Expected:**
- Zero `page.on('pageerror')` events.
- Zero `console.error` messages.
- (This is what `scripts/capture-screenshots.mjs` already asserts
  via its `pageerror` and `console.error` hooks.)

---

## Coverage vs canonical scenarios

| Canonical T-# | Port PT-# | Notes |
|---|---|---|
| T-01 startup / quit | PT-01 | No "quit prompt" — the tab close is the quit. |
| T-02 first AI move is K10 | PT-02 | Direct mapping. |
| T-03 basic move entry | PT-03 | Click replaces `K10`-typed input. |
| T-04 invalid move | PT-05 | Off-grid click is silently rejected (no textbox to type into). |
| T-05 occupied cell | PT-04 | Click on occupied is silent no-op. |
| T-06 save/restore | *(deferred to v2 — SGF)* | See diff-log "Removed / Deferred". |
| T-07/T-08 win detection | PT-11, PT-12 | 4 directions covered. |
| T-09 tie | *(automated engine test only)* | 361-stone tie is impractical to run manually. |
| T-10 resign | PT-10 | Direct mapping. |

## Automated coverage

The `tests/` folder covers the *pure* logic (47 tests, 100% engine
+ coords + AI branch coverage). This document covers the
*interactive* + *presentational* concerns that live above the
engine boundary.
