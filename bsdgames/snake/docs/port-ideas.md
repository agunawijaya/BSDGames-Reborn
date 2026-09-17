# `snake` — Port Design Ideas

> Brainstorm for modernisation.

---

## Guiding Question

> If BSD `snake` were being written today, what would we keep,
> improve, or reimagine?

The core preserve: **you (`I`) collecting money (`$`) while a chasing
snake (`S...s`) tries to eat you, with an exit (`#`) as escape.**

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
