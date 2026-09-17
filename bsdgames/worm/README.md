# Worm — BSDGames Reborn

A faithful modernization and pedagogical study of the classic BSD terminal
arcade game **Worm**, originally written in 1980 by **Michael Toy** (co-creator
of *Rogue*) at the University of California, Santa Cruz and UC Berkeley.

---

## 1. Quick Start

```bash
# Play original BSDGames Worm (requires bsdgames package on Linux/WSL)
worm              # Launch standard game with default starting length (7 segments)
worm 15           # Start with custom initial length (15 segments)
```

---

## 2. Directory Structure

```
bsdgames/worm/
├── README.md              # THIS FILE — Landing page & directory map
├── AGENTS.md              # Agent instructions & context for this game
├── CLAUDE.md              # Thin pointer to AGENTS.md
├── docs/
│   ├── about.md           # History, Michael Toy (1980), Rogue connection, screenshots
│   ├── how-to-play.md     # Controls (hjkl/arrows), sprint keys (HJKL), digit food (1-9), scoring
│   ├── spec.md            # Reverse specification: doubly-linked list model, entity inventory, invariants
│   ├── architecture.md    # Real-time SIGALRM loop, curses winch() collision engine, screen windows
│   ├── lessons.md         # Pedagogical analysis: O(1) doubly linked FIFO queue, screen-buffer collision
│   ├── port-ideas.md      # Modernization roadmap: variable speed curves, Unicode graphics, Slither.io MP
│   ├── diff-log.md        # Original 1980 C vs modern spiritual successor
│   ├── notes.md           # Screen coordinate bounds, memory allocation lifecycle, digit probability
│   ├── manpage.md         # Annotated mirror of worm(6) manual page
│   ├── lineage.md         # Heritage from Blockade (1976) to BSD Worm to Nibbles to Nokia Snake
│   ├── test-scenarios.md  # Digit eating & growth, sprint stop, wall & self-collision test scripts
│   ├── references.md      # Primary sources, Michael Toy citations, CSRG Berkeley archives
│   └── decisions/         # Per-game Architecture Decision Records (ADRs)
│       └── README.md      # ADR index and scope
└── media/                 # Raw terminal captures and arena layouts
    ├── 01-start.txt       # Initial starting state with length 7 worm and first food digit
    ├── 02-growth.txt      # Mid-game state showing elongated body and multiple eaten digits
    └── 03-crash.txt       # Game over state displaying collision and final score
```

---

## 3. The Game at a Glance

- **Genre:** Real-Time Terminal Arcade / Growing Snake Game.
- **Author:** Michael Toy (University of California, Santa Cruz / UC Berkeley, 1980).
- **Historic Milestone:** Preceded Michael Toy's work on *Rogue* (with Ken Arnold and Glenn Wichman). One of the earliest real-time action games on BSD UNIX utilizing asynchronous terminal input paired with `SIGALRM` timer interrupts.
- **Core Loop:** Guide your worm's head (`@`) across a walled terminal arena using `hjkl` or arrow keys. Eat randomly spawned food digits (`1` through `9`). Each digit eaten increases your score and causes the worm's body (`o`) to grow longer by that exact number of segments. The game ends the instant your head collides with the outer boundary walls (`*`) or your own trailing body!

---

## 4. Upstream Source Reference

The original BSD C source is available in the upstream repository:
- Repository: [vattam/BSDGames](https://github.com/vattam/BSDGames)
- Source folder: [`vattam/BSDGames/tree/master/worm`](https://github.com/vattam/BSDGames/tree/master/worm)
