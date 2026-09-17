# `hack` — How to Play

> The adventurer's field manual: keyboard controls, inventory management, tactical survival, and dungeon etiquette.

---

## 1. Objective

You enter the subterranean **Dungeons of Doom** at Level 1. Your goal is to navigate downward through approximately 30 increasingly perilous levels, defeat the Wizard of Yendor in his subterranean lair, seize the **Amulet of Yendor**, and ascend back through the dungeon to escape alive to the surface.

---

## 2. Character Roles & Starting Configurations

When launching `hack`, you can select your adventurer role or let the game choose randomly:

| Role | Symbol | Strengths & Starting Gear | Difficulty Level |
|---|:---:|---|:---:|
| **Knight** | `K` | Long sword, shield, chainmail armor. High melee survivability and chivalric code. | Moderate |
| **Fighter** | `F` | Two-handed sword, banded mail, high strength. Massive physical damage. | Easy |
| **Speleologist / Cave-man** | `S` | Club, leather armor, high endurance, rock throwing. | Moderate |
| **Wizard** | `W` | Staff, magic spellbooks, high intelligence. Fragile early on; godlike in late game. | Hard |
| **Tourist** | `T` | Hawaiian shirt, darts, camera, extra gold. Low combat stats; challenging survival. | Very Hard |

---

## 3. Movement & Directional Controls

*Hack* uses standard Unix *vi* directional keys for 8-way movement:

```text
       y   k   u         [7]  [8]  [9]
        \  |  /            \   |   /
      h -  .  - l        [4] - . - [6]
        /  |  \            /   |   /
       b   j   n         [1]  [2]  [3]
```

- `h, j, k, l`: West, South, North, East.
- `y, u, b, n`: Northwest, Northeast, Southwest, Southeast.
- `H, J, K, L`: Run continuously in a direction until hitting an obstacle or monster.
- `.` or `<space>`: Rest in place for 1 turn (allows hit points to regenerate slowly).
- `<` / `>`: Ascend / Descend staircases (`%` or `>`).

---

## 4. Key Commands Reference

| Key | Command | Tactical Function & Description |
|:---:|---|---|
| `i` | **Inventory** | Display all items currently carried, assigned letters `a` through `z`. |
| `w` | **Wield** | Ready a weapon in your hands (e.g. `w a` to wield your sword). |
| `W` | **Wear** | Put on armor, cloak, helmet, or boots (`W b`). |
| `T` | **Take Off** | Remove a piece of equipped armor or clothing. |
| `P` | **Put On Ring** | Slip a magical ring onto your left or right hand. |
| `R` | **Remove Ring** | Take off a ring from your fingers. |
| `e` | **Eat** | Consume food rations, tripe rations, or freshly slain monster corpses. |
| `q` | **Quaff** | Drink a potion from your inventory. |
| `r` | **Read** | Read a scroll or study a magical spellbook. |
| `z` | **Zap** | Zap a magical wand in a specified directional vector. |
| `a` | **Apply** | Use a non-magical tool (pick-axe, camera, skeleton key, mirror). |
| `d` | **Drop** | Discard an item onto the floor. |
| `t` | **Throw** | Hurl an item, dart, or stone at a distant target. |
| `E` | **Engrave** | Scratch a message or the sacred name *"Elbereth"* into the dust. |
| `s` | **Search** | Thoroughly inspect adjacent walls for hidden secret doors and traps. |
| `^P` | **Previous Messages**| Re-read recent narrative announcements and combat logs. |
| `S` | **Save** | Save current game state and exit. |
| `Q` | **Quit** | Abandon the adventure and commit seppuku. |

---

## 5. Essential Survival Rules

### 1. The Power of "Elbereth"
If you are surrounded by lethal monsters and low on hit points, press `E`, choose your fingers (`-`), and write:
```text
Elbereth
```
Monsters (except for undead demons and shopkeepers) are stricken with reverent terror and will refuse to strike you in melee as long as the dust engraving remains undisturbed beneath your feet.

### 2. Caring for Your Pet Dog (`d`)
- Your dog is your greatest ally. It attacks monsters, absorbs damage, and gains levels.
- **Curse Detection:** Dogs refuse to step onto squares containing cursed weapons, armor, or rings. Drop unknown gear on the floor; if your dog whimpers or balks, the item is cursed!
- **Feeding:** Feed your dog tripe rations or fresh meat to keep it loyal and prevent it from going feral.

### 3. Subterranean General Stores & Shopkeepers
- When you enter a shop, the shopkeeper greets you. Any item picked up from shop floor shelves adds to your active bill.
- Drop gold or pay the shopkeeper before walking through the door.
- **Warning:** Shoplifting causes the shopkeeper to barricade the door, draw lethal wands, and summon the Keystone Kops.

### 4. Corpse Consumption & Resistances
- Slain monsters leave corpses (`%`). Eating fresh corpses provides nourishment and can confer permanent intrinsic resistances:
  - Fire beetle $\rightarrow$ Fire resistance.
  - Blue dragon $\rightarrow$ Lightning resistance.
  - Floating eye $\rightarrow$ Telepathy / Monster detection.
- **Danger:** Never eat old, tainted corpses (fatal food poisoning), and never eat cockatrice corpses without leather gloves (petrification death).

### 5. Identification Protocol
- Never blindly quaff unknown potions or read unknown scrolls when low on health.
- Test wands by engraving in the dust (e.g., zapping a wand of digging says *"The floor is shattered!"*; zapping a wand of fire scorches the earth).
- Use scrolls of identify once collected to reveal full magical properties, enchantments (`+1`, `+2`), and charges.
