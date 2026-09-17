# `wump` — Port Design Ideas & Modernisation Brainstorm

> **Spiritual Successor Blueprint.** Exploring how *Hunt the Wumpus* can be elevated
> into a compelling modern puzzle game while retaining its pure deductive heart.

---

## Guiding Question

> *If Hunt the Wumpus were being designed today—with no hardware limitations, rich TUI/graphical frameworks, networked multiplayer, and 50 years of game design evolution—what would it look like?*

---

## 1. Gameplay Modernisation

### Upgraded Creature AI: The Stalking Wumpus
- **Current Behavior:** The Wumpus sits dormant until startled by a missed arrow or a player bumping into a wall, at which point it wanders blindly to an adjacent room.
- **Modern AI Ideas:**
  - **Scent & Sound Tracking:** When startled, the Wumpus doesn't wander randomly; it performs an A* or Dijkstra gradient walk toward the source of the noise (the player's last shot or wall collision).
  - **Aggression Modes:**
    - *Slumbering:* Stationary; heavy stench emitted.
    - *Stalking:* Slow, deliberate patrol along peripheral loops; fainter scent, heavier footsteps.
    - *Enraged:* Triggers when wounded or down to the player's last arrow; moves 1 room every turn directly toward the player.
  - **Wumpus Hunger / Migration:** On prolonged games, the Wumpus wakes up naturally after $K$ turns to hunt for bats, adding subtle time pressure.

### Expanded Mechanics & Tools
- **Auto-Cartography System:** The original required physical scrap paper. A modern port should feature an **in-terminal dynamic graph visualizer** that automatically renders visited rooms, known tunnels, and suspected hazard zones using box-drawing characters or graph layout algorithms (Fruchterman-Reingold).
- **Arrow Types:**
  - *Standard Magic Arrow:* 1-hit kill, bouncy, ricochet hazard.
  - *Flare Arrow:* Illuminates up to 2 rooms, revealing bats or pits without disturbing the Wumpus, but is consumed.
  - *Sonar Arrow:* Empties a dull whistle; echoes back the degree and distance of nearby chambers.
- **Bat Ecology:**
  - Bats are disturbed by flare arrows and loud noises. Players could deliberately shoot a flare into a bat room to disperse them into neighboring corridors, creating tactical chaos.

### Cave Topologies as Game Modes
- **Classic Dodecahedron:** Gregory Yob's iconic 1973 20-room symmetric graph.
- **BSD Procedural:** Dave Taylor's coprime $\gcd$ dynamic graph.
- **Non-Orientable Caves:** Mobius strip and Klein bottle topologies where directional parity flips after traversing certain tunnels!
- **3D Hyper-Dodecahedron (120-cell):** For hardcore puzzle solvers, a 4D polytope projected into rooms.

---

## 2. UI / UX Design

### Visual Direction: Neo-Retro Cyber-Chamber
- **Palette:** Phosphor green on deep obsidian black (amber or monochrome CRT modes available).
- **Typography:** Monospaced, high-legibility Unicode box characters (`╭─╮`, `╰─╯`, `◈`, `◆`, `◇`).
- **Dynamic Atmosphere:** Subtle ANSI particle effects simulating falling cavern dust or fluttering bat wings.

### Multi-Pane Terminal Layout

```
┌──────────────────────────────────────┬──────────────────────────────┐
│  CAVE TOPOLOGY MAP (Dynamic Graph)  │ SENSORY STATUS               │
│                                      │                              │
│       [02] ─── [03] ─── [10]         │ Room: 12      Quiver: 🏹🏹🏹 │
│        │        │        │           │                              │
│       [01] ─── [04]* ── [14]!        │ Warnings:                    │
│        │        │                    │ 👃 Stench: Strong (<= 2 rms) │
│       [05] ─── [06] ─── [15]?        │ 💨 Draft:  Cold air nearby!  │
│                                      │ 🦇 Sounds: Distant squeaks   │
│  Legend:                             ├──────────────────────────────┤
│  [*] Player  [!] Pit  [?] Suspect    │ TURN LOG                     │
│                                      │ > Moved from Room 4 to 12.   │
├──────────────────────────────────────┤ > Cold draft felt from north.│
│ COMMAND CONSOLE                      │                              │
│ [m]ove <room>  [s]hoot <path>  [q]uit│                              │
│ > s 15 _____________________________ │                              │
└──────────────────────────────────────┴──────────────────────────────┘
```

### Audio & Soundscape (TUI / CLI Audio Support)
- Low-frequency ambient cave drone.
- Directional stereo audio cues:
  - Wind whistle (`*whoosh*`) panned left or right depending on the tunnel index.
  - Ultrasonic bat chatter (`*rustle*`).
  - Deep resonant breathing of the Wumpus.

---

## 3. Internet & Local Multiplayer

### Cooperative Expedition (2–4 Players)
- Multiple hunters enter different corners of the cavern network.
- **Shared Senses:** Players can radio each other with sensory reports ("I smell him from 14!").
- **Friendly Fire Hazard:** Magic arrows navigate tunnels blindly—players must coordinate shot vectors to avoid shooting each other across the cave!

### Asymmetric 1v1: Hunter vs. The Wumpus
- One player controls the Archer (relying on sensory reports and limited arrows).
- The other player **controls the Wumpus**!
  - The Wumpus has night vision and can move 1 room every 2 turns.
  - The Wumpus leaves a scent trail behind it and must evade arrows while stalking the archer into a corner.

---

## 4. Persistence & Daily Challenge

- **Daily Seed Challenge:** Every 24 hours, a global seed generates a unique cavern layout identical for all players worldwide.
- **Leaderboards & Metrics:**
  - Ranked by: *Fewest turns to kill*, *Fewest arrows expended*, *Zero bats triggered*, *Zero pit near-misses*.
- **Local Replay Logging:** Export games as compact JSON files that can be replayed turn-by-turn or shared with other puzzle enthusiasts.

---

## 5. Accessibility

- **Screen Reader Compatibility:** An explicit `--screen-reader` mode that emits clear, unadorned linear text transcripts without ASCII art boxes or ANSI escape codes.
- **High-Contrast Themes:** Colorblind-safe palettes (Deuteranopia, Protanopia, Tritanopia).
- **Textual Intensity Levels:** Textual indicators (e.g. `[HAZARD: PIT DETECTED]` alongside `*whoosh*`) to assist players with sensory processing preferences.

---

## 6. What NOT to Change

The mechanic identity of `wump` that must be preserved for the port
to still be *Hunt the Wumpus*:

- **Deductive-by-sensory-cue core.** Players learn the world only
  through indirect information (stench, draft, rustle). Do not add
  a first-person "you can see the room" view in default mode.
- **Two-hop stench, one-hop bat/pit.** These distances are
  mechanically load-bearing; changing them destroys the deductive
  triangulation gameplay.
- **Arrows travel through tunnels, not straight lines.** Crooked
  arrows are the defining combat mechanic.
- **Bats teleport player randomly.** Not deterministic escort.
- **Pits are (mostly) instant death** with a small outcrop survival
  chance. Do not soften.
- **Graph topology (not grid) as the world model.** The world is a
  set of connected rooms, not a coordinate space.
- **Wumpus wakes and moves on missed shots.** The `lastchance`
  tension escalation must survive.

---

## 7. Open Questions

Design decisions raised by this brainstorm that need per-game ADRs
before implementation:

- Should auto-cartography be **default on**, **default off**, or
  **unlockable after N wins**? Default-on removes a core historical
  challenge (paper mapping); default-off makes the port
  inaccessible to new players.
- Should Wumpus AI variants (Slumbering / Stalking / Enraged) be a
  runtime setting, a difficulty tier, or a "modern mode" toggle?
- Should non-Orientable Cave topologies (Möbius, Klein, 4D
  120-cell) ship in v1 or as post-launch content pack?
- For asymmetric 1v1 (Hunter vs. Wumpus), what's the anti-cheating
  model? The Wumpus player has full-map knowledge by definition.
- Should shot-by-shot arrow trajectory be visible to the player
  post-hoc (animated flight through rooms) or remain opaque?

Each of these → a separate ADR in
[`./decisions/`](./decisions/).
