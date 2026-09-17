# `battlestar` — How to Play

> Comprehensive manual, command reference, navigation mechanics, and survival strategy.

---

## 1. Objective

You begin trapped inside your stateroom on an interstellar battlestar that is under catastrophic assault. Your mission is five-fold:

1. **Escape the Battlestar:** Navigate through corridors littered with debris, collect essential gear, reach launch tube #7, and launch the lone remaining Viper fighter.
2. **Survive Orbit:** Destroy attacking Cylon raiders in orbital dogfights and safely re-enter the planetary atmosphere.
3. **Explore the Tropical Island:** Navigate across the surface of the planet, discover ancient ruins, survive nocturnal hazards, and manage your health, nourishment, and carrying encumbrance.
4. **Unite the Three Sacred Artifacts:** Locate the three water goddesses and secure the **Amulet**, the **Medallion**, and the **Talisman**.
5. **Attain Wizardhood:** Combine all three items to trigger magical transcendence, unlocking the reality-altering power of wizardry to win the game.

---

## 2. Command Syntax & Parser Mechanics

The parser in `battlestar` is case-insensitive and reads simple English two-word or three-word phrases in `VERB NOUN` or `VERB PREPOSITION NOUN` format:

```text
>-: take laser
>-: wear pajamas
>-: shoot cylon
>-: go north
>-: put on robe
```

### Movement Commands

The game uniquely supports two distinct movement paradigms:

#### A. Absolute Cardinal Navigation
Directs movement relative to the world compass:
- `north` / `n` — Move North
- `south` / `s` — Move South
- `east` / `e` — Move East
- `west` / `w` — Move West
- `up` / `u` — Ascend stairs, climb ladders, or fly upward
- `down` / `d` — Descend stairs, climb down, or dive into water

#### B. Egocentric Relative Navigation
Directs movement relative to the direction you are currently facing:
- `ahead` / `forward` / `f` — Step directly forward
- `back` / `retreat` / `b` — Step directly backwards
- `left` / `l` — Turn 90 degrees left and step forward
- `right` / `r` — Turn 90 degrees right and step forward

*Note: Whenever you enter a room, the game prints which exits are accessible. When facing North, `ahead` leads North, `right` leads East, `back` leads South, and `left` leads West.*

### Interaction & Item Commands

| Command | Syntax / Examples | Effect |
|---|---|---|
| `take` / `get` | `take laser`, `take all` | Pick up an item from the current room and place it in inventory. |
| `drop` | `drop knife`, `drop matches` | Discard an item onto the floor of the current room. |
| `wear` / `put on` | `wear robe`, `wear mail` | Equip armor, clothing, or footwear onto your body. |
| `take off` | `take off pajamas` | Remove an equipped piece of clothing or armor. |
| `draw` / `wield` | `draw sword`, `draw laser` | Ready a weapon for melee or ranged combat. |
| `inven` / `i` | `inven` | Display current inventory, worn apparel, injury list, and carrying capacity. |
| `look` / `l` | `look` | Reprint the full room description, exits, and visible objects. |
| `light` | `light lamp`, `light match` | Ignite a light source to illuminate dark subterranean chambers. |
| `eat` | `eat papaya`, `eat coconut` | Consume tropical fruit to prevent starvation. |
| `drink` | `drink water`, `drink potion` | Quench thirst or consume magical healing elixirs. |
| `open` | `open door`, `open trunk` | Unlock or unlatch passages and containers. |
| `dig` | `dig`, `dig shovel` | Excavate hidden treasures in loose earth or sand. |
| `kill` / `fight` | `kill elf with broadsword` | Engage in combat against hostile creatures or enemies. |
| `shoot` | `shoot cylon` | Fire ranged weaponry (laser pistol or ship torpedoes). |
| `launch` | `launch viper` | Blast off from a launch bay into outer space orbit. |
| `land` | `land` | Touch down your starfighter onto designated landing zones. |
| `sleep` | `sleep` | Rest to recover stamina and reset the fatigue counter (`snooze`). |
| `save` | `save [filename]` | Save the current game state to an encrypted save file (default: `.Bstar`). |
| `score` | `score` | Print current Pleasure, Power, and Ego ratings and turn count. |
| `quit` / `q` | `quit` | Exit the current game session. |

---

## 3. Flight Simulator Controls (`fly.c`)

When launching the Viper fighter into orbit, the game shifts to a real-time curses terminal display:

```text
                   .                                 *
           *                     +                     .
                    [ CYLON RAIDER DETECTED ]
                               .-.
                             -( o )-
                               '-'
            *                                         .
                       .             +
================================================================================
FUEL: 242   TORPEDOES: 8   CLOCK: 114   [h/j/k/l: Maneuver | f: Fire | q: Eject]
```

- **Maneuvering:**
  - `h` or `r` — Pitch / Yaw Left (Consumes 1 unit of fuel).
  - `l` or `f` — Pitch / Yaw Right (Consumes 1 unit of fuel).
  - `j` or `u` — Pitch Down (Consumes 1 unit of fuel).
  - `k` or `d` — Pitch Up (Consumes 1 unit of fuel).
- **Weapons:**
  - `f` or `space` — Fire Photon Torpedo. Must align crosshairs directly onto enemy raider. Consumes 1 torpedo (`TORPEDOES 10`).
- **HUD & Telemetry:**
  - **`FUEL`:** Starts at 250 (`TANKFULL`). If fuel drops to 0, thrusters flame out and the Viper crashes.
  - **`TORPEDOES`:** Starts at 10. Once depleted, raiders cannot be destroyed.
  - **`CLOCK`:** 120-second mission flight limit before orbital decay.

---

## 4. Systems of Survival

### Day / Night Cycle (`CYCLE 100`)

Time continuously advances with each turn (`ourtime++`). Every 100 turns, the sun sets or rises:
- **Daytime (`0..99`, `200..299`):** Surface locations are fully lit. Peaceful villagers and island elders roam the market squares.
- **Nighttime (`100..199`, `300..399`):** Darkness descends. Caves and indoor ruins become pitch-black without a lantern. Ruthless wood-elves armed with deadly halberds patrol the tropical forests, attacking on sight.

### Encumbrance & Inventory Management

- **Weight Limit:** You can carry at most **60 kg** (`MAXWEIGHT`). Heavy armors, broadswords, and ship batteries weigh substantial amounts.
- **Bulk / Encumbrance Limit:** You can hold at most **10 cumbersome units** (`MAXCUMBER`). Oddly shaped objects (like long ladders or ladders of chain) severely limit your carrying ability.
- **Clothing / Armor:** Wearing garments (like `pajamas`, `robe`, `chainmail`, or `shoes`) assigns items to your body rather than hands, preserving encumbrance slots.

### Medical Trauma & Injuries

Physical encounters inflict specific bodily trauma (`NUMOFINJURIES 13`):
- Broken arm, fractured ribs, ruptured back/spine, concussion, deep lacerations, broken neck.
- Each injury degrades your carrying capacity (reducing `MAXWEIGHT` by 5–15 kg per trauma).
- Severe injuries cause gradual bleeding. You must drink healing potions (`POTION`) or seek medical treatment in the battlestar sick bay (`Room 18`).

---

## 5. Scoring & The Personality Matrix

Typing `score` evaluates your standing across three distinct attributes:

$$\text{Rating} = \max(\text{PLEASURE}, \text{POWER}, \text{EGO})$$

### Rating Titles

| Dominant Attribute | Score Range | Bestowed Title |
|---|:---:|---|
| **PLEASURE** | $0 \dots 4$ | *Novice* |
| | $5 \dots 19$ | *Junior Voyeur* |
| | $20 \dots 34$ | *Don Juan* |
| | $\ge 35$ | **Marquis De Sade** |
| **POWER** | $0 \dots 4$ | *Serf* |
| | $5 \dots 7$ | *Samurai* |
| | $8 \dots 12$ | *Klingon* |
| | $13 \dots 21$ | *Darth Vader* |
| | $\ge 22$ | **Sauron the Great** |
| **EGO** | $0 \dots 4$ | *Polyanna* |
| | $5 \dots 9$ | *Philanthropist* |
| | $10 \dots 19$ | *Tattoo* |
| | $\ge 20$ | **Mr. Roarke** |

---

## 6. Difficulty Levels & Setup Configuration

### CLI Flags & Invocation Options

```bash
# Start a fresh adventure
battlestar

# Restore an existing saved session from default file (.Bstar)
battlestar -r

# Restore an existing saved session from a custom save file
battlestar -r /path/to/mysave.Bstar

# Start or restore directly by passing save file as first argument
battlestar /path/to/mysave.Bstar
```

### Runtime Setup Knobs & Invariants

1. **Initial Player State:**
   - Spawns in Room 22 (Stateroom), facing North.
   - Initial inventory: Silk pajamas equipped on body.
   - Initial resources: `fuel = 250`, `torps = 10`, `ourtime = 0`.
2. **Wizard Privilege (`su`):**
   - By default, `su` is locked.
   - Collecting all three sacred amulets (`AMULET`, `MEDALION`, `TALISMAN`) grants permanent in-game Wizard status (`tempwiz = 1`).
   - Typing `su` prompts for any room index ($1 \dots 275$) to instantly teleport there.

---

## 7. Tips & Strategic Advice

1. **Don't Forget Your Clothes:** You start in silk pajamas. Before running into the main hangar, grab the robe or look for heavy armor.
2. **Secure the Brass Lantern Early:** Never venture into the subterranean caves or stay out past turn 100 without a lit lantern or matches.
3. **Carry Fruit:** Island exploration consumes turns rapidly. Pick up pineapples, papayas, and coconuts along the beaches to keep hunger at bay.
4. **Viper Fuel Conservation:** In orbital flight, do not waste fuel making erratic course corrections. Line up your shots steadily.
5. **Beware the Wood-Elves:** When turn 100 approaches, seek shelter in fortified structures or be prepared with a shield and broadsword.
