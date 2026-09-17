# `battlestar` — Reverse Specification

> Implementation-independent specification of mechanics, extracted directly from the original BSD C source.

---

## 1. Objective

- **Win Condition:** Acquire all three sacred artifacts—the Amulet (`AMULET`), the Medallion (`MEDALION`), and the Talisman (`TALISMAN`). When simultaneously in the player's possession (either worn or in inventory), the game automatically triggers wizard ascension (`tempwiz = 1`), unlocking the `su` master command and achieving victory (`live()`).
- **Lose Condition:**
  - Physical Death (`die()`): Incurring mortal injuries, falling to 0 stamina, or losing combat with Elves, Woodsmen, or Cylons.
  - Asphyxiation / Vacuum Death: Stepping outside into space without life support.
  - Starvation / Dehydration: Allowing the nourishment counter (`ate`) to decay to zero without eating fruit.
  - Ship Explosion: Failing to evacuate Room 7 before the Battlestar explodes.
  - Orbital Crash (`crash()`): Fuel depletion (`fuel <= 0`) while flying the Viper starfighter.
- **Draw / Stalemate:** None. The player can wander indefinitely provided nourishment and sleep are maintained.

---

## 2. State Variables

| Variable | Type | Range | Initial Value | Persisted? | Description |
|---|---|---|---|:---:|---|
| `position` | `int` | $1 \dots 275$ | 22 | Yes | Current room location index. |
| `direction` | `int` | `NORTH`, `SOUTH`, `EAST`, `WEST` | `NORTH` | Yes | Absolute facing direction of the player. |
| `ourtime` | `int` | $0 \dots \infty$ | 0 | Yes | Global elapsed turn counter. |
| `fuel` | `int` | $0 \dots 250$ | 250 (`TANKFULL`) | Yes | Remaining starfighter thruster fuel. |
| `torps` | `int` | $0 \dots 10$ | 10 (`TORPEDOES`) | Yes | Remaining photon torpedo munitions. |
| `ourclock` | `int` | $0 \dots 120$ | 120 | No | Flight mission duration clock in `fly.c`. |
| `carrying` | `int` | $0 \dots 60$ | 0 | Yes | Current carried weight in kilograms. |
| `encumber` | `int` | $0 \dots 10$ | 0 | Yes | Current carried bulk / volume units. |
| `snooze` | `int` | $0 \dots 150$ | 150 (`CYCLE * 1.5`) | Yes | Sleepiness countdown before collapse. |
| `ate` | `int` | $0 \dots 100$ | 50 | Yes | Nutrition countdown before starvation. |
| `pleasure` | `int` | $0 \dots 100$ | 0 | Yes | Hedonistic personality score. |
| `power` | `int` | $0 \dots 100$ | 0 | Yes | Martial / combat personality score. |
| `ego` | `int` | $0 \dots 100$ | 0 | Yes | Material wealth / vanity personality score. |
| `wiz` | `int` | $0, 1$ | 0 (or 1 if hereditary) | Yes | Flag indicating whether player is a root wizard. |
| `tempwiz` | `int` | $0, 1$ | 0 | Yes | Flag set when the 3 amulets are assembled. |
| `inven` | `int[]` | Bitmask (64 bits) | 0 | Yes | Bitmask of objects currently carried. |
| `wear` | `int[]` | Bitmask (64 bits) | `1 << PAJAMAS` | Yes | Bitmask of objects currently worn on body. |
| `injuries` | `int[13]`| $0 \dots 1$ each | All 0 | Yes | Array of active bodily trauma flags. |
| `notes` | `int[6]` | $0 \dots 1$ each | All 0 | Yes | Environmental condition flags (`CANTSEE`, `LAUNCHED`, etc.). |
| `beenthere`| `int[275]`| $0 \dots \infty$ | `beenthere[22] = 1` | Yes | Visit counter for each room in the world. |

---

## 3. Actions / Commands

### Movement Resolution Matrix

The parser maps relative commands into absolute directions based on `direction`:

$$\begin{pmatrix} \text{facing} & \text{ahead} & \text{back} & \text{left} & \text{right} \\ \text{NORTH} & \text{NORTH} & \text{SOUTH} & \text{WEST} & \text{EAST} \\ \text{SOUTH} & \text{SOUTH} & \text{NORTH} & \text{EAST} & \text{WEST} \\ \text{EAST} & \text{EAST} & \text{WEST} & \text{NORTH} & \text{SOUTH} \\ \text{WEST} & \text{WEST} & \text{EAST} & \text{SOUTH} & \text{NORTH} \end{pmatrix}$$

### Core Verbs

| Command | Arguments | Preconditions | State Transition |
|---|---|---|---|
| `take` / `get` | `<object>` | Item present in room; `carrying + wt <= MAXWEIGHT`; `encumber + cb <= MAXCUMBER`. | Clear item bit in room; set bit in `inven`. Update weight/bulk. |
| `drop` | `<object>` | Item in `inven`. | Clear item bit in `inven`; set bit in room. Update weight/bulk. |
| `wear` / `put on`| `<clothing>` | Item in `inven`; item is wearable (`objflags & OBJ_WEAR`). | Clear bit in `inven`; set bit in `wear`. Deduct bulk penalty. |
| `take off` | `<clothing>` | Item in `wear`. | Clear bit in `wear`; set bit in `inven`. |
| `eat` | `<food>` | Food in `inven` (`PAPAYAS`, `PINEAPPLE`, etc.). | Consume item; destroy from inventory; `ate += 30`. |
| `drink` | `<liquid>` | Potion in `inven` or water source present. | If `POTION`, heal random injury; `pleasure += 5`. |
| `light` | `lamp` / `match`| Lamp or matches held in `inven`. | If matches, light for 1 turn; if lamp, set `notes[CANTSEE] = 0`. |
| `launch` | none | `position == 7` (Launch Tube); player inside Viper. | Transition to Sector 2 (`position = 32`); launch flight engine. |
| `land` | none | `position` in space sector; over planetary landing zone. | Transition to Sector 3 (`position = 70`). |
| `su` | none / `<room>` | `wiz == 1` or `tempwiz == 1`. | Prompt for room number; set `position = target`. |

---

## 4. Difficulty Levels & Setup Configuration

### Invocation Modes & CLI Knobs

```bash
battlestar [-r] [savefile]
```

- **Default Startup:** Initializes a fresh adventure in Stateroom 22 wearing silk pajamas.
- **`-r` (Restore):** Reads saved state from `.Bstar` (or specified path).
- **Hereditary Wizard Accounts:** Hardcoded user check in `init.c`. Accounts named `riggle`, `chris`, `edward`, `dmr`, `ken` bypass mortal restrictions immediately.

### Runtime Balance Knobs

1. **Day / Night Cycle Interval (`CYCLE`):**
   - Fixed at 100 turns.
   - Daytime: $0 \le (\text{ourtime} \bmod 200) < 100$.
   - Nighttime: $100 \le (\text{ourtime} \bmod 200) < 200$.
2. **Fatigue & Hunger Rates:**
   - Sleep threshold: `snooze` initialized to 150 turns. Degrades by 1 each turn. Falling below 20 causes drowsiness and combat penalties; reaching 0 causes unconscious collapse.
   - Hunger threshold: `ate` initialized to 50 turns. Degrades by 1 each turn. Reaching 0 inflicts progressive injury trauma.
3. **Encumbrance Bounds:**
   - Base weight: 60 kg.
   - Base bulk: 10 volume units.
   - Broken arm penalty: $-15\text{ kg}$ carrying capacity.
   - Broken back penalty: $-30\text{ kg}$ carrying capacity.

---

## 5. Complete Object & Entity Inventory (64 Objects)

Extracted from `extern.h`, `dayobjs.c`, and `nightobjs.c`:

| Enum Constant | ID | Name & Description | Category | Initial Room (Day / Night) | Wt (kg) | Cumber | Properties & Invariants |
|---|:---:|---|---|:---:|:---:|:---:|---|
| `KNIFE` | 0 | Hunting Knife | Weapon | 21, 30 / 21, 30 | 1 | 1 | Edged light melee weapon. |
| `SWORD` | 1 | Fine Scabbard & Sword | Weapon | 260 / 260 | 5 | 2 | Masterwork blade; +10 Power in combat. |
| `LAND` | 2 | Viper Landing Pad | Feature | 70–104 / 70–104 | 0 | 0 | Non-portable flight destination anchor. |
| `WOODSMAN` | 3 | Forest Woodsman | NPC / Foe | 172 / 168, 170, 216 | 70 | 10 | Hostile woodcutter wielding iron mallet. |
| `TWO_HANDED` | 4 | Heavy Two-Handed Sword | Weapon | 190 / 190 | 10 | 4 | Heavy two-handed blade. Requires both arms. |
| `CLEAVER` | 5 | Meat Cleaver | Weapon | 30 / 30 | 2 | 1 | Heavy kitchen blade. |
| `BROAD` | 6 | Broadsword | Weapon | 142 / 142 | 6 | 3 | Knightly slashing weapon. |
| `MAIL` | 7 | Coat of Chainmail | Armor | 258 / 258 | 15 | 3 | Body armor; mitigates 50% physical damage. |
| `HELM` | 8 | Iron Helmet | Armor | 258 / 258 | 3 | 2 | Head protection; prevents fatal skull fractures. |
| `SHIELD` | 9 | Wooden Shield | Armor | 146 / 113, 124, 144 | 5 | 3 | Offhand protection; parries halberd strikes. |
| `MAID` / `BODY`| 10 | The Maid / Slain Body | NPC | 21 / 21 | 50 | 10 | Battlestar stewardess. |
| `VIPER` | 11 | Starfighter Viper | Vehicle | 7 / 7 | 5000 | 100| Spacecraft; permits orbital flight. |
| `LAMPON` | 12 | Brass Lantern | Tool / Light | 268 / 92, 181, 236 | 2 | 2 | Portable illumination; negates darkness. |
| `SHOES` | 13 | Leather Shoes | Armor | 216 / 216 | 1 | 1 | Footwear; protects against jagged coral. |
| `CYLON` | 14 | Cylon Raider | NPC / Foe | 36, 49, 64 / 68 | 2000 | 50 | Orbital starfighter enemy. |
| `PAJAMAS` | 15 | Silk Pajamas | Clothing | Worn (22) / 218 | 1 | 1 | **STARTING APPAREL.** Worn at turn 0. |
| `ROBE` | 16 | Warm Robe | Clothing | 8 / 8 | 2 | 2 | Thermal insulation apparel. |
| `AMULET` | 17 | Sacred Amulet | **Artifact** | 13, 126 / 13, 126 | 1 | 1 | **KEY ARTIFACT 1/3.** From Water Goddess. |
| `MEDALION` | 18 | Sacred Medallion | **Artifact** | — / 218 | 1 | 1 | **KEY ARTIFACT 2/3.** Appears only at night. |
| `TALISMAN` | 19 | Sacred Talisman | **Artifact** | 275 / 275 | 1 | 1 | **KEY ARTIFACT 3/3.** At the High Altar. |
| `DEADWOOD` | 20 | Deadwood Timber | Resource | 172 / 168, 170 | 8 | 4 | Combustible fuel for signaling. |
| `MALLET` | 21 | Heavy Wooden Mallet | Tool | 172 / 168, 170 | 4 | 2 | Blunt crushing tool. |
| `LASER` | 22 | Laser Blaster Pistol | Weapon | 20 / 20 | 3 | 2 | High-tech firearm; kills Cylons and Elves. |
| `BATHGOD` | 23 | Bathing Water Goddess | NPC | 126 / 126 | 50 | 10 | Mythical nymph in forest pool. |
| `NORMGOD` | 24 | Sea Goddess Nymph | NPC | 218 / 218 | 50 | 10 | Mythical water nymph. |
| `GRENADE` | 25 | Explosive Grenade | Weapon | 26, 256 / 26, 256 | 1 | 1 | Throwable explosive weapon. |
| `CHAIN` | 26 | Iron Chain | Tool | 237 / 237 | 10 | 3 | Heavy towing chain. |
| `ROPE` | 27 | Hemp Rope | Tool | 237 / 237 | 2 | 2 | Climbing utility. |
| `LEVIS` | 28 | Denim Levis Jeans | Clothing | 218 / 218 | 1 | 1 | Durable trousers. |
| `MACE` | 29 | Spiked Iron Mace | Weapon | 164 / 164 | 6 | 2 | Heavy bludgeoning weapon. |
| `SHOVEL` | 30 | Excavation Shovel | Tool | 137 / 144 | 4 | 3 | Used to unearth buried items (`dig`). |
| `HALBERD` | 31 | Guard Halberd | Weapon | 146 / 113, 124, 144 | 8 | 4 | Polearm wielded by Wood-Elves. |
| `COMPASS` | 32 | Magnetic Compass | Tool | 237 / 237 | 1 | 1 | Displays absolute cardinal heading. |
| `CRASH` | 33 | Crashed Viper Hull | Feature | 70 / 70 | 0 | 0 | Smoldering ruins of fighter. |
| `ELF` | 34 | Nocturnal Wood-Elf | NPC / Foe | 146 / 113, 124, 144 | 60 | 10 | Fierce hostile forest dwellers. |
| `FOOT` | 35 | Severed Foot | Curiosity | — / 249, 250 | 2 | 1 | Macabre anatomical relic. |
| `COINS` | 36 | Pile of Gold Coins | Treasure | 11, 260 / 11, 260 | 5 | 2 | Valuable currency; +15 Ego. |
| `MATCHES` | 37 | Book of Matches | Tool / Light | 24, 235 / 24, 235 | 1 | 1 | Provides short-duration lighting. |
| `MAN` | 38 | Island Trader | NPC | 93 / 92 | 70 | 10 | Friendly merchant NPC. |
| `PAPAYAS` | 39 | Fresh Papayas | Food | 109 / 92, 93 | 1 | 1 | Tropical fruit; $+30$ nutrition. |
| `PINEAPPLE` | 40 | Ripe Pineapples | Food | 110, 152 / 92 | 2 | 2 | Tropical fruit; $+30$ nutrition. |
| `KIWI` | 41 | Kiwi Fruit | Food | 111 / 92 | 1 | 1 | Tropical fruit; $+20$ nutrition. |
| `COCONUTS` | 42 | Coconut Shells | Food | 112, 150 / 112 | 2 | 2 | Hydration and food; $+25$ nutrition. |
| `MANGO` | 43 | Juicy Mangoes | Food | 149 / 92 | 1 | 1 | Tropical fruit; $+25$ nutrition. |
| `RING` | 44 | Diamond Ring | Treasure | 218 / 218 | 1 | 1 | Royal jewelry; $+10$ Ego. |
| `POTION` | 45 | Enchanted Healing Draught| Potion | 190 / 190 | 1 | 1 | Heals broken bones and bleeding. |
| `BRACELET` | 46 | Jeweled Gold Bracelet | Treasure | 130 / 130 | 1 | 1 | Sacred heirloom; $+10$ Ego. |
| `GIRL` | 47 | Island Maiden | NPC | 93 / 93 | 45 | 10 | Friendly companion; offers advice. |
| `GIRLTALK` | 48 | Maiden's Whisper | Clue | 93 / 93 | 0 | 0 | Narrative hint dialog. |
| `DARK` | 49 | Pitch Blackness | Hazard | 266 / 266 | 0 | 0 | Environmental occlusion obstacle. |
| `TIMER` | 50 | Clockwork Timer | Tool | 235 / 235 | 2 | 1 | Mechanism for delayed detonators. |
| `BOMB` | 54 | Fusion Bomb Core | Weapon | 19 / 19 | 20 | 5 | Massive demolition explosive. |
| `DEADGOD` | 55 | Slain Deity | Feature | — / — | 100 | 20 | Slain god entity. |
| `DEADTIME` | 56 | Stagnant Time Field | Anomaly | — / — | 0 | 0 | Temporal barrier. |
| `DEADNATIVE`| 57 | Slain Villager | Feature | — / — | 60 | 10 | Combat casualty. |
| `NATIVE` | 58 | Island Villager | NPC | 167 / 92, 235 | 60 | 10 | Indigenous island resident. |
| `HORSE` | 59 | Wild Stallion | Mount | 236 / 236 | 400 | 50 | Rapid transit mount. |
| `CAR` | 60 | Ancient Ground Car | Vehicle | 237 / 237 | 1000 | 100| Ruined mechanical rover. |
| `POT` | 61 | Pot of Gold | Treasure | 275 / 275 | 15 | 4 | Altar hoard; $+20$ Ego. |
| `BAR` | 62 | Solid Gold Bar | Treasure | 275 / 275 | 20 | 3 | Altar bullion; $+20$ Ego. |
| `BLOCK` | 63 | Stone Altar Block | Feature | 275 / 275 | 500 | 50 | Immovable altar pedestal. |

---

## 6. RNG Usage

| Subsystem | Distribution | Condition / Trigger | Consequence |
|---|---|---|---|
| `fight()` | Uniform $[0, 30]$ | Combat round roll | Determines hit or miss against Elves / Woodsmen. |
| `fly.c` | Uniform $[0, \text{LINES}-3]$ | Cylon raider spawn position | Generates target coordinates on HUD grid. |
| `misc.c` | Uniform $[0, 12]$ | Bodily trauma assignment | Determines which of 13 injuries player incurs. |
| `init.c` | Seeded via `getpid()` | Startup initialization | Non-deterministic initial combat seeds. |

---

## 7. Scoring & Termination

Score evaluation computes:

$$\text{Final Rating} = \text{rate}() \quad \text{based on} \quad \max(\text{pleasure}, \text{power}, \text{ego})$$

- **Victory:** Uniting `AMULET`, `MEDALION`, and `TALISMAN` $\rightarrow$ triggers `live()`, posts score with `'!'` flag, exits `0`.
- **Defeat:** Fatal injury or starvation $\rightarrow$ triggers `die()`, posts score with `' '` flag, exits `0`.
- **Quit:** Typing `quit` or `q` $\rightarrow$ exits `0`.
