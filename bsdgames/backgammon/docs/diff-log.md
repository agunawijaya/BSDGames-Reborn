# Backgammon — Difference Log

Detailed feature-by-feature comparison between the original 1980 BSD Unix C implementation
and the planned modern spiritual successor.

---

## 1. Feature Comparison Matrix

| Feature | Original 1980 BSD Backgammon | Modern Spiritual Successor Port | Rationale / ADR Link |
|---|---|---|---|
| **Programming Language** | K&R / ANSI C | Modern memory-safe language (Rust / Go / TS) | Memory safety, zero segfaults, cross-platform compilation. |
| **Terminal Graphics** | Plain ASCII pipe layout (`\| r w \|`) | High-resolution Unicode triangle points (`▲`, `▼`) | Beautiful, authentic physical board appearance. |
| **Checkers** | Plain letters (`r`, `w`) | Unicode disks (`🔴`, `⚪`) or colored ANSI glyphs | Instant visual clarity of board anchors. |
| **AI Strategy** | 1-ply greedy heuristic (`move.c`) | 3 Tiers: 1980 Heuristic, Minimax 2-Ply, Neural Net | Upgrades notoriously weak 1980 AI to grandmaster level. |
| **Multiplayer** | Single-player vs AI or local hot-seat (`-pb`) | Local Hot-Seat + Online WebSocket Matchmaking | Real-time competitive remote play with clocks. |
| **Tournament Rules** | Basic match point score tracking | Crawford Rule, Jacoby Rule, DMP tracking | Standard international tournament compliance. |
| **Interactive Tutor** | Standalone `teachgammon` binary | Modern interactive academy with tactical puzzle solving | Deepens pedagogical value for new learners. |
| **Match Analysis** | None | Export to `.mat` / `.sgf` + blunder evaluation | Enables post-game review with GnuBG / XG engines. |
| **Pip Counting** | Manual mental calculation by player | Dynamic HUD pip count gauge (with toggle) | Reduces arithmetic fatigue while training eye. |
| **Audio Feedback** | Terminal bell (`\a`) only | Authentic sounds: shaking dice cup, checker clacks | Enhanced tactile immersion. |
| **Save State** | Basic file serialization (`save.c`) | Structured, portable JSON / SQLite format | Resilient session persistence across devices. |
