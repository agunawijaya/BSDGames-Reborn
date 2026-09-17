# `atc` — Port Design Ideas & Modernisation Brainstorm

> Spiritual successor blueprint for Ed James's masterpiece.
> Preserve the dread. Modernise the delivery.

---

## Guiding Question

> If Ed James were writing `atc` today, with 40 years of game
> design, real hardware, and internet infrastructure — what would
> the game feel like, while remaining recognisably `atc`?

---

## 1. Gameplay Modernisation

### AI: Better "Plane Autopilot" Behaviour

The original planes have zero autonomous behaviour — they obey
your commands and blindly fly into terrain if you forget them.
This is intentional (you're the intelligence). But small optional
autopilot features would let players scale to bigger fleets:

- **Auto-hold** — plane circles automatically if it would exit
  through the wrong border.
- **TCAS-lite** — a subtle audio cue when two planes will collide
  next tick if no action taken.
- **Auto-descend for approach** — plane self-descends to airport
  altitude when pointed at its destination airport within N tiles.

All **opt-in per plane** via new command flags (e.g. `Xh` = plane X:
auto-hold). Default off — the classic experience remains.

### Mechanics

- **Weather zones** — regions of the arena where planes can only
  descend, not turn. Adds true 3D thinking.
- **Multiple runways per airport** — planes can land in any of
  several allowed directions.
- **Emergency planes** — occasional low-fuel / damaged planes need
  priority routing. Introduces triage.
- **Larger direction resolution** — 16 or 32 compass points, not
  8. Modern radar resolution.
- **Continuous fuel model** — fuel as a float that ticks down at
  variable rate depending on altitude & speed. Realistic.

### Playfields

- **Preserve all 17 originals** as canonical playfields.
- **Import editor** — GUI to design new playfields; export to
  original yacc DSL for compatibility.
- **Community sharing** — steam workshop / GitHub-hosted playfield
  library.
- **Real-world airports** — playfields based on JFK, LHR, Narita
  approach patterns. Educational.

### Difficulty Progression

Introduce **campaign mode**:

- Level 1: 2 planes at a time on `easy`.
- Level 5: Full `default` challenge.
- Level 10: `Killer`.
- Level 15: `Atlantis`.
- Level 20: real-world SFO/JFK approach mode.

Unlockable. Score-based progression. Endless mode = classic
experience preserved.

## 2. UI/UX Design

### Visual Direction

**Two modes:**

- **Retro TUI** — green phosphor on black, exact 1986 aesthetic.
  Default for purists.
- **Modern radar** — realistic ATC scope, vector graphics, callouts
  for each plane showing altitude/direction/destination in a modern
  ATC display style. Optional.

Both share the same command grammar and same underlying game logic.

### Interaction Paradigm

- **Command line** — the original, retained as primary input.
  Muscle memory matters.
- **Keyboard shortcuts** — number keys quick-select planes; single-key
  common commands.
- **Voice input** — speak commands like a real controller ("United
  4-2, descend and maintain 3000"). Uses local speech recognition.
  **Optional and off by default** — this is a modernisation, not a
  purity violation.
- **Touch** — tap a plane, swipe to indicate direction, pinch for
  altitude. Mobile UX.
- **Controller** — planes on left stick, commands on d-pad. Console
  UX.

### Layout

- **Adaptive to screen size** — no more 80×24 lock-in. Radar
  scales, info panel resizes.
- **Multi-monitor** — radar on primary, info + input on secondary.
- **Zoom** — pan and zoom radar on large playfields.

### Accessibility

- **Colourblind palettes** — all 8 default colours have accessible
  alternatives.
- **Screen reader** — game state announced verbally on request
  (`?` in accessibility mode reads current plane list aloud).
- **Slow-time** — an accessibility toggle that stretches ticks
  by 2× or 3×. Available in single-player only; disables score
  logging in ranked mode.
- **Custom keybindings** — everything remappable.

## 3. Multiplayer / Networking

The original is strictly single-player. Add:

- **Cooperative multiplayer (2-4 controllers)** — one shared
  playfield, each player controls a subset of planes. Assigned by
  colour code.
- **Adversarial "Godmode"** — one player controls the ATC, another
  controls the plane spawn generator (choose type, direction,
  destination, timing). Fun asymmetric mode.
- **Async competitive** — same playfield seed, everyone plays
  same starting conditions. Compare scores. Daily challenge.
- **Ghost recording** — replay another player's session as an
  overlay. Learn from the pros.
- **Tournaments** — regular structured events. `atc` esports? Maybe.

## 4. Persistence

- **Local SQLite / JSON scores** replacing the shared score file.
- **Cloud sync** — optional account for cross-device history and
  leaderboards.
- **Match replays** — full input+seed log for exact replay.
- **Playfield history** — track best score per playfield per player.

## 5. Other Modernisation Angles

- **Telemetry (opt-in, anonymised)** — collect: score
  distribution, cause-of-loss frequency (fuel > collision > wrong-exit?),
  playfield popularity. Improves difficulty tuning.
- **Configuration** — flags map to original (`-g`, `-r`, etc.) plus
  new (`--speed 1.5x`, `--tutorial`, `--voice`, `--seed`).
- **Internationalisation** — command grammar in English but plane
  callouts and messages translatable.
- **Modding API** — custom playfields (already), custom plane
  types, custom AI plane behaviours as sandboxed scripts.
- **Educational mode** — real ATC phraseology as an alternative
  command set. Aviation-community friendly.
- **Ports** — desktop (Linux/mac/Win), web (WASM), mobile, VR
  tower mode (see below).

### The VR Tower Fantasy

A separate stretch goal: instead of top-down radar, put the player
**inside a tower** with a real 3D view. Same game logic, same plane
management, but the visual metaphor is "look out the window and see
the planes moving." Uses XR headset. Voice input becomes the natural
UI. Different product, same DNA.

## 6. What NOT to Change

Preserve to remain recognisably `atc`:

- **Real-time tick with player commands submitted between ticks.**
- **Empty-Enter as tick fast-forward.**
- **Deterministic plane state machine** — no autonomous plane AI
  in classic mode.
- **Player types commands, not clicks.** Command grammar is the
  identity.
- **Collision = adjacency in all three axes.**
- **Jets = lowercase, props = uppercase, jets move every tick,
  props every other.**
- **17 canonical playfields with original names and layouts.**
- **Author signature** — `ATC - by Ed James` visible somewhere in
  the modernised UI.
- **`?` completion feature** — grammar-driven help.
- **Score = planes safely delivered.** No time bonus.
- **Suspend NOT permitted** in the default mode. The pain is the
  point.

## 7. Open Questions

Design decisions raised that need per-game ADRs:

- Should voice input be a "modernisation mode" toggle, or a
  separate binary/mode? Voice conflicts with the typing identity.
- What's the pause policy? Original has none. Modern accessibility
  demands one. How do we split "purist mode" (no pause) from
  "accessible mode" (pause allowed, score marked as such)?
- Should the yacc DSL for playfields be preserved (compat with
  community-authored files) or replaced with JSON? Or both, with
  round-trip conversion?
- Should ranked leaderboards distinguish TUI vs modern-radar? The
  latter is arguably easier due to better visual affordances.
- Multiplayer scoring: shared score or per-plane attributed?
- Should the campaign mode be included in v1 or ship-after? Adding
  it changes the "endless survival" purity.

Each becomes an ADR in [`./decisions/`](./decisions/).

## See Also

- [`architecture.md`](./architecture.md) — what we start from.
- [`spec.md`](./spec.md) — mechanic identity to preserve.
- [`./decisions/`](./decisions/) — per-game ADRs.
- Root [ADR-002 Porting Philosophy](../../../docs/decisions/002-porting-philosophy.md).
