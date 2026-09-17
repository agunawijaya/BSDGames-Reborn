# `adventure` — Manual Test Scenarios

> Playthrough scripts and regression verification scenarios for *Colossal Cave Adventure*.
>
> Run these scripts before releasing ports to verify parser behavior, puzzle logic,
> creature interactions, and scoring invariants.

---

## Test Environment

- **Terminal:** Minimum $80 \times 24$, UTF-8 capable.
- **Platforms:** Linux, macOS, Windows (PowerShell / Windows Terminal).
- **Execution Command:** `adventure [options]`

---

## Regression Suite

### T-01 — Smoke Test & Clean Exit
- **Steps:**
  1. Launch `adventure`.
  2. Observe welcome prompt.
  3. Type `quit`.
  4. Confirm prompt: `Do you really wish to quit now?` $\rightarrow$ type `yes`.
- **Expected:** Game prints score breakdown and cleanly exits with status code `0`.

---

### T-02 — 5-Letter Parser Truncation
- **Steps:**
  1. From start, type `INVENTORY`.
  2. Then type `INVEN`.
- **Expected:** Both commands produce the exact same response: `"You are currently holding nothing."`.

---

### T-03 — The Darkness & Pit Plunge Rule
- **Steps:**
  1. Enter building $\rightarrow$ `TAKE KEYS` $\rightarrow$ `OUT`. (Leave the lamp!).
  2. `SOUTH` $\rightarrow$ `SOUTH` $\rightarrow$ `SOUTH` $\rightarrow$ `UNLOCK GRATE` $\rightarrow$ `OPEN GRATE` $\rightarrow$ `DOWN`.
  3. Attempt to move in the dark: `WEST`.
- **Expected:**
  Game immediately displays:
  `"You fell into a pit and broke your neck!"`
  Player dies and is either offered divine reincarnation or game ends.

---

### T-04 — Magic Portal Teleportation (`XYZZY` & `PLUGH`)
- **Steps:**
  1. Take keys and lamp $\rightarrow$ enter cave $\rightarrow$ travel to Debris Room (`loc 11`).
  2. Type `XYZZY`.
  3. Observe return to the inside of the Brick Building.
  4. Type `XYZZY` again $\rightarrow$ Observe teleportation back to Debris Room.
  5. Travel to Y2 (`loc 33`) $\rightarrow$ Type `PLUGH`.
  6. Observe teleportation directly to the Brick Building.
- **Expected:** Instant bidirectional teleportation functions smoothly without turn-delay penalty.

---

### T-05 — Black Rod & Crystal Bridge Across Fissure
- **Steps:**
  1. Stand on East Bank of Fissure holding the black iron rod.
  2. Type `WAVE ROD`.
  3. Type `WEST` to cross over the chasm.
  4. Type `WAVE ROD` on the other side.
- **Expected:**
  - First wave produces: `"A crystal bridge now spans the fissure."`
  - Second wave collapses the bridge: `"The crystal bridge has vanished!"`

---

### T-06 — Bird vs. Snake Puzzle
- **Steps:**
  1. Catch little green bird in wicker cage (ensure rod is dropped outside bird chamber).
  2. Walk to Hall of the Mountain King where the fierce green snake blocks the passage.
  3. Type `DROP BIRD`.
- **Expected:**
  Game outputs:
  `"The little bird attacks the green snake, and in an astounding flurry drives the snake away!"`
  The passage north and south is now permanently cleared.

---

### T-07 — Slaying the Green Dragon Bare-Handed
- **Steps:**
  1. Enter Dragon Lair holding an axe or sword.
  2. Type `ATTACK DRAGON`.
  3. Observe prompt: `"With what? Your bare hands?"`.
  4. Type `YES`.
- **Expected:**
  Game outputs:
  `"Congratulations! You have just vanquished a dragon with your bare hands! (Who'd have thought it possible?)"`
  The dragon vanishes, leaving the Persian rug accessible.

---

### T-08 — The Fragile Ming Vase Drop
- **Steps:**
  1. Collect Ming Vase from Oriental Room.
  2. In any stone room, type `DROP VASE`.
- **Expected:**
  Vase shatters into pieces:
  `"The vase drops with a delicate crash and shatters into a thousand pieces!"`
- **Alternative (Safe):** Drop velvet pillow first, then `DROP VASE` $\rightarrow$ Vase rests softly on pillow intact.

---

### T-09 — The Chasm Troll & Cave Bear
- **Steps:**
  1. Feed meat to cave bear in Barren Room $\rightarrow$ Unlock chain $\rightarrow$ `TAKE BEAR`.
  2. Lead bear to Chasm edge where the greedy troll blocks the bridge.
  3. Type `THROW BEAR`.
- **Expected:**
  `"The bear lumbers toward the troll, which takes one look at the enormous beast and flees in terror!"`
  The troll never returns.

---

### T-10 — Full 15-Treasure Deposit & 350-Point Verification
- **Steps:**
  1. Execute Walkthrough B to deposit all 15 treasures inside the building.
  2. Observe cave closing chime.
  3. Complete repository blast escape.
- **Expected:**
  Final output displays:
  `"You scored 350 out of a possible 350 using X turns."`
  Class rank awarded: **Grandmaster**.
