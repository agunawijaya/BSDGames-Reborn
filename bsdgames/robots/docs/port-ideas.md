# `robots` — Port Design Ideas

> Brainstorm for modernisation. We are doing a **spiritual
> successor** — preserve the core mechanic, freely modernise
> everything else.

Every non-obvious choice becomes a per-game ADR under
[`./decisions/`](./decisions/) or a root ADR if it affects multiple
games.

---

## Guiding Question

> If `robots` were being designed *today*, with no era constraints,
> what would we keep, what would we throw away, and what would we
> add?

Answer at a high level: **keep the two-line AI, keep the occupancy
grid, keep the 40-robot ceiling — but reinvent every layer around
it.**

---

## Competitive Landscape

`robots` occupies a genuinely quiet niche. Unlike Tetris or Snake,
the BSDGames `robots` mechanic — grid-step turn-based survival
against greedy 8-direction chasers, with random teleport as the
only escape — has almost no modern browser competition. This is
an opportunity, not a red flag.

### The current ceilings

- **[Chu's Chess Robots](https://www.chessrobots.com/)** and
  various *[robots.js](https://github.com/tmcw/robots)* type
  ports — direct terminal-style ports of the mechanic on the
  web. Small audiences, minimal polish, generally faithful but
  visually inert.
- **[Into the Breach](https://subsetgames.com/itb.html)**
  (Subset Games) — spiritual cousin. Grid-tactics with enemies
  that telegraph next turn. Sets the ceiling for
  *forward-planning turn-based* on grid. Paid indie, high
  production. We won't compete on depth.
- **[Hoplite](https://www.magmaportal.com/hoplite.html)** and
  the wider grid-roguelike genre — turn-based positional
  combat on hex grids. Owns the "roguelike puzzle-tactics"
  slot.
- **[Chess.com](https://www.chess.com/) puzzles** — turn-based
  positional survival puzzles at the trivial extreme. Owns the
  casual daily-puzzle slot for turn-based positional play.
- **Google's *[Robots](https://en.wikipedia.org/wiki/Robots_(game))*
  Chrome extensions** and various open-source clones — direct
  ASCII ports. Function, but no distinctive identity.
- **[7DRL](https://7drl.com/) roguelike jams** — regularly
  produce robots-adjacent tactical survival roguelikes.
  Owns the experimental / prototype slot.

### What's still open

- **A visually-arresting, mainstream-web-quality `robots`.** No
  competitor has attempted a *presentation-first* port. Every
  existing browser `robots` looks like a terminal artefact,
  which is on-brand for retro purists but excludes 99% of
  modern players.
- **The "planet-in-space" framing.** Nobody has treated the
  60×23 grid as *an actual physical place* (a platform, a floor,
  a scene) rather than an abstract playfield.
- **Isometric 3D turn-based survival on the web.** Into the
  Breach is desktop; Hoplite is mobile; no browser R3F/Three.js
  isometric grid-survival game exists at high polish.
- **Safe-wait as a spectator moment.** BSD `robots` has the
  `w` "wait until safe" command, which classically resolves
  instantly. Presenting each turn *visibly* while safe-wait
  runs — so you can watch robots crash into each other — is
  underexplored and turns a UX shortcut into gameplay theatre.

---

## Distinctive Hook — What Shipped

This section is retrospective. The
[`fancy-web` port shipped 2026-09-17](../../robots/ports/fancy-web/README.md);
what follows describes the identity the released product actually
delivers.

**Positioning:** *`robots` as a scene from a hand-crafted
isometric puzzle game — the 60×23 grid reimagined as a luminous
platform floating in space.*

### The three anchors of the shipped identity

**1. The platform is a place, not a grid.**

- Isometric 3D rendering via `@react-three/fiber` + Three.js.
  Orthographic camera at ~30° tilt.
- Zoom out and the platform reads like a **distant planet
  ringed by an aura halo**. Zoom in and you play a close-up
  turn-by-turn game with a walking human character.
- The camera adaptively follows the player at high zoom; halo
  silently fades so the tiles read cleanly at close range.
- Reference points: Monument Valley, Into the Breach, Mini
  Metro. Nobody else in the browser-`robots` slot targets
  this production tier.

**2. The player and enemies are physical objects with animation.**

- **Voxel human player** with a full walk cycle: legs and arms
  swing counter-phase; body rotates to face movement direction;
  hop is parabolic between grid cells.
- **Hover-bot enemies** — yellow chassis, red LED eyes, subtle
  bob-hover animation. Menacing on approach, satisfying to
  bait into collisions.
- **Scrap piles** are distinct volumetric objects, not `*`
  glyphs. They stack visually when multiple robots collide on
  the same tile.

**3. Safe-wait as theatre.**

- The canonical `w` command traditionally resolves instantly
  (you either survive or die on a single line of output).
- Our port plays each turn out *visibly* during safe-wait —
  robots step, collide, crash into piles one turn at a time
  with animation. Any keypress interrupts.
- This turns a UX shortcut into a spectator moment: you
  set up a chain and *watch it resolve*. Signature
  interaction that no other `robots` port has.
- Deviates from spec in *timing*, not *outcome*, which is
  documented under
  [port ADR 002 (safe-wait deviation)](../../robots/ports/fancy-web/docs/decisions/).

### What we deliberately did NOT do

- **We did not preserve terminal ASCII rendering** in the
  default view. There is no `+ @ *` glyph mode. This is a
  clean break from the retro-preservation instinct — the port
  is unambiguously a *modern reimagining*, not a terminal
  emulator. Terminal-style rendering may return as an
  optional theme in a v2 port ADR.
- **We did not implement AI variants.** The greedy 2-line
  `sign()` AI ships as the only enemy behaviour. This
  preserves the mechanic identity; AI variants remain a
  documented modernisation option (Section 1) for future
  ports.
- **We did not add multiplayer.** The port is strictly
  single-player, consistent with the original. Async score
  competition and ghost mode remain deferred.

### The moat

- Nobody else is doing isometric 3D + WebGL for `robots`.
- Nobody else is treating the grid as a *place* (halo-lit
  platform in a starfield).
- Nobody else is playing safe-wait as animated theatre.
- 289 KB gzipped, TypeScript strict, 33/33 tests pass —
  production quality is the moat that the retro-terminal
  competitors don't reach.

---

## 1. Gameplay Modernisation

### AI

- **Keep the trivial greedy AI as *default*.** It is the game.
- Add **AI variants** as difficulty options (unlockable / selectable):
  - *Classic* — the 2-line `sign()` AI.
  - *Coordinated* — robots stagger their moves so they can't all be
    baited into one heap.
  - *Line-of-sight* — some robots pause and re-evaluate every 3
    turns.
  - *Hunter-killer* — one "elite" robot moves 2 squares per turn,
    marked distinctly.
- These are variants, not replacements. A player can always pick
  Classic and get the pure original experience.

### Mechanics

- **Weapon pickups** as an optional mode. One-time-use EMPs, decoy
  drones, laser fences. Explicitly a *variant*; classic mode has
  none.
- **Adjacent-cell warning** (subtle visual cue) when a robot is one
  turn from you. Accessibility-oriented.
- **Undo one move** with a small score cost — helps new players
  learn. Removable in "expert" mode.

### Progression

- **Campaign mode** with hand-designed set pieces alternating with
  procedural levels. E.g., "Level 5: 20 robots and 5 pre-placed
  scrap heaps in a specific arrangement." Gives designers a way to
  teach mechanics without a tutorial.
- **Endless mode** = the classic experience, kept as default.

### Content

- **Different fields:** the game currently assumes a rectangle.
  Introduce fields with corridors, walls, teleporter pads, one-way
  doors.
- **Cosmetic themes** ("cyberpunk," "ancient temple," "spaceship")
  that don't change mechanics — pure UI.

## 2. UI / UX Design

### Visual Direction

- Two visual modes:
  - **Terminal (retro)** — high-fidelity `+ @ *` on textured
    ASCII, CRT scanline effect, subtle terminal-glow shader.
  - **Modern** — vector graphics, smooth animation between grid
    positions, particle effects on collision. Same gameplay, same
    grid.
- Palette: green-phosphor default, colourblind-friendly
  alternatives (Wong palette).

### Interaction Paradigm

- **Keyboard-first**, matching the original vi-keys but adding:
  - Arrow keys mapped identically.
  - WASD as alternative diagonal-lite scheme.
- **Mouse / touch optional**: click adjacent cell to move there;
  click "safe zone" indicator to teleport.
- **Undo** (single-move) with `u` or `Ctrl-Z`.

### Layout

- Grid stays 60×23 by default (respect original balance) but scale
  visually to any window/screen size.
- Sidebar: score, level, "next-turn preview" of robot destinations
  (optional aid).
- Bottom bar: available actions with keybinding hints.

### Accessibility

- Colourblind palettes (protanopia / deuteranopia / tritanopia).
- Screen-reader support: announce robots' relative positions on
  request ("`s` = say status").
- Slow-motion mode: after each key press, animate robot movement
  over 300ms with an announcement.
- No time pressure in default mode — turn-based means accessible
  by default.

## 3. Multiplayer / Networking

The original is strictly single-player. Introduce:

- **Async competitive:** same seed, different players, compare
  scores + move counts. Weekly leaderboards.
- **Ghost mode:** overlay a friend's playthrough (their `@` shown
  as a ghost) so you can see how they solved a level.
- **Local co-op ("2 humans, 1 field"):** two `@`s share the field;
  robots target the *closest* human each turn. Adds interesting
  strategic dynamics — decoying for your partner.

Explicitly *not* considering:

- Real-time PvP — the game is turn-based; PvP would betray it.

## 4. Persistence

- Local high-score DB (SQLite or JSON) mirroring the classic
  `robots.scores` file but portable.
- Optional cloud sync with account. Never *required*.
- Cross-device: same account = same scores everywhere.
- **Deterministic replays:** every game seeded and every input
  logged. A win can be replayed exactly. Great for sharing.

## 5. Other Modernisation Angles

- **Telemetry:** opt-in only. Collect anonymised: level reached,
  cause of death, deaths per level (to inform difficulty tuning).
  Never collect: usernames, machine info, session times.
- **Configuration:** command-line flags mirror the original where
  applicable (`-a` advance, `-t` auto-teleport). Plus a config
  file (`config.toml` or `~/.config/bsdgames-reborn/robots.toml`)
  for keybindings, palette, difficulty defaults.
- **i18n:** small string set — should be trivially localised. Man
  page text, level intro, epitaph.
- **Modding:** allow custom robot AI scripts (JSON rules or a
  small DSL) for the "AI variants" system. Community-authored.
- **Platform targets:** primary = TUI (Rust+ratatui or similar,
  pending root ADR). Secondary = web (`xterm.js` or canvas).
  Tertiary = mobile touch.

## 6. What NOT to Change

The mechanic identity of `robots`. Explicitly preserved:

- **Two-line greedy AI as the default and always-available mode.**
- **Occupancy-based collision** (two things on a cell = both die).
- **Movement in 8 directions plus wait.**
- **`w` wait command with bonus reward.**
- **Random teleport** as the only "get out of trouble" mechanic in
  classic mode.
- **The `AARRrrgghhhh....` epitaph.** Non-negotiable.
- **`+`, `@`, `*` characters as visual identity** (even in modern
  visual mode, retained as accent glyphs).

## 7. Open Questions (need ADRs)

- Should there be a story / setting? Original has none. Adding one
  is a big design choice. → Per-game ADR.
- Are the AI variants a runtime setting or separate "game modes"?
  → Per-game ADR.
- Should the port support both real-time (`-r`) and turn-based?
  → Per-game ADR.
- Multiplayer scoring: same seed vs. different seeds — how do we
  determine "same challenge"? → Per-game ADR.

## See Also

- [`architecture.md`](./architecture.md) — what we start from.
- [`spec.md`](./spec.md) — the mechanic identity to preserve.
- [`./decisions/`](./decisions/) — where per-game ADRs live.
- Root [ADR-002 Porting Philosophy](../../../docs/decisions/002-porting-philosophy.md).
