# Mille — BSDGames Reborn

A faithful modernization and pedagogical study of the classic BSD terminal
card game **Mille** (based on *Mille Bornes*), originally written in 1982 by
**Ken Arnold** at the University of California, Berkeley.

---

## 1. Quick Start

```bash
# Play original BSDGames Mille (requires bsdgames package on Linux/WSL)
mille             # Start a standard 5,000-point match against the computer
mille -r          # Restore a saved game session
```

---

## 2. Directory Structure

```
bsdgames/mille/
├── README.md              # THIS FILE — Landing page & directory map
├── AGENTS.md              # Agent instructions & context for this game
├── CLAUDE.md              # Thin pointer to AGENTS.md
├── docs/
│   ├── about.md           # History, Edmond Dujardin (1954), Ken Arnold (1982), screenshots
│   ├── how-to-play.md     # Rules, Coup-fourré, board layout, commands, scoring bonuses
│   ├── spec.md            # Reverse specification: 101-card inventory, state variables, invariants
│   ├── architecture.md    # Multi-window curses layout, AI heuristics (comp.c), save engine
│   ├── lessons.md         # Pedagogical analysis: early split-window curses, reactive interrupts
│   ├── port-ideas.md      # Modernization roadmap: Art Deco card graphics, online 4-player, AI tiers
│   ├── diff-log.md        # Original 1982 C vs modern spiritual successor
│   ├── notes.md           # Deck probability distribution, window coordinates, AI card valuation
│   ├── manpage.md         # Annotated mirror of mille(6) manual page
│   ├── lineage.md         # Heritage from Touring (1906) to Mille Bornes (1954) to digital racers
│   ├── test-scenarios.md  # Coup-fourré, Extension, Shut-Out, Delayed Action verification scripts
│   ├── references.md      # Primary sources, Parker Brothers patents, USENIX citations
│   └── decisions/         # Per-game Architecture Decision Records (ADRs)
│       └── README.md      # ADR index and scope
└── media/                 # Raw terminal captures and layout screens
    ├── 01-board.txt       # Initial game layout (Hand, Battle, Speed, Mileage)
    ├── 02-battle.txt      # Mid-game hazard battle & Coup-fourré exchange
    └── 03-score.txt       # End-of-hand scoring window and match summary
```

---

## 3. The Game at a Glance

- **Genre:** Road Race Card Game (French: *Mille Bornes* = "A Thousand Milestones").
- **Original Creator:** Edmond Dujardin (France, 1954); licensed by Parker Brothers (1962).
- **BSD Author:** Ken Arnold (University of California, Berkeley, 1982).
- **Historic Milestone:** One of the earliest multi-window terminal applications, dividing the screen into three independent curses windows (`Board`, `Miles`, `Score`) to render an animated French auto race on 80×24 CRT displays.
- **Core Loop:** Race to lay down exactly **700 miles** (or take an **Extension to 1,000 miles**) before your opponent does, using Hazard cards (*Out of Gas*, *Flat Tire*, *Accident*, *Speed Limit*, *Stop*) to sabotage them while deploying Remedy and permanent Safety cards to defend your car. Accumulate points across hands to reach the grand goal of **5,000 match points**.
- **Signature Mechanic:** The **Coup-fourré** — an immediate reactive interrupt played when an opponent attacks you with a Hazard, parrying their strike, earning permanent immunity, and banking a huge **+300 point bonus**.

---

## 4. Upstream Source Reference

The original BSD C source is available in the upstream repository:
- Repository: [vattam/BSDGames](https://github.com/vattam/BSDGames)
- Source folder: [`vattam/BSDGames/tree/master/mille`](https://github.com/vattam/BSDGames/tree/master/mille)
