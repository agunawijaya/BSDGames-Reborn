# Worm — Port Modernization Ideas

Brainstorming gameplay enhancements, visual upgrades, and multiplayer architectures for the
modern spiritual successor of BSD Worm.

---

## Competitive Landscape

BSD `worm(6)` sits inside the *growing-worm* genre — the same
family as Nokia Snake — and that genre is one of the most
saturated in casual gaming. Any port must acknowledge who
already occupies the space and where the gap is.

### The current ceilings

- **Nokia 3310 *Snake* (1997)** — the cultural anchor. Not a
  product any more, but every casual player's mental model of
  "snake game." Sets the *baseline* expectations for the entire
  genre.
- **[Google Snake](https://www.google.com/fbx?fbx=snake_arcade)** —
  the casual browser default. Six unlockable modes (walls,
  portals, twin, small map, statue trail, etc.). Free, zero
  friction. Owns the *5-minute browser session* slot.
- **[Slither.io](https://slither.io/)** — massively multiplayer
  online worm. 2016-era viral hit, still going. Owns the
  *browser MMO* slot for the genre.
- **[Powerline.io](https://powerline.io/)** — competitive
  lightcycle-snake hybrid. Owns the *competitive PVP browser*
  slot.
- **[Little Big Snake](https://littlebigsnake.com/)** — the
  slither.io successor with progression, bosses, and stronger
  visual identity. Owns the *casual-with-progression* slot.
- **[Wormate.io](https://wormate.io/)** — cute-decorated
  slither variant. Owns the *casual visually-friendly* slot.
- **Mobile ports and clones** — hundreds. Ad-supported. Owns
  the casual mobile slot.

### What's still open

- **BSD-faithful growing-worm.** No modern browser worm
  faithfully implements the *chained bonus + progressive
  growth* math that BSD `worm(6)` originated in 1980. Everyone
  copied the "eat fruit → +1 length" mechanic but discarded
  the *digit food (1-9) with delayed multi-tick growth* system.
  This is a real, defensible historical niche.
- **Symmetric ecology.** No worm game treats rival worms as
  bound by the same rules as the player (die on wall, die on
  self, hunt the same food). Slither.io breaks symmetry for
  spectacle; a *fair-chase* worm ecology is rare.
- **Static-fence puzzle worm.** Worms with maze walls are
  common (Google Snake has "wall" mode) but static-fence
  layouts as *puzzle constraints* rather than random walls
  are underexplored.
- **Speed-tier selection as an identity choice** (not a
  difficulty setting). The BSD 1×/second pace is deliberately
  meditative; presenting it alongside modern arcade speeds as
  equally legitimate options is a design statement, not a
  concession.

---

## Distinctive Hook — What Shipped

This section is retrospective. The
[`fancy-web` port shipped 2026-09-17](../../worm/ports/fancy-web/README.md)
and was updated through late 2026-09 with Wild mode + fair-chase
gardener + wooden fences. What follows describes the identity the
released product actually delivers.

**Positioning:** *the growing-worm genre, told through its BSD
lineage — with a fair-chase ecology and puzzle-fence layer that
nobody else has attempted.*

### The three anchors of the shipped identity

**1. Pure Mode preserves BSD `worm(6)` verbatim.**

- Single apple, no enemies, no bonuses. Just the digit-food (1-9)
  → multi-tick delayed growth → chained-bonus math from Michael
  Toy's 1980 original.
- Positioned as *meditative preservation mode* — you get the
  actual 1980 game, on a modern canvas, without arcade layers.
- This is the historical / archaeological identity anchor
  consistent with `wump` (Moria), `adventure` (illustrated
  point-and-click), and the proposed `tetris` / `atc` port
  hooks.

**2. Wild Mode adds a symmetric arcade ecology.**

- 10-apple pool with a ripe → rotten → decay lifecycle (20s
  ripe → 5s rotten → gone).
- Four opt-in enemies, each with a distinct threat class:
  - **Bird** — non-lethal thief; races you to the ripest apple.
  - **Wasp** — lethal chaser that spawns from rotten apples.
  - **Rival worm** — a full symmetric AI worm playing by the
    same rules you do (grows on apples, dies on wall/self,
    body = wall to you and to itself).
  - **Gardener** — a rare (45-60s) fair-chase hunter that
    enters from the far edge and targets the *nearest head* —
    you or the rival, no favouritism. Retreats after a 25s
    hunt window.
- The symmetry is the point. In slither.io, other worms are
  spectacle; in our Wild mode, they are *bound by the same
  rules you are*. This is a
  [game-design principle](../../../docs/decisions/002-porting-philosophy.md)
  we hold across ports.

**3. Wooden puzzle fences.**

- Six fence layouts (None, Single H, Double H, Cross, Box,
  Corridors) act as static internal walls. Rendered as
  wooden post-and-rail structures across all 8 themes —
  matches the physical-materials aesthetic direction of
  [`gomoku` fancy-web](../../gomoku/ports/fancy-web/) (kaya
  board, clamshell stones).
- Fence cells are walls to the player, rival, and gardener.
  Wasp and bird pass over (airborne). This asymmetry is *by
  physical logic*, not player-favour — reinforces the
  ecology's coherence.

### What we deliberately did NOT do

- **We did not merge in Nokia-snake mechanics.** BSD `worm(6)`
  is the *growing* game; BSD `snake(6)` is the *chase* game.
  We ship them as two distinct products with two distinct
  identities. The `snake` port has raptors chasing you; the
  `worm` port has you being the worm. Different tables.
- **We did not implement slither.io-style multiplayer.** The
  identity is *symmetric single-machine ecology* — the rival
  worm plays by our rules, and it's local. Adding online
  multiplayer would collapse into "slither.io #10001."
- **We did not use random maze walls.** Six curated layouts,
  each with a distinct name and shape. Puzzle constraints,
  not procedural noise.

### The moat

- Nobody else is preserving BSD `worm(6)`'s digit-food chained-
  bonus math faithfully.
- Nobody else is doing fair-chase rival worms with symmetric
  rules.
- Nobody else is doing wooden puzzle fences in a
  growing-worm game.
- Single-file, no-dependency, offline-first, ~1500 LOC.

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
