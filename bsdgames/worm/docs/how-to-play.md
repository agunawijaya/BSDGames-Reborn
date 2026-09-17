# How to Play Worm

A comprehensive player manual, control reference, and tactical guide for BSD Worm.

---

## 1. Objective of the Game

The objective of **Worm** is to guide your worm across a walled terminal arena, eating randomly
spawned numerical digits (**`1` through `9`**) to grow as long as possible and achieve the highest
score, while avoiding fatal collisions with the outer perimeter walls or your own trailing body.

---

## 2. Command Line Invocation & Setup

```bash
worm [size]
```

| Argument | Description | Default | Bounds |
|---|---|:---:|---|
| `size` *(optional)* | Initial length of the worm in body segments. | `7` | $1 \le \text{size} \le \frac{(\text{LINES}-3) \times (\text{COLS}-2)}{3}$ |

### Examples
- `worm`: Starts the standard game with a 7-segment worm.
- `worm 20`: Starts the worm with 20 segments for a more challenging, congested opening.
- `worm 1`: Starts as a lone head (`@`) that grows only upon eating digits.

---

## 3. Controls & Movement

BSD Worm supports traditional vi-keys (`hjkl`), arrow keys, and unique capital sprint keys:

```
          [k] Up
            ▲
 [h] Left ◄   ► [l] Right
            ▼
         [j] Down
```

| Key | Direction | Behavior |
|:---:|:---:|---|
| **`h`** or **Left Arrow** | Left | Turn and step left one character cell. |
| **`j`** or **Down Arrow** | Down | Turn and step down one character cell. |
| **`k`** or **Up Arrow** | Up | Turn and step up one character cell. |
| **`l`** or **Right Arrow** | Right | Turn and step right one character cell. |
| **`H`** *(Capital)* | Sprint Left | Automatically dashes left for up to **9 steps** (stops if it hits a digit). |
| **`L`** *(Capital)* | Sprint Right | Automatically dashes right for up to **9 steps** (stops if it hits a digit). |
| **`J`** *(Capital)* | Sprint Down | Automatically dashes down for up to **5 steps** (stops if it hits a digit). |
| **`K`** *(Capital)* | Sprint Up | Automatically dashes up for up to **5 steps** (stops if it hits a digit). |
| **`Ctrl+L`** or **`\f`** | Redraw | Clears and redraws both the status and playfield windows. |
| **`Ctrl+C`** or **`Ctrl+D`**| Quit | Terminates the match immediately. |

> **Direction Persistence:** If you release all keys, the worm **continues moving forward** in its
> current direction on every clock tick (1 second timer).

---

## 4. Food Digits & Growth Dynamics

```mermaid
flowchart TD
    SPAWN["Random Food Digit (1-9) Spawns<br/>Placed on open screen cell"] --> HEAD_MOVES["Worm Head Moves Forward"]
    HEAD_MOVES --> CHECK_CELL{"Inspect Target Cell (winch)"}
    CHECK_CELL -->|Empty Cell (' ')| NORMAL_STEP["Normal Step:<br/>Advance head @, erase tail segment"]
    CHECK_CELL -->|Digit (e.g. '7')| EAT_DIGIT["EAT DIGIT!<br/>growing += 7<br/>score += growing"]
    EAT_DIGIT --> EXTEND["Growth Active (growing > 0):<br/>Advance head @, DO NOT erase tail!"]
    EXTEND --> DECR["growing decrements by 1 each step"]
    DECR --> SPAWN_NEW["Spawn New Random Digit (1-9)"]
    CHECK_CELL -->|Wall '*' or Body 'o'| CRASH["FATAL CRASH!<br/>Game Over"]
```

### The Mathematics of Growth
When your worm's head (`@`) collides with a digit $d \in [1, 9]$:
1. **Growth Reservoir:** The value $d$ is added to an internal accumulator: `growing += d`.
2. **Score Award:** The newly added growth value increments your score: `score += growing`.
3. **Elongation Phase:** On each subsequent move, while `growing > 0`, the trailing tail segment is
   **not erased**, extending the total visible length of the worm by 1 segment per tick until the
   growth reservoir reaches zero.
4. **Digit Replacement:** A new random digit is immediately placed at an unoccupied coordinate.

---

## 5. Collision Rules & Invariants

1. **Perimeter Walls (`*`):**
   The playfield is framed by a boundary box of `*` characters. Contacting any boundary cell
   results in instant death.
2. **Self-Collision (`o`):**
   Running your head (`@`) into any segment of your own body (`o`) results in instant death.
3. **Food Immunity:**
   Food digits are safe to enter; they are consumed instantly and never block movement.

---

## 6. Strategy & High-Score Tactics

1. **Mastering the Sprint Dash (`HJKL`):**
   Capital sprint keys are your most powerful scoring tool. Because sprint dashes automatically
   halt the exact moment they touch a digit, you can safely line up your worm with a digit across
   the arena and press `H` or `L` to collect it instantly without manual step-by-step steering.
2. **The Outer Wall Sweep (Serpentine Coiling):**
   As your body lengthens past 50 segments, cruising through the center of the arena is suicidal.
   Adopt an edge-hugging strategy: trace the perimeter walls, leaving open corridors in the interior
   to snake back through when food appears.
3. **Beware the High Digits ($8$ and $9$):**
   Eating a `9` yields substantial points (+9), but it also adds 9 consecutive segments to your body.
   Before gobbling an 8 or 9, ensure you have a long, clear escape path ahead to accommodate the
   sudden surge of trailing mass.
4. **Turn Buffering:**
   UNIX terminal input buffers keypresses. If you need to make a rapid two-step turn (e.g. Up then Left),
   you can press `k` followed immediately by `h`; the input queue will execute the turns in sequence
   on consecutive ticks.
