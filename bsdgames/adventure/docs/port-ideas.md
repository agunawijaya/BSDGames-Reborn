# `adventure` — Port Design Ideas & Modernisation Brainstorm

> **Spiritual Successor Blueprint.** Exploring how *Colossal Cave Adventure* can be elevated
> for modern players while preserving its seminal charm, historical authenticity, and puzzle rigor.

---

## Guiding Question

> *If Colossal Cave Adventure were being built today—unconstrained by 64KB PDP-11 memory, with rich multi-pane TUIs, modern natural language parsing, and ambient spatial audio—what would it become?*

---

## 1. Gameplay Modernisation

### Upgraded Command Parsing: Hybrid Dual-Engine
- **Current Limitation:** The parser is strictly two-word (`VERB NOUN`) with 5-letter word truncation.
- **Modern Solution:**
  - Support full natural language sentences: *"Take the brass lantern and unlock the iron grate with the brass keys"*.
  - Keep 100% backward compatibility with classic short commands (`TAKE LAMP`, `XYZZY`, `NW`).
  - Contextual disambiguation: If multiple items exist (e.g. `TAKE ROD` when both black and red rods exist), prompt: *"Which rod do you mean: the black rod or the red rod?"*.

### Dynamic Auto-Cartography (In-Terminal Auto-Mapper)
- In 1976, players had to spend dozens of hours drawing pencil-and-paper maps to survive the *Maze of Twisty Little Passages, All Alike*.
- A modern port should include an **optional live auto-mapping panel**:
  - Automatically draws visited chambers and connecting corridors using Unicode box-drawing characters.
  - Automatically marks known teleport routes (`XYZZY`, `PLUGH`).
  - Displays breadcrumb tokens dropped in the mazes.

### Creature AI & Stealth Mechanics
- **The Dwarves:** Rather than instant random dice rolls, give dwarves sensory sight-lines. If the player extinguishes their lantern in the dark and stays silent, dwarves might walk past unnoticed in adjacent passages.
- **The Pirate:** Allow conversational interaction or bribing the pirate with counterfeit goods rather than purely passive theft.

---

## 2. UI / UX Design

### Multi-Pane Modern TUI Layout

```
┌──────────────────────────────────────┬──────────────────────────────┐
│  COLOSSAL CAVE AUTO-MAPPER           │ ROOM DESCRIPTION             │
│                                      │                              │
│       [Building]* <==XYZZY==> [Debris]│ YOU ARE IN A SPLENDID        │
│          │                      │    │ CHAMBER THIRTY FEET HIGH.    │
│       [Valley]               [Canyon]│ A POOL OF WATER SITS IN THE  │
│          │                      │    │ CORNER.                      │
│       [Grate] ─────────────── [Bird] │                              │
│          │                           │ Obvious Exits:               │
│       [Cobble]                       │ NORTH, SOUTH, UP, DOWN       │
│                                      ├──────────────────────────────┤
│  Legend:                             │ INVENTORY & STATUS           │
│  [*] Player  [+] Item  [!] Hazard    │ Battery: [████████░░] 78%    │
│                                      │ Pack: Keys, Brass Lamp (Lit) │
├──────────────────────────────────────┴──────────────────────────────┤
│ COMMAND CONSOLE                                                     │
│ > take golden eggs ________________________________________________ │
└─────────────────────────────────────────────────────────────────────┘
```

### Ambient Soundscape
- Dynamic audio layers:
  - Deep reverberant subterranean echo.
  - Water dripping from stalactites in the Cobble Crawl.
  - Whistling wind through the fissure.
  - Distant clattering of dwarf axes on stone.

---

## 3. Internet Multiplayer: The Shared Expedition

### Collaborative Spelunking (2-4 Players)
- Up to 4 explorers descend into the cave simultaneously.
- **Inventory Cooperation:** One player carries the bird cage, while another holds the black rod across the fissure.
- **Synchronized Puzzles:** Two players standing in different rooms must pull levers or say magic words simultaneously to open deep vaults.

### Asynchronous Speedrunning & Ghost Runs
- Stream ghost markers of top-ranked runs on global leaderboards.
- Compete on categories: *Any% Exit*, *350-Point 100% Speedrun*, *Lowest Turn Count*.

---

## 4. Accessibility

- **Screen-Reader Mode (`--screen-reader`):** Emits purely sequential, clean, screen-reader-optimized prose without graphical borders or ANSI escape codes.
- **Hint Engine:** An interactive in-game hint oracle (the "Wise Old Spelunker") that provides gentle progressive nudges rather than deducting 5 points as punitive penalties.
- **Modern Save System:** Cloud synchronization, unlimited save slots, and undo/rewind capability (`undo`) to eliminate frustrating accidental fatal drops.

---

## 5. What NOT to Change

The mechanic identity of `adventure` that must be preserved for
the port to still be recognisably *Colossal Cave Adventure*:

- **The opening line.** *"You are standing at the end of a road
  before a small brick building..."* is sacred text. Never
  rewrite it.
- **Two-word `VERB NOUN` parser** as the *default* (natural
  language is opt-in enhancement, never a replacement).
- **The 350-point Woods scoring system** — 15 treasures, deposit-
  in-building scoring, closing sequence at 15/15. Do not change
  the point values.
- **XYZZY and PLUGH magic words** — sacred. Case-insensitive but
  identical strings.
- **The 5-letter parser truncation** as an authenticity mode
  option (turn off by default in modern mode, but preserve the
  option for purists).
- **Dwarf/pirate mechanics** — 5 dwarves + 1 pirate, axe-throwing,
  treasure theft, Hall of Mists spawn trigger.
- **The lantern battery clock (330 turns)** — tension source.
- **Two distinct mazes** — *Twisty Little Passages All Alike*
  (rooms 42–57) and *All Different* (60–87). Both preserved.
- **The Repository endgame** — bomb + emerald + blast puzzle.
- **`glorkz` data file** heritage — modern format may replace it
  internally, but preserve round-trip compatibility.
- **Ranks** — Beginner (0–34) through Grandmaster (350+). Names
  and thresholds preserved.

---

## 6. Open Questions

Design decisions raised by this brainstorm that need per-game
ADRs before implementation:

- Should natural-language parsing be **default on** in modern
  mode, or **opt-in via flag**? Default-on may confuse purists;
  default-off may make the port feel dated to new players.
- Should the auto-cartography panel be **available from turn 1**
  or **unlockable after first completion**? First option removes
  the historical pencil-and-paper mapping challenge; second is
  gate-keepy.
- **Multiplayer synchronisation model**: real-time (everyone
  types simultaneously with lock arbitration) vs. turn-based
  (one player commands at a time, others watch)?
- **Undo policy**: unlimited (accessibility) vs. bounded (design
  integrity — some deaths are meant to teach) vs. per-checkpoint?
- **Sound design licensing**: use royalty-free samples, generate
  procedurally, or commission original score? Trade-off between
  cost and quality.
- **Hint engine** — should it be trained on Don Woods's original
  hint file, or authored fresh? The originals have literary
  charm but only ~20 entries.
- **Rank name localisation** — should "Grandmaster" stay English
  everywhere or be translated? Star Trek's "Commodore" precedent.

Each becomes an ADR in [`./decisions/`](./decisions/).
