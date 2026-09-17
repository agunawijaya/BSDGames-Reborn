# `battlestar` — Walkthroughs

> Complete step-by-step solutions for *Battlestar*:
> 1. **The Speedrun Walkthrough (Shortest Path to Victory)** — Minimal turns to escape, acquire the 3 artifacts, and become a Wizard.
> 2. **The Grandmaster Walkthrough (Maximum Score Path)** — Achieving highest rating (*Sauron the Great* / *Marquis De Sade*), defeating all Cylons, gathering all treasures, and maximizing visited rooms.

---

## Walkthrough 1: The Speedrun (Shortest Path to Victory)

This path ignores non-essential side quests and focuses on immediate starship evacuation, rapid orbital transit, and direct artifact retrieval.

### Phase 1: Starship Evacuation

1. `west` (Leave Stateroom 22 into hallway 17).
2. `north` (Enter Executive Suites 16).
3. `west` (Enter Hallway Junction 12).
4. `west` (Enter Armory 19).
5. `take laser` (Arm yourself with the laser blaster).
6. `east` (Return to Junction 12).
7. `north` (Enter Wide Hallway 9).
8. `north` (Enter Main Hangar 1).
9. `up` (Climb to Gallery 3).
10. `north` (Enter Control Room 4).
11. `down` (Descend into Launch Room 5).
12. `north` (Enter Viper Launch Tube 7).
13. `take viper` (Board the fighter).
14. `launch` (Ignite thrusters and blast off into space).

### Phase 2: Orbital Flight & Re-Entry

15. In curses cockpit HUD:
    - Steer using `h`, `j`, `k`, `l` to align with orbital re-entry trajectory.
    - If a Cylon raider enters your sights, press `f` to fire a torpedo.
    - Press `q` or navigate to atmospheric re-entry corridor to initiate descent.
16. `land` (Touch down on the tropical island beach, Room 70).

### Phase 3: Island Exploration & Artifact Retrieval

17. `north` (Move onto sandy beach 71).
18. `take papaya` (Grab fruit to maintain nourishment).
19. `eat papaya` (Prevent hunger penalty).
20. `north` (Move past bluff into Room 80).
21. `north` (Cross estuary to Room 100).
22. `north` (Enter Great Rainforest trailhead 121).
23. `north` (Enter Grotto of the Bathing Goddess 126).
24. `take amulet` (Retrieve **Artifact #1: The Sacred Amulet**).
25. `north` (Enter Woodsman clearing 172).
26. `north` (Enter Citadel Entrance 197).
27. `north` (Enter Grotto of the Sea Nymph 218).
28. `wait` (If daytime, wait until turn 100 for nightfall; if nighttime, proceed).
29. `take medallion` (Retrieve **Artifact #2: The Sacred Medallion**).
30. `north` (Enter Stables 236).
31. `east` (Enter Vehicle Wreck 237).
32. `take compass` (Equip navigation tool).
33. `north` (Enter Citadel Armory 258).
34. `take mail` (Equip armor for protection).
35. `wear mail`
36. `north` (Enter Vault approach 266).
37. `light match` (Illuminate the dark chamber).
38. `north` (Enter Crystal Chamber 268).
39. `take lamp` (Secure permanent light).
40. `north` (Ascend to High Altar of the Gods 275).
41. `take talisman` (Retrieve **Artifact #3: The Sacred Talisman**).

### Phase 4: Wizard Ascension & Victory

42. As soon as all three artifacts are held in inventory:
    ```text
    The three amulets glow and reenforce each other in power.
    You are now a wizard.
    ```
43. `su` (Exercise wizard reality control).
44. Enter `275` (Confirm high altar coordinates).
45. `score`
46. `live` or `quit` (Trigger triumphant victory sequence).

---

## Walkthrough 2: The Grandmaster (Maximum Score Path)

To maximize the tri-partite score (**PLEASURE**, **POWER**, and **EGO**) and claim the highest rank (*Sauron the Great* or *Marquis De Sade*), the player must:
1. Slay all 3 Cylon raiders in orbit.
2. Defeat the hostile Wood-Elves in melee combat.
3. Collect all treasures (Gold Coins, Pot of Gold, Gold Bar, Jeweled Bracelet, Diamond Ring).
4. Discover all secret grottos and rescue the Island Girl.
5. Visit >75% of the 275 world rooms.

### Act I: Scavenging the Battlestar

1. Start in Room 22:
   - `take off pajamas`
   - `west` (Hallway 17).
   - `north` (Room 16), `east` to Room 8: `take robe`, `wear robe`.
   - `west` to Room 16, `north` to Room 27 (Presidential Suite): examine tapestries.
   - `south` to 16, `west` to 12.
   - `south` to 10, `south` to Landing Bay 2: witness the space battle.
   - `north` to 10, `north` to 12, `west` to Armory 19:
     - `take laser`
     - `take bomb`
   - `east` to 12, `south` to 14, `south` to Magazine 26:
     - `take grenade`
   - `north` to 14, `west` to Dining Hall 28, `north` to Kitchen 30:
     - `take cleaver`
     - `take knife`
   - `south` to 28, `east` to 14, `north` to 12, `north` to Hallway 9.
   - `take coins` (Room 11 rubble).
   - `north` to Main Hangar 1.
   - `up` to Gallery 3, `north` to Control Room 4, `down` to Launch Room 5.
   - `north` to Viper Launch Tube 7.
   - `board viper`
   - `launch`

### Act II: The Ace of Orbit (Space Combat)

2. In space (`fly.c`):
   - Sector 36: Intercept Cylon Raider 1. Maneuver to center crosshairs (`+`) and fire (`f`). Raider destroyed (+10 Power).
   - Sector 49: Intercept Cylon Raider 2. Fire torpedo. Raider destroyed (+10 Power).
   - Sector 64: Intercept Cylon Raider 3. Fire torpedo. Raider destroyed (+10 Power).
   - Re-orient to re-entry vector and touch down on Room 70.

### Act III: The Tropical Conquest

3. Island Shore:
   - Move through rooms 71, 72, 75, 76, 77, 78, 79, 81, 82 (systematically mapping the beach and boosting visited room percentage).
   - Gather coconuts, papayas, and pineapples in Rooms 109, 110, 111, 112.
   - Visit Room 93:
     - Meet the Island Trader and Island Girl.
     - `kiss girl` (+5 Pleasure).
     - `give papaya to girl` (+5 Pleasure, +5 Ego).
     - `talk to girl` (Receive mystical clues about the water nymphs).

4. The Rainforest & Wood-Elf Battle:
   - Move to Room 137: `take shovel`.
   - Move to Room 130: `take bracelet` (+10 Ego).
   - Advance to Room 146 (Wood-Elf Stronghold):
     - `draw laser`
     - `shoot elf` (Elf is slain; +10 Power).
     - `take halberd`
     - `take shield`
   - Move to Room 164: `take mace`.
   - Move to Room 172: `talk to woodsman`, `take mallet`.
   - Move to Room 190: `take two-handed`, `take potion`.

### Act IV: The Goddesses & The Citadel

5. Secret Grottoes:
   - Visit Room 126: Greet the Bathing Goddess.
     - `love goddess` (+10 Pleasure).
     - `take amulet` (**First Artifact**).
   - Advance to Room 218: Grotto of the Sea Nymph.
     - `take ring` (+10 Ego).
     - `take levis`, `wear levis`.
     - At nightfall (`ourtime >= 100`): `take medallion` (**Second Artifact**).
   - Move to Room 236: `ride horse` (+5 Ego).
   - Move to Room 237: `take chain`, `take compass`.

6. The Citadel Depths:
   - Move to Room 258:
     - `take mail`, `wear mail`
     - `take helm`, `wear helm`
   - Move to Room 260:
     - `take sword`
     - `take coins` (+15 Ego)
   - Move through 266: `light match`.
   - Enter Room 268: `take lamp`, `light lamp`.
   - Ascend to Room 275 (The High Altar):
     - `take pot` (Pot of Gold; +20 Ego).
     - `take bar` (Gold Bar; +20 Ego).
     - `take talisman` (**Third Artifact**).

### Act V: Cosmic Ascension

7. With all three artifacts assembled:
   - The three items resonate with brilliant blinding light.
   - You ascend to Wizardhood.
   - `score`:
     ```text
     	PLEASURE	POWER		EGO
     	 35		 38		 80

     This gives you the rating of Sauron the Great in 184 turns.
     You have visited 215 out of 275 rooms this run (78%).
     ```
   - Total Grandmaster Victory achieved!
