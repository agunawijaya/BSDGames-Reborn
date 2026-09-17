# `battlestar` — World Map & Sector Topology

> Complete graph topology, regional Mermaid flowcharts, and the Master 275-Room Directory for *Battlestar*.

---

## Overview of the World Graph

The world of *Battlestar* is composed of **275 distinct rooms** (`NUMOFROOMS 275`) partitioned into five macro-sectors:

```mermaid
flowchart TD
    subgraph SpaceOpera [Space Opera Phase]
        S1["Sector 1: The Battlestar Cruiser<br/>(Rooms 1–31)"]
        S2["Sector 2: Deep Space & Orbit<br/>(Rooms 32–68)"]
    end

    subgraph PlanetaryPhase [Planetary Surface Phase]
        S3["Sector 3: Tropical Coast & Crash Beach<br/>(Rooms 69–120)"]
        S4["Sector 4: Rainforest & Wood-Elf Territory<br/>(Rooms 121–200)"]
        S5["Sector 5: Ancient Ruins & Sacred Grottoes<br/>(Rooms 201–275)"]
    end

    S1 ==>|Viper Launch Tube 7| S2
    S2 ==>|Atmospheric Re-entry| S3
    S3 <==>|Coastal Trails| S4
    S4 <==>|Mountain Trails| S5

    classDef ship fill:#1a365d,stroke:#2b6cb0,color:#fff;
    classDef space fill:#171923,stroke:#4a5568,color:#fff;
    classDef land fill:#22543d,stroke:#38a169,color:#fff;
    classDef temple fill:#744210,stroke:#d69e2e,color:#fff;

    class S1 ship;
    class S2 space;
    class S3,S4 land;
    class S5 temple;
```

---

## 1. Sector 1: The Battlestar Cruiser (Rooms 1–31)

```mermaid
flowchart TD
    R22["Room 22: Luxurious Stateroom<br/>(STARTING ROOM)"] -->|West| R17["Room 17: Long Dimly Lit Hallway"]
    R17 <-->|North| R16["Room 16: Executive Suites"]
    R17 <-->|South| R18["Room 18: Sick Bay"]
    R17 <-->|East| R20["Room 20: Hallway End / Laser Pistol"]
    R16 <-->|West| R12["Room 12: Hallway Junction"]
    
    R12 <-->|North| R9["Room 9: Wide Hallway to Main Hangar"]
    R12 <-->|South| R10["Room 10: Hallway to Landing Bay"]
    
    R9 <-->|North| R1["Room 1: Main Hangar"]
    R10 <-->|South| R2["Room 2: Landing Bay"]
    
    R1 <-->|Up| R3["Room 3: The Gallery"]
    R3 <-->|North| R4["Room 4: Control Room"]
    R4 <-->|Down| R5["Room 5: Launch Room"]
    
    R5 <-->|East| R6["Room 6: Cluttered Workbench"]
    R5 <-->|North| R7["Room 7: Viper Launch Tube<br/>(VIPER STARFIGHTER)"]

    R12 <-->|West| R19["Room 19: Armory / Bomb"]
    R17 <-->|East| R21["Room 21: Maid Utility Room"]
    R18 <-->|South| R26["Room 26: Magazine / Grenades"]
    R16 <-->|North| R27["Room 27: Presidential Suite"]
```

---

## 2. Sector 2: Deep Space & Orbital Dogfight (Rooms 32–68)

Outer space is modeled as a 3D coordinate grid of 37 space sectors (`Rooms 32–68`). Patrols of Cylon raiders wander through these coordinates.

```mermaid
flowchart LR
    subgraph SpaceGrid [Orbital Combat Zones]
        R32["Space 32"] <--> R33["Space 33"] <--> R36["Space 36<br/>(Cylon Raider 1)"]
        R36 <--> R40["Space 40"] <--> R49["Space 49<br/>(Cylon Raider 2)"]
        R49 <--> R55["Space 55"] <--> R64["Space 64<br/>(Cylon Raider 3)"]
        R64 <--> R68["Space 68<br/>(Re-entry Corridor)"]
    end

    R68 ==>|Atmospheric Descent| R70["Room 70: Planetary Landing Zone"]
```

---

## 3. Sector 3: Tropical Coast & Crash Beach (Rooms 69–120)

```mermaid
flowchart TD
    R70["Room 70: Crash Site / Smoldering Viper"] <-->|North| R71["Room 71: Sandy Beach"]
    R71 <-->|East| R72["Room 72: Coral Reef Shallows"]
    R71 <-->|West| R75["Room 75: Palm Grove / Coconuts"]
    R75 <-->|North| R80["Room 80: Rocky Bluff"]
    
    R80 <-->|East| R92["Room 92: Native Coastal Encampment"]
    R92 <-->|North| R93["Room 93: Island Trader Dock<br/>(Friendly Man & Girl)"]
    
    R80 <-->|North| R100["Room 100: Estuary Crossing"]
    R100 <-->|East| R109["Room 109: Papaya & Fruit Plantation"]
    R100 <-->|North| R121["Room 121: Border of the Great Rainforest"]
```

---

## 4. Sector 4: Rainforest & Wood-Elf Territory (Rooms 121–200)

```mermaid
flowchart TD
    R121["Room 121: Rainforest Trailhead"] <-->|North| R126["Room 126: Grotto of the Bathing Goddess<br/>(AMULET)"]
    R121 <-->|East| R130["Room 130: Hidden Pool / Gold Bracelet"]
    R121 <-->|West| R137["Room 137: Excavation Pit / Shovel"]
    
    R126 <-->|North| R146["Room 146: Wood-Elf Stronghold<br/>(Elf Guardian, Halberd, Shield)"]
    R146 <-->|East| R164["Room 164: Overgrown Shrine / Spiked Mace"]
    R146 <-->|North| R172["Room 172: Woodsman Clearing / Mallet"]
    
    R172 <-->|East| R190["Room 190: Hidden Glade / Healing Potion & Two-Handed Sword"]
    R172 <-->|North| R197["Room 197: Hanging Gardens of the Citadel"]
```

---

## 5. Sector 5: Ancient Ruins & Sacred Grottoes (Rooms 201–275)

```mermaid
flowchart TD
    R197["Room 197: Citadel Entrance"] <-->|North| R218["Room 218: Grotto of the Sea Nymph<br/>(MEDALLION & RING)"]
    R218 <-->|East| R235["Room 235: Shrine of the Ancients / Matches & Timer"]
    R218 <-->|North| R236["Room 236: The Stables / Wild Stallion"]
    R236 <-->|East| R237["Room 237: Ancient Vehicle / Iron Chain & Compass"]
    
    R237 <-->|North| R258["Room 258: Armory of the Gods / Chainmail & Helm"]
    R258 <-->|East| R260["Room 260: Vault / Gold Coins & Runed Sword"]
    R258 <-->|North| R266["Room 266: Pitch Black Chasm"]
    R266 <-->|Light Lamp| R268["Room 268: Crystal Cave / Lit Lantern"]
    
    R268 <-->|North| R275["Room 275: The High Altar of the Heavens<br/>(TALISMAN & FINAL SANCTUM)"]
```

---

## Master Room & Object / Entity Directory

Below is the complete room-by-room entity directory for key interactive locations across all 275 game rooms, detailing day versus night presence:

| Room ID | Room Name | Sector | Day Entities & Objects | Night Entities & Objects | Puzzle & Gameplay Role |
|:---:|---|---|---|---|---|
| **1** | Main Hangar | Battlestar | Pilots, Debris | Debris, Fires | Central ship junction; leads to gallery and bays. |
| **4** | Control Room | Battlestar | Technicians | Empty console | Contains stairs descending to launch room #5. |
| **5** | Launch Room | Battlestar | Guard fighters | Empty racks | Leads to Viper launch tube. |
| **6** | Workbench | Battlestar | Cluttered tools | Tools | Provides contextual clues for ship maintenance. |
| **7** | Viper Launch Tube | Battlestar | **VIPER Starfighter** | **VIPER Starfighter** | Player enters Viper here and issues `launch`. |
| **8** | Walk-in Closet | Battlestar | **Robe** (`ROBE`) | **Robe** | Wearable warm clothing. |
| **11** | Rubble Hallway | Battlestar | **Gold Coins** (`COINS`) | Gold Coins | Valuable treasure boosting score. |
| **13** | Elegant Stateroom | Battlestar | **First Sacred Amulet** (`AMULET`) | Amulet | Key artifact 1 of 3 for wizard status. |
| **18** | Sick Bay | Battlestar | Medical supplies | Medical supplies | Resting here treats injuries and stops bleeding. |
| **19** | Armory | Battlestar | **Fusion Bomb** (`BOMB`) | Fusion Bomb | Heavy explosive weapon. |
| **20** | Presidential Corridor | Battlestar | **Laser Blaster** (`LASER`) | Laser Blaster | Powerful ranged weapon for ship defense. |
| **21** | Maid's Room | Battlestar | **Hunting Knife** (`KNIFE`), Maid | Knife, Maid | Initial cutting weapon. |
| **22** | Luxurious Stateroom | Battlestar | **Silk Pajamas** (`PAJAMAS`) | Pajamas | **STARTING ROOM.** Player awakens wearing pajamas. |
| **24** | First Class Lounge | Battlestar | **Book of Matches** (`MATCHES`) | Matches | Light source to ignite lanterns. |
| **26** | Magazine | Battlestar | **Grenades** (`GRENADE`) | Grenades | Throwable ordnance. |
| **30** | Kitchen | Battlestar | **Cleaver** (`CLEAVER`), **Knife** | Cleaver, Knife | Weapons and cooking implements. |
| **36** | Deep Space Sector | Orbit | **Cylon Raider #1** (`CYLON`) | Cylon Raider #1 | Hostile fighter to shoot down in `fly.c`. |
| **49** | Deep Space Sector | Orbit | **Cylon Raider #2** (`CYLON`) | Cylon Raider #2 | Hostile fighter to shoot down in `fly.c`. |
| **64** | Deep Space Sector | Orbit | **Cylon Raider #3** (`CYLON`) | Cylon Raider #3 | Hostile fighter to shoot down in `fly.c`. |
| **70** | Crash Beach | Island Shore | Damaged Viper, Landing gear | Damaged Viper | Atmospheric touch-down coordinate. |
| **92** | Native Encampment | Island Shore | Papayas, Pineapples, Mangoes | **Natives**, **Campfire**, **Lit Lamp** | Friendly gathering; food and night light. |
| **93** | Coastal Pier | Island Shore | **Trader Man** (`MAN`), **Island Girl** (`GIRL`) | Trader Man, Girl | NPC interaction; trading and clues. |
| **109** | Papaya Grove | Island Plains | **Fresh Papayas** (`PAPAYAS`) | Papayas | Essential nourishing food. |
| **110** | Pineapple Patch | Island Plains | **Pineapples** (`PINEAPPLE`) | Pineapples | Essential nourishing food. |
| **111** | Kiwi Orchard | Island Plains | **Kiwi Fruit** (`KIWI`) | Kiwi Fruit | Essential nourishing food. |
| **112** | Coconut Palms | Island Plains | **Coconuts** (`COCONUTS`) | Coconuts | Thirst quenching and nutrition. |
| **124** | Darkened Clearing | Jungle | Forest flora | **Armed Wood-Elf** (`ELF`), **Shield**, **Halberd** | Nocturnal ambush point. |
| **126** | Emerald Pools | Rainforest | **Bathing Goddess** (`BATHGOD`) | Slumbering waters | Second nymph encounter. |
| **130** | Hidden Grotto | Rainforest | **Jeweled Bracelet** (`BRACELET`) | Jeweled Bracelet | Precious treasure boosting Ego score. |
| **137** | Sandy Pit | Rainforest | **Excavation Shovel** (`SHOVEL`) | Shovel | Tool needed to dig buried artifacts. |
| **146** | Forest Clearing | Deep Jungle | **Wood-Elf Guardian** (`ELF`), **Shield**, **Halberd** | Wood-Elf Guardian, Shield, Halberd | High-tier combat encounter. |
| **164** | Ancient Pedestal | Deep Jungle | **Spiked Mace** (`MACE`) | Spiked Mace | Heavy blunt crushing weapon. |
| **172** | Timber Clearing | Highlands | **Woodsman** (`WOODSMAN`), **Mallet** (`MALLET`), **Deadwood** | Woodsman, Mallet, Deadwood | Woodcutting puzzle and tool source. |
| **181** | Forest Path | Highlands | Dark path | **Hanging Lantern** (`LAMPON`) | Nocturnal light beacon. |
| **190** | Mystic Spring | Highlands | **Two-Handed Sword** (`TWO_HANDED`), **Healing Potion** (`POTION`) | Two-Handed Sword, Healing Potion | Curative draught for mortal trauma. |
| **197** | Citadel Steps | Highlands | Marble portal | Marble portal | Threshold to final sacred sectors. |
| **216** | Stone Archway | Ancient Ruins | **Leather Shoes** (`SHOES`) | **Wood-Elf Guardian**, **Shield**, **Halberd** | Armor for feet; dangerous at night. |
| **218** | Sacred Springs | Ancient Ruins | **Denim Levis** (`LEVIS`), **Diamond Ring** (`RING`) | **Second Sacred Medallion** (`MEDALION`) | Night appearance of key artifact 2 of 3. |
| **235** | Sunken Crypt | Ancient Ruins | **Timer Mechanism** (`TIMER`), **Matches** | **Tribal Shaman** (`NATIVE`) | Mechanical puzzle component. |
| **236** | Ancient Paddock | Ancient Ruins | **Wild Stallion** (`HORSE`) | Wild Stallion, **Lit Lantern** | Rideable mount to travel swiftly. |
| **237** | Vehicle Wreck | Ancient Ruins | **Iron Chain** (`CHAIN`), **Magnetic Compass** (`COMPASS`), **Car** | Chain, Compass, Car | Heavy utility items and orienteering tool. |
| **258** | Citadel Armory | Citadel Interior | **Chainmail Coat** (`MAIL`), **Iron Helmet** (`HELM`) | Chainmail Coat, Iron Helmet | Maximum physical defense armor. |
| **260** | Royal Treasury | Citadel Interior | **Runed Broadsword** (`SWORD`), **Gold Coins** (`COINS`) | Broadsword, Coins | Elite masterwork blade. |
| **266** | Dark Vault | Citadel Interior | **Pitch Darkness** (`DARK`) | Pitch Darkness | Requires active light source to cross. |
| **268** | Crystal Chamber | Citadel Interior | **Brass Lantern** (`LAMPON`) | Brass Lantern | Permanent portable illumination. |
| **275** | Altar of the Gods | Citadel Zenith | **Third Sacred Talisman** (`TALISMAN`), **Pot of Gold** (`POT`), **Gold Bar** (`BAR`) | Sacred Talisman, Pot of Gold, Gold Bar | **FINAL SANCTUM.** Uniting all three artifacts wins the game. |

---

## Traversal Notes & Invariants

1. **Directional Inversion:** Because movements may be relative (`ahead`, `back`, `left`, `right`), the player's facing direction must be monitored at all times.
2. **Day vs. Night Connectivity:** Room descriptions swap entirely at turn multiples of 100 (`ourtime % 100 == 0`). Dark interior spaces (e.g. rooms 266–268) become fatal without light.
3. **Viper Spaceflight Gate:** The player cannot enter space without boarding the Viper in Room 7 and issuing `launch`.
