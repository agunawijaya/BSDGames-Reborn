# `adventure` — Reverse Specification

> Implementation-independent mechanical specification of *Colossal Cave Adventure* (Woods 350-point version),
> reverse-engineered directly from Jim Gillogly's C source (`hdr.h`, `main.c`, `subr.c`, `done.c`).

---

## Objective

- **Ultimate Victory (Grandmaster):** Explore Colossal Cave, retrieve all **15 primary treasures**, deposit them safely inside the brick building on the surface, trigger the cave closing sequence, survive the repository endgame, and exit with a maximum score of **350 points** (or 351 with the Witt's End magazine easter egg).
- **Survival Victory:** Explore, collect partial treasures, and retire safely (`quit`) with a positive score rating.
- **Defeat:**
  1. **Fatal Fall:** Walking in a dark room without a lit brass lantern (`wzdark && !lit(loc)` $\rightarrow$ "You fell into a pit and broke your neck").
  2. **Dwarf Attack:** Pierced by a dwarf's throwing axe after exhausting reincarnations (`numdie >= maxdie`).
  3. **Dragon Incineration:** Attacking the green dragon with weapons rather than bare hands.
  4. **Trap Suffocation:** Trapped inside the cave during the final cave-in without unlocking the repository blast.
  5. **Quiver / Battery Depletion:** The brass lantern battery dies (`limit <= 0`), plunging the player into irreversible darkness.

---

## State Variables

| Variable | Type | Range | Initial Default | Persisted? |
|---|---|---|---|:---:|
| `loc` | integer | $1 \le L \le 140$ | `1` (Surface Hill) | Yes (save file) |
| `newloc` | integer | $1 \le L \le 140$ | `1` | Turn-local |
| `oldloc` | integer | $1 \le L \le 140$ | `1` | Yes |
| `turns` | integer | $\ge 0$ | `0` | Yes |
| `limit` | integer | $\ge -1$ | `330` (Battery ticks) | Yes |
| `prop[i]` | integer array | $-1 \le P \le 2$ | Initialized per object | Yes |
| `place[i]` | integer array | $0 \le \text{room} \le 140$ | Initialized per object | Yes |
| `fixed[i]` | integer array | $-1 \dots 140$ | Secondary fixed anchor | Yes |
| `dflag` | integer | $0, 1, 2$ | `0` (Dwarves dormant) | Yes |
| `dloc[6]` | integer array | $1 \dots 140$ | Dwarf & pirate positions | Yes |
| `odloc[6]` | integer array | $1 \dots 140$ | Previous dwarf positions | Yes |
| `dseen[6]` | boolean array | $0, 1$ | Whether player seen | Yes |
| `closng` | boolean | $0, 1$ | `0` | Yes |
| `closed` | boolean | $0, 1$ | `0` | Yes |
| `bonus` | integer | $0, 133, 134, 135$ | `0` | Yes |
| `numdie` | integer | $0 \le D \le 3$ | `0` (Deaths incurred) | Yes |
| `maxdie` | integer | $3$ | `3` (Max lives) | Constant |
| `hinted[i]` | boolean array | $0, 1$ | `0` | Yes |
| `tally` | integer | $0 \le T \le 15$ | `15` (Remaining treasures) | Yes |

---

## Actions & Command Syntax

The parser processes two-word commands (`VERB NOUN` or single-word directional / magic invocations). Words are evaluated using their first **5 characters**.

### 1. Spatial Movement
- **Compass Directions:** `NORTH`, `SOUTH`, `EAST`, `WEST`, `NE`, `SE`, `NW`, `SW`.
- **Vertical & Relative:** `UP`, `DOWN`, `IN`, `OUT`, `ENTER`, `EXIT`, `CLIMB`, `CRAWL`, `JUMP`.
- **Named Landmarks:** `BUILDING`, `CANYON`, `STREAM`, `DEBRIS`, `HOLE`, `WALL`, `PIT`.
- **Magic Transit Words:**
  - `XYZZY`: Teleports between the Building (`loc 1`) and Debris Room (`loc 11`).
  - `PLUGH`: Teleports between the Building (`loc 1`) and Y2 (`loc 33`).
  - `PLOVER`: Teleports between Plover Room (`loc 100`) and Y2 (`loc 33`) (only carrying small emerald).

### 2. Interaction Verbs
- `TAKE` / `GET <obj>`: Picks up item into inventory (max 7 items).
- `DROP <obj>`: Drops item in current room.
- `OPEN` / `CLOSE <obj>`: Operates grate, wicker cage, clam, oyster, or safe.
- `LOCK` / `UNLOCK <obj>`: Locks/unlocks grate or doors with keys.
- `ON` / `LIGHT`: Ignites the brass lantern (consumes battery).
- `OFF` / `EXTINGUISH`: Turns off lantern to conserve battery.
- `WAVE <rod>`: Waves the black rod (creates/destroys crystal bridge across fissure).
- `THROW <axe/food>`: Throws weapon at dwarf or meat to dragon/bear.
- `ATTACK` / `KILL`: Initiates combat (e.g. `KILL DRAGON`).
- `FEED`: Offers food or meat to creatures.
- `POUR <water/oil>`: Waters the giant beanstalk or oils rusty door hinges.
- `INVENTORY`: Lists all items currently carried.
- `SCORE`: Computes and displays current score and turns used.
- `QUIT`: Terminates session and displays final rank.
- `SUSPEND`: Serializes game state into save file.

---

## Rules & Core Invariants

1. **Light & Darkness Rule:** If the current room has `wzdark == 1` and the lantern is unlit or absent, taking any move command except turning on the lamp triggers an immediate fatal pit plunge.
2. **Inventory Limit:** The adventurer can hold at most **7 portable objects** simultaneously. Entering narrow crevices (like the Plover Room passage) rejects travel if carrying anything larger than the emerald.
3. **Complete Object & Entity Inventory:**

| Object Name | C Variable | Initial Room (`place`) | Type / Value | State Properties (`prop`) & Puzzle Roles |
|---|---|:---:|:---:|---|
| **Brass Keys** | `keys` | Room 3 (Building) | Tool | Unlocks iron grate (`loc 8`) and golden chain on bear (`loc 119`). |
| **Brass Lantern** | `lamp` | Room 3 (Building) | Tool | `prop = 0` (off), `1` (on). Consumes battery ticks; protects against dark pit falls. |
| **Wicker Cage** | `cage` | Room 10 (Cobble Crawl) | Tool | Container used to capture and carry the little green bird. |
| **Little Green Bird** | `bird` | Room 13 (Bird Chamber) | Creature / Tool | Captured in cage (fails if rod held); drives away fierce snake in Mountain King. |
| **Black Iron Rod** | `rod` | Room 11 (Debris Room) | Tool / Portal | Waved at fissure to create/collapse crystal bridge; `XYZZY` portal endpoint. |
| **Red Iron Rod** | `rod2` | Room 95 (Mirror Canyon) | Decoy Trap | Identical star mark; explodes if waved! |
| **Bottle of Water/Oil**| `bottle` | Room 3 (Building) | Tool | `prop = 0` (empty), `1` (water), `2` (oil). Water grows beanstalk; oil frees rusty hinges. |
| **Food Rations** | `food` | Room 3 (Building) | Tool | Consumed to feed and tame the fierce cave bear in Barren Room. |
| **Dwarf's Axe** | `axe` | Room 17/19 (Hall of Mists) | Weapon | Hurled by first dwarf; lethal missile weapon thrown to slay wandering dwarves. |
| **Fresh Batteries** | `batter` | Room 98 (Vending Machine)| Tool | Purchased by dropping coins into machine; extends lantern life by 1000 turns. |
| **Stick of Dynamite** | — | Room 135 (Repository) | Endgame Tool | Used with `BLAST` command in NE alcove to shatter the exit door during cave closing. |
| **Large Gold Nugget** | `nugget` | Room 18 (Nugget Room) | 💎 Treasure (10 pts)| Heavy nugget found in low crawlway. |
| **Diamonds** | — | Room 15 (West Fissure) | 💎 Treasure (10 pts)| Retrieved across crystal bridge. |
| **Bars of Silver** | — | Room 23 (Low Room) | 💎 Treasure (10 pts)| Heavy silver bars located in northern crawl. |
| **Precious Jewelry** | — | Room 19 (South Chamber)| 💎 Treasure (10 pts)| Found in southern alcove of Hall of the Mountain King. |
| **Rare Coins** | `coins` | Room 17 (West Mists) | 💎 Treasure (10 pts)| Can be deposited for points or dropped in vending machine for batteries. |
| **Silver Chest** | `chest` | Room 130 (Pirate Lair) | 💎 Treasure (14 pts)| Found at dead-end cul-de-sac of Maze All Alike; contains stolen goods. |
| **Golden Eggs** | `eggs` | Room 88 (Giant Room) | 💎 Treasure (12 pts)| Stolen from Giant; `FEE FIE FOE FOO` magic phrase returns eggs to nest. |
| **Jeweled Trident** | `tridnt` | Room 102 (Waterfall) | 💎 Treasure (10 pts)| Found on slippery ledge beside waterfall; used to pry open giant clam. |
| **Giant Pearl** | `pearl` | Room 103 (Shell Room) | 💎 Treasure (10 pts)| Concealed inside giant clam; rolls out when clam is pried open with trident. |
| **Velvet Pillow** | `pillow` | Room 98 (Soft Room) | 💎 Treasure (10 pts)| Cushion required to catch fragile Ming vase without breaking. |
| **Ming Vase** | `vase` | Room 97 (Oriental Room) | 💎 Treasure (14 pts)| Extremely fragile; shatters (`prop = -1`) if dropped on any surface except velvet pillow. |
| **Rare Spices** | `spices` | Room 124 (Boulders) | 💎 Treasure (10 pts)| Fragrant spices hidden behind giant boulders in secret canyon. |
| **Persian Rug** | `rug` | Room 96 (Dragon Lair) | 💎 Treasure (14 pts)| Resting beneath sleeping green dragon; accessible only after dragon is slain. |
| **Golden Chain** | `chain` | Room 119 (Barren Room) | 💎 Treasure (14 pts)| Locked to fierce cave bear; must tame bear with food and unlock with brass keys. |
| **Rare Emerald** | `emrald` | Room 100 (Plover Room)| 💎 Treasure (10 pts)| Accessed through narrow crevice; teleported directly to Y2 via `PLOVER`. |
| **"Spelunker Today"** | `magzin` | Room 108 (Witt's End) | 📜 Easter Egg (1 pt)| Depositing magazine in Room 108 awards the secret 351st point. |
| **Fierce Green Snake** | `snake` | Room 19 (Mountain King)| Barrier / Hazard | Blocks northern and southern passages; drives away only when bird is released. |
| **Green Dragon** | `dragon` | Room 96 (Dragon Lair) | Barrier / Hazard | Slain exclusively by bare-handed attack (`ATTACK DRAGON` $\rightarrow$ `YES`). |
| **Greedy Chasm Troll** | `troll` | Room 117 (Chasm Edge) | Barrier / Hazard | Blocks crossing; throwing tame cave bear scares troll off bridge permanently. |
| **Fierce Cave Bear** | `bear` | Room 119 (Barren Room) | Creature / Ally | Chained to wall; becomes docile when fed meat; follows player and scares troll. |
| **Giant Clam / Oyster**| `clam` | Room 103 (Shell Room) | Container | Locked tightly shut; opened by wedging jeweled trident into shell. |
| **Giant Beanstalk** | `plant` | Room 88 (West Pit) | Climbing Path | `prop = 0` (tiny sprout), `1` (grown), `2` (giant beanstalk reaching Giant lair after 2 waters). |

4. **Puzzle Solution Invariants:**
   - *Grate:* Opened and unlocked only using the brass keys found in the surface building.
   - *Snake:* Blocks Hall of Mountain King. Releasing the little green bird terrifies the snake, causing it to flee.
   - *Bird:* Can only be caught using the wicker cage while the black iron rod is dropped outside the room (bird fears the rod).
   - *Beanstalk:* Located in Giant Room; pouring water twice grows it into a climbable beanstalk reaching the Giant's lair.
   - *Dragon:* Sleeping on Persian rug; attacking with weapons fails ("Your sword bounces off!"). Attacking with bare hands slays it.
   - *Troll:* Blocks the chasm. Demands treasure to cross. Giving treasure loses points; throwing the tame bear at the troll frightens it away permanently.
   - *Bear:* Tamed by feeding it the meat. Unlocked using the brass keys. Follows player like a loyal dog.
   - *Ming Vase:* Extremely fragile; dropping it anywhere other than the velvet pillow shatters it into worthless pottery shards.
5. **The Pirate Mechanic:**
   The pirate lurks in the shadows. If the player possesses at least 1 treasure and is deep in the cave, the pirate has a periodic probability of ambushing the player, stealing all carried treasures, and concealing them in his chest at the maze's end.

---

## Difficulty Levels & Setup Configuration

*Colossal Cave Adventure* does not use numbered difficulty modes, but is heavily governed by explicit runtime parameters and internal progression constraints:

### 1. Difficulty & Progression Dimensions
- **Battery Life Clock (`limit`):**
  - Starts at 330 turns.
  - At 30 turns remaining, the lamp begins flickering ("Your lamp is growing dim").
  - Fresh batteries in the vending machine can replenish the lamp once (costing 1 coin).
- **Dwarf Escalation Ramp (`dflag`):**
  - `dflag = 0`: Safe surface and upper cave exploration.
  - `dflag = 1`: First dwarf appears at Hall of Mists, throws an axe (guaranteed miss), and flees.
  - `dflag = 2`: Full combat activation. Up to 5 dwarves and 1 pirate actively patrol rooms, hurling lethal axes with increasing hit accuracy.
- **Reincarnation Limits (`numdie` vs `maxdie`):**
  - Player possesses 3 lives.
  - Dying once or twice revives the adventurer at the building, costing 10 points per death.
  - Dying a third time ends the game permanently.

### 2. Setup Configuration & Wizard Controls
- **Save / Restore Protection:** Saves are single-use (`unlink(argv[1])` on load) to prevent save-scumming.
- **Working Hours Delay (`wizard.c`):**
  - Suspending enforces a 45-minute latency lock (`latncy = 45`) before resuming is allowed.
  - Overridable only via the wizard command password (`dwarf`).
- **Hint Penalties:** Answering "YES" to in-game hints (e.g. Plover room, dark maze) deducts 2 to 5 points each from the final score.

---

## RNG Usage

| Trigger | Distribution | Effect |
|---|---|---|
| Dwarf appearance | Uniform roll $[0, 99]$ | Determines if dwarf enters player's room |
| Dwarf knife attack | Uniform $[0, 99]$ | Hit vs miss check (accuracy scales with turns) |
| Pirate encounter | $20\%$ periodic check | Steals carried treasures to pirate's chest |
| Reincarnation prompt | Uniform check | Offers divine resurrection |
| Witt's End exit | $95\%$ trap / $5\%$ escape | Navigating out of Witt's End |

---

## Scoring Breakdown (Max 350 / 351 Points)

```text
Score Component                         Points Available
--------------------------------------------------------
Finding 15 treasures (2 pts each)                    30
Depositing 15 treasures in Building (k-2 pts)       170
Surviving without deaths (maxdie - numdie)*10        30
Entering the cave (dflag != 0)                       25
Triggering cave closure (closng == 1)                25
Surviving endgame repository (bonus)                 45
Reading "Spelunker Today" in Witt's End (Easter Egg)   1
Never giving up / clean exit                          4
Never using hinted clues                             -N
--------------------------------------------------------
GRAND TOTAL MAXIMUM SCORE                           350 (or 351)
```

### Rank Classifications
- **0–34:** Beginner
- **35–99:** Amateur
- **100–199:** Experienced Adventurer
- **200–299:** Seasoned Adventurer
- **300–349:** Master
- **350+:** Grandmaster ("To achieve the next higher rating would be a neat trick! Congratulations!!")

---

## Termination Conditions

1. **Grandmaster Victory:** Cave closed, repository puzzle cleared, score = 350/351 $\rightarrow$ exits with congratulations.
2. **Standard Resignation (`quit`):** Player types `quit` $\rightarrow$ final score and rank displayed.
3. **Perma-Death:** 3 deaths reached $\rightarrow$ game terminates with final score minus penalties.
4. **Suffocation in Cave-in:** Clock runs out during repository closing $\rightarrow$ crushed by falling boulders.
