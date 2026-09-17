# Mille — Difference Log

Detailed feature-by-feature comparison between the original 1982 BSD Unix C implementation
and the planned modern spiritual successor.

---

## 1. Feature Comparison Matrix

| Feature | Original 1982 BSD Mille | Modern Spiritual Successor Port | Rationale / ADR Link |
|---|---|---|---|
| **Programming Language** | K&R / ANSI C | Modern memory-safe language (Rust / Go / TS) | Memory safety, native cross-platform build. |
| **Terminal Display** | Curses subwindows (`Board`, `Miles`, `Score`) | TrueColor Unicode TUI + Web/Desktop GUI | Clean rendering, retro Art Deco styling, modern terminals. |
| **Visual Aesthetics** | Plain text brackets (`[  Stop  ]`) | Unicode card frames, dashboard gauges, speedometers | Immersive automotive driving atmosphere. |
| **Card Deck Size** | Authentic 101 cards | Authentic 101 cards | Inviolate core rule. |
| **Opponents** | Single-player vs computer AI only | Solo vs AI, Local Hot-Seat, and Online Multiplayer | Allows real social play, including 4-player 2v2 teams. |
| **AI Decision Engine** | Static heuristic rules & `Numseen` card counting | 3 Tiers: Classic Heuristic, MCTS, Speed Demon | Caters to both casual players and tournament tacticians. |
| **Coup-Fourré Model** | Synchronous prompt interrupt | Timed reaction window with audio/visual flash | Resolves network latency in multiplayer. |
| **Save State Format** | Raw binary memory dump (`varpush.c`) | Portable, schema-validated JSON / SQLite | Cross-architecture portability (x86/ARM/Wasm). |
| **Audio Effects** | Terminal bell (`\a`) only | Sound effects: engine revs, screeching tires, French horn | Enhances feedback and tactile satisfaction. |
| **Match Progression** | Cumulative memory variables up to 5,000 pts | Persistent driver profile with career stats & match logs | Long-term progression and achievement tracking. |
| **Localization** | English card names only | Bilingual option: English and original French names | Honors Edmond Dujardin's cultural heritage. |
