# `phantasia(6)` — Original Man Page (Annotated)

> Mirror of `phantasia.6` from BSDGames, converted to Markdown
> with historical annotations.
>
> Upstream source:
> <https://github.com/vattam/BSDGames/blob/master/phantasia/phantasia.6>

---

## NAME

**phantasia** — an interterminal fantasy game

## SYNOPSIS

```
phantasia [-abHmpSsx]
```

## DESCRIPTION

`phantasia` is a role playing game which allows players to roll
up characters of various types to fight monsters and other
players. Progression of characters is based upon gaining
experience from fighting monsters (and other players).

Most of the game is menu driven and self-explanatory (more or
less). The screen is cursor updated, so be sure to set up the
`TERM` variable in your environment.

## OPTIONS

- **`-a`** — Get a listing of all character names on file.
- **`-b`** — Show scoreboard of top characters per login.
- **`-H`** — Print header only.
- **`-m`** — Get a monster listing.
- **`-p`** — Purge old characters.
- **`-S`** — Turn on wizard options, if allowed, if running as
  `root`.
- **`-s`** — Invokes `phantasia` without header information.
- **`-x`** — Examine/change a particular character on file.

Characters are saved on a common file, in order to make the
game interactive between players. Characters are given a password
in order to retrieve them later. Only characters above level
zero are saved. Characters unused for awhile will be purged.
Characters are only placed on the scoreboard when they die.

## PARTICULARS

### Normal Play

A number of the player's more important statistics are almost
always displayed on the screen, with maximums (where applicable)
in parentheses.

The character is placed randomly near the center of a Cartesian
system. Most commands are selected with a single letter or digit.
Movement uses `W`, `S`, `N`, `E` (or lowercase, or vi-keys
`h`, `j`, `k`, `l`). Distance per move = 1 + 1.5 × level.

- **`players` (2)** — see other players, subject to visibility.
- **`talk` (3)** — send a line of text.
- **`stats` (4)** — extended stats.
- **`quit` (5)** — leave.
- **`rest` (default)** — regen energy, find mana.
- **`call monster` (9 or C)** — summon combat.
- **`X`** — examine another player.

### Fighting Monsters

Six options:

- **`melee`** — full damage, based on strength.
- **`skirmish`** — less damage; reduces monster quickness.
- **`evade`** — attempt to flee; based on brains + quickness.
- **`spell`** — cast a monster-combat spell.
- **`nick`** — 1 + sword damage; grants 10% monster XP; boosts
  monster quickness.
- **`luckout`** — battle of wits; success = instant kill.

### Character Statistics

- **strength** — damage.
- **quickness** — decisions per fight.
- **energy level** — HP.
- **magic level** — spell effectiveness.
- **brains** — intelligence.
- **mana** — spell power.
- **experience** — XP.
- **level** — geometric of experience.
- **poison** — sickness debuff.
- **sin** — karma tracker.
- **age** — turn count; degenerates stats.

### Character Types

Six types:

- **magic user** — strong in magic, brains; weak elsewhere.
- **fighter** — well-equipped, good in strength and energy.
- **elf** — very high quickness, above-average magic.
- **dwarf** — very high strength and energy, slow and dumb.
- **halfling** — quick, smart, high energy, poor magic and
  strength; starts with some experience.
- **experimento** — mediocre in all, but flexible starting
  location.

### Starting Statistics

| Type | Str | Quick | Mana | Energy | Brains | Magic |
|---|---|---|---|---|---|---|
| Mag. User | 10-15 | 30-35 | 50-100 | 30-45 | 60-85 | 5-9 |
| Fighter | 40-55 | 30-35 | 30-50 | 45-70 | 25-45 | 3-6 |
| Elf | 35-45 | 32-38 | 45-90 | 30-50 | 40-65 | 4-7 |
| Dwarf | 50-70 | 25-30 | 25-45 | 60-100 | 20-40 | 2-5 |
| Halfling | 20-25 | 34 | 25-45 | 55-90 | 40-75 | 1-4 |
| Experimento | 25 | 27 | 100 | 35 | 25 | 2 |

### Progression per Level

| Type | Str | Mana | Energy | Brains | Magic |
|---|---|---|---|---|---|
| Mag. User | 2.0 | 75 | 20 | 6 | 2.75 |
| Fighter | 3.0 | 40 | 30 | 3.0 | 1.5 |
| Elf | 2.5 | 65 | 25 | 4.0 | 2.0 |
| Dwarf | 5 | 30 | 35 | 2.5 | 1 |
| Halfling | 2.0 | 30 | 30 | 4.5 | 1 |

### Spells

Categorized into Normal / Monster Combat / Inter-terminal.

Highlights (partial list from man page):

- **cloak** (magic 20 + level 7, 35 mana) — hide from monsters
  and players.
- **teleport** (magic 40 + level 12, 30 mana / 75 moved) — long-
  distance movement.
- **power blast** (any, 5 × level mana) — inter-terminal high
  damage.
- **all or nothing** (any, 1 mana) — 25% instant kill, 75%
  double monster.
- **magic bolt** (magic 5, variable mana) — reliable damage.
- **force field** (magic 15, 30 mana) — shield.
- **transform** (magic 25, 50 mana) — random monster swap.
- **increase might** (magic 35, 75 mana) — strength boost.
- **invisibility** (magic 45, 90 mana) — quickness boost.
- **transport** (magic 60, 125 mana) — combat teleport.

## AUTHOR

Edward A. Estes, AT&T (Bell Labs), March 12, 1986.

Distributed without formal copyright per Estes's disclaimer:
*"may be used in any manner the recipient sees fit."*

## SEE ALSO

`vi(1)`, `curses(3)`, `flock(2)`.

---

## Historical Notes (Editor's Additions)

- **AT&T disclaimer**: Estes wrote *"AT&T is in no way connected
  with this game"* — legal-hedging while distributing on AT&T
  infrastructure.
- **No formal copyright** = public-domain-adjacent. Modernizing
  requires a fresh license decision.
- **Wizard mode** (`-S`) is root-only. Sysadmin can modify any
  character.
- **The Grail** — deliberately obscure endgame secret. Not
  documented in man page.
- **`monsters.asc`** — user-editable monster file. First
  documented UGC in gaming?
- **Tolkien vocabulary** — Valar, palantír, grail, etc. — could
  be copyright-sensitive for a modern commercial port.
- **Setup complexity**: not in default Debian bsdgames package
  because character/void/scoreboard files need per-system
  configuration.

## See Also

- [`about.md`](./about.md).
- [`architecture.md`](./architecture.md).
- [`how-to-play.md`](./how-to-play.md).
- [`references.md`](./references.md).
