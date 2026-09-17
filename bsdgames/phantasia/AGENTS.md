# AGENTS.md — `phantasia` (BSDGames Reborn)

Context for AI agents and human contributors working on the port of
**`phantasia`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Adventure & RPG (Persistent Multi-User Fantasy RPG)
- **One-line description:** An interterminal fantasy RPG from
  1986 AT&T — roll a character (magic user, fighter, elf, dwarf,
  halfling, or experimento), wander a Cartesian world, fight
  monsters, cast spells, meet other players in real time. The
  proto-MMO.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/phantasia>

## 2. Port Status

- **Current status:** 🟠 In Progress (documentation phase)
- **Owner:** Agun Wijaya (with Claude Opus)
- **Baseline released?** no

## 3. Folder Contents

```
phantasia/
├── README.md         Landing page
├── AGENTS.md         This file
├── CLAUDE.md         Thin pointer
├── docs/             12 documentation files
│   └── decisions/    Per-game ADR overrides (may be empty)
├── src/              Implementation (awaiting language ADR)
├── data/             Monster file, help file, character data
├── media/            Screenshots (pending — see notes.md)
└── tests/            Automated tests
```

## 4. Design Decisions Specific to `phantasia`

None yet. All decisions defer to root defaults.

Likely future ADRs:

- **Persistence model** — original uses a shared character file
  with lock-based access. Modernize to SQLite? Cloud DB? Both?
- **Multiplayer transport** — original is single-host inter-terminal.
  Modernize to internet MMO? Keep local?
- **Character-file format compatibility** — should the port read
  old phantasia character files, or start fresh?
- **Purge policy** — original purges idle characters. Preserve?
- **Wizard mode** — root-only privileged mode. Modernize as
  admin panel?
- **MOTD file** — how to modernize the message-of-the-day
  broadcast.

## 5. Gotchas & Non-Obvious Notes

- **Distributed WITHOUT copyright.** Edward Estes's disclaimer in
  `main.c:10-28`: *"This game is distributed without notice of
  copyright, therefore it may be used in any manner the recipient
  sees fit."* Unusual for BSDGames. Legally, this is public
  domain-ish, though not formally disclaimed.
- **AT&T connection.** Estes was at AT&T (Bell Labs) in 1986.
  Bell Labs was where Unix itself came from. The disclaimer says
  *"AT&T is in no way connected with this game"* — legal
  hedging.
- **6 character types**, each with different stat distributions
  AND different progression rates per level.
- **10 stats** (strength, quickness, energy, magic, brains, mana,
  experience, level, poison, sin, age).
- **~15 spells** in three categories: normal play, monster
  combat, inter-terminal battle.
- **100 monsters** loaded from `monsters.asc` data file.
- **Cartesian coordinate world.** No rooms. Movement in HJKL
  vi-style + N/S/E/W. Distance per move = 1 + 1.5×level.
- **Visibility rules**: players see only players closer to origin
  than themselves.
- **Kings, Valar, Council of the Wise** are special ranks with
  extra abilities.
- **Cloaking** hides from monsters and players.
- **Palantir** overrides visibility restrictions (kings can be
  seen by everyone by default).
- **Character file locking** via `flock()` or similar — race
  conditions were a real concern.
- **`interplayer.c`** is the inter-terminal battle system — one
  of the earliest documented real-time PvP implementations.
- **Monster file** (`monsters.asc`) is human-editable ASCII —
  admin can add/edit monsters.
- **Age progresses each turn**; old characters degenerate.
- **Sin accumulates** with nasty actions; rarely matters but
  tracked.

## 6. Workflow

Follow the standard 14-step workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source not committed. Cite upstream only.
- Preserve Edward Estes's public-domain-ish disclaimer verbatim
  when relevant.
- Joseph Samuel Myers's later maintenance headers (1997-2001)
  also preserved where present.
