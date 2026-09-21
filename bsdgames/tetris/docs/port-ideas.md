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

## Competitive Landscape

Tetris is possibly the most saturated genre in gaming. Any port must
acknowledge who already owns the space, and what ceilings they've
set. Being honest about this saves us from shipping "generic Tetris
#4001" and forces the design toward a defensible identity.

### The current ceilings

- **[tetr.io](https://tetr.io/)** — the modern competitive standard.
  Browser-based, extremely polished, 100+ player battle royale
  ("TETRA LEAGUE"), custom rulesets, replay system, deep skill
  ceiling. Free. This is where the competitive audience lives; we
  will not out-compete it on pure gameplay depth.
- **[Tetris Effect: Connected](https://www.tetriseffect.game/)** —
  Enhance's audiovisual masterpiece. Sets the ceiling for
  atmosphere: every piece placement is scored, every stage has a
  bespoke visual + musical journey (jellyfish, deep space, tribal
  drums). $40 paid product. We will not out-produce it on polish.
- **[Not Tetris 2](https://stabyourself.net/nottetris2/)** —
  Stabyourself's physics-based Tetris. Pieces obey gravity and
  rotation like rigid bodies; lines clear by *area covered*, not
  by full rows. Free, viral in the mid-2010s. The novelty-Tetris
  slot is taken.
- **[Tetris 99](https://tetris99.nintendo.com/)** (Nintendo
  Switch) — 99-player royale, sends garbage to targeted opponents.
  Owns the mainstream battle-royale slot on console.
- **Mobile clones** — infinite, mostly ad-driven, most people's
  default "casual tetris" (King's *Tetris Blitz*, EA's official
  *Tetris*, dozens of clones). Owns the casual mobile slot.
- **[Jstris](https://jstris.jezevec10.com/)** — competitive
  browser Tetris predating tetr.io, still popular for practice
  and sprint runs. Owns the "purist competitive practice" slot.

### What's still open

- **Historical / archaeological framing.** No mainstream Tetris
  presents itself as a *museum of the game's own history*. The
  1984 Elektronika-60 original, the 1988 Spectrum-Holobyte MS-DOS
  port, the 1989 Game Boy version, the 1992 BSD Chuck Simmons
  terminal port, the 2001 Tetris Worlds era — each has a distinct
  computing-culture footprint. Nobody has bundled that lineage as
  interactive gameplay.
- **Physical / craft aesthetic.** Everyone has a "neon
  cyberpunk" theme; a *wooden puzzle box* aesthetic (real grain,
  chisel marks, blocks that clack instead of ping) has been
  attempted (see [Tetris Effect's wood stage briefly](https://youtu.be/qyoUqoc0ZOs)),
  but not as the entire product identity.
- **Contemplative / no-fail modes.** Tetris Effect has "Zen"
  modes, but a Tetris designed around *slowness* — meditative, no
  score, ambient — remains niche and could be a distinctive local
  identity.
- **BSD lineage / historical accuracy angle.** The Chuck Simmons
  1992 port is a specific artifact with its own quirks (single
  CCW rotation only, `random() % 7` bag, cumulative-clear scoring).
  A port that *preserves* those quirks as an "authentic 1992
  terminal" mode inside a modern shell is a niche nobody occupies.

### Positioning statement (working)

> Not "another Tetris." A **Tetris archaeology**: the specific
> 1992 BSD terminal artifact, framed inside a modern shell that
> lets the player peel back layers of the game's own history.

The full hook this positioning implies is described in
[Distinctive Hook](#distinctive-hook) below.

## Distinctive Hook

Two candidate hooks. **Neither is committed** — this section
brainstorms; the choice becomes a per-game ADR. Both accept that
we cannot win on gameplay depth (tetr.io) or production polish
(Tetris Effect), so we must win on *identity*.

### Hook A — "Terminal Archaeology" *(recommended)*

**Premise:** The port is a **playable museum of Tetris history**.
Five eras, five terminals, one game.

| # | Era | Terminal | What changes |
|--:|---|---|---|
| 1 | 1984 | Elektronika 60 (Pajitnov's original) | Text mode, `[]` blocks, no colour, tight command grammar |
| 2 | 1988 | Spectrum-Holobyte MS-DOS | CGA 4-colour, PC-speaker beeps, Russian folk-tune snippet |
| 3 | 1989 | Nintendo Game Boy | 4-shade green LCD, 8×8 pixel blocks, Type-A/B music (public-domain reinterpretations) |
| 4 | 1992 | **BSD Chuck Simmons terminal** *(the identity anchor)* | Curses-style block glyphs, single-CCW rotation, `random() % 7` bag, cumulative-clear scoring — spec-faithful |
| 5 | 200x | Modern browser | SRS + 7-bag + hold + ghost + hard drop — the tetr.io baseline |

Player unlocks eras by completing lines in the previous one. Each
era carries small mechanical shifts *appropriate to its computing
constraints*: input lag on the Elektronika, refresh flicker on
CGA, DAS/ARR quirks on the Game Boy. Gameplay is recognisably
Tetris throughout; the *feel* narrates the game's own history.

Signature moments:

- Boot sequence for each era (BIOS beep, kernel dmesg, GB startup
  chime — public-domain reinterpretations).
- CRT phosphor shader that changes character per era (green DEC
  VT100 for BSD, amber for MS-DOS, LCD ghosting for Game Boy).
- End-of-era transition: your last stack "dissolves" and reflows
  into the next terminal's pixel grid.

Why this fits **this project**:

- Same "computing archaeology" identity as the shipped
  [`wump/ports/fancy-web/`](../../wump/ports/fancy-web/) (Moria
  aesthetic) and the [`adventure` port's](../../adventure/ports/fancy-web/)
  Ithildin script details. The port is a natural extension of the
  BSD Games project's own thesis: *these programs are historical
  artifacts worth preserving with reverence.*
- No commercial competitor can replicate this without licensing
  the BSD lineage. The moat is authenticity, not budget.

### Hook B — "Wooden Well"

**Premise:** Tetris rendered as a **physical wooden puzzle** — no
neon, no lasers. Blocks are turned oak with visible grain; the
well is a lacquered pine box; line clears trigger a wood-chisel
strike and splinters that fall out the bottom.

Signature moments:

- Each tetromino type has a distinct wood species (oak I, walnut
  O, maple T, cherry L, teak J, ash S, ebony Z). Grain rotates
  with the piece.
- Sounds are sampled: wood-on-wood clacks, hollow "tock" for a
  lock, saw-buzz for line clear, warm bass drone for level up.
- Post-clear, the well shows sawdust settling on the bottom edge
  for a beat before fully clearing.

Why it fits **this project**:

- Aligns with the physical-materials aesthetic direction the
  [`gomoku` fancy-web port](../../gomoku/ports/fancy-web/) took
  (kaya wood board, clamshell stones) and the wooden fences in
  [`worm` Wild mode](../../worm/ports/fancy-web/).
- Removes the "Tetris = electronic arcade" default; positions the
  port as a *tactile object* rather than a *screen experience*.

Weakness: less thematic depth than Hook A. Wooden aesthetic alone
may not carry a full product; likely stronger as a *theme within*
Hook A's modern-era shell than as the whole identity.

### Recommendation

Hook A ("Terminal Archaeology") is the stronger identity. Hook B
becomes an unlockable theme inside Hook A's modern era rather
than a competing product concept. **This is a proposal, not a
decision** — the final choice becomes ADR
`tetris/docs/decisions/002-port-identity-hook.md` (still to write).

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
