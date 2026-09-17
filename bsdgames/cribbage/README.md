# Cribbage — BSDGames Reborn

A faithful modernization and pedagogical study of the classic BSD terminal
card game **Cribbage**, originally written in 1980 by **Earl T. Cohen** (game
logic and AI) and **Ken Arnold** (visual pegboard interface using `curses`).

---

## 1. Quick Start

```bash
# Play original BSDGames Cribbage (requires bsdgames package on Linux/WSL)
cribbage          # Standard 121-point match (twice around the board)
cribbage -e       # Explain scoring mistakes (learning mode)
cribbage -r       # Random cut (skips manual prompt for cut card index)
cribbage -q       # Quiet / compact prompts
```

---

## 2. Directory Structure

```
bsdgames/cribbage/
├── README.md              # THIS FILE — Landing page & directory map
├── AGENTS.md              # Agent instructions & context for this game
├── CLAUDE.md              # Thin pointer to AGENTS.md
├── docs/
│   ├── about.md           # History, authors (Cohen & Arnold), Suckling lore, screenshots
│   ├── how-to-play.md     # Rules, pegging, scoring, card input syntax, options
│   ├── spec.md            # Reverse specification: 52-card inventory, state machine, scoring
│   ├── architecture.md    # Curses layout, game loop, pegging & discard heuristics
│   ├── lessons.md         # Pedagogical analysis: early curses UI, card evaluation, parser
│   ├── port-ideas.md      # Modernization roadmap: Unicode wood board, online MP, AI tiers
│   ├── diff-log.md        # Original 1980 C vs modern spiritual successor
│   ├── notes.md           # Pegboard coordinate matrix, score log files, design thoughts
│   ├── manpage.md         # Annotated mirror of cribbage(6) manual page
│   ├── lineage.md         # History from 17th-century Noddy to digital card classics
│   ├── test-scenarios.md  # 29-point hand, pegging 31, short/long game sign-off scripts
│   ├── references.md      # Primary sources, Hoyle rules, BSD source citations
│   └── decisions/         # Per-game Architecture Decision Records (ADRs)
│       └── README.md      # ADR index and scope
└── media/                 # Raw terminal captures and board screenshots
    ├── 01-pegboard.txt    # Opening board state
    ├── 02-hand.txt        # Active hand evaluation and pegging
    └── 03-win.txt         # Victory screen / pegging out
```

---

## 3. The Game at a Glance

- **Genre:** Traditional English 2-player Card Game with Pegboard Tracking.
- **Invented:** ~1630 by poet Sir John Suckling (derived from *Noddy*).
- **BSD Authors:** Earl T. Cohen & Ken Arnold (University of California, Berkeley, 1980).
- **Historic Milestone:** One of the very first interactive board/card games built on Ken Arnold's revolutionary `curses` library, rendering an ASCII wooden pegboard with dual 30-hole tracks, skunk lines, and running totals in real time.
- **Goal:** Be the first player to peg 121 points (standard long game) or 61 points (short game) through pegging play and hand combinations (fifteens, pairs, runs, flushes, and nobs).

---

## 4. Upstream Source Reference

The original BSD C source is available in the upstream repository:
- Repository: [vattam/BSDGames](https://github.com/vattam/BSDGames)
- Source folder: [`vattam/BSDGames/tree/master/cribbage`](https://github.com/vattam/BSDGames/tree/master/cribbage)
