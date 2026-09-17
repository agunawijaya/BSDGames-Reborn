# Worm — Difference Log

Detailed feature-by-feature comparison between the original 1980 BSD Unix C implementation
and the planned modern spiritual successor.

---

## 1. Feature Comparison Matrix

| Feature | Original 1980 BSD Worm | Modern Spiritual Successor Port | Rationale / ADR Link |
|---|---|---|---|
| **Programming Language** | K&R / ANSI C | Modern memory-safe language (Rust / Go / TS) | Memory safety, native cross-platform build without C signals. |
| **Timer Engine** | POSIX `SIGALRM` (`alarm(1)`) | Asynchronous non-blocking event loop (tokio/async) | Signal-safe architecture, millisecond-precision ticks. |
| **Game Speed** | Fixed 1.0s tick (`alarm(1)`) | Configurable: Classic (1s) or Turbo Dynamic Curve | Modern players expect increasing challenge as score climbs. |
| **Visual Aesthetics** | Plain text (`@`, `o`, `*`) | TrueColor Unicode connected glyphs (`╭╮╰╯─│` / `●`) | Modern visual polish while respecting terminal roots. |
| **Food Digits** | Plain ASCII numbers `1`..`9` | Circled Unicode digits (`①`..`⑨`) with color tiers | Clear visual hierarchy for risk/reward decisions. |
| **Arena Boundaries** | Single rectangular `*` box | Outer border + optional maze and obstacle layouts | Adds tactical variety and replayability. |
| **Multiplayer** | Single-player only | Local 2P Shared Arena + Online 8P Slither.io Mode | Transforms solo survival into intense competitive combat. |
| **Controls** | `hjkl`, `HJKL`, curses keypad | `hjkl`, `WASD`, Arrow keys, Gamepad support | Eliminates friction for players unfamiliar with `vi`. |
| **High Scores** | Ephemeral memory display only | Persistent JSON / SQLite leaderboard with initials | Encourages long-term mastery and competitive ranking. |
| **Collision Engine** | Direct curses buffer peek (`winch()`) | Decoupled 2D spatial grid model | Clean architectural separation of model and view. |
| **Audio Feedback** | Terminal bell (`\a`) only | 8-bit retro crunch, sprint hum, crash explosions | Heightens sensory satisfaction. |
