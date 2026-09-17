# Worm — Port Modernization Ideas

Brainstorming gameplay enhancements, visual upgrades, and multiplayer architectures for the
modern spiritual successor of BSD Worm.

---

## 1. Gameplay Modernization

### Dynamic Tick Rate Scaling (Speed Curves)
In the 1980 original, the movement interval is fixed at a relaxed `alarm(1)` (1 tick per second).
A modern arcade successor should implement progressive speed curves:
- **Classic Mode:** Authentic 1-second ticks for relaxed retro play.
- **Arcade Turbo Mode:** Starts at 250ms per tick, accelerating by 5ms for every 50 points scored
  down to a blistering 50ms terminal reflex test!

### Special Power-Up Digits & Obstacles
Introduce rare, intermittent bonus glyphs alongside standard `1`–`9` digits:
- **`✂` (Shears):** Instantly cuts the worm's trailing body in half, providing sudden breathing
  room in a congested arena!
- **`❄` (Freeze / Slow):** Temporarily halves the game speed for 10 seconds.
- **`★` (Golden Star):** High-value prize (+50 score) that vanishes after 10 ticks.
- **Procedural Obstacles:** Optional maze layouts with internal stone pillars and corridor walls.

### Slither.io Multiplayer Battle Arena
Backgammon, Hunt, and Hack proved the popularity of multiplayer in BSD games.
A modern Worm port can easily support a **multi-worm arena**:
- **2-Player Local Duel:** Shared arena with Player 1 using `WASD` and Player 2 using arrow keys.
- **Online WebSocket Arena:** Up to 8 players competing in a large terminal viewport. When a worm
  crashes into an opponent's body, its entire length disintegrates into a shower of edible digits,
  fueling a frantic feeding frenzy!

---

## 2. Visual & UI/UX Design

```
 ╔═════════════════════════════════════════════════════════════════════════════╗
 ║ WORM ARCADE               Length: 42   Speed: 120ms          Score:  148    ║
 ╠═════════════════════════════════════════════════════════════════════════════╣
 ║                                                                             ║
 ║                         ⑧                                                   ║
 ║                                                                             ║
 ║                                                                             ║
 ║                   ╭────────────────╮                                        ║
 ║                   │                │                                        ║
 ║                   │                │                                        ║
 ║                   │   ▲            │                                        ║
 ║                   │   │            │                                        ║
 ║                   │   ╰────────────╯                                        ║
 ║                   │                                                         ║
 ║                   ╰───────────────────────────                              ║
 ║                                                                             ║
 ║                                                                             ║
 ╚═════════════════════════════════════════════════════════════════════════════╝
```

- **Unicode Box & Block Drawing Characters:** Replace asterisks (`*`) with elegant double-line borders
  (`╔═╗`), and plain `o` characters with connected snake directional curves (`╭╮╰╯─│`) or solid
  rounded block segments (`●`).
- **Pulsating Digit Glyphs:** Enclosed Unicode numbers (`①`..`⑨`) that pulse with terminal ANSI
  TrueColor highlights (e.g. green for 1–3, yellow for 4–6, fiery red for high-growth 7–9).
- **Retro Audio Effects:**
  - Crisp 8-bit blip when stepping.
  - Satisfying chomp sound upon consuming a digit.
  - High-pitched whine when executing a sprint dash (`HJKL`).
  - Low crunch sound upon wall or self-collision death.

---

## 3. Persistence & Leaderboards

- **Global & Local High-Score Table:** Track top 10 runs with 3-letter initials, date, final score,
  peak length, and total digits consumed.
- **Session Replay (Ghost Worm):** Save high-score runs to disk and replay the player's previous best
  run as a faint, translucent "ghost worm" on the arena floor!

---

## 4. What NOT to Change (Core Identity)

- **Digit Values Dictate Growth:** Eating a `7` must always add 7 segments to the worm; never
  flatten growth to uniform 1-block units.
- **Direction Persistence:** The worm must continue moving forward in its current direction until
  a new direction key is pressed.
- **Capital `HJKL` Sprint Dashes:** The automated multi-step dash with automatic stopping upon
  eating a digit is the mechanical soul of BSD Worm.
- **Instant Death on Collision:** Zero margin for error; hitting walls or body segments must remain
  fatal.

---

## 5. Open Questions for Discussion

1. *Should dynamic speed scaling be enabled by default, or should Classic 1-tick-per-second be the default?*
2. *Should wrapping / toroid screen edges (moving off right edge reappears on left) be offered as an
   optional game mode?*
