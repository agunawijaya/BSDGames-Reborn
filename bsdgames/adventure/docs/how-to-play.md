# How to Play `adventure`

> Manual, two-word command dictionary, puzzle hints, and survival strategies
> for *Colossal Cave Adventure*.

---

## Objective

Your quest is to locate the entrance to **Colossal Cave**, descend into its subterranean passages, find **15 legendary treasures**, bring them all back to the surface, and store them safely inside the brick building.

Once all treasures are secured, you must survive the dramatic closing of the cave and solve the endgame puzzle to achieve the ultimate score of **350 points** (Grandmaster).

---

## Starting the Game

Launch `adventure` from your terminal:

```bash
$ adventure [saved-file]
```

- If launched without arguments, a fresh expedition begins outside the brick building.
- If passed a saved-file argument (e.g. `adventure mysave`), the session resumes from that suspended state.

---

## The Two-Word Parser Grammar

*Adventure* understands simple two-word imperative English sentences formatted as `VERB NOUN`, as well as single-word directional motions.

> [!IMPORTANT]
> **The 5-Letter Rule:** The parser only looks at the first **5 letters** of each word. Longer words are truncated (`INVENTORY` $\rightarrow$ `INVEN`, `STREAM` $\rightarrow$ `STREA`).

### Movement Commands
- **Compass:** `NORTH`, `SOUTH`, `EAST`, `WEST`, `NE`, `NW`, `SE`, `SW`.
- **Vertical:** `UP`, `DOWN`, `CLIMB`, `CRAWL`, `JUMP`.
- **Relative:** `IN`, `OUT`, `ENTER`, `EXIT`, `CROSS`.
- **Landmarks:** `BUILDING`, `ROAD`, `VALLEY`, `GULLY`, `STREAM`, `ROCK`, `DEBRIS`, `CANYON`, `COBBLE`, `HALL`, `PIT`.

### Magic Teleportation Words
- **`XYZZY`**: Instantly teleports you between the inside of the Brick Building and the Debris Room in the upper cave.
- **`PLUGH`**: Instantly teleports you between the Brick Building and Y2.
- **`PLOVER`**: Instantly teleports you between Y2 and the Plover Room (only functions if carrying nothing larger than the emerald).

### Common Action Verbs
- `TAKE <item>` / `GET <item>`: Pick up an object into your pack.
- `DROP <item>`: Place an object in your current room.
- `OPEN <object>` / `CLOSE <object>`: Open/close the grate, wicker cage, or clam.
- `LOCK` / `UNLOCK <object>`: Secure doors or the grate using the brass keys.
- `ON` / `LIGHT`: Turn on your brass lantern (consumes battery power).
- `OFF` / `EXTINGUISH`: Turn off lantern to conserve battery.
- `WAVE <rod>`: Wave the black rod to magically span the fissure with a crystal bridge.
- `ATTACK` / `KILL`: Fight creatures (use bare hands for the dragon!).
- `FEED <creature>`: Offer food or meat to calm beasts.
- `POUR <liquid>`: Water the beanstalk or oil rusty door hinges.
- `INVENTORY`: List all items currently carried.
- `SCORE`: Display your current progress and turn count.
- `SUSPEND`: Save and suspend your game to disk.
- `QUIT`: End the game and compute your final ranking.

---

## Core Survival Rules

### 1. The Darkness & Pit Rule
Never walk through dark subterranean passages without a lit lantern! Moving in the dark triggers an immediate, fatal plunge:
`"You fell into a pit and broke your neck!"`

### 2. The 7-Item Pack Limit
Your backpack can carry at most **7 items** at one time. Plan your expeditions: bring only the tools necessary for the specific sector you are exploring.

### 3. Dwarf Defense
Dwarves patrol the lower cave. When a dwarf enters your chamber, he will throw an axe. Pick up the dropped axe immediately and throw it back (`THROW AXE`) to slay the dwarf!

### 4. Beware the Shadowy Pirate
If you wander through the deep cave while carrying treasures, the Pirate may sneak up behind you, rob you blind, and stash your treasures inside his chest at the far end of the maze.

---

## Difficulty Levels & Game Setup Configuration

While *Adventure* does not have a numeric difficulty selector, its challenge and session parameters are strictly controlled by internal systems:

### 1. Battery Consumption & Timers
- **Lantern Battery (`limit`):** Starts at **330 ticks**. Turning the lamp on consumes 1 tick per turn. Turning it off stops consumption.
- **Battery Renewal:** When the lamp flickers dim, visit the underground vending machine in the Soft Room and drop a coin to purchase fresh batteries.

### 2. Dwarf Alertness Progression (`dflag`)
- **Stage 0 (Surface & Grate):** No dwarves spawn.
- **Stage 1 (First Sighting):** Activated upon reaching the Hall of Mists. A lone dwarf appears, throws an axe (guaranteed miss), and vanishes.
- **Stage 2 (Active Hunting):** Up to 5 dwarves and the pirate actively roam the cave graph. Axe hit probabilities increase with turn count.

### 3. Reincarnation & Lives
- You possess **3 lives** (`maxdie = 3`).
- Dying teleports you back to the surface building via divine intervention, but deducts **10 points** per resurrection from your final score.

### 4. Suspension Latency & Wizard Mode
- Suspending the game records a timestamp.
- To prevent employees and students from playing during working hours, resuming within **45 minutes** is locked (`latncy = 45`), displaying:
  `"This adventure was suspended a mere X minutes ago. Come back later."`
- Entering the wizard password `dwarf` grants administrator privileges, bypassing the delay.

---

## Key Puzzle Solutions

- **The Grate:** Unlocked with the brass keys found on the building table.
- **The Snake:** Terrified of birds. Release the little green bird from the cage to chase the snake away.
- **The Bird:** Fears the black iron rod. Drop the rod outside the room before catching the bird in the cage.
- **The Sleeping Dragon:** Do not use weapons! Type `ATTACK DRAGON`, then confirm `"YES"` to slay it with your bare hands.
- **The Chasm Troll:** Throw the tame bear at the troll to frighten it away forever.
- **The Ming Vase:** Drop the velvet pillow first, then drop the vase onto the pillow to prevent it from shattering.

---

## Scoring Ranks (350 Points)

| Score Range | Rank Title |
|:---:|---|
| **0–34** | Beginner |
| **35–99** | Amateur |
| **100–199** | Experienced Adventurer |
| **200–299** | Seasoned Adventurer |
| **300–349** | Master |
| **350+** | **Grandmaster** |
