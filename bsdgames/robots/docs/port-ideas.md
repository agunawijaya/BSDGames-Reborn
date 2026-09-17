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
