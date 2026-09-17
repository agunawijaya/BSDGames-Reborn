# `phantasia` — Reverse Specification

> Implementation-independent specification of `phantasia`'s
> mechanics, extracted from the original C source (`main.c`,
> `phantstruct.h`, `phantglobs.c`, `fight.c`, `interplayer.c`,
> `phantasia.6`).

This document is the contract that `src/` and `tests/` must
honour.

Upstream source (not redistributed):
<https://github.com/vattam/BSDGames/tree/master/phantasia>

---

## Objective

- **No fixed win condition.** `phantasia` is a persistent RPG.
- **Death** ends a character. Scoreboard entry.
- **Long-term goals:** ascend to King / Council of the Wise / Valar,
  find the Grail, top the scoreboard.

## State Variables

### Per-Character

Persistent across sessions. Stored in character file.

| Variable | Type | Description |
|---|---|---|
| `name` | char[N] | Character name (unique within login) |
| `password` | char[16] | Login password (plaintext in original — port MUST hash) |
| `type` | int | 1..6 (see below) |
| `level` | int | ≥ 0; derived from experience |
| `experience` | double | Accumulated XP |
| `strength` | double | Physical damage capacity |
| `max_strength` | double | Cap |
| `quickness` | double | Combat action count |
| `max_quickness` | double | Cap |
| `energy` | double | HP |
| `max_energy` | double | Cap |
| `magic` | double | Magic level |
| `max_magic` | double | Cap |
| `brains` | double | Intelligence |
| `max_brains` | double | Cap |
| `mana` | double | Spell power |
| `max_mana` | double | Cap |
| `age` | int | Turn count |
| `sin` | double | Karma tracker |
| `poison` | double | Poison affliction |
| `gold` | double | Currency |
| `x`, `y` | double | Cartesian position |
| `status` | int | Alive / dead / cloaked / etc. |
| `login` | char[N] | Unix login name |
| `login_time` | time_t | Last session start |

### Per-Session (Runtime)

- Global `Player` struct (loaded from file at start)
- `Curmonster` (current monster in combat)
- `Fileloc` (position in character file)
- `Wizard` (root-mode flag)

### Per-World (Shared Across Sessions)

- Character file (all players' records)
- Energy void file (event queue)
- MOTD file (message of the day)
- Scoreboard file (dead characters)
- Monster file (100 monsters, `monsters.asc`)

## Character Types

Six types with stat ranges (from man page and `phantglobs.c`):

| Type | Strength | Quick | Mana | Energy | Brains | Magic |
|---|---|---|---|---|---|---|
| **Magic User** | 10-15 | 30-35 | 50-100 | 30-45 | 60-85 | 5-9 |
| **Fighter** | 40-55 | 30-35 | 30-50 | 45-70 | 25-45 | 3-6 |
| **Elf** | 35-45 | 32-38 | 45-90 | 30-50 | 40-65 | 4-7 |
| **Dwarf** | 50-70 | 25-30 | 25-45 | 60-100 | 20-40 | 2-5 |
| **Halfling** | 20-25 | 34 | 25-45 | 55-90 | 40-75 | 1-4 |
| **Experimento** | 25 | 27 | 100 | 35 | 25 | 2 |

Progression per level:

| Type | Str | Mana | Energy | Brains | Magic |
|---|---|---|---|---|---|
| Magic User | 2.0 | 75 | 20 | 6.0 | 2.75 |
| Fighter | 3.0 | 40 | 30 | 3.0 | 1.5 |
| Elf | 2.5 | 65 | 25 | 4.0 | 2.0 |
| Dwarf | 5.0 | 30 | 35 | 2.5 | 1.0 |
| Halfling | 2.0 | 30 | 30 | 4.5 | 1.0 |

## Actions / Commands

### Main Menu

| Key | Command | Effect |
|---|---|---|
| `1` | move | Move to (x, y) or use vi-keys |
| `2` | players | List visible other players |
| `3` | talk | Send message to another player |
| `4` | stats | Extended stat display |
| `5` | quit | Exit (saves character) |
| `6` | cloak | Toggle cloak spell |
| `7` | rest | Regenerate energy + mana |
| `9`/`C` | call monster | Summon combat |
| `X` | examine | View another player's stats |
| `H`,`J`,`K`,`L` | move vi | Move in vi-directions |
| `W`,`S`,`N`,`E` | move compass | Move in cardinal direction |
| `Ctrl-L` | redraw | Refresh screen |

### Monster Combat

| Command | Effect |
|---|---|
| `melee` | Damage = strength; reduces monster strength |
| `skirmish` | Damage < melee; reduces monster quickness |
| `evade` | Success = brains + quickness contest |
| `spell` | Sub-menu for combat spells |
| `nick` | Small damage; grants 10% monster XP; boosts monster quickness |
| `luckout` | Battle of wits (brains); success = instant kill |

### PvP

| Command | Effect |
|---|---|
| `flee` | Escape encounter |
| `talk` | Chat with opponent |
| `fight` | Enter turn-based PvP combat |

## Rules & Invariants

1. **Character file is authoritative.** All state updates go
   through it. `flock()` prevents corruption.
2. **Every turn advances age by 1.** No exceptions.
3. **Distance per movement = 1 + 1.5 × level.**
4. **Visibility**: player sees only others closer to origin.
   Kings and Council override.
5. **Cloaked players show as `?`** to others; cannot collect
   mana or discover trading posts.
6. **Password is required** on subsequent logins (unless wizard
   mode).
7. **Death = permanent.** Character removed from file; entry
   added to scoreboard.
8. **Idle characters purged** after configurable threshold.
9. **Sin persists across sessions.**
10. **Spell requirements**: magic level + character level.
11. **Movement is Cartesian.** No walls, no rooms.
12. **Wizard mode** (root-only) can modify any character.

## Spell Availability

| Spell | Magic Req. | Char Level Req. | Mana Cost | Context |
|---|---|---|---|---|
| Cloak | 20 | 7 | 35 + 3/rest | Normal |
| Teleport | 40 | 12 | 30 / 75 moved | Normal |
| Power blast | 0 | 0 | 5 × level | PvP |
| All or nothing | 0 | 0 | 1 | Monster |
| Magic bolt | 5 | 0 | variable | Monster |
| Force field | 15 | 0 | 30 | Monster |
| Transform | 25 | 0 | 50 | Monster |
| Increase might | 35 | 0 | 75 | Monster |
| Invisibility | 45 | 0 | 90 | Monster |
| Transport | 60 | 0 | 125 | Combat |
| ... | ... | ... | ... | ... |

## RNG Usage

Seed: `srandom(time(NULL))` typically.

Primitives:

- `ROLL(base, range)` macro → `base + rand() % range`
- `drandom()` → uniform double [0, 1)

Sites:

| Site | Distribution | Effect |
|---|---|---|
| Character creation | `ROLL` per stat within type range | Rolls starting stats |
| Monster spawn | Uniform over monsters | Which monster appears |
| Trading post encounter | RNG check per rest | Whether TP found |
| Luckout resolution | Brains contest | Success chance |
| All-or-nothing | 25% success | Instant kill or self-nerf |
| Combat damage | RNG factors | Actual damage rolled |
| Poison damage | Uniform | Per-turn HP loss |
| Age-related events | Various | Stat degradation |

## Difficulty Levels & Setup Configuration

### No Explicit Difficulty

- Single scale for all players.
- Difficulty = f(character type, level, other-player composition).

### Setup

- **CLI flags**: `-a` (all chars), `-b` (scoreboard), `-H`
  (header), `-m` (monsters), `-p` (purge), `-S` (wizard), `-s`
  (short), `-x` (examine).
- **First-time**: setup by admin creates character/void/scoreboard
  files. Requires filesystem write to game data directory.

### Session Replay

- **Persistent character** — every login continues from prior
  session.
- No save/load — implicit persistence.
- **Character export** — the port could add this for backup.

### Character Purge Policy

- Idle characters (no login for N days) are purged on next
  admin `-p` or automatically.
- Void file is cleared on new King ascension.

## Scoring

- **Only dead characters** appear on scoreboard.
- Score derived from level + experience + gold at death.
- One entry per Unix login (highest score kept).
- View with `phantasia -b`.

## Termination Conditions

- **Character death** (energy < 0 in combat): permanent, goes
  to scoreboard.
- **User quit** (`5` menu option): saves, exits.
- **Purge**: idle for too long → deleted, no scoreboard entry.
- **Wizard modify** (root): can delete any character.

## Not in Scope for the Port

- **Plaintext password storage** — MUST hash in port.
- **`flock()`-based synchronization** — replace with proper DB or
  server.
- **File-based mailbox** — replace with real message queue.
- **PDP-era memory constraints** — irrelevant.
- **Terminal speed detection** — irrelevant.

## Ambiguities in the Original

- **Exact experience-to-level formula** — implicit in code, needs
  reverse engineering.
- **Sin trigger events** — deliberately opaque; some in
  `gamesupport.c`.
- **The Grail mechanics** — deliberately obscured. Community
  knowledge only.
- **Spell resolution formulas** — many magic numbers in code.
- **Age degradation curve** — parametric, needs extraction.

## See Also

- [`architecture.md`](./architecture.md).
- [`test-scenarios.md`](./test-scenarios.md).
