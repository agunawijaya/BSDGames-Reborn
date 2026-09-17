# `hack` — Reverse Specification

> Low-level formal mechanics specification reverse-engineered directly from `hack.h`, `def.permonst.h`, `def.objects.h`, and `hack.c`.

---

## 1. Objective

- **Victory Condition:** Retrieve the **Amulet of Yendor** (`"`), ascend from Level 30 back to Dungeon Level 1, and step out of the dungeon via the surface staircase (`<`).
- **Defeat Condition:**
  - Physical Death (`done("died")`): Hit points reaching 0 from combat, poison, or starvation.
  - Petrification (`done("petrified")`): Turning to stone via cockatrice touch or flesh consumption.
  - Drowning / Dissolution: Falling into deep water or acid pools.
- **Draw / Stalemate:** None. Permadeath is strictly enforced; a slain character is archived to a tombstone RIP display and saved as a bones level.

---

## 2. State Variables

| Variable | Type | Range | Initial Value | Persisted? | Description |
|---|---|---|---|:---:|---|
| `u.uhp` | `int` | $0 \dots 255$ | Role-based (12–18) | Yes | Current player hit points. Reaching 0 triggers death. |
| `u.uhpmax` | `int` | $1 \dots 255$ | Initial HP | Yes | Maximum hit points achievable via leveling/potions. |
| `u.uac` | `int` | $-12 \dots 10$ | Role-based (4–10) | Yes | **Armor Class.** Lower is better. Naked = 10. |
| `u.ugold` | `long` | $0 \dots 2 \times 10^9$ | Role-based (0–1000) | Yes | Gold carried in purse. |
| `u.uexp` | `unsigned`| $0 \dots 10^7$ | 0 | Yes | Experience points earned from slaying monsters. |
| `u.ulevel` | `int` | $1 \dots 14$ | 1 | Yes | Character experience level. |
| `u.ustr` | `int` | $3 \dots 18$ | Role-based (12–18) | Yes | Physical strength (influences carry weight and melee). |
| `dlevel` | `int` | $1 \dots 30$ | 1 | Yes | Current dungeon depth floor. |
| `moves` | `long` | $0 \dots \infty$ | 0 | Yes | Global turn count. |
| `u.uhunger` | `int` | $0 \dots 2000$ | 900 | Yes | Hunger counter. Degrades 1 per turn. Below 150 = Weak. |
| `flags.ident`| `char[26]`| Randomized | Shuffled per run | Yes | Appearance-to-identity mapping for potions/scrolls. |
| `invent` | Linked list | Max 52 items | Role starting gear | Yes | Player carried inventory (letters `a`–`z`, `A`–`Z`). |

---

## 3. Character Roles & Setup Configuration

Defined in [`hack.u_init.c:40-60`](https://github.com/vattam/BSDGames/tree/master/hack/hack.u_init.c#L40-L60):

| Role Name | Identifier | Base HP | Base AC | Starting Weapons & Armor | Difficulty Rating |
|---|:---:|:---:|:---:|---|:---:|
| **Fighter** | `F` | 17 | 5 | Two-handed sword, banded mail armor, strength 18. | Easy |
| **Knight** | `K` | 16 | 4 | Long sword, ring mail, shield, helmet. | Moderate |
| **Speleologist**| `S` | 15 | 7 | Hard hat, pick-axe, can of grease, leather armor. | Moderate |
| **Cave-man** | `C` | 16 | 8 | Club, leather armor, flint stones. | Moderate |
| **Wizard** | `W` | 12 | 9 | Quarterstaff, spellbook of magic missile, wand of striking. | Hard |
| **Tourist** | `T` | 10 | 10 | Hawaiian shirt, expensive camera, dart gun, 500 gold. | Very Hard |

---

## 4. Complete Monster Bestiary (58 Monster Classes)

Extracted from [`def.permonst.h`](https://github.com/vattam/BSDGames/tree/master/hack/def.permonst.h):

| Symbol | Monster Name | Level | Move Speed | Base AC | Damage Roll | Special Abilities & Hazards |
|:---:|---|:---:|:---:|:---:|:---:|---|
| `a` | Giant Ant | 2 | 18 | 3 | 1d4 | Very fast runner; bites repeatedly. |
| `b` | Giant Bat | 1 | 22 | 8 | 1d2 | Erratic flying movement; hard to hit. |
| `c` | Centipede | 1 | 9 | 4 | 1d3 | Poisonous sting drains strength. |
| `c` | Cockatrice | 5 | 6 | 6 | 1d3 | **Lethal:** Touching without gloves causes petrification. |
| `d` | Little Dog | 2 | 12 | 6 | 1d6 | Faithful starter companion; can be tamed. |
| `d` | Large Dog | 4 | 12 | 5 | 2d4 | Grown combat pet; high attack power. |
| `d` | Jackal | 0 | 12 | 7 | 1d2 | Pack hunter. |
| `d` | Winter Wolf | 5 | 12 | 4 | 2d6 | Breathes freezing blizzard blasts. |
| `e` | Floating Eye | 2 | 1 | 9 | 0d0 | **Paralysis Gaze:** Melee strikes paralyze the attacker! |
| `f` | Homunculus | 2 | 12 | 6 | 1d3 | Sleep poison bite. |
| `g` | Gnome | 1 | 6 | 5 | 1d6 | Subterranean digger. |
| `h` | Hobgoblin | 1 | 9 | 5 | 1d8 | Wields clubs and iron daggers. |
| `i` | Stalker | 8 | 12 | 3 | 4d4 | Completely invisible; tracks player footprints. |
| `j` | Jack-o-lantern | 1 | 0 | 10 | 0d0 | Illuminates rooms. |
| `k` | Kobold | 1 | 6 | 10 | 1d4 | Shoots poisonous darts. |
| `k` | Killer Bee | 1 | 18 | -1 | 1d3 | Highly venomous; swarms in hives. |
| `l` | Leprechaun | 5 | 12 | 8 | 1d2 | Steals gold purse and teleports away. |
| `m` | Mimic | 7 | 3 | 7 | 3d4 | Disguises itself as gold, chests, or stairs! |
| `n` | Nymph | 3 | 12 | 9 | 0d0 | Steals magical objects and teleports away. |
| `o` | Orc | 2 | 9 | 6 | 1d8 | Aggressive dungeon tribe; wears armor. |
| `p` | Piercer | 3 | 1 | 3 | 3d6 | Drops from ceiling onto passing adventurers. |
| `q` | Quivering Blob | 3 | 1 | 8 | 1d8 | Poisonous acidic mass. |
| `r` | Giant Rat | 0 | 12 | 7 | 1d3 | Common vermin. |
| `r` | Rabid Rat | 2 | 12 | 6 | 2d4 | Inflicts rabies disease. |
| `s` | Snake | 1 | 15 | 3 | 1d3 | Venomous bite. |
| `t` | Troll | 7 | 12 | 4 | 2d8 | Regenerates health; resurrects after death! |
| `u` | Unicorn | 9 | 24 | 2 | 1d12 | Very fast; horn cures all poisons and curses. |
| `v` | Fog Cloud | 3 | 1 | 0 | 1d6 | Obscures vision; suffocating mist. |
| `w` | Long Worm | 8 | 3 | 5 | 2d10 | Multi-segment segmented body (`hack.worm.c`). |
| `x` | Xorn | 8 | 9 | -2 | 4d6 | Phases directly through solid stone walls! |
| `y` | Yellow Light | 3 | 15 | 0 | 0d0 | Explodes in blinding flash of light. |
| `z` | Zombie | 2 | 6 | 8 | 1d8 | Undead corpse; immune to sleep. |
| `A` | Giant Ant | 3 | 18 | 3 | 2d4 | Fast soldier insect. |
| `B` | Giant Beetle | 5 | 6 | 4 | 3d6 | Heavy chitinous shell. |
| `C` | Centaur | 4 | 18 | 4 | 2d6 | Fires arrows from distance; gallops rapidly. |
| `D` | Red Dragon | 10 | 9 | -1 | 3d8 | Breathes searing streams of fire. |
| `D` | White Dragon | 10 | 9 | -1 | 3d8 | Breathes freezing ice shards. |
| `D` | Blue Dragon | 10 | 9 | -1 | 3d8 | Breathes chain lightning bolts. |
| `E` | Ettin | 10 | 12 | 3 | 2d8 | Two-headed giant. |
| `F` | Fire Beetle | 1 | 6 | 4 | 2d4 | Emits light; grants fire immunity when eaten. |
| `G` | Gnome King | 5 | 6 | 2 | 2d6 | High-level gnome commander. |
| `H` | Minotaur | 15 | 12 | -3 | 3d10 | **Devastating:** Melee juggernaut in mazes. |
| `I` | Invisible Stalker| 8 | 12 | 3 | 4d4 | Permanent invisibility. |
| `K` | Keystone Kop | 1 | 18 | 10 | 1d4 | Summoned when shopkeepers are robbed. |
| `L` | Lich | 11 | 6 | 0 | 2d10 | High-level undead sorcerer; casts curses. |
| `M` | Mummy | 6 | 6 | 6 | 1d12 | Undead wrapped in cursed linen. |
| `N` | Nazgûl | 13 | 12 | 0 | 3d6 | Terrifying wraith; level drain touch. |
| `O` | Ogre | 5 | 9 | 5 | 2d10 | Heavy brute armed with great clubs. |
| `P` | Purple Worm | 15 | 9 | 6 | 2d8 | Swallows players whole! |
| `Q` | Quantum Mechanic | 7 | 12 | 3 | 1d4 | Inflicts quantum teleportation on hit. |
| `R` | Rust Monster | 5 | 18 | 2 | 0d0 | **Eats Iron:** Corrodes armor and weapons to dust. |
| `S` | Scorpion | 5 | 15 | 3 | 1d4 | Highly lethal constitution drain poison. |
| `T` | Trapper | 12 | 3 | 3 | 4d6 | Disguises as floor; crushes walking victims. |
| `U` | Umber Hulk | 9 | 6 | 2 | 3d4 | Confusion gaze; bores tunnels through rock. |
| `V` | Vampire | 8 | 12 | 1 | 1d6 | Drains experience levels on physical hit. |
| `W` | Wraith | 6 | 12 | 4 | 1d6 | Undead specter; drains experience levels. |
| `X` | Xorn | 8 | 9 | -2 | 4d6 | Stone-eating earth elemental. |
| `Y` | Yeti | 5 | 12 | 6 | 1d6 | Subterranean cold beast. |
| `Z` | Master Zombie | 5 | 6 | 6 | 1d10 | Toughened undead. |
| `@` | **Shopkeeper** | 12 | 18 | 0 | 4d4 | Armed with wands of death and shotguns. |
| `@` | **Wizard of Yendor**| 15 | 12 | -2 | 4d6 | **FINAL BOSS:** High sorcerer holding the Amulet. |
| ` ` | **Ghost** | $L$ | 3 | 0 | 0d0 | Restless spirit of deceased player from bones file. |

---

## 5. Item Categories & Mechanics

1. **Weapons (`)`):** Swords, daggers, maces, bows, arrows, darts, boomerangs. Can be cursed, uncursed, or blessed with enchantment bonuses (`-2` to `+7`).
2. **Armor (`[`):** Helmets, body armor, shields, cloaks, gloves, and boots. Lowers AC.
3. **Potions (`!`):** Extra healing, gain energy, speed, levitation, invisibility, poison, blindness, object detection. Colors shuffled per run.
4. **Scrolls (`?`):** Identify, teleportation, remove curse, enchant weapon, enchant armor, create monster, light. Unreadable when blind.
5. **Wands (`/`):** Striking, magic missile, fire, cold, lightning, digging, death, teleportation, secret door detection. Shuffled materials (ebony, silver, oak).
6. **Rings (`=`):** Protection, teleportation, regeneration, fire resistance, search, see invisible.
7. **Food (`%`):** Food rations, cram rations, tripe, fresh corpses. Prevents starvation.
8. **The Amulet of Yendor (`"`):** The ultimate objective; radiates anti-magic and increases monster agitation.
