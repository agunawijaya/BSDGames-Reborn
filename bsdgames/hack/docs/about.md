# About `hack`

> *"You descend into the Dungeons of Doom in search of the Amulet of Yendor. Beside you trots your faithful little dog. Below you wait thirty levels of cunning traps, ferocious monsters, enchanted weapons, and the restless ghosts of adventurers who came before."*

---

## The Pitch

In 1980, Michael Toy and Glenn Wichman created *Rogue*, introducing the world to procedurally generated dungeons, permadeath, and turn-based tactical ASCII exploration. But *Rogue* was proprietary and distributed only as compiled binaries with early BSD releases.

In 1982, high school student **Jay Fenlason** and his friends decided to write their own open-source reimagining in C: **`hack`**. When Fenlason shared the code, Dutch mathematician and Unix wizard **Andries Brouwer** at CWI Amsterdam took the reins, expanding the program by more than three hundred percent. Brouwer introduced revolutionary mechanics that redefined interactive entertainment: a loyal companion pet dog (`d`), multi-tile slithering long worms (`w`), subterranean general stores with hot-tempered shopkeepers, and the legendary "bones" system—where dying saves your corpse, ghost, and gear into the dungeon files for future players to discover.

In 1987, Mike Stephenson organized a team around Brouwer's code to create *NetHack*, which became one of the longest-running, most celebrated open-source game projects in human history. BSD *Hack* is the sacred origin: the pure, unfiltered wellspring from which modern roguelikes arose.

---

## Visual Presentation

![Awakening in the Dungeons of Doom](../media/01-dungeon.png)
*Figure 1: Entering Dungeon Level 1 accompanied by your faithful pet dog (`d`).*

![Subterranean General Store](../media/02-shop.png)
*Figure 2: Trading items with the shopkeeper in a brightly lit dungeon store.*

![Tombstone of the Fallen](../media/03-death.png)
*Figure 3: The iconic ASCII tombstone memorializing a fallen adventurer and generating a persistent bones file.*

---

## Historical & Cultural Background

| Metadata | Details |
|---|---|
| **Original Title** | *Hack — exploring the Dungeons of Doom* |
| **Original Authors** | Jay Fenlason, Kenny Woodland, Mike Thome, Jon Payne (Lincoln-Sudbury High School, 1982–1984) |
| **Major Expansion** | Andries Brouwer (Centrum Wiskunde & Informatica - CWI, Amsterdam, 1984–1985) |
| **BSD Integration** | 4.3BSD (June 1986) |
| **Language** | C (K&R C, later modernized to ANSI C in NetBSD) |
| **Upstream Code** | [`vattam/BSDGames/tree/master/hack`](https://github.com/vattam/BSDGames/tree/master/hack) |

### The High School Genesis & The CWI Leap

In the early 1980s, Jay Fenlason attended Lincoln-Sudbury Regional High School in Massachusetts, which had acquired a PDP-11 minicomputer. Enchanted by *Rogue*, Fenlason and his classmates set out to build an open clone with more monsters (expanding the bestiary from 26 lettered creatures to 52+), more items, and greater environmental variety. Fenlason famously quipped in the original `Original_READ_ME`:

> *"This is export hack, my first semester programming project... If you find any bugs or have ANY questions, write me: Jay Fenlason, 29 East St., Sudbury Mass., 01776... Since I have both a modem and a teen-age sister, Good Luck."*

When Fenlason distributed the source on USENET, Andries Brouwer encountered it at CWI Amsterdam. Brouwer overhauled the codebase, transforming a simple dungeon crawler into a rich simulation of emergent world interactions. Brouwer introduced the pet dog, which could sniff out cursed items; shopkeepers who guarded their merchandise with shotguns and wands; and long worms whose segments could be individually severed.

When Brouwer stepped down in 1987 to focus on mathematics and the Linux kernel, Mike Stephenson formed the NetHack DevTeam, carrying *Hack*'s codebase forward into the modern era.

---

## Why It's Fun

1. **Unprecedented Emergent Depth:** The world operates on consistent physical and magical rules. You can kick locked chests to crack them open (at the risk of breaking delicate potions inside); you can throw meat to pacify hostile wolves; you can use your pet dog to test whether an unidentified ring is cursed.
2. **The Mystery of the Unknown:** Wands, potions, scrolls, and rings change appearances every game. A bubbly blue potion might be extra healing in one run and lethal poison in the next. Discerning item identities through clever experimentation is a master game of deduction.
3. **The Bones File Community Experience:** Dying doesn't just end your game; it creates history. Your ghost and possessions are preserved in a binary bones file. When a friend plays on the same machine, they might enter a dark chamber and discover your tombstone and an angry ghost bearing your name.
4. **The Sanctuary of "Elbereth":** When cornered by minotaurs or lethal dragons, carving the sacred word *"Elbereth"* into the dust with your fingertips repels monsters in awe, creating legendary clutch survival moments.
5. **Role Variety:** Playing as an armored Knight with a warhammer feels fundamentally different from playing a frail Wizard casting magic missiles or a Tourist wielding a dart gun and camera.

---

## Difficulty & Progression

*Hack* is famous for its uncompromising tactical difficulty, requiring patience, game knowledge, and strategic risk management:

### Progression Phases

1. **The Upper Dungeons (Levels 1–10):**
   - Resource scarcity and basic survival. Managing hunger (`corpses`, `food rations`), avoiding early poisonous bites (killer bees, snakes), identifying armor class (AC), and finding a general store to sell excess loot.
2. **The Mid Dungeons (Levels 11–20):**
   - Lethal monster abilities: Rust monsters corroding your armor, cockatrices whose corpses petrify anyone touching them without gloves, nymphs stealing vital wands, and minotaurs dealing massive melee damage.
3. **The Deep Abyss & Sanctum (Levels 21–30):**
   - Darkness, fire, and demon princes. Locating the Wizard of Yendor's lair, executing the final boss battle, and claiming the legendary **Amulet of Yendor**.
4. **The Ascension Run (Upward Climb):**
   - Once the Amulet is secured, the player must climb all 30 levels back to Level 1 and escape to the surface. Carrying the Amulet increases monster spawn rates, drains magical energy, and summons the Wizard's vengeful ghost to harass the player.

---

## Known Quirks & Bugs in the Original

1. **Floating Point Shopkeeper Overflow:**
   - In early versions of `hack.shk.c`, carrying huge amounts of gold combined with credit slips could trigger integer overflow in bill calculations, causing the shopkeeper to pay the player vast fortunes.
2. **Corpse Rot Timing:**
   - Corpses dropped by slain monsters decay into tainted meat after a set number of turns. Eating tainted meat inflicts fatal food poisoning.
3. **Cockatrice Touch of Death:**
   - Wielding a dead cockatrice corpse as a weapon petrifies any monster struck by it. However, tripping over a pit trap or falling down stairs while carrying it immediately petrifies the player to stone!

---

## See Also

- [`how-to-play.md`](./how-to-play.md) — Controls, mechanics, and survival strategy.
- [`walkthrough.md`](./walkthrough.md) — The Universal Ascendant Survival Protocol.
- [`world-map.md`](./world-map.md) — Dungeon architecture and procedural generation.
- [`spec.md`](./spec.md) — Reverse specification, monster table, and item mechanics.
