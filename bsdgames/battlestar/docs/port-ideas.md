# `battlestar` — Modernization & Port Ideas

> Brainstorming modern enhancements, UI/UX upgrades, architectural refinements, and preservation boundaries for the spiritual successor port.

---

## 1. Gameplay Modernization

### Smarter Natural Language Parser
- **Fuzzy Token Matching:** Classic `battlestar` fails rigidly if the player types `"take the laser gun"` instead of `"take laser"`. A modernized parser should support stop-word stripping (`the`, `a`, `an`, `to`), synonym recognition, and Levenshtein distance matching for common typos (`"tkae lasr"` $\rightarrow$ `"take laser"`).
- **Tab Auto-Completion:** Suggest available objects and viable directions dynamically as the user types at the command prompt.

### Enhanced Curses Flight Engine (`fly.c`)
- **60 FPS Smooth Terminal Rendering:** Replace rigid curses refresh with double-buffered ANSI rendering.
- **Enhanced Vector Radar HUD:** Render a mini-compass showing 3D Cylon vector bearings, distance indicators, and shield damage bars.
- **Dogfight Tactics:** Give Cylon raiders basic evasion behaviors (weaving, flanking) rather than purely random jitter.

### Deep Survival Simulation
- **Temperature & Weather Events:** Tropical rainstorms that extinguish unshielded torches and reduce visibility outdoors.
- **Crafting & Improvisation:** Combining deadwood and matches to build signal campfires; using the iron chain and shovel to rig winch pulleys across chasms.

---

## 2. UI / UX Design Ideas

### Split-Pane Terminal Layout
Instead of scrolling text streams where previous room descriptions are lost, provide a clean multi-panel TUI:

```text
┌──────────────────────────────────────┬─────────────────────────────┐
│ ROOM 22: LUXURIOUS STATEROOM         │ STATUS & INVENTORY          │
├──────────────────────────────────────┼─────────────────────────────┤
│ The walls are lined with fine silk   │ Health: 100% (Uninjured)    │
│ tapestries, and a plush Persian rug  │ Nourishment: 85%            │
│ covers the deck. Alarms wail through │ Fatigue: Well Rested        │
│ the ventilation conduits.            │ Facing: NORTH               │
│                                      │ Carrying: 1 kg / 60 kg      │
│ Exits: [W] West                      │ Encumbrance: 1 / 10         │
│ Visible Items:                       ├─────────────────────────────┤
│   - A pair of silk pajamas           │ WORN ON BODY:               │
│                                      │   - Silk Pajamas            │
├──────────────────────────────────────┴─────────────────────────────┤
│ >-: take pajamas                                                   │
└────────────────────────────────────────────────────────────────────┘
```

### Aesthetic Retro Themes
- **"Cylon Red":** Amber/red monochrome palette for the Battlestar interior under red alert.
- **"Emerald Lagoon":** Lush green/cyan palette for the tropical island rainforest.
- **"Deep Vacuum":** Dark slate and high-contrast stars for orbital flight.

---

## 3. Persistence & Cross-Platform Cloud Saves

- **Human-Readable JSON / TOML Saves:** Replace the obscure XOR-encrypted binary `.Bstar` format with structured JSON including a schema version and checksum.
- **Browser WebAssembly Port:** Compile to WebAssembly with an xterm.js frontend, persisting saves to browser `localStorage` or IndexedDB.
- **Replay Scripting:** Support playback scripts (`--script moves.txt`) for speedrunning validation and automated testing.

---

## 4. What NOT to Change (Preservation Invariants)

To preserve the soul and cultural identity of *Battlestar*:

1. **The 1970s Space Opera / Pulp Fantasy Genre Clash:** Never "clean up" the quirky blend of Battlestar Galactica Vipers and water goddesses. That jarring, imaginative fusion is the defining charm of David Riggle's vision.
2. **The Tri-Partite Scoring Dimension:** Retain **PLEASURE**, **POWER**, and **EGO**, along with the colorful titles (*Don Juan*, *Klingon*, *Darth Vader*, *Sauron the Great*, *Mr. Roarke*).
3. **The 275-Room Topology:** Maintain the complete canonical graph of all 275 rooms and the dual day/night transformation cycle.
4. **The Starting Pajamas:** The player must always awaken in stateroom 22 wearing silk pajamas!

---

## 5. Open Questions & Design Decisions

1. **Should Real-Time Flight Be Optional?**
   - *Consideration:* Some interactive fiction purists prefer purely turn-based gameplay without real-time reaction timers. Should there be a `--turn-based` flag that turns the dogfight into tactical command choices?
2. **Hereditary Wizard Accounts on Modern OS:**
   - *Consideration:* Modern multi-user workstations rarely have usernames named `riggle` or `dmr`. Should wizard mode be activated via an explicit command-line flag (`--wizard`) or an in-game secret passphrase instead?
3. **Audio / Sound Design:**
   - *Consideration:* Should terminal bell chimes (`\a`) or optional chiptune audio be included for laser blasts and alarm sirens?
