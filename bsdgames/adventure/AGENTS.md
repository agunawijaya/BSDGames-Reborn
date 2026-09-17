# AGENTS.md — `adventure` (BSDGames Reborn)

This file provides context for AI agents and human contributors working specifically on the port of **`adventure`** (Colossal Cave Adventure).

For repository-wide instructions, see the **root [`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Adventure & RPG (Interactive Fiction / Parser Adventure)
- **One-line description:** The original *Colossal Cave Adventure* by Will Crowther & Don Woods. Ancestor of the entire interactive fiction genre.
- **Upstream source:** <https://github.com/vattam/BSDGames/tree/master/adventure>

## 2. Port Status

- **Current status:** 🟠 In Progress (Pre-port Documentation Phase) — mirror [`../../docs/progress.md`](../../docs/progress.md).
- **Owner:** AntiGravity & Agun
- **Baseline released?** No.

## 3. Folder Contents

```
adventure/
├── README.md         Landing page for this game
├── AGENTS.md         This file
├── CLAUDE.md         Thin pointer to this file
├── docs/             Comprehensive documentation set
│   ├── about.md
│   ├── how-to-play.md
│   ├── walkthrough.md
│   ├── world-map.md
│   ├── architecture.md
│   ├── lessons.md
│   ├── port-ideas.md
│   ├── spec.md
│   ├── notes.md
│   ├── manpage.md
│   ├── diff-log.md
│   ├── test-scenarios.md
│   ├── lineage.md
│   ├── references.md
│   └── decisions/    Per-game ADR overrides (if any)
├── src/              Implementation (Phase 3)
├── data/             Game data / text assets (`glorkz`)
├── media/            Screenshots, historical cave maps, asciicasts
└── tests/            Automated test suites
```

## 4. Design Decisions Specific to `adventure`

*If any root defaults have been overridden for this game, they appear as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to root defaults.*

- *(No per-game overrides yet; following root ADR-001 through ADR-004.)*

## 5. Gotchas & Non-Obvious Notes

- **5-Letter Vocabulary Truncation:** In original Fortran and Jim Gillogly's C version, words are truncated to 5 letters for vocabulary matching (`INVENTORY` $\rightarrow$ `INVEN`, `NORTHWEST` $\rightarrow$ `NW`).
- **Data File (`glorkz`):** The room descriptions, travel tables, hints, and object descriptions are compiled into or read from `glorkz`.
- **The 350-Point Benchmark:** This version is the classic Woods 350-point version (capable of 351 points if Spelunker Today is left in Witt's End).
- **Two Mazes with Subtle Distinctions:**
  1. *Maze of Twisty Little Passages, All Alike* (Rooms 42 to 57). Every room has the exact same description; navigation requires dropping inventory items to disambiguate nodes.
  2. *Maze of Twisty Little Passages, All Different* (Rooms 60 to 87). Every room has a permuted wording ("Little twisty passages, all alike", "Twisty little passages, all different", etc.).
- **Dwarf & Pirate Threat Model:** Dwarves spawn after entering the Hall of Mists. Up to 5 axe-throwing dwarves and 1 stealthy Pirate wander the cave and steal treasures.
- **The Endgame Closing Sequence:** When all 15 treasures are retrieved, the cave begins closing: magic words fail, passages collapse, and the player is transported to the Repository for a final puzzle involving the blast and emerald.
- **Wizard Hours & Suspension Delay:** `wizard.c` originally enforced a 45-minute delay after suspending (`latncy = 45`) to discourage playing during work hours.

## 6. Workflow

Follow the standard 14-step workflow documented in [`../../docs/porting-guide.md`](../../docs/porting-guide.md).
Both `walkthrough.md` and `world-map.md` are **mandatory** because `adventure` has a fixed room network.
