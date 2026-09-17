# AGENTS.md — `wump` (BSDGames Reborn)

This file provides context for AI agents and human contributors working specifically on the port of **`wump`**.

For repository-wide instructions, see the **root [`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Puzzle & Word Games (deductive spatial puzzle)
- **One-line description:** Hunt the Wumpus — procedural cave traversal using sensory clues (stench, drafts, rustling) to locate hazards and blind-shoot crooked arrows into the Wumpus's lair.
- **Upstream source:** <https://github.com/vattam/BSDGames/tree/master/wump>

## 2. Port Status

- **Current status:** 🟠 In Progress (Documentation & Specification Phase) — mirror [`../../docs/progress.md`](../../docs/progress.md).
- **Owner:** AntiGravity & Agun
- **Baseline released?** No (documentation complete; waiting for language/platform consensus before implementation).

## 3. Folder Contents

```
wump/
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
├── data/             Game assets / text
├── media/            Screenshots, diagrams, ASCIInema casts
└── tests/            Automated test suites
```

## 4. Design Decisions Specific to `wump`

*If any root defaults have been overridden for this game, they appear as ADRs in [`docs/decisions/`](./docs/decisions/). Silence = defer to root defaults.*

- *(No per-game overrides yet; following root ADR-001 through ADR-004.)*

## 5. Gotchas & Non-Obvious Notes

- **Cave Topology is Not Fixed:** Unlike Gregory Yob's original 1973 BASIC version which used a fixed 20-vertex dodecahedral graph, Dave Taylor's BSD implementation dynamically creates a randomized graph using a coprime hop delta (`gcd(room_num, delta + 1) == 1`) to ensure Hamiltonian connectivity, followed by randomized cross-room chords.
- **Asymmetric / One-Way Tunnels Exist:** The linking logic in `cave_init()` (`wump.c:568-592`) allows directional links that do not necessarily have reciprocal return tunnels, which is also alluded to in the manpage ("tunnels that go from one room to another, but not necessarily back!").
- **Magic Tunnel Artifact:** Entering room `room_num + 1` triggers a "magic tunnel" that teleports the player (`jump()`) to a random room.
- **Sensory Reach Difference:** Bats and bottomless pits are sensed strictly 1 room away (`bats_nearby()`, `pit_nearby()`). The Wumpus stench radiates up to **2 rooms away** (`wump_nearby()`, checking distance 1 and distance 2 tunnel hops).
- **Arrow Ricochet & Failure Probabilities:** Arrows don't just stop if an invalid room number is typed; they randomly divert into an available tunnel. Furthermore, shooting 3 or 4 rooms away triggers bowstring snap or flight decay checks.
- **Pit Survival Chance:** Stepping into a pit is not a guaranteed instant death: there is a 2 in 12 (~16.67%) chance the explorer clings to a rocky outcrop (`pit_survive()`).

## 6. Workflow

Follow the standard 14-step workflow documented in [`../../docs/porting-guide.md`](../../docs/porting-guide.md).
Do not start coding until the owner explicitly greenlights the implementation phase and ADR decisions.
