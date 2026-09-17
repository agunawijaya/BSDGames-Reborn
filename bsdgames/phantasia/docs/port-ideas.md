# `phantasia` — Port Design Ideas & Modernisation Brainstorm

> The proto-MMO from 1986, reimagined for 2026. This one is
> ambitious: we could ship a real modern MMO with `phantasia`'s
> DNA at its heart.

---

## Guiding Question

> If Edward Estes were writing `phantasia` today, with modern
> networking, cloud persistence, and 40 years of MMO design
> learning — what would he build?

---

## 1. Gameplay Modernisation

### AI Monsters

- **Behaviour trees per monster type.** Balrogs stalk; Nazgul
  patrol; Trolls guard bridges.
- **Difficulty-adjusted encounters.** Match monster to player
  level within tolerance to prevent one-shots.
- **Persistent monster memory.** A wounded monster remembers you
  and hunts.
- **Cooperative monster packs.** Multiple monsters coordinate.

### Mechanics

- **Skill trees per class** — extend the 5-stat progression into
  branching skill trees like Diablo or Path of Exile.
- **Item system** — modern weapons, armor, consumables, unique
  drops.
- **Crafting** — trading posts extend into a full economy.
- **Quests** — persistent NPCs giving objectives.
- **Guilds** — persistent player organizations with shared
  storage.
- **Housing** — persistent player-owned coordinates.

### Content

- **New character types** — Rogue, Cleric, Bard, Ranger,
  Necromancer.
- **Racial variants** — subtypes within each type.
- **Environmental hazards** — lava zones, storms, void regions.
- **Named NPCs** — Kings and Council members that persist and
  interact.
- **Endgame raids** — 5+ player content requiring coordination.

### Preserve the Proto-MMO Charm

- **Cartesian world with distance-based visibility** — core
  identity, must survive.
- **Real-time inter-terminal battle** — the reason this game
  matters.
- **Character permadeath** as an option (safe/hardcore modes).
- **Type-specific stat progression tables** — data-driven design
  is worth keeping.

## 2. UI / UX Design

### Visual Direction

**Three tiers:**

1. **Classic TUI** — green phosphor, exact 1986 aesthetic. For
   purists.
2. **Enhanced TUI** — Unicode box characters, colour, subtle
   animations. Still terminal.
3. **Modern 2D** — top-down world view with animated sprites,
   tile-based movement, particle spells. Full mouse + keyboard.

### Interaction Paradigm

- **Command line** for classic mode.
- **Hotbars** for modern mode — spells on 1-9, movement WASD,
  target with mouse.
- **Voice chat** — proximity-based (players within N tiles hear
  each other).
- **Emotes** — /dance, /bow, /wave.

### Layout

- **Multi-pane** — world view, stats, minimap, chat, inventory.
- **Configurable** — drag panels, save layouts.
- **Mobile-responsive** — swipe to move, tap to target.

### Accessibility

- **Colourblind palettes.**
- **Screen reader** — announce your position, health, nearby
  players.
- **Configurable spell hotkeys.**
- **Slow-mode** — extend turn timers for accessibility.

## 3. Multiplayer / Networking

**This is where `phantasia` should shine.** The original was
proto-MMO on a single host. Modernize to full internet MMO.

### Persistent Server

- **Single global shard** or **regional shards** with cross-shard
  travel.
- **Authoritative server** (game logic runs on server, clients
  are dumb).
- **WebSocket-based real-time** for combat and chat.
- **HTTP for slower operations** (browse scoreboard, view
  character).

### Cross-Platform

- **Desktop** (Rust + native).
- **Web** (WASM + xterm.js or Canvas).
- **Mobile** (React Native or Flutter).
- All talk to the same server; account portable.

### Guilds & Social

- **Guilds** with shared bank, chat, coordinated raids.
- **Friends list** with proximity notifications ("Gandalf is
  online 3 zones from you").
- **In-game mail** for offline messaging.
- **Trading** with proper escrow.

### Anti-Cheat

- **Server-side validation** of every action.
- **Rate limiting** on repeated actions.
- **Log-based analytics** for anomaly detection.

### Regions & Localization

- **US / EU / Asia servers** with region-locked accounts (or not).
- **UI localization** across major languages.
- **Chat auto-translate** (opt-in).

## 4. Persistence

- **Cloud-native**: PostgreSQL or Cassandra for character DB;
  Redis for real-time state; S3 for backups.
- **Character migration** across shards.
- **Character sharing** — link to view a character's history.
- **Achievement system** — persistent unlocks.
- **Replay for legendary battles** — 5-minute clips saved to
  cloud.

## 5. Other Modernisation Angles

- **Telemetry** — opt-in. Track: class balance, spell usage,
  session length, cause of death.
- **Configuration** — flags map to original (-a, -b, -m, -p, -S,
  -s, -x) plus new (--server, --account, --hardcore).
- **i18n** — significant text; localise Tolkien references
  carefully (or offer classic English mode).
- **Modding** — the `monsters.asc` heritage. Support Lua or a
  small DSL for community-authored monsters, quests, items.
- **Streaming mode** — special UI optimised for Twitch.
- **Educational mode** — teach D&D basics through gameplay.

## 6. What NOT to Change

The identity of `phantasia` that must be preserved:

- **6 canonical character types** (Magic User, Fighter, Elf,
  Dwarf, Halfling, Experimento). Names preserved.
- **10 core stats** (strength, quickness, energy, magic, brains,
  mana, experience, level, poison, sin, age).
- **Cartesian coordinate world.** Not tiles, not rooms.
- **Distance-from-origin visibility rule.**
- **King, Council of the Wise, Valar** ranks. Tolkien vocabulary.
- **Palantír** as ultimate visibility item.
- **Grail** as endgame secret.
- **~15 spells** with type-based level requirements.
- **Six combat actions**: melee, skirmish, evade, spell, nick,
  luckout. All preserved.
- **All-or-nothing spell** with its risk/reward. Iconic.
- **Cloak** with its trade-offs. Never a free defense.
- **Inter-terminal PvP** — turn-based, mana-costly, high-risk.
- **Age-based degeneration.** Characters have lifespans.
- **Public-domain-adjacent distribution.** Preserve Estes's
  disclaimer in credits.

## 7. Open Questions

Design decisions raised that need per-game ADRs:

- **Permadeath default?** Original enforces it. Modernise with
  optional safe mode + hardcore mode? Or single canonical mode?
- **Password security migration.** Original stores plaintext.
  Modern port MUST hash. Migration path for existing character
  files?
- **Server model** — single global shard vs. regional shards vs.
  federated multi-server? Trade-offs on discoverability,
  latency, community.
- **Character portability** — should modern `phantasia`
  characters transfer between server instances?
- **Bot detection** — MMOs have real bot problems. What's the
  policy?
- **Free vs. paid** — hosting an MMO costs money. Free with
  cosmetic microtransactions? Subscription? One-time purchase?
- **Client architecture** — thick client with predictive logic
  vs. thin client that trusts server? Trade-offs on cheat
  resistance vs. latency.
- **Real-time PvP arbitration** — how do simultaneous turn ties
  resolve in a networked context?
- **Modding sandbox** — how far to let community-authored content
  affect balance? Full sandbox vs. curated?
- **Tolkien reference licensing** — Valar, palantír are Tolkien
  Estate protected trademarks. Renamed? Kept with attribution?

Each becomes an ADR in [`./decisions/`](./decisions/).

## See Also

- [`architecture.md`](./architecture.md).
- [`spec.md`](./spec.md).
- [`./decisions/`](./decisions/).
- Root [ADR-002 Porting Philosophy](../../../docs/decisions/002-porting-philosophy.md).
