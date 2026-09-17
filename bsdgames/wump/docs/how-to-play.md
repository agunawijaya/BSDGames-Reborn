# How to Play `wump`

> Manual, strategy guide, sensory deciphering, and tactical tips for *Hunt the Wumpus*.

---

## Objective

Your mission is simple: **Locate and shoot the evil Wumpus** with a magic arrow before it devours you, before you fall to your doom in a bottomless pit, or before your quiver runs dry.

---

## Starting the Game

In the classic BSD terminal, launch `wump` from your shell:

```bash
$ wump [options]
```

### CLI Command Options

- `-a <count>`: Number of custom anti-evil Wumpus arrows in your quiver (default: `5`).
- `-b <count>`: Number of rooms occupied by super bats (default: `3`).
- `-p <count>`: Number of rooms containing bottomless pits (default: `3`).
- `-r <count>`: Total number of rooms in the cave (range: `10` to `250`, default: `20`).
- `-t <count>`: Number of tunnels leading out of each room (range: `2` to `25`, default: `3`).
- `-h`: **Hard Mode** — automatically generates extra bats, extra pits, and increases Wumpus awakening sensitivity.

---

## Controls & Commands

At the turn prompt `Move or shoot? (m-s)`:

| Command | Syntax | Action | Example |
|---|---|---|---|
| **Move** | `m <room>` or `M <room>` | Walk into the specified connected room number. | `m 14` |
| **Shoot** | `s <r1> <r2> ...` | Fire an arrow through a sequence of connected rooms (up to 5). | `s 12 7` |
| **Quit** | `q`, `Q`, or `x` | Surrender and exit to shell. | `q` |
| **Help/Info** | `\n` (Enter) | If prompted without args, repeats room status or asks destination. | `m` $\rightarrow$ prompts room |

---

## Deciphering Your Senses

You cannot see into neighboring caverns. Every turn begins with a sensory report:

```text
You are in room 12 of the cave, and have 5 arrows left.
*rustle* *rustle* (must be bats nearby)
*whoosh* (I feel a draft from some pits).
*sniff* (I can smell the evil Wumpus nearby!)
There are tunnels to rooms 3, 7, and 15.
```

### The Three Warnings

1. **`*sniff* (I can smell the evil Wumpus nearby!)`**
   - **Range:** Up to **2 tunnels away**.
   - **Meaning:** The Wumpus is either in an adjacent room or a room connected to one of your neighbors. Proceed with extreme caution!
2. **`*whoosh* (I feel a draft from some pits).`**
   - **Range:** Exactly **1 tunnel away**.
   - **Meaning:** At least one adjacent tunnel leads directly into a bottomless pit.
3. **`*rustle* *rustle* (must be bats nearby)`**
   - **Range:** Exactly **1 tunnel away**.
   - **Meaning:** At least one adjacent room is infested with giant bats.

---

## Combat Mechanics: The Magic Arrow

You do **not** want to enter the same room as the Wumpus. Doing so results in immediate, gruesome death. Instead, you must slay it by shooting from afar.

### How Arrows Fly
- You can aim an arrow through a chain of rooms: `s 3 8 14`.
- If the arrow enters the room where the Wumpus is lurking, **you win!**
- **Warning on Bad Aims:** If you specify a room that has no connecting tunnel from the arrow's current position, the arrow deflects randomly down one of the existing tunnels. A wild ricochet may fly directly back into your room and kill you!
- **Range Limits:** Arrows can travel at most 5 hops. At hop 3 there is a $20\%$ chance of bowstring breakage; at hop 4 there is a $60\%$ chance of flight exhaustion. The ideal shot is **1 or 2 hops away**.
- **Waking the Beast:** Every missed shot makes noise, rapidly increasing the chance that the Wumpus awakens and wanders into an adjoining cave.

---

## Tactical Tips & Survival Strategy

### 1. Maintain a Written Graph
Never play `wump` purely from memory! Keep a piece of paper or a digital scratchpad. Draw a node for each room you visit, record its outbound tunnels, and mark rooms with draft, rustle, or stench warnings.

### 2. Triangulating the Wumpus
If you smell the Wumpus from Room 1 and Room 2, identify which rooms are shared neighbors within 2 hops of both rooms. This narrow overlap is your prime target list.

### 3. Safe Exploration
If a room has *no* warnings (`no sniff, no whoosh, no rustle`), all its adjacent tunnels are completely safe to explore! Use these "clean" corridors to build out your map.

### 4. Beware of Wall Bumps
Never type a typo like `m 99`! Bumping into a rock wall produces `*Oof!*` and has a 1-in-6 chance of alerting the Wumpus.

### 5. Bat Hazards: Blessing or Curse?
Entering a bat room causes giant bats to pick you up and drop you in a random room. While this can drop you into a pit or into the mouth of the Wumpus, it can also occasionally act as an emergency escape if you are cornered.

---

## Difficulty Levels & Cave Setup Configuration

Unlike games with linear stage progression, `wump` provides full control over the cave's procedural geometry and hazard density through runtime CLI options.

### 1. Difficulty Modes (`EASY` vs `HARD`)

| Gameplay Element | `EASY` (Default) | `HARD` (`-h` flag) | Strategic Consequence in `HARD` |
|---|---|---|---|
| **Pit Rooms** | Exactly 3 | $3 + \text{random}(1 \dots \lfloor R/2 \rfloor)$ | Up to 13 pits in a 20-room cave! Safe corridors become rare. |
| **Bat Rooms** | Exactly 3 | $3 + \text{random}(1 \dots \lfloor R/2 \rfloor)$ | Up to 13 bat rooms! High risk of being grabbed and dropped into pits. |
| **Player Starting Point** | Any room $\ne$ Wumpus | Prohibited within 2 hops of Wumpus | Ensures player starts far from the beast; prevents early lucky kills. |
| **Wumpus Alertness** | Agitation roll $\pmod{12}$ | Agitation roll $\pmod{9}$ | Beast awakens much faster on missed shots; aggressive roaming. |

### 2. Custom Cave Topologies & Gameplay Archetypes

You can combine CLI flags to create radically different gameplay experiences:

- **The Claustrophobic Web (`wump -r 10 -t 5`):** A tiny 10-room cave with 5 tunnels per room. Danger is extreme; the Wumpus can smell you from almost anywhere.
- **The Sprawling Labyrinth (`wump -r 100 -t 3 -a 10`):** A massive 100-room subterranean complex. Requires extensive paper mapping and route planning across distant cave sectors.
- **The Sniper Challenge (`wump -a 1`):** You have only 1 arrow. You must deduce the Wumpus's exact location with 100% certainty before releasing your bowstring.
- **The Classical Dodecahedron (`wump -r 20 -t 3`):** The standard 20-room, 3-tunnel cave matching Gregory Yob's original game size.

> [!CAUTION]
> **Cave Collapse Warning:** If you request too many tunnels in a small cave (e.g., $L > R - \lfloor R/4 \rfloor$), the cave ceiling collapses under its own weight and the game refuses to start!

### 3. Rematch Option: Replaying the Same Cave

When you win or die, `wump` asks:
```text
Care to play another game? (y-n) y
In the same cave? (y-n)
```
- **If you choose `y` (Same Cave):** The game retains the **identical cave graph topology** (all room numbers and tunnel interconnections remain exactly the same), but randomly redistributes the Wumpus, bats, pits, and your starting position. If you drew a map on paper during your first run, you can reuse your map to easily navigate around dead ends and one-way corridors!
- **If you choose `n` (New Cave):** The game calls `cave_init()` to generate an entirely new procedural cave layout with a fresh random seed.

---

## Easter Eggs & Humorous Quirks

- **Magic Tunnel ($R+1$):** Entering room number $R+1$ (e.g. `21` in a 20-room cave) triggers a hidden teleportation corridor:
  `"With a jaunty step you enter the magic tunnel. Suddenly you feel a very curious, warm sensation and find yourself in room X!!"`
- **Non-Euclidean Warning:** Attempting to move to a negative room number outputs:
  `"Sorry, but we're constrained to a semi-Euclidean cave!"`
- **Jules Verne Homage:** Plummeting into a bottomless pit displays:
  `"Look on the bright side; you can at least find out if Jules Verne was right..."`
- **Puzzled Input:** Typing unexpected nonsense gives a 1-in-15 chance of Spanish confusion:
  `"Que pasa?"`
