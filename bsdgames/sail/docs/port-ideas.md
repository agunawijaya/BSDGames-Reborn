# `sail` — Port Design Ideas & Modernisation Brainstorm

> Dave Riggle's 1980 multi-process wooden-ship simulator,
> reimagined for 2026 internet multiplayer.

---

## Guiding Question

> If Dave Riggle were writing `sail` today — with WebSockets,
> WebGL, and 40 years of naval-sim design — what would he build?

---

## 1. Gameplay Modernisation

### AI Captains

- **Personality-driven captains.** Nelson-style aggressive vs.
  Villeneuve-style cautious.
- **Historical AI profiles** for named scenarios — try to match
  the real Villeneuve's actual decisions at Trafalgar.
- **Adaptive learning** — AI adjusts to player patterns over
  repeated scenarios.
- **Team AI** for larger scenarios (Algeciras 10-ship battles).

### Mechanics

- **Ammunition types** — expand beyond 4 (round/double/chain/grape)
  to include heated shot, canister, langrage.
- **Crew skill trees** — captains gain XP; crews improve tiers.
- **Ship damage model** — mast-specific damage, water damage,
  fire spread.
- **Weather system** — full storm mechanics, fog, night
  visibility.
- **Currents and tides** — coastal scenarios add complexity.
- **Ship customization** — captain chooses armament, crew
  quality, sail configuration.

### Content

- **50+ scenarios** — expand from 32 with community content.
- **Campaign mode** — string of related scenarios (Nile campaign,
  Trafalgar buildup).
- **Custom scenario editor** — GUI or DSL.
- **Named captains** — Nelson, Villeneuve, Preble, Perry with
  historical bios.

### Preserve

- **32 historical scenarios** as canonical.
- **4 shot types** as canonical.
- **5 crew quality tiers**.
- **8-direction facing**.
- **Battle sails vs. full sails** trade-off.
- **Rake damage bonus**.
- **Fouling and boarding** mechanics.

## 2. UI / UX Design

### Visual Direction

**Three tiers:**

1. **Classic TUI** — 1980 aesthetic, ASCII ships, green phosphor.
2. **Enhanced TUI** — Unicode box characters, colour by
   nationality, sail glyphs.
3. **2D top-down** — proper naval sim graphics; smoke, water
   effects, cannon flash.

### Interaction Paradigm

- **Command line** — original grammar preserved (`l1r1r2`).
- **Point-and-click** — click waypoint, click shot type, click
  target.
- **Real-time hybrid** — commands still batched to turns, but UI
  is responsive between polls.
- **Touch / mobile** — swipe to rotate ship, tap targets.

### Layout

- **Multi-pane** — battle grid, ship status, wind vane, comms,
  log.
- **Configurable panels**.
- **Multi-monitor** — battle on primary, status/log on
  secondary.

### Accessibility

- **Colourblind palettes** — nationality colours are load-bearing.
- **Screen reader** — describe ship positions, wind, damage.
- **Configurable turn timers** — for players who need more time.
- **Keyboard-only** — all mouse actions have keys.

## 3. Multiplayer / Networking

### Internet Multiplayer

- **WebSocket server** running scenarios.
- **Real-time joining** — original supports mid-game join
  (slowly); modern port makes it fast.
- **Voice chat integration** — like real bridge command.
- **Cross-platform** — desktop, web, mobile.

### Scenario Rooms

- **Public scenario rooms** — join any that has open ship slot.
- **Private rooms** — invite friends.
- **Scenario matchmaking** — find players of similar skill.
- **Ranked mode** — competitive ladder for scenarios like frigate
  duels.

### Async

- **Play-by-mail** — one turn per hour, day, or week. Correspond
  by email.
- **Ghost replays** — watch a friend's captaincy replayed.

## 4. Persistence

- **Cloud accounts** for cross-device continuity.
- **Career stats** — historical scenarios completed, ranks
  achieved.
- **Custom scenario library** — community sharing.
- **Match replay archive** — record every game.

## 5. Other Modernisation Angles

- **Telemetry** — opt-in. Balance data: scenario win rates by
  crew quality, ship class survivability.
- **Configuration** — flags map to original (`-s`, `-l`, `-x`,
  `-b`, `num`) plus new (`--server`, `--voice`, `--replay`).
- **i18n** — scenarios have historical names in multiple
  languages. Localise carefully.
- **Modding** — Lua or DSL for custom captains, scenarios,
  ships.
- **Educational mode** — teach real Napoleonic naval tactics.
- **Livestream mode** — Twitch-optimised UI.
- **Historical timeline** — link scenarios to Wikipedia articles.

## 6. What NOT to Change

Preserve to remain recognisably `sail`:

- **Turn-based, polled multi-user gameplay.**
- **Movement command grammar** (`l1r1r2` etc.).
- **32 canonical historical scenarios** with original names.
- **2-character ship glyphs** (case-driven for sail state).
- **4 shot types** (round, double, chain, grape).
- **5 crew quality tiers** (Elite / Crack / Mundane / Green /
  Mutinous).
- **8 compass headings**.
- **Battle vs. full sails** with 2x rigging damage risk.
- **Rake damage bonus** on bow-to-stern axis.
- **Fouling / grappling / boarding** mechanics.
- **Repairs at 2 points per 3 turns.**
- **Hurricane destroys all ships.**
- **Riggle's colorful man page style** — reference in modern
  docs.
- **Historical crew quality assignments** — American Elite,
  Mundane British, etc.

## 7. Open Questions

Design decisions raised that need per-game ADRs:

- **Real-time or turn-based?** Original is turn-based via poll.
  Modern could be either. Trade-off between authenticity and
  responsiveness.
- **Poll interval** — original 7 seconds. Modern port shorter?
  Configurable?
- **`link()` lock replacement** — proper DB transactions? In-
  memory server state? WebSocket message ordering?
- **AI captain sophistication** — full behaviour tree vs.
  neural policy? Trade-off between explainability and skill.
- **Scenario portability** — should custom scenarios be
  portable across versions? Versioning scheme?
- **Multiplayer scoring** — per-scenario ranking or global
  Elo?
- **Voice chat** — mandatory for realism, optional for
  accessibility?
- **Historical inaccuracy in favor of gameplay** — how much do
  we bend history for fun?
- **Modding sandbox** — full custom ships / captains vs. curated
  content?
- **Star Trek scenario (31)** — preserve as easter egg or drop?

Each becomes an ADR in [`./decisions/`](./decisions/).

## See Also

- [`architecture.md`](./architecture.md).
- [`spec.md`](./spec.md).
- [`./decisions/`](./decisions/).
- Root [ADR-002 Porting Philosophy](../../../docs/decisions/002-porting-philosophy.md).
