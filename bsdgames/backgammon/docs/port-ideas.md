# Backgammon — Port Modernization Ideas

Brainstorming architectural enhancements, visual overhauls, and modern AI integrations for the
modern spiritual successor of BSD Backgammon.

---

## 1. Gameplay & AI Modernization

### Tiered Artificial Intelligence
As Alan Char noted in 1980, the original heuristics were elementary. A modern successor should offer
three distinct AI difficulty tiers:
1. **Classic Apprentice (1980 Heuristic):** Preserves Alan Char's original 1-ply rule engine
   (`move.c`). Quick, aggressive at hitting blots, but prone to tactical blunders.
2. **Intermediate Club Player (Minimax 2-Ply with Equity Heuristics):** Evaluates moves using
   pip count differentials, anchor security, prime strength, and exact 36-outcome hitting odds.
3. **Grandmaster (Neural Network / TD-Gammon / GNU Backgammon Engine):** Employs a modern
   neural network trained on self-play reinforcement learning, providing world-class positional
   and doubling decisions.

### Tournament Regulations & Variant Toggles
- **Crawford Rule:** In standard tournament match play, when a player reaches match point minus one
  (e.g., 6 points in a 7-point match), the Crawford rule dictates that neither player may double
  for the next single game.
- **Jacoby Rule (Money Play Toggle):** Optional toggle where Gammons and Backgammons do not count
  as double/triple points unless the Doubling Cube has been offered and accepted during the game.
- **Manual vs. True RNG Dice:** Allow players to manually type their own physical dice rolls
  (for players using physical dice at home).

---

## 2. Visual & UI/UX Design

```
   ┌────────────────────────────────────────────────────────────────────────┐
   │  B A C K G A M M O N   M A T C H            Red: 4  White: 2   [V: 2]  │
   ├────────────────────────────────────────────────────────────────────────┤
   │   13   14   15   16   17   18   BAR   19   20   21   22   23   24      │
   │  ┌───┬───┬───┬───┬───┬───┐     ┌───┬───┬───┬───┬───┬───┐  HOME   │
   │  │ ▲ │ ▼ │ ▲ │ ▼ │ ▲ │ ▼ │     │ ▲ │ ▼ │ ▲ │ ▼ │ ▲ │ ▼ │ ┌────┐  │
   │  │ ⚪ │   │   │   │ 🔴 │   │     │ 🔴 │   │   │   │   │ ⚪ │ │    │  │
   │  │ ⚪ │   │   │   │ 🔴 │   │     │ 🔴 │   │   │   │   │ ⚪ │ │ ⚪  │  │
   │  │ ⚪ │   │   │   │ 🔴 │   │     │ 🔴 │   │   │   │   │   │ │ 0  │  │
   │  │ ⚪ │   │   │   │   │   │     │ 🔴 │   │   │   │   │   │ └────┘  │
   │  │ ⚪ │   │   │   │   │   │     │ 🔴 │   │   │   │   │   │         │
   │  │   │   │   │   │   │   │ ┌─┐ │   │   │   │   │   │   │ ┌────┐  │
   │  │   │   │   │   │   │   │ │ │ │   │   │   │   │   │   │ │    │  │
   │  │ 🔴 │   │   │   │   │ ⚪ │ │ │ │ ⚪ │   │   │   │   │ 🔴 │ │ 🔴  │  │
   │  │ 🔴 │   │   │   │   │ ⚪ │ │ │ │ ⚪ │   │   │   │   │ 🔴 │ │ 0  │  │
   │  │ 🔴 │   │   │   │ ⚪ │ ⚪ │ │ │ │ ⚪ │   │   │   │   │   │ └────┘  │
   │  │ 🔴 │   │   │   │ ⚪ │ ⚪ │ │ │ │ ⚪ │   │   │   │   │   │         │
   │  │ 🔴 │   │   │   │ ⚪ │ ⚪ │ │ │ │ ⚪ │   │   │   │   │   │         │
   │  │ ▼ │ ▲ │ ▼ │ ▲ │ ▼ │ ▲ │ └─┘ │ ▼ │ ▲ │ ▼ │ ▲ │ ▼ │ ▲ │         │
   │  └───┴───┴───┴───┴───┴───┘     └───┴───┴───┴───┴───┴───┘         │
   │   12   11   10    9    8    7          6    5    4    3    2    1      │
   ├────────────────────────────────────────────────────────────────────────┤
   │  Pip Counts:  🔴 Red: 167 pips   |   ⚪ White: 167 pips                 │
   │  Red rolls: [ ⚄ 5 ]  [ ⚂ 3 ]                                           │
   │  Enter move (e.g. 12/5 17/3) or [D]ouble, [Q]uit >                     │
   └────────────────────────────────────────────────────────────────────────┘
```

- **Unicode Triangle Points:** Render authentic alternating wood-tone triangular points (`▲` and `▼`)
  framed by double-line box border characters.
- **Checker Glyphs:** High-contrast Unicode checker disks (`🔴` and `⚪`) or retro ANSI glyphs (`(R)` and `(W)`).
- **Audio & Haptic Feedback:**
  - Rattle of wooden dice inside a leather dice cup before rolling.
  - The distinct clack of wooden checkers sliding across felt and striking an anchor.
  - Ominous snap when the Doubling Cube is offered.

---

## 3. Internet Multiplayer & Analysis

1. **WebSocket Lobby & Matchmaking:**
   - Real-time match play with configurable turn timers (Fischer-style incremental clocks).
   - Live spectator board with real-time pip count and win equity gauges.
2. **Match Export & Blunder Analysis:**
   - Export games in standardized `.mat` or `.sgf` notation for analysis in external engines
     (GNU Backgammon, eXtreme Gammon).
   - Post-game review highlighting blunders, missed doubles, and risky blot exposures.

---

## 4. Modernizing Teachgammon

Transform the 1980 `teachgammon` into a modern interactive Academy:
- **Module 1: Foundations:** Board geography, legal movement, hitting, and bearing off.
- **Module 2: Probability & Pip Counts:** Understanding the 36 dice outcomes and pip counting methods.
- **Module 3: Positional Warfare:** Prime building, anchor holding, and slotting tactics.
- **Module 4: Doubling Cube Mastery:** Calculating 25% take points and market loss thresholds.

---

## 5. What NOT to Change (Core Identity)

- **The Exact 24-Point Board Geometry:** Standard point layout, bar, and home board trays.
- **Checker Starting Distribution:** 2 on 1, 5 on 12, 3 on 17, 5 on 19 for Red (and symmetrical for White).
- **Doubling Cube Progression:** Powers of two ($2, 4, 8, 16, 32, 64$).
- **Scoring Invariants:** Regular win (1x), Gammon (2x), Backgammon (3x).

---

## 6. Open Questions for Discussion

1. *Should live pip count display be visible by default, or hidden in hardcore competitive modes?*
2. *Should we provide an auto-bear-off option for straightforward endgames to accelerate play?*
