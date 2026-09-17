# About `phantasia`

> Long before **World of Warcraft**. Before **Ultima Online**.
> Before **MUD1** was even five years old. In 1986, at AT&T Bell
> Labs, Edward A. Estes wrote a game where **multiple players
> logged into the same Unix machine could each roll up a fantasy
> character, walk a shared world in real time, cast spells at
> each other, and permadeath their way to a shared scoreboard**.
> He called it `phantasia`, distributed it without copyright, and
> hoped for the best.

---

## What Is `phantasia`?

`phantasia` is a **persistent multi-user fantasy RPG** shipped
with AT&T Unix and later BSDGames. Every player has a character
saved on the machine's disk — magic user, fighter, elf, dwarf,
halfling, or the wild-card **experimento**. Characters accumulate
stats across sessions. They wander a **Cartesian coordinate
world**, cast a rich taxonomy of spells, fight 100 different
monsters, encounter each other for **real-time inter-terminal
battle**, ascend through ranks all the way to **King** or
**Council of the Wise** or **Valar** (Tolkien reference).

When a character dies, it goes to the scoreboard. Idle characters
are eventually purged. New players roll fresh.

## Screenshots

⚠️ **Live screenshots not captured.** `phantasia` requires per-
system setup (character file, void file, MOTD, scoreboard) that
isn't shipped with the Debian `bsdgames` package. It must be
compiled from source and configured before it will run. See
[`notes.md`](./notes.md) §Screenshot Gap for full context.

Instead, here are **synthetic mockups** based on the man page
description, showing what a running session looks like:

```
                   * * *  Phantasia 3.3.2  * * *
              A game of high fantasy and multi-user
                       inter-terminal battle

Please enter your name (or 'newcharacter'):
```

*The login screen. Enter existing character name or `newcharacter`
to roll a fresh one.*

```
--- Character Type ---
   [1] Magic User      Strong in magic and brains
   [2] Fighter         Strong in strength and energy
   [3] Elf             High quickness, above average magic
   [4] Dwarf           High strength and energy, low magic/brains
   [5] Halfling        Quick, smart, poor magic and strength
   [6] Experimento     Mediocre in all — but starts anywhere

Choose type:
```

*Character creation. Each type has different starting stats and
different progression rates as they level up.*

```
Ymir the Dwarf                                     Level: 12
Coord: (-15, 42)                        Age: 245    Type: Dwarf
Str: 92 (110)   Quick: 34 (38)   Energy: 285 (300)   Sin: 3
Magic: 8 (10)   Brains: 45 (50) Mana: 120 (200)  Gold: 4285

Options:  [1] move  [2] players  [3] talk  [4] stats
          [5] quit  [6] cloak    [7] rest  [9] call monster

Command?
```

*The main play screen. Left panel: character stats with maximums
in parens. Bottom: command options. `phantasia` is menu-driven
with single-key selections.*

```
You encounter a Balrog!

Str: 250   Quick: 45   Energy: 500   Magic: 20   Brains: 60

Options: [1] melee   [2] skirmish   [3] evade   [4] spell
         [5] nick    [6] luckout

Battle command?
```

*Monster combat. Six choice types with different mechanics —
melee is high-damage, luckout is a battle-of-wits, evade tries
to run.*

```
Player 'Gandalf' (Magic User, level 24) at (-15, 43) — 1 hop away!

Options: [1] flee   [2] talk   [3] fight

Choice?
```

*Meeting another player. If both consent to fight, real-time
inter-terminal battle begins — a distinguishing feature that
almost no game of the era had.*

---

## Authors & Publisher

- **Author (1986):** **Edward A. Estes** at **AT&T** (Bell Labs).
  Wrote the game between other Bell Labs work. Version 3.3.2 as
  shipped. Header comment: *"Phantasia 3.3.2 -- Interterminal
  fantasy game. Edward A. Estes. AT&T, March 12, 1986."*
- **Long-term maintainer:** **Joseph Samuel Myers** — later
  maintained the BSDGames port to Linux, including many phantasia
  fixes from 1997 onward.
- **Publisher / distributor:** Distributed through Usenet and
  the BSD Unix ecosystem; later formal in NetBSD BSDGames.
- **Language:** C using `curses`.
- **License:** *No copyright notice*. Estes's disclaimer: *"may be
  used in any manner the recipient sees fit. However, the author
  assumes no responsibility for maintaining or revising this
  game."*

## The AT&T Bell Labs Connection

Bell Labs was **the birthplace of Unix** (Thompson, Ritchie,
Kernighan, and colleagues, starting 1969). By 1986 Bell Labs
had become an environment where programmers routinely wrote
elaborate side projects on their host systems. `phantasia` is a
product of that culture. Estes wrote it, put it on the file
server, and the distributed disclaimer suggests he did NOT get
official AT&T sponsorship. Hence: *"AT&T is in no way connected
with this game."*

## Why It's Historically Monumental

- **The proto-MMO.** In 1986: MUD1 had existed for 8 years but
  was UK-only, over slow trans-Atlantic packet networks.
  `phantasia`, on a single well-configured Unix machine, gave a
  campus 50+ concurrent players sharing a persistent world with
  real-time inter-player combat. This was radical.
- **File-based real-time synchronisation.** No sockets, no
  daemons. Just a shared file with `flock()` locking. Elegant
  and, at times, frustrating.
- **Character persistence.** Your dwarf keeps growing over weeks
  and months of play. Death = permanent (scoreboard entry).
- **Complex character progression.** 6 types × 10 stats × ~15
  spells × ~100 monsters = enough combinatorial depth to keep
  players engaged for years.
- **Tolkien and D&D sensibility.** *Valar*, *Council of the
  Wise*, *palantír*, *Balrog*, *Gandalf*, *Ymir*, *grail* — the
  vocabulary is unapologetically fantasy-genre.

## Difficulty & Progression

`phantasia`'s progression is **character-level based** and
**deep across sessions**:

### 1. Character Type Determines Starting Range

Six types with distinctly different starting stat ranges. Rolled
randomly within type ranges:

| Type | Strength | Quick | Mana | Energy | Brains | Magic |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Magic User | 10-15 | 30-35 | 50-100 | 30-45 | 60-85 | 5-9 |
| Fighter | 40-55 | 30-35 | 30-50 | 45-70 | 25-45 | 3-6 |
| Elf | 35-45 | 32-38 | 45-90 | 30-50 | 40-65 | 4-7 |
| Dwarf | 50-70 | 25-30 | 25-45 | 60-100 | 20-40 | 2-5 |
| Halfling | 20-25 | 34 | 25-45 | 55-90 | 40-75 | 1-4 |
| Experimento | 25 | 27 | 100 | 35 | 25 | 2 |

### 2. Level Progression Rate

Each stat gains at type-specific per-level rates:

| Type | Str | Mana | Energy | Brains | Magic |
|---|:---:|:---:|:---:|:---:|:---:|
| Magic User | 2.0 | 75 | 20 | 6 | 2.75 |
| Fighter | 3.0 | 40 | 30 | 3.0 | 1.5 |
| Elf | 2.5 | 65 | 25 | 4.0 | 2.0 |
| Dwarf | 5 | 30 | 35 | 2.5 | 1 |
| Halfling | 2.0 | 30 | 30 | 4.5 | 1 |

*Experimentos progress randomly as one of the other types each
level.*

### 3. Spell Availability by Level

Spells unlock at specific magic levels:
- *Magic bolt* — level 5
- *Force field* — level 15
- *Cloak* — level 20 (plus character level 7)
- *Transform* — level 25
- *Increase might* — level 35
- *Teleport* — level 40 (plus level 12)
- *Invisibility* — level 45
- *Transport* — level 60

### 4. Special Ranks

- **King** — earned at highest levels; can see and be seen by
  everyone; can grant title.
- **Council of the Wise** — advisory rank; magical benefits.
- **Valar** — Tolkien-style demigods; special powers.

### 5. Age-Based Degeneration

As `age` (turn count) increases, some stats degenerate. Every
character has a natural lifespan.

### 6. Poison and Sin

- `poison` accumulated from various sources; degrades performance.
- `sin` from nasty acts (details opaque); very occasionally
  matters.

## Making-Of Anecdotes

- The disclaimer disowning AT&T (*"AT&T is in no way connected
  with this game"*) is legal-hedging — Estes distributed the
  game against corporate policy but couldn't quite bring himself
  to remove it.
- **No formal copyright.** In 1986, releasing without copyright
  meant it fell into an ambiguous public-domain-adjacent state.
  This was possibly an oversight, possibly deliberate. Estes
  wrote: *"may be used in any manner the recipient sees fit."*
- **The `monsters.asc` file is ASCII.** Administrators could
  edit it. This is one of the earliest examples of *user-generated
  content* in gaming.
- **The purge system** — inactive characters cleared automatically
  — was inspired by real disk-space concerns.

## Cultural Impact

- **Proto-MMO.** Every online RPG since owes something to
  `phantasia`'s "persistent shared world with real players"
  concept.
- **Character-file persistence** became a standard technique for
  Unix game state.
- **Inter-terminal PvP** is a direct ancestor of PvP mechanics in
  Ultima Online, EverQuest, World of Warcraft, EVE Online, and
  every MMO since.
- **Multi-class fantasy RPG** with type-specific stat trees is
  the D&D → Bard's Tale → Baldur's Gate → Divinity → BG3
  lineage. `phantasia` was doing it in text in 1986.

See [`lineage.md`](./lineage.md) for the full family tree.

## Known Bugs (Historical)

- **File-locking race conditions.** Two players hitting the
  character file at exactly the same instant occasionally caused
  corruption. Manual DB repair by admin was a thing.
- **Character file unbounded growth.** Purge is a workaround.
- **Energy void file also grows** — purged when a new King is
  crowned.
- **Cloaking + PvP interaction** — subtle edge cases where a
  cloaked player was visible to non-cloaked opponents.
- **Wizard mode** (root-only) can accidentally corrupt characters
  if used carelessly.

## See Also

- [`how-to-play.md`](./how-to-play.md) — actually playing.
- [`architecture.md`](./architecture.md) — code deep-dive
  (shared-file multi-user model).
- [`lineage.md`](./lineage.md) — proto-MMO family tree.
- [`references.md`](./references.md) — source citations.
