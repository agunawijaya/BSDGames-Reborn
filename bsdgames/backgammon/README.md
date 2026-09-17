# Backgammon — BSDGames Reborn

A faithful modernization and pedagogical study of the classic BSD terminal
board game **Backgammon** (and its companion interactive tutor **Teachgammon**),
originally written in 1980 by **Alan Char** at the University of California, Berkeley.

---

## 1. Quick Start

```bash
# Play original BSDGames Backgammon (requires bsdgames package on Linux/WSL)
backgammon               # Play a match against the computer
backgammon -n            # Start immediately without asking for instructions
backgammon -pr           # Play as Red (moving points 1 -> 24)
backgammon -pw           # Play as White (moving points 24 -> 1)
backgammon -pb           # Two-player hot-seat match (human vs human)
teachgammon              # Launch the interactive tutorial and practice match
```

---

## 2. Directory Structure

```
bsdgames/backgammon/
├── README.md              # THIS FILE — Landing page & directory map
├── AGENTS.md              # Agent instructions & context for this game
├── CLAUDE.md              # Thin pointer to AGENTS.md
├── docs/
│   ├── about.md           # 5,000-year history, Alan Char (1980), Teachgammon, screenshots
│   ├── how-to-play.md     # Board layout, point notation (s-f, s/r), hitting, bearing off, doubling
│   ├── spec.md            # Reverse specification: 30-checker inventory, board[26] model, invariants
│   ├── architecture.md    # Modular architecture: main, common_source, teachgammon, odds engine
│   ├── lessons.md         # Pedagogical analysis: board duality (-1 vs +1), termcap cursor optimization
│   ├── port-ideas.md      # Modernization roadmap: Unicode triangle board, TD-Gammon neural AI, online MP
│   ├── diff-log.md        # Original 1980 C vs modern spiritual successor
│   ├── notes.md           # 36 dice outcome matrix, blot hitting probabilities, pip equity formulas
│   ├── manpage.md         # Annotated mirror of backgammon(6) and teachgammon
│   ├── lineage.md         # Heritage: Royal Game of Ur (2600 BCE) -> Tables -> BSD -> TD-Gammon -> GnuBG
│   ├── test-scenarios.md  # Blot hitting & re-entry, bearing off, doubling cube, gammon/backgammon tests
│   ├── references.md      # Magriel, Jacoby, USENIX, CSRG Berkeley citations
│   └── decisions/         # Per-game Architecture Decision Records (ADRs)
│       └── README.md      # ADR index and scope
└── media/                 # Raw terminal captures and board layouts
    ├── 01-board.txt       # Initial starting layout (points 1-24, bar, home)
    ├── 02-doubling.txt    # Doubling cube challenge sequence (1 -> 2 -> 4 -> ...)
    └── 03-bearoff.txt     # Endgame bearing off and victory condition
```

---

## 3. The Game at a Glance

- **Genre:** Two-Player Board Game of Race, Probability, and Doubling Strategy.
- **Historic Roots:** Traced back 5,000 years to the *Royal Game of Ur* in Mesopotamia and Roman *Tabula*. Modern doubling cube invented in 1920s New York.
- **BSD Author:** Alan Char (University of California, Berkeley CSRG, 1980).
- **Historic Milestone:** One of the earliest UNIX board games to feature an integrated interactive tutorial program (`teachgammon`) and a modular probability calculator (`odds.c`) that dynamically evaluated dice rolls and hitting odds on character terminals.
- **Core Loop:** Race 15 checkers around a 24-point board into your home board, hit vulnerable opponent single checkers (*blots*) to the bar, bear off all checkers, and strategically employ the **Doubling Cube** ($1 \dots 64$) to maximize match points across regular wins (1x), Gammons (2x), and Backgammons (3x).

---

## 4. Upstream Source Reference

The original BSD C source is available in the upstream repository:
- Repository: [vattam/BSDGames](https://github.com/vattam/BSDGames)
- Source folder: [`vattam/BSDGames/tree/master/backgammon`](https://github.com/vattam/BSDGames/tree/master/backgammon)
