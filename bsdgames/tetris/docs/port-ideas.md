# `tetris` — Port Design Ideas

> **Brainstorm for modernisation.** We are doing a **spiritual
> successor** (root ADR-002). Preserve the core mechanic; freely
> modernise everything else.
>
> Every non-obvious choice becomes a per-game ADR under
> [`./decisions/`](./decisions/) or a root ADR if it affects multiple
> games.

---

## Guiding Question

> If this game were being designed *today*, with no era constraints,
> what would we do?

## 1. Gameplay Modernisation

### AI

N/A. `tetris` is a single-player puzzle game. There is no computer opponent. The only autonomous system is gravity, whose curve can be tuned.

### Mechanics

- **Standard rotation system (SRS).** Replace the single counterclockwise rotation with full clockwise/counterclockwise rotation and Super Rotation System wall kicks. This preserves Tetris identity while removing the frustration of failed rotations.
- **Hold queue.** Allow the player to stash one piece for later, a standard feature in modern Tetris.
- **Ghost piece.** Draw a transparent outline of where the current piece will land, helping with precision placement without changing the core mechanic.
- **Hard drop vs. soft drop.** Distinguish a hard drop (instant lock, more points) from a soft drop (accelerated fall). The original conflates both under the space key.
- **7-bag randomizer.** Replace `random() % 7` with a 7-bag system: deal all seven tetrominoes in random order, then reshuffle. This removes long droughts of a given piece.
- **Line-clear bonuses.** Reward single, double, triple, and Tetris clears with multipliers instead of the original's flat scoring.
- **Lock delay.** Add a brief delay after a piece lands, giving the player a last chance to rotate or slide it into place.

### Content

- **Marathon mode.** The classic endless mode, faithful to the original.
- **Sprint / Time Attack.** Clear 40 lines as fast as possible.
- **Ultra.** Score as many points as possible in a fixed time limit.
- **Challenge modes.** Pre-set board configurations or limited-piece puzzles.

## 2. UI / UX Design

### Visual Direction

- **Neo-retro terminal aesthetic.** Keep the monospace grid and phosphor-green-on-black palette as a nod to the original, but use subtle modern touches: rounded block glyphs, smooth line-clear animation, and a clean status panel.
- **Fallback to pure ASCII.** When run in a bare terminal or with `--ascii`, render with simple `#` characters, matching the original feel.

### Interaction Paradigm

- **Keyboard-first.** Default keys mirror the original `j`/`k`/`l`/space mapping, plus `z`/`x` for rotation and `c` for hold.
- **Mouse/touch optional.** Tap/click on on-screen control buttons for mobile or accessibility.
- **Controller support.** Map D-pad/left stick to movement, face buttons to rotate/hold/drop.

### Layout

- **Left panel:** hold piece and statistics (piece counts, lines cleared, level).
- **Center:** the 10×20 well.
- **Right panel:** next queue (show 1–5 upcoming pieces) and score.
- **Bottom:** key reminder and pause/quit help.
- **Responsive:** scale the well and panels proportionally; minimum terminal size 80×24.

### Accessibility

- **Colorblind-friendly palette.** Use distinct shapes/patterns, not just colors. Each tetromino should have a subtle unique glyph or border.
- **Screen-reader support.** Provide a `--accessible` mode that announces the current piece, next piece, stack height, and danger state.
- **Adjustable timing.** Let players tune DAS, ARR, and lock delay for motor accessibility.

## 3. Multiplayer / Networking

Tetris can support multiplayer in a modern port:

- **Local hot-seat / versus screen.** Two players share one screen or terminal window, each with their own well.
- **Local network.** Synchronise game state over WebSocket; send garbage lines when one player clears multiple lines.
- **Internet matchmaking.** Lobby system with ranked and casual queues. Anti-cheat would focus on verifying replay files and move timing.
- **Spectator mode.** Allow others to watch a live game and view the next queue from the player's perspective.

The original BSD `tetris` has no multiplayer, so these are additions rather than preservation.

## 4. Persistence

- **Local high-score file.** Preserve the original per-user/per-level high-score concept, but store it in a user-owned JSON file instead of a setgid-protected system file.
- **Cloud leaderboards.** Optional account-based leaderboards for each game mode.
- **Replays.** Save a compact replay file (initial seed + input log) so players can re-watch or share a run.
- **Cross-device sync.** If cloud account is enabled, sync settings and high scores.

## 5. Other Modernisation Angles

- **Telemetry.** Collect only anonymous aggregate metrics: game duration, lines cleared, mode chosen. Never collect keystroke timing or screen contents. Opt-in only.
- **Configuration.** A `tetris.toml` or `settings.json` for key bindings, colors, DAS/ARR, and default mode. CLI flags still supported for compatibility.
- **Internationalisation.** UI strings should be localisable, but the game mechanics are language-independent.
- **Modding.** Allow custom piece skins and color schemes; optionally allow custom shape sets (e.g., pentomino mode) as a toggle.
- **Ports / distribution.** Desktop (Windows/macOS/Linux), web (WebAssembly + canvas), and terminal (TUI) builds from a single codebase.

## 6. What NOT to Change

To keep this recognisable as Tetris, the port must preserve:

- The 10-column × 20-row well.
- The seven tetromino shapes.
- The goal of clearing horizontal lines by fitting pieces together.
- Gravity as the primary pressure.
- Single-keystroke, immediate controls (no menus during play).

## 7. Open Questions

Questions this brainstorm raised that need a decision (usually via ADR):

1. **Which rotation system should the default port use?** SRS is modern but changes the feel; preserving original single-CCW rotation is more authentic. **Needs ADR.**
2. **Should the continuous `faster()` acceleration be kept, replaced with level-based speed caps, or made configurable?** **Needs ADR.**
3. **Should scoring be modernized (line-clear bonuses) or kept flat to match the original?** **Needs ADR.**
4. **What is the target platform / language for the implementation?** A root language ADR is already pending; this game defers to it.
5. **Should replays be deterministic by seed, or should the 7-bag randomizer make them deterministic by construction?** **Needs ADR if replays are implemented.**

## See Also

- [`architecture.md`](./architecture.md) — what we start from.
- [`spec.md`](./spec.md) — the mechanic identity to preserve.
- [`./decisions/`](./decisions/) — where per-game ADRs live.
- Root [ADR-002 Porting Philosophy](../../../docs/decisions/002-porting-philosophy.md).
