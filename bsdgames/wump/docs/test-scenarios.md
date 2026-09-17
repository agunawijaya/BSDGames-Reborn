# `wump` — Manual Test Scenarios

> Human-executable playthrough scripts for validating `wump` game mechanics,
> sensory calculations, RNG triggers, and boundary conditions.
>
> Run these scenarios during manual QA and before each release milestone.

---

## Test Environment

- **Terminal:** Minimum $80 \times 24$, UTF-8 capable.
- **Platforms:** Linux, macOS, Windows (PowerShell / Windows Terminal).
- **Execution Command:** `wump [options]`

---

## Regression Suite

### T-01 — Smoke Test & Clean Exit
- **Setup:** Launch `wump` with no arguments.
- **Steps:**
  1. Observe initial room banner and description.
  2. At prompt `Move or shoot? (m-s)`, type `q` (or `x`).
- **Expected:** The program terminates immediately with exit status `0`, restoring the terminal cursor and state.

---

### T-02 — Movement & Wall Collision
- **Setup:** Launch `wump`. Observe room status. Note the available tunnels (e.g., `rooms 2, 5, and 8`).
- **Steps:**
  1. Type `m 2` (or any valid listed tunnel). Observe movement to Room 2.
  2. At Room 2, attempt to move to an invalid unlisted room (e.g. `m 99`).
- **Expected:**
  1. Terminal confirms arrival in Room 2 and updates room status.
  2. Terminal prints `*Oof!* (You hit the wall)`. Player remains in Room 2. (There is a 1-in-6 chance the wumpus awakens).

---

### T-03 — Sensory Proximity Cues
- **Setup:** Start a game with known hazard locations (or explore until warnings appear).
- **Steps:**
  1. Approach a room adjacent to a pit.
  2. Approach a room adjacent to bats.
  3. Approach a room within 2 hops of the Wumpus.
- **Expected:**
  1. Pit proximity displays: `*whoosh* (I feel a draft from some pits).`
  2. Bat proximity displays: `*rustle* *rustle* (must be bats nearby)`
  3. Wumpus proximity displays: `*sniff* (I can smell the evil Wumpus nearby!)`

---

### T-04 — Super Bat Relocation
- **Setup:** Enter a room known to contain bats.
- **Steps:**
  1. Issue `m <bat_room>`.
- **Expected:**
  1. Game displays: `*flap* *flap* *flap* (humongous bats pick you up and move you!)`.
  2. Player is relocated to a random new room.
  3. If the destination also contains bats, it repeats with: `(humongous bats pick you up and move you again!)`.
  4. If dropped into a pit or wumpus, death resolution triggers immediately.

---

### T-05 — Bottomless Pit Fall vs. Survival Outcrop
- **Setup:** Enter a pit room multiple times in test mode.
- **Steps:**
  1. Walk into a pit room (`cave[room].has_a_pit == 1`).
- **Expected:**
  - In $\approx 83.3\%$ of cases ($10/12$), game outputs Jules Verne death monologue:
    `*AAAUUUUGGGGGHHHHHhhhhhhhhhh...*` and player dies.
  - In $\approx 16.7\%$ of cases ($2/12$), game outputs:
    `Without conscious thought you grab for the side of the cave...` and player survives on the ledge!

---

### T-06 — Magic Arrow: Slaying the Beast (Victory)
- **Setup:** Pinpoint the Wumpus room (e.g. Room 15) from adjacent Room 6.
- **Steps:**
  1. Issue command `s 15`.
- **Expected:**
  1. Game prints victory banner:
     `*thwock!* *groan* *crash* ... you have slain the evil Wumpus and won the game!`
  2. Game displays prompt: `Care to play another game? (y-n)`.

---

### T-07 — Arrow Ricochet & Self-Inflicted Injury
- **Setup:** Stand in Room 1 (tunnels: 2, 5, 8).
- **Steps:**
  1. Intentionally fire an arrow into an invalid/disconnected room number: `s 99`.
- **Expected:**
  1. Arrow cannot find tunnel and diverts randomly:
     `*thunk* The arrow can't find a way from 1 to 99 and flys randomly into room X!`
  2. If the wild trajectory returns to Room 1:
     `*Thwack!* A sudden piercing feeling informs you that the ricochet of your wild arrow has resulted in it wedging in your side...`
     The Wumpus rushes in and devours the injured player.

---

### T-08 — Quiver Exhaustion Death
- **Setup:** Launch with 1 arrow (`wump -a 1`).
- **Steps:**
  1. Fire arrow into empty safe rooms (e.g. `s 2`).
- **Expected:**
  1. Arrow misses.
  2. Quiver reaches 0 arrows.
  3. Game outputs:
     `You turn and look at your quiver, and realize with a sinking feeling that you've just shot your last arrow...`
     Wumpus rampages through the cave and eats the player alive.

---

### T-09 — Boundary & Easter Egg Checks
- **Setup:** Launch `wump -r 20`.
- **Steps:**
  1. Attempt to move to negative room: `m -5`.
  2. Attempt to move to room $R+1$: `m 21`.
  3. Type random gibberish: `foobar`.
- **Expected:**
  1. Prints: `Sorry, but we're constrained to a semi-Euclidean cave!`
  2. Prints: `With a jaunty step you enter the magic tunnel...` and teleports player via `jump()`.
  3. Prints: `I don't understand!` (or 1-in-15 chance: `Que pasa?`).

---

### T-10 — Command-Line Configuration Bounds
- **CLI Invocations:**
  - `wump -r 5` $\rightarrow$ Fails with: `No self-respecting wumpus would live in such a small cave!`
  - `wump -r 300` $\rightarrow$ Fails with: `Even wumpii can't furnish caves that large!`
  - `wump -t 1` $\rightarrow$ Fails with: `Wumpii like extra doors in their caves!`
  - `wump -t 20 -r 20` $\rightarrow$ Fails with: `Too many tunnels! The cave collapsed!`
  - `wump -h` $\rightarrow$ Successfully boots with randomized extra bats and pits.

---

## Sign-off Template

Once all scenarios pass:

```
- [ ] T-01 smoke test and clean exit
- [ ] T-02 movement and wall collision
- [ ] T-03 sensory proximity cues (all 3 warnings)
- [ ] T-04 super bat relocation (including chained)
- [ ] T-05 bottomless pit fall vs. survival
- [ ] T-06 magic arrow victory
- [ ] T-07 arrow ricochet self-injury
- [ ] T-08 quiver exhaustion death
- [ ] T-09 boundary and easter egg checks
- [ ] T-10 CLI configuration bounds

Tested by: [name]
Date: YYYY-MM-DD
Build: [commit hash]
Cave seed used (if --seed supported): [seed value]
```

---

## Regression from Bugs

*As bugs are discovered and fixed, add a scenario here that reproduces
each so it doesn't regress.*

*(None yet — port implementation not yet started.)*
