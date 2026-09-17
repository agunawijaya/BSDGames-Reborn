# `battlestar` — Test Scenarios & Verification Scripts

> Manual and automated end-to-end verification scripts to validate port parity with original 4.2BSD behavior.

---

## Scenario 1: Initial Spawn & Apparel Verification

### Objective
Verify that the game initializes player position, direction, and starting clothing correctly.

### Steps
1. Launch game without flags:
   ```bash
   battlestar
   ```
2. Verify banner text:
   ```text
   Version 4.2, fall 1984.
   First Adventure game written by His Lordship, the honorable
   Admiral D.W. Riggle
   ```
3. Verify initial room text:
   ```text
   This is a luxurious stateroom.
   ```
4. Enter command `inven`:
   - Expected Output: Must indicate that the player is wearing silk pajamas (`PAJAMAS`) on their body.
   - Initial carrying capacity should report 60 kg with 0 kg carried in hands.

---

## Scenario 2: Relative Navigation & Facing Invariants

### Objective
Verify that `ahead`, `back`, `left`, `right` correctly translate according to the player's facing direction.

### Steps
1. At Room 22 (facing `NORTH`):
   - Type `left`.
   - Expected Result: Player moves `WEST` into Room 17 (Hallway). Facing direction updates to `WEST`.
2. At Room 17 (facing `WEST`):
   - Type `right`.
   - Expected Result: Player moves `NORTH` into Room 16 (Executive Suites). Facing direction updates to `NORTH`.
3. At Room 16 (facing `NORTH`):
   - Type `back`.
   - Expected Result: Player retreats `SOUTH` back into Room 17.

---

## Scenario 3: Starship Evacuation & Viper Launch

### Objective
Verify that the player can navigate to the hangar, enter the Viper, and launch into orbital space.

### Steps
1. From Room 22:
   ```text
   west
   north
   west
   north
   north
   up
   north
   down
   north
   ```
2. Confirm arrival at Room 7 (Viper Launch Tube):
   ```text
   You are in the viper launch tube.
   ```
3. Type `board viper` followed by `launch`.
4. Expected Result: Game enters curses flight engine (`fly.c`), rendering cockpit HUD with `FUEL: 250` and `TORPEDOES: 10`.

---

## Scenario 4: Day / Night Transition Verification

### Objective
Verify that room descriptions and entity populations swap at turn 100.

### Steps
1. Land on tropical island (Room 70).
2. Move north to Room 71 (Sandy Beach).
3. Issue 100 benign commands (e.g. `look`, `wait`) until `ourtime == 100`.
4. Expected Result:
   - System prints: `"The sun has set, plunging the world into darkness."`
   - Active database swaps from `dayfile` to `nightfile`.
   - Wood-elves armed with shields and halberds appear in outdoor forest clearings.

---

## Scenario 5: Three-Artifact Assembly & Wizard Ascension

### Objective
Verify that holding `AMULET`, `MEDALION`, and `TALISMAN` simultaneously triggers wizard ascension and allows `su` command teleportation.

### Steps
1. Acquire all three items (or use test harness script).
2. Verify console announcement:
   ```text
   The three amulets glow and reenforce each other in power.
   You are now a wizard.
   ```
3. Enter command:
   ```text
   su
   ```
4. Verify prompt:
   ```text
   Room (was ...) = 
   ```
5. Enter `275`. Verify instantaneous teleportation to the High Altar.

---

## QA Sign-Off Template

```text
================================================================================
BATTLESTAR TEST RUN SIGN-OFF
================================================================================
Platform: [ Linux / macOS / Windows WSL2 ]
Binary Version: [ bsdgames-reborn v0.1.0 ]
Date of Test: [ YYYY-MM-DD ]
Tester: [ Contributor Name / Agent ID ]

[ ] Scenario 1: Initial Spawn & Apparel Verification ............ PASS / FAIL
[ ] Scenario 2: Relative Navigation & Facing Invariants ......... PASS / FAIL
[ ] Scenario 3: Starship Evacuation & Viper Launch .............. PASS / FAIL
[ ] Scenario 4: Day / Night Transition Verification ............. PASS / FAIL
[ ] Scenario 5: Three-Artifact Assembly & Wizard Ascension ...... PASS / FAIL

Comments:
________________________________________________________________________________
```
