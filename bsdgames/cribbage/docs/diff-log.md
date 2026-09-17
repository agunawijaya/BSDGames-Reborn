# Cribbage — Difference Log

Detailed feature-by-feature comparison between the original 1980 BSD Unix C implementation
and the planned modern spiritual successor.

---

## 1. Feature Matrix

| Feature | Original 1980 BSD Cribbage | Modern Spiritual Successor Port | Rationale / ADR Link |
|---|---|---|---|
| **Programming Language** | K&R C (later ANSI C) | Modern cross-platform language (Rust / TS / Go) | Memory safety, native multi-platform compilation. |
| **Terminal UI** | 1980 curses (`termcap`-based ASCII) | Unicode 256-color / TrueColor TUI + Web GUI | High-resolution wood grain, card glyphs, clean layout. |
| **Card Graphics** | Plain text (`5S`, `JD`, `8H`) | Unicode card glyphs (`🂵`, `🂻`) & styled ASCII cards | Immersive visual presentation. |
| **Pegboard Display** | ASCII rows of 30 holes (`. . .`) | Unicode double-track wooden board with live peg hops | Recreates authentic physical board feel. |
| **Game Length Modes** | Short (61) and Long (121) | Short (61), Long (121), plus custom target options | Preserves core rules while offering quick-play modes. |
| **AI Strategy** | Static rule-based heuristics (`support.c`) | 3 AI Tiers: Heuristic, Monte Carlo Equity, Minimax | Accommodates complete novices up to grandmasters. |
| **Multiplayer** | Single-player vs computer only | Local Hot-Seat + Online WebSocket Matchmaking | Cribbage is fundamentally a social pub game. |
| **Input Methods** | CLI stdin parsing (`kd`, `k d`, `k`) | Keyboard shortcuts, arrow-key navigation, mouse | Reduced friction, mobile/browser accessibility. |
| **Pedagogical Support** | `-e` flag (prints miscount delta) | Interactive tutor mode with discard equity heatmaps | Teaches counting and discard strategy visually. |
| **Deck Cutting** | Manual index `0..51` or `-r` flag | Animated interactive cut with click/spacebar stop | More engaging than entering numbers. |
| **Muggins Mode** | Not implemented | Optional toggle for competitive games | Adds beloved pub-rule tension for experienced players. |
| **Persistence** | Session-only memory variables | SQLite / JSON match history & statistics | Track lifetime win rates, skunks, and 29-point hands. |
| **Score Logging** | Optional log file (BSD score log) | Cloud synchronization & shareable match replays | Modern social sharing. |
