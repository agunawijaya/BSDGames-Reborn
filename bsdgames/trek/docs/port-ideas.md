# `trek` — Port Design Ideas & Modernisation Brainstorm

> Eric Allman's 1976 command-line masterpiece, reimagined for
> 2026. Keep the guts. Modernise the everything-else.

---

## Guiding Question

> If Eric Allman were building `trek` today, with modern graphics,
> proper multiplayer, and 50 more years of game design lessons —
> what would we get?

---

## 1. Gameplay Modernisation

### AI: Smarter Klingons

- **Coordinated fleet tactics.** Klingons currently act
  independently. Modern AI: Klingon squadron leaders coordinate
  wolf-pack attacks, feinting maneuvers, retreat-and-regroup.
- **Personality-driven captains.** Aggressive, cautious,
  ambitious — different Klingon captains behave differently.
- **Adaptive difficulty.** Klingons learn your patterns and
  counter them.
- **NPC allies.** Federation task forces sometimes appear to help.

### Mechanics

- **Ship customisation.** Instead of one Enterprise, choose from
  Constitution class, Excelsior, Defiant, Sovereign — each with
  different device slots and stats.
- **Officer system.** Promote/demote crew. Officers have skills
  affecting device efficiency. Death of officers matters.
- **Missions and objectives** beyond "kill all Klingons": rescue,
  reconnaissance, first contact, diplomacy, sabotage.
- **Diplomacy layer.** Not every alien is hostile. Trade, treaty,
  spy on. Full 4X-lite mode.
- **Real 3D space** (not just quadrant/sector grid). Optional
  layer.

### Content

- **Named campaigns** — the "Kobayashi Maru scenario," "The
  Doomsday Machine," "Best of Both Worlds." Recreate iconic Star
  Trek moments.
- **Procedural side missions** — generated distress calls,
  anomalies, salvage runs.
- **Community-authored scenarios** — mod support.

## 2. UI / UX Design

### Visual Direction

**Three tiers:**

1. **Classic TUI** — the original ASCII, green phosphor, minimal.
   For purists.
2. **Enhanced TUI** — Unicode box characters, colour, subtle
   animations. Still terminal.
3. **Modern 2D** — top-down galaxy view, animated ships, particle
   effects. Full point-and-click option.

Always the same underlying game engine.

### Interaction Paradigm

- **Command line** — the original, preserved and celebrated.
  Learning to type `phasers manual 500 3.0 15 250 5.0 20` is a
  ritual.
- **Interactive prompts** — the game asks for parameters
  step-by-step in modern mode. Beginner-friendly.
- **Voice interface** — genuinely speak commands. "Sulu, take us
  to warp 5, heading 3.0 mark 0." Uses local speech recognition.
- **Point-and-click** — click a Klingon, choose "fire phasers" from
  context menu.
- **Touch / mobile** — swipe to move, tap to target.

### Layout

- **Multi-pane bridge view** — radar, status, comm, damages, log,
  each in its own pane. Configurable.
- **Optional 3D bridge simulation** — VR mode for the Star Trek
  fantasy.

### Accessibility

- **Colourblind palettes.**
- **Screen reader** — every command, every status change
  announced.
- **Slow-time mode** — trek is turn-based already, but add extra
  breathing room.
- **Configurable keybindings.**
- **Text-only mode** for pure keyboard players.

## 3. Multiplayer / Networking

The original is strictly single-player. Massive room for
modernisation.

### Co-op Bridge Crew

**2–6 players share one ship.** Each takes a station:

- Captain — decides
- Helmsman — moves
- Science officer — scans
- Weapons officer — phasers/torpedoes
- Engineer — devices/damages
- Communications — comm, distress calls

Just like the show. Voice chat naturally slots in.

### Adversarial

- **Klingon captain vs Federation captain** — one player controls
  the Enterprise, one controls a Klingon warlord. Turn-based
  moves, hidden information (fog of war based on scan range).
- **Multiplayer galaxy** — 4-8 captains hunt each other and shared
  Klingon spawns. Battle royale with tactics.

### Persistent Universe

- **Massively multiplayer campaign.** Server-hosted galaxy.
  Klingons breed across sessions. Federation resources shared
  across all captains. Real-life EVE Online but with `trek`
  bones.

### Async

- **Play-by-mail** — one turn per day. Suitable for correspondence
  chess players.
- **Ghost captains** — replay a friend's playthrough as a
  navigable ghost.

## 4. Persistence

- **SQLite / JSON save format** replacing the original raw
  memcpy'd snapshot.
- **Cloud sync** — optional account for cross-device saves.
- **Match replays** — full input log + seed for exact replay.
- **Leaderboard per skill/length**.
- **Achievement system** — "First Klingon killed," "Defeated on
  Impossible," "Captured 10 Klingons alive."

## 5. Other Modernisation Angles

- **Telemetry (opt-in)** — Klingon-kill patterns, cause of loss
  histogram, command usage frequency. Informs difficulty tuning.
- **Configuration** — flags map to original (`-a`, `-f`, `-s`)
  plus new (`--skill novice --length short --seed 42`).
- **i18n** — the game has significant text. Localise into
  Klingon (yes, real Klingon language, tlhIngan Hol). Star Trek
  fans will love it.
- **Modding API** — custom ships, custom scenarios, custom AI
  behaviour scripts.
- **Streaming / broadcast mode** — special UI optimised for Twitch
  audiences. Log audible. Big fonts.
- **Educational mode** — teaches command language incrementally.
  Star Trek gamification for kids learning CS.

## 6. What NOT to Change

Preserve to remain recognisably `trek`:

- **Turn-based, command-driven.** No real-time.
- **8×8 galaxy of quadrants.** Iconic. Changing = different game.
- **10×10 sector grid per quadrant.**
- **Enterprise (or Queene) as the ship glyph.** Uppercase letter.
- **Klingons as `K`.** No mercenaries, no Romulans by default —
  those are optional expansions.
- **The 14 devices.** Warp, phasers, torpedoes, shields, computer,
  ssradio, life support, SINS, cloak, transporter, shuttlecraft.
  All preserved with their names.
- **Skill scale novice → impossible.** Names are canon.
- **Length scale short → long.**
- **The command language.** `srscan`, `phasers manual`, `torpedo`,
  `warp`, `move`, `dock`. All preserved as valid commands.
- **The `?` completion feature.**
- **The 13 lose codes.** Every way to die is documented and
  preserved.
- **Uhura, Sulu, Scotty, Chekov, Spock, Kirk** as personality
  hooks.
- **`ATC - by Ed James`** — wait, wrong game. **`* * * S T A R
  T R E K * * *`** as the banner.
- **Eric Allman's credit** somewhere prominent.

## 7. Open Questions

Design decisions raised that need per-game ADRs:

- Should the port bundle official Star Trek canon (species,
  ships, planets) or use generic replacements to avoid IP issues?
- Is the Klingon language i18n a joke or a real feature? Both
  valid.
- Should VR be a stretch goal or first-class?
- Multiplayer scoring: shared per crew, or per-player attribution?
- Should modernization allow "pause" or preserve the never-suspend
  rule from `atc`? Trek is turn-based so pause is meaningless,
  but between-turn breaks may need policy.
- Time-warp snapshot mechanic — preserve as gameplay feature, or
  hide behind "developer mode"?
- Ship customisation vs canonical Enterprise-only — which is
  default?

Each becomes an ADR in [`./decisions/`](./decisions/).

## See Also

- [`architecture.md`](./architecture.md) — what we start from.
- [`spec.md`](./spec.md) — mechanic identity to preserve.
- [`./decisions/`](./decisions/) — per-game ADRs.
- Root [ADR-002 Porting Philosophy](../../../docs/decisions/002-porting-philosophy.md).
