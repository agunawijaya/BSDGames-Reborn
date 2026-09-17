# How to Play `phantasia`

> Roll a character. Wander the world. Cast spells. Fight
> monsters. Meet other players in real time. Try not to die.

---

## Objective

There is no fixed "win" — `phantasia` is a **persistent RPG**
where you level up your character over weeks or months of play.
Long-term goals:

- Grow your character to high levels.
- Accumulate mana, gold, experience, magic level.
- Ascend to **King**, **Council of the Wise**, or **Valar** rank.
- Recover the **Grail** (endgame secret).
- Die dramatically and enter the scoreboard.

There's no end state — only the ongoing story of your character.

## Starting the Game

```
$ phantasia [-abHmpSsx]
```

CLI flags:

- `-a` — list all character names on file
- `-b` — scoreboard of top characters per login
- `-H` — print header only
- `-m` — monster listing
- `-p` — purge old characters
- `-S` — wizard mode (root only)
- `-s` — short mode (no header)
- `-x` — examine/change a specific character

Without flags, you're prompted for a character name. Type
`newcharacter` to roll a fresh one.

## Character Creation

You'll choose one of **6 types**:

| Type | Style | Best For |
|---|---|---|
| **Magic User** | High magic, high brains, low strength | Spellcaster |
| **Fighter** | High strength, high energy | Direct combat |
| **Elf** | High quickness, above-avg magic | Balanced agile |
| **Dwarf** | Very high strength & energy, slow, dumb | Tank |
| **Halfling** | Quick, smart, low magic & strength | Nimble hybrid |
| **Experimento** | Mediocre in all, but flexible spawn | Chaos |

Set a **password** to protect your character. Password is checked
on future logins.

## Reading the Main Screen

Sample layout (from man page description):

```
Name the Type                                 Level: N
Coord: (X, Y)                Age: T    Sin: S    Type: <type>
Str: N (max)   Quick: N (max)   Energy: N (max)
Magic: N (max) Brains: N (max)  Mana: N (max)  Gold: N
```

Numbers in parens are maximums.

## Movement

- **`W`, `S`, `N`, `E`** — move maximum in cardinal direction
- **`H`, `J`, `K`, `L`** — same, vi-style
- **`1` (move)** — move to specific (x, y) coordinate

**Distance per move** = 1 + 1.5 × character level. Higher-level
characters move further.

The world is a **Cartesian plane**. Origin (0, 0) is
central. Distance from origin affects mana regen (further = more
mana per rest).

## Options at the Main Prompt

Single-key menu:

| Key | Command | Effect |
|---|---|---|
| `1` | move | Move to specific coordinates |
| `2` | players | See other players (limited by visibility rules) |
| `3` | talk | Send message to another player |
| `4` | stats | Show extended stats |
| `5` | quit | Leave (saves character) |
| `6` | cloak | Enter/exit cloak (spell) |
| `7` | rest | Rest to regen energy/mana |
| `9` or `C` | call monster | Summon a fight |
| `X` | examine player | Peek at another player's stats |
| `Ctrl-L` | redraw | Refresh screen |

## Visibility Rules

Not everyone sees everyone else:

- You see only players **closer or at the same distance to
  origin** as you.
- **Kings and Council of the Wise** see and are seen by everyone.
- **Cloaked players** show as `?` in the players list.
- **Palantír** (magic item) overrides all restrictions.

This creates a subtle **social geography** — high-status
characters gravitate toward the origin.

## Combat with Monsters

Six choices in monster combat:

| Command | Effect |
|---|---|
| `melee` | Full damage attack (based on strength). Also lowers monster strength. |
| `skirmish` | Less damage but lowers monster quickness. |
| `evade` | Try to flee. Success = brains + quickness contest. |
| `spell` | Cast a monster-combat spell (see below) |
| `nick` | 1 + sword damage, but grants 10% of monster XP and boosts its quickness. Paralyzed monsters wake fast. |
| `luckout` | Battle of wits (brains). Success = full monster kill. Failure = chance lost. |

## Inter-Terminal Battle (PvP)

When you encounter another player and both agree to fight:

- **Power blast** — high damage (mana × level × 5).
- Standard melee-style options.
- **Cloaking** disallowed in active combat.
- Death is **permanent** — your character goes to the scoreboard.

## Spells

Spells are categorized by when they can be cast. See [`spec.md`](./spec.md)
for a full grid. Highlights:

### Normal Play

- **Cloak** (magic 20 + level 7, 35 mana + 3/rest) — hide from
  monsters and other players.
- **Teleport** (magic 40 + level 12, 30 mana / 75 moved) — move
  much further than walk allows.

### Monster Combat

- **All or nothing** (any level, 1 mana) — 25% chance to
  instant-kill; on fail doubles monster's stats.
- **Magic bolt** (magic 5, variable mana) — 10 damage/mana
  guaranteed.
- **Force field** (magic 15, 30 mana) — shield damage cap.
- **Transform** (magic 25, 50 mana) — turn monster into random
  one of 100 monsters.
- **Increase might** (magic 35, 75 mana) — boost strength up to
  cap.
- **Invisibility** (magic 45, 90 mana) — monster hits harder to
  land.
- **Transport** (magic 60, 125 mana) — high-magic special.

### Inter-Terminal Battle

- **Power blast** (any level, 5×level mana) — high PvP damage
  scaled by magic + strength.

## Tips & Tricks

1. **Start with Fighter** if new — most forgiving.
2. **Dwarves for endgame** — highest ceiling on strength & energy.
3. **Magic users take time to develop** — early game is fragile,
   late game dominates.
4. **Talk to Kings** — they might grant favours.
5. **Cloak when travelling long distances** to avoid random monster
   ambushes.
6. **Don't hoard mana** — resting doesn't stack past cap.
7. **Buy from trading posts** when you find them.
8. **Watch your age** — old characters can't compete with new
   ones.
9. **Sin matters occasionally** — don't be a jerk.
10. **Keep a paper map** of trading post locations.

## Scoring

- **Only dead characters** appear on the scoreboard.
- Score = derived from level, experience, gold at time of death.
- One entry per login (Unix login name).
- Higher score replaces lower for same login.
- View with `phantasia -b`.

## Difficulty Modes

`phantasia` has **no explicit difficulty setting**. All players
are on the same scale. Difficulty is determined by:

- **Character type choice** (Fighter easiest, Magic User hardest
  early).
- **Random starting stats** (each type has a range).
- **Ambient other-player behaviour** — a hostile server is
  harder than a friendly one.
- **Monster spawn RNG** — some sessions are unlucky.

## Easter Eggs

- **`newcharacter`** as name → character creation flow.
- **The Grail** — endgame item; details deliberately obscure.
- **Tolkien references** — Valar, Council of the Wise, palantír,
  Balrog, Ymir. All meaningful in-game.
- **Wizard mode** (`-S` as root) — sysadmin god powers.
- **The `monsters.asc` file** — sysadmins can add custom monsters
  by editing this ASCII file. User-generated content.

## Common Pitfalls

- **Forgetting your password** — no recovery. Character lost.
- **Idle characters purged.** Login regularly or lose progress.
- **Attacking above your level** — Balrogs at level 5 = death.
- **Wandering too far from origin** — you can't easily return
  without teleport.
- **Sin accumulation** — subtle but real.
- **`quit` during battle = death.** Battle exit is via winning or
  fleeing.

## See Also

- [`spec.md`](./spec.md) — full formal spec.
- [`architecture.md`](./architecture.md) — how the game engine
  works.
