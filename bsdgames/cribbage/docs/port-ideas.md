# Cribbage — Port Modernization Ideas

Brainstorming architectural enhancements, visual upgrades, and feature ideas for the modern
spiritual successor of BSD Cribbage.

---

## 1. Gameplay Modernization

### Tiered Artificial Intelligence
While Earl Cohen's 1980 heuristics are remarkably competent, a modern successor should offer
three distinct AI difficulty settings:
1. **Apprentice (Heuristic):** The authentic 1980 BSD Cohen rule engine (`support.c`). Fast,
   tactically sound, but predictable in endgame scenarios.
2. **Journeyman (Equity Matrix):** Evaluates discard equity using precomputed probability tables
   derived from all 46 unseen cards (Monte Carlo simulation of cut cards and opponent hands).
3. **Master (Minimax / Perfect Endgame Solver):** Within 15 points of victory, switches to an
   exhaustive minimax search over pegging lines, playing with mathematical perfection to maximize
   the probability of pegging out before the opponent counts.

### Optional Rule Variations & Toggles
- **Muggins Toggle (Optional):** Traditional pub rule where if a player undercounts their hand,
  the opponent can press a key or call "Muggins!" to claim the unclaimed points. Disabled by
  default; enabled as a hardcore competitive mode.
- **3-Player & 4-Player Partnership Modes:** Standard Cribbage natively supports 3-player (5 cards
  each, 1 to crib) and 4-player partnership (5 cards each, 1 to crib, partners sitting opposite).

---

## 2. Visual & UI/UX Design

```
   ┌────────────────────────────────────────────────────────────────────────┐
   │  C R I B B A G E   M A T C H                 Target: 121  [Long Game]  │
   ├────────────────────────────────────────────────────────────────────────┤
   │  YOU:  42 pts  [● Front: 42 | ○ Rear: 38]     Dealer: Opponent         │
   │  ╔══════════════════════════════════════════════════════════════════╗  │
   │  ║ 01 ── 05 ── 10 ── 15 ── 20 ── 25 ── 30 ── 35 ── 40 ●─ 45 ── 50 ║  │
   │  ║ 61 ── 65 ── 70 ── 75 ── 80 ── 85 ── 90 ── 95 ──100 ──105 ──120 ║  │
   │  ╚══════════════════════════════════════════════════════════════════╝  │
   │  OPP:  36 pts  [● Front: 36 | ○ Rear: 31]                              │
   ├────────────────────────────────────────────────────────────────────────┤
   │  Starter: [ 🂵 5♦ ]      Count: 23 / 31                                 │
   │  Pegging Track: [ 🂪 10♠ ] -> [ 🂷 7♣ ] -> [ 🂶 6♥ (15-2!) ]              │
   │                                                                        │
   │  Your Hand:  [1] 🂪 10♦    [2] 🂸 8♠    [3] 🂱 A♥                        │
   │  Play card (1-3 or name): > 2                                          │
   └────────────────────────────────────────────────────────────────────────┘
```

- **Unicode Wood Pegboard:** Render dual continuous 120-hole wooden tracks with polished box-drawing
  borders, brass peg indicators (`●`, `○`), and distinct milestone flags at 30, 60, 90 (skunk), and 120.
- **Unicode Playing Cards:** Render authentic card suits (`♠`, `♥`, `♦`, `♣`) with standard red/white/black
  terminal ANSI color styling, or full 2-line mini card glyphs.
- **Haptic & Audio Feedback:** Optional subtle terminal audio or GUI sound effects: wooden peg placement
  clacks, deck shuffle swish, and card snap.

---

## 3. Internet & Local Multiplayer

1. **Hot-Seat Pass & Play:** Allows two human players on a single laptop/terminal with screen-clearing
   or card-hiding between hand views.
2. **WebSocket Matchmaking:** Direct peer-to-peer or server-brokered multiplayer with room codes:
   - Synchronized pegboard animation.
   - Configurable turn timer (e.g., 30-second discard and 15-second pegging clock).
   - Spectator mode with live win-probability gauges.

---

## 4. Persistence & Statistics

- **Historical Performance Ledger:** Track lifetime stats: wins, losses, skunks dealt, skunks suffered,
  highest hand scored (aiming for the elusive 29-pointer!), and average pegging yield per hand.
- **Match Replay / PGNDump:** Export matches in a standardized notation for review or study.

---

## 5. What NOT to Change (Core Identity)

- **The Strict 121 / 61 Target:** Never replace the traditional point thresholds with arbitrary limits.
- **Counting Order Priority:** Non-dealer counts hand **first**, dealer counts hand **second**, dealer
  counts crib **third**. Immediate termination upon hitting 121 must remain inviolate.
- **Scoring Formulas:** 15s (2), pairs (2), runs (1/card), flushes (4/5), nobs (1), and heels (2).
- **Pegging Limit of 31:** The 31-count invariant is the mathematical foundation of cribbage.

---

## 6. Open Questions for Discussion

1. *Should Muggins be enabled in online ranked matches or restricted to casual fun?*
2. *Should we provide a "Pegboard Customizer" allowing players to select classic 3-track boards,
   triangular boards, or custom wood stains?*
