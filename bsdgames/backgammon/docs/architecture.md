# Backgammon — Original Code Architecture

A technical deep-dive into the modular multi-program architecture, board representation duality,
real-time odds calculation engine, and termcap screen renderer in BSD `backgammon`.

---

## 1. Upstream Module Map

The original C source code is located in [`vattam/BSDGames/tree/master/backgammon`](https://github.com/vattam/BSDGames/tree/master/backgammon):

```
vattam/BSDGames/tree/master/backgammon/
├── common_source/          # Shared board engine and terminal primitives
│   ├── back.h              # Global structs, board[26] array, macros (swap, rnum)
│   ├── board.c             # Full-screen ASCII board renderer (wrboard, wrbsub)
│   ├── fancy.c             # High-speed cursor addressing using termcap (fboard)
│   ├── check.c             # Legal move verification (checkmove, movokay)
│   ├── allow.c             # Move generation and permutation generator (movallow)
│   ├── odds.c              # Dynamic hitting probability calculator (odds, count)
│   ├── table.c             # 6x6 odds lookup table for 36 dice outcomes
│   ├── one.c               # Single checker movement primitives (backone)
│   ├── subs.c              # Utility string and I/O subroutines
│   └── save.c              # Save and recover game state routines
│
├── backgammon/             # Main interactive match binary
│   ├── main.c              # Entry point, flag parsing (-pr/-pw/-pb), top-level turn loop
│   ├── move.c              # Human move parsing and AI move generator (makmove)
│   ├── extra.c             # Doubling cube logic and game value handling
│   ├── text.c              # Help text and in-game prompt strings
│   └── backlocal.h         # Local macros and message buffers
│
└── teachgammon/            # Interactive tutorial program
    ├── teach.c             # Tutorial driver and stage sequencing
    ├── tutor.c             # Interactive question-and-answer validator
    ├── ttext1.c            # Tutorial lessons: rules, board quadrants, movement
    ├── ttext2.c            # Advanced lessons: bearing off, doubling cube, strategy
    └── data.c              # Pre-scripted tutorial board layouts and moves
```

---

## 2. Main Game Loop Control Flow

```mermaid
flowchart TD
    START(["Launch backgammon"]) --> INIT["Initialize termcap & TTY raw mode<br/>main.c:54 / fancy.c:getcaps()"]
    INIT --> CHECK_FLAGS{"CLI Flags<br/>(-pr, -pw, -pb)?"}
    CHECK_FLAGS --> SET_PLAYERS["Set Player Roles & Colors<br/>pnum: -1 (White), 1 (Red), 0 (Both)"]
    SET_PLAYERS --> CHECK_RULES{"Prompt: Want Rules?<br/>aflag"}
    CHECK_RULES -->|Yes| EXEC_TEACH["Execv teachgammon<br/>main.c:125"]
    CHECK_RULES -->|No| RESET_BOARD["Reset Board to Starting Position<br/>init.c:init()"]
    
    subgraph MATCH_LOOP ["Match & Turn Loop"]
        OPEN_ROLL["Roll for Opening Move<br/>Higher roll moves first"] --> TURN_START
        
        TURN_START["Active Player Turn Begins<br/>cturn: Red (1) or White (-1)"] --> DOUBLE_CHECK{"Offer Double?<br/>(if cube available)"}
        DOUBLE_CHECK -->|Double Offered| OPP_DOUBLE{"Opponent Accepts?<br/>(extra.c:checkd)"}
        OPP_DOUBLE -->|Declined| CONCEDE["Opponent Concedes!<br/>Winner receives gvalue pts"]
        OPP_DOUBLE -->|Accepted| DOUBLE_VAL["gvalue = gvalue * 2<br/>dlast = opponent"]
        DOUBLE_VAL --> ROLL_DICE
        DOUBLE_CHECK -->|No Double| ROLL_DICE["Roll 2 Dice<br/>rnum(6) + 1"]
        
        ROLL_DICE --> GEN_MOVES["Calculate Legal Moves<br/>allow.c:movallow()"]
        GEN_MOVES --> CHECK_MOVES{"Any Legal Moves?"}
        CHECK_MOVES -->|No Moves Possible| PASS_TURN["Forced Pass (Turn Ends)"]
        CHECK_MOVES -->|Moves Available| EXEC_MOVE{"Human or AI?"}
        
        EXEC_MOVE -->|Human| INPUT_MOVE["Parse Input (s-f or s/r)<br/>move.c:getmove()"]
        EXEC_MOVE -->|Computer AI| AI_MOVE["Heuristic Move Selection<br/>move.c:makmove()"]
        
        INPUT_MOVE --> APPLY_MOVE["Update board[26] & Check Hits<br/>check.c:checkmove()"]
        AI_MOVE --> APPLY_MOVE
        
        APPLY_MOVE --> CHECK_BEAR_WIN{"off[player] == 15?"}
        CHECK_BEAR_WIN -->|Yes| EVAL_TIER["Evaluate Win Multiplier<br/>(Regular 1x, Gammon 2x, Backgammon 3x)"]
        CHECK_BEAR_WIN -->|No| TOGGLE_TURN["cturn = -cturn<br/>Swap Active Player"]
        PASS_TURN --> TOGGLE_TURN
        TOGGLE_TURN --> TURN_START
    end
    
    EVAL_TIER --> TALLY_SCORE["Add (gvalue * multiplier) to Score"]
    TALLY_SCORE --> PROMPT_REMATCH{"Play Another Game?<br/>[y/n]"}
    PROMPT_REMATCH -->|Yes| RESET_BOARD
    PROMPT_REMATCH -->|No| END(["Exit Program"])
    CONCEDE --> TALLY_SCORE
```

---

## 3. The `board[26]` Representation Duality (`back.h`)

Alan Char utilized an elegant mathematical convention in `board[26]`
([`back.h:53-62`](https://github.com/vattam/BSDGames/tree/master/backgammon/common_source/back.h#L53)):
- **Sign represents color:**
  - Positive numbers ($+n$) = $n$ **Red** checkers.
  - Negative numbers ($-n$) = $n$ **White** checkers.
  - Zero ($0$) = Empty point.
- **Direction aligns with signs:**
  - Red moves in **ascending** order ($1 \rightarrow 24$).
  - White moves in **descending** order ($24 \rightarrow 1$).
- **Boundary points encode Bar and Home:**
  - `board[0]` = Red's Bar / White's Home.
  - `board[25]` = White's Bar / Red's Home.

This symmetry allowed a single movement loop in `check.c` to handle both players simply by
multiplying board indices by the player's sign `cturn` ($\pm 1$).

---

## 4. Real-Time Odds Engine (`odds.c` & `table.c`)

In [`common_source/odds.c:30`](https://github.com/vattam/BSDGames/tree/master/backgammon/common_source/odds.c#L30),
BSD Backgammon calculates exact mathematical hitting probabilities across all 36 combinations of two dice:
- `table[6][6]`: Lookup matrix containing all 36 dice rolls.
- Given a blot at distance $d \in [1, 24]$, `odds.c:count()` iterates over all 36 outcomes, checking
  if direct rolls ($r_1 = d$ or $r_2 = d$), additive combinations ($r_1 + r_2 = d$), or doublets
  can hit the blot without being blocked by intervening opponent anchor points.

---

## 5. Alan Char's 1980 AI Strategy Engine (`move.c`)

The computer AI in `move.c:makmove()` ([`move.c:120`](https://github.com/vattam/BSDGames/tree/master/backgammon/backgammon/move.c#L120))
relies on a 1-ply greedy static evaluation function:
1. **Hitting Priority:** If any legal move hits an opponent blot, execute it immediately.
2. **Safe Anchor Creation:** If a move allows pairing two checkers on an open point (making an anchor),
   prioritize it to eliminate blots.
3. **Running Priority:** Advance the furthest trailing checkers forward to reduce pip distance.
4. **Blot Minimization:** Heavily penalize moves that leave single blots within direct hitting distance
   (1–6 points) of opponent checkers.

While basic by modern neural network standards (as Char famously noted in the manual page), the engine
plays competent, rapid moves suitable for beginners.

---

## 6. High-Speed Termcap Screen Management (`fancy.c`)

Rather than relying on `curses`, Alan Char implemented a custom terminal optimization module using
raw `termcap` capabilities (`cm` for cursor motion, `cl` for clear screen):
- `fboard()` ([`fancy.c:45`](https://github.com/vattam/BSDGames/tree/master/backgammon/common_source/fancy.c#L45)):
  Pre-computes row and column offsets for all 24 points.
- Only points that have changed since the last turn are redrawn, transmitting minimal escape sequences
  over serial connections.
