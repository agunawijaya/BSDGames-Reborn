# `hack` — Test Scenarios & Verification Scripts

> Manual and automated end-to-end verification scripts for testing *Hack* mechanics, shop interactions, bones files, and combat.

---

## Scenario 1: Initial Character Spawn & Pet Synchronization

### Objective
Verify that `hack` launches into Level 1, displays correct HUD metrics, and spawns a loyal pet dog adjacent to the player.

### Steps
1. Launch game:
   ```bash
   hack
   ```
2. Select role `K` (Knight).
3. Observe terminal screen:
   - Player character `@` appears inside a room.
   - Pet dog `d` appears in an adjacent tile.
   - Bottom status line displays:
     ```text
     Level 1  Gold: 0  Hp: 16(16)  Ac: 4  Str: 16  Exp: 1  Dlvl: 1
     ```
4. Move 3 steps North (`k k k`):
   - Expected Result: Pet dog moves behind player, following closely without attacking.

---

## Scenario 2: Shopkeeper Interaction & Purchase Transaction

### Objective
Verify that picking up items in a shop computes a bill and dropping gold resolves payment.

### Steps
1. Locate a general store on Level 2 or 3.
2. Step inside the shop doorway (`+`).
   - Expected Result: Message line prints: `"Hello stranger! Welcome to ... general store!"`
3. Pick up a sword from the shop floor (`w a`):
   - Expected Result: Item is added to inventory, tagged as unpaid.
4. Attempt to walk out the door without paying:
   - Expected Result: Shopkeeper blocks exit and demands payment.
5. Drop gold equal to the item's price (`d $`):
   - Expected Result: Shopkeeper acknowledges payment: `"Thank you for your business!"` Doorway is unblocked.

---

## Scenario 3: Bones File Serialization on Permadeath

### Objective
Verify that dying on Level 4 writes an encrypted bones file `bonD0.4` and that a subsequent game loads the tombstone and ghost.

### Steps
1. Descend to Dungeon Level 4 (`dlevel == 4`).
2. Type `Q` to quit and die.
3. Observe tombstone display:
   ```text
                ----------
               /   REST   \
              /     IN     \
             /    PEACE     \
   ```
4. Check filesystem:
   - Verify that bones file `bonD0.4` was created.
5. Start a new game and descend back to Level 4.
   - Expected Result: Level 4 loads the previous map layout containing the tombstone and player ghost `pm_ghost`.

---

## QA Sign-Off Template

```text
================================================================================
HACK TEST RUN SIGN-OFF
================================================================================
Platform: [ Linux / macOS / Windows WSL2 ]
Binary Version: [ bsdgames-reborn v0.1.0 ]
Date of Test: [ YYYY-MM-DD ]
Tester: [ Contributor Name / Agent ID ]

[ ] Scenario 1: Initial Character Spawn & Pet Synchronization ... PASS / FAIL
[ ] Scenario 2: Shopkeeper Interaction & Purchase Transaction ... PASS / FAIL
[ ] Scenario 3: Bones File Serialization on Permadeath .......... PASS / FAIL

Comments:
________________________________________________________________________________
```
