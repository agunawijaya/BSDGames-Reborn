# `snake` — Port Design Ideas

> Brainstorm for modernisation.

---

## Guiding Question

> If BSD `snake` were being written today, what would we keep,
> improve, or reimagine?

The core preserve: **you (`I`) collecting money (`$`) while a chasing
snake (`S...s`) tries to eat you, with an exit (`#`) as escape.**

---

## Competitive Landscape

"Snake" as a name has been colonised by Nokia's *growing snake*, a
completely different game. BSD `snake(6)` is the *chase snake* —
lineage from Berkeley, 1980s. The competitive landscape must be
read through that distinction; otherwise we mis-position.

### The "snake" that most people mean (Nokia lineage — different game)

- **Nokia 3310 *Snake* (1997)** — the culturally dominant "snake."
  Growing worm, eats fruit, dies on wall/self. Millions know
  only this. This is *not* BSD `snake` — it is closer to BSD
  `worm(6)`, which we ship separately.
- **[Google Snake](https://www.google.com/fbx?fbx=snake_arcade)** —
  the browser default for casual snake. Six unlockable modes
  (walls, portals, small map, twin, etc.). Free. Owns the
  "quick-fix casual snake" slot for the Nokia lineage.
- **[Slither.io](https://slither.io/)** — massively multiplayer
  Nokia-lineage snake. Owns the browser MMO snake slot.
- **[Powerline.io](https://powerline.io/)** — competitive
  neon-lightcycle-snake hybrid. Owns the competitive-browser slot.

### The "snake" that BSD actually is (chase lineage — our lineage)

- **Almost no direct competitor exists.** The chase-snake genre
  (you flee from a snake instead of being one) has essentially
  disappeared from mainstream awareness. This is remarkable and
  is the port's central positioning advantage.
- Historical curiosities like *Snake Byte* (1981 Apple II) and
  *Anaconda* (arcade) are chase-snake adjacent but long
  forgotten and not shipping on modern platforms.
- The closest active browser game is arguably **Pac-Man clones** —
  chase-you mechanic with pickup objective — but the identity
  is chase-ghost, not chase-snake.

### What's still open

- **The chase-snake identity itself.** Nobody is currently
  telling the story of "the *other* snake" from the 1980s BSD
  suite. This is our differentiation from Google Snake and
  slither.io.
- **Ecosystem / diorama aesthetic.** Nokia snake is grid+phone;
  slither.io is dark neon soup; Google Snake is a checkered
  plane. A snake game *set inside a specific ecosystem* (savanna
  with real thermals, jungle canopy, moonlit desert) is
  underexplored.
- **Continuous slither motion.** Most snake games are strictly
  grid-stepped. Continuous spring-follow motion — where the body
  waves and glides between grid cells while gameplay remains
  turn-based — is a niche visual identity.

---

## Distinctive Hook — What Shipped

This section is retrospective. The
[`fancy-web` port shipped 2026-09-17](../../snake/ports/fancy-web/README.md);
the following describes the identity that the released product
actually delivers, so future ports of `snake` (or forks of this
one) can understand what "our version" already stakes out.

**Positioning:** *the chase-snake, reintroduced as an ecosystem
diorama.*

### The three anchors of the shipped identity

**1. Chase-snake, not growing-snake.**

- `$` becomes an **apple**, not a fruit-to-grow-on. Collecting
  apples fills a bank; you escape through *any edge* to cash
  out. Directly BSD `snake(6)` mechanics.
- The enemy is a **hovering eagle** (or an owl at night in
  Midnight theme) with a state machine: idle → hunt → strike →
  cooldown. A visible shadow warns you 800 ms before a strike
  lands.
- Player is a **45-segment slithering body** with wave physics,
  tapered gradient, and a flicking tongue. You are unambiguously
  *a snake being chased by a bird*, not a snake eating fruit.

**2. Eight ecosystem themes, one game.**

- Neon Grid (cyberpunk cyan/magenta) → Savanna (African fish
  eagle over dry grass) → Jungle (harpy eagle in canopy green) →
  Desert (pale hawk over warm gold sand) → River (osprey over
  blue gradient) → Aztec (Mexican-flag eagle over terracotta) →
  Origami (folded-paper eagle) → Midnight (horned owl silhouette
  against a moon).
- Themes shift *which raptor hunts you* — not just the palette.
  This is a small but distinctive touch nobody else does.

**3. Spring-follow continuous slither.**

- Movement is turn-based (grid-stepped ticks), but the body
  interpolates continuously between cells with spring physics.
  Head snaps to the input direction; tail waves behind. Gives
  the game a *tactile* feel that's rare in grid games.
- Single-pass body glow (whole path stroke + shadow) and
  offscreen static-layer cache keep it at 60 fps on 2020-era
  laptops across all 8 themes.

### What we deliberately did NOT do

- **We did not merge in the Nokia-snake mechanic.** BSD `snake`
  is a chase game; Nokia is a growth game. Merging them would
  destroy the chase-identity and turn us into slither.io #10001.
  See the "Nokia mode" open question at the bottom of this
  document — position remains **do not merge.**
- **We did not go real-time by default.** The classic BSD
  mechanic is turn-based (snake ticks when you move). Real-time
  is a legitimate variant but changes the feel; we shipped
  turn-based to preserve identity.
- **We did not add a story.** The game is a diorama, not a
  narrative. Each theme suggests a setting; the player supplies
  the story.

### The moat

- Nobody else is telling the BSD-lineage chase-snake story.
- Nobody else is doing raptor-per-ecosystem theming for snake.
- Nobody else is doing spring-follow slither with single-file
  no-dependency shipping (~1900 LOC, one HTML file, offline).

---

## 1. Gameplay Modernisation

### AI

- **Keep the six-segment chase snake** as classic mode.
- Add **AI variants**:
  - *Predictive* snake: uses simple lookahead to predict player
    routes toward money.
  - *Pack of two*: two independent snakes at higher difficulties.
  - *Adaptive*: snake speeds up as you accumulate more money.

### Mechanics

- **Real-time mode** — snake moves on a timer. Fundamentally
  different feel. Available as a mode, not the default (the
  original is turn-based and that matters).
- **Money variants**:
  - `$` = small amount (default).
  - `£` or `¥` = larger amount but placed further from you.
  - `%` = bonus multiplier for the next `n` seconds.
- **Powerups (optional mode)**: shield (survive 1 hit), speed
  boost (move 2 squares per key), lure (snake chases a decoy for
  N turns).
- **Difficulty settings** independent of screen size.

### Progression

- **Campaign mode**: series of hand-designed levels with escalating
  challenges (multiple snakes, wall obstacles, moving exit).
- **Endless / arcade mode**: the classic experience.
- **Puzzle mode**: "given this snake position and your position,
  find the safe money route."

## 2. UI / UX Design

### Visual Direction

- **Retro terminal mode** — pixel-perfect recreation of the ASCII
  aesthetic. CRT-glow shader optional.
- **Modern smooth mode** — animated grid, pixel art or vector,
  smooth-scrolling snake body, particle effects on money pickup.
- Colour palettes with colourblind alternatives.

### Interaction Paradigm

- Keyboard-first (hjkl + arrows + WASD).
- Mouse: click-adjacent-square to move.
- Touch: swipe gestures for direction; tap-hold for long-move.
- Controller: D-pad for direction, face buttons for spacewarp / long-move.

### Layout

- Field fills window, aspect-ratio adjusted.
- Score prominent at top.
- Snake body length visible even after growth (if growth mode
  chosen).
- On-screen minimap for very large fields.

### Accessibility

- Colourblind palettes.
- Screen reader: state readouts on request.
- Configurable input delay for players with slower reflexes.
- Snake-speed slider independent of "difficulty".

## 3. Multiplayer / Networking

Original is single-player. Options:

- **Async competitive**: same seed, compare scores. Weekly
  leaderboards.
- **Ghost mode**: overlay a friend's route.
- **Local co-op**: two `I`s share the field, one shared snake.
  Snake chases the closer player.
- **Real-time competitive** (variant only, not default):
  race to see who cashes out first. Two players, two snakes,
  shared money pool.

## 4. Persistence

- Local SQLite / JSON scores.
- Optional cloud sync.
- Match replays (input log + seed).

## 5. Other Modernisation Angles

- **Telemetry:** opt-in, anonymised. Track: score distributions,
  cause-of-death heatmaps, spacewarp frequency (to tune penalty).
- **Configuration:** flags map to original (`-w`, `-l`, `-t`) plus
  new (`--seed`, `--snake-count`, `--speed`).
- **i18n:** trivial string set.
- **Modding:** allow custom snake AIs (small DSL / scripts) —
  possible showcase for the port.
- **`snscore` subcommand**: modernise as `snake scores` subcommand
  with filtering, sorting, per-user history.

## 6. What NOT to Change

Preserve to keep `snake` recognisable:

- **Six-segment chase snake** — the shape and count matter.
- **Money placement is random with retry.**
- **You are `I`, snake head is `S`, tail `s`, money `$`, exit `#`.**
  These are the icons in Classic mode.
- **Spacewarp with penalty** — a defining risk-reward mechanic.
- **Bonus digit at end** — the "pinball" feel.
- **Score scales with screen size** — deliberate design.

## 7. Open Questions (need ADRs)

- Real-time mode: default or optional? → Per-game ADR. Real-time
  is *not* the original but is what modern audiences expect from
  a "snake" game.
- Merge with Nokia-snake mechanic (snake grows when it eats)? Or
  keep pure BSD chase mechanic? Position: **do not merge**. The
  Nokia snake is a different game. Add a "Nokia mode" as a
  separate option if desired but never default.
- Combined `snake`/`snscore` binary vs. two separate tools? →
  Per-game ADR.

## See Also

- [`architecture.md`](./architecture.md).
- [`spec.md`](./spec.md).
- [`./decisions/`](./decisions/).
- Root [ADR-002 Porting Philosophy](../../../docs/decisions/002-porting-philosophy.md).
