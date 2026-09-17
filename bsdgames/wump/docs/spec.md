# `wump` — Reverse Specification

> Implementation-independent specification of the game's mechanics,
> extracted directly from the original BSD C source (`wump.c`).
>
> This document is the mechanical contract that `src/` and `tests/` must honour.

---

## Objective

- **Win condition:** The player fires a magic arrow whose trajectory terminates in or passes through the room currently occupied by the Wumpus (`arrow_location == wumpus_loc`).
- **Lose conditions:**
  1. **Devoured by Wumpus:** The player enters the room containing the Wumpus, or an awakened Wumpus moves into the player's room (`player_loc == wumpus_loc`).
  2. **Pit Death:** The player enters a room with a pit and fails the outcrop survival roll (`random() % 12 >= 2`).
  3. **Arrow Ricochet:** An arrow trajectory is misdirected or bounces back into the room occupied by the player (`arrow_location == player_loc`).
  4. **Exhausted Quiver:** The player expends their final arrow without striking the Wumpus (`arrows_left == 0`).
- **Stalemate:** None. Cave graph connectivity invariants guarantee that valid moves or arrow shots always exist.

---

## State Variables

| Variable | Type | Range | Initial Default | Persisted? |
|---|---|---|---|:---:|
| `room_num` | integer | $10 \le R \le 250$ | `20` | Session configuration |
| `link_num` | integer | $2 \le L \le \min(25, R - \lfloor R/4 \rfloor)$ | `3` | Session configuration |
| `arrow_num` | integer | $\ge 1$ | `5` | Session configuration |
| `pit_num` | integer | $0 \le P \le \lfloor R/2 \rfloor$ | `3` (EASY) | Session configuration |
| `bat_num` | integer | $0 \le B \le \lfloor R/2 \rfloor$ | `3` (EASY) | Session configuration |
| `level` | enum | `EASY (1)`, `HARD (2)` | `EASY` | Session configuration |
| `player_loc` | integer | $1 \le \text{pos} \le R$ | Random valid room | Volatile turn state |
| `wumpus_loc` | integer | $1 \le \text{pos} \le R$ | Random room $\ne$ `player_loc` | Volatile turn state |
| `arrows_left` | integer | $0 \le A \le \text{arrow\_num}$ | `arrow_num` | Volatile turn state |
| `cave[i].tunnel[j]`| integer array | $1 \le \text{target} \le R$ (or $R+1$) | Initialized in `cave_init()` | Per-cave graph structure |
| `cave[i].has_a_pit`| boolean | $0$ or $1$ | Initialized per round | Per-round hazard placement |
| `cave[i].has_a_bat`| boolean | $0$ or $1$ | Initialized per round | Per-round hazard placement |
| `lastchance` | integer | $\ge 0$ | `2` | Static internal alert state |

---

## Actions & Commands

| Command | Arguments | Effect | Preconditions / Validation |
|---|---|---|---|
| `M` / `m` | `[room]` | Moves the player to destination `room`. | Target room must be listed in `cave[player_loc].tunnel`. If missing, player hits wall (`*Oof!*`) with 1-in-6 chance of waking Wumpus. |
| `S` / `s` | `[r1 r2 ...]` | Launches an arrow through sequence of up to 5 rooms. | Must have $\ge 1$ arrow. List delimited by space/tab/newline. |
| `Q` / `q` / `x` | none | Immediately exits the game process. | Always valid. |
| `\n` | none | Empty enter prompt; reprompts turn without state change. | None. |
| Other | text | Outputs `"I don't understand!"` (or 1-in-15 chance `"Que pasa?"`). | None. |

---

## Rules & Invariants

1. **Graph Connectedness:** The cave network must form a strongly connected component. The generator guarantees at least one directed cycle connecting all $R$ rooms via an initial hop $\delta$ satisfying $\gcd(R, \delta + 1) = 1$.
2. **Tunnel Capacity:** Every room possesses exactly `link_num` outbound tunnels, sorted in ascending numerical order when presented to the player.
3. **Hazard Exclusivity on Placement:** A single room cannot spawn with *both* a bat and a pit during initial placement (`cave[loc].has_a_pit && cave[loc].has_a_bat` rejected).
4. **Player Spawn Safety:**
   - Player never spawns in `wumpus_loc`.
   - On `HARD` difficulty (if tunnel density $\frac{L}{R} < 0.4$), the player is guaranteed not to spawn within 2 rooms of the Wumpus.
5. **Sensory Proximity Calculations:**
   - `bats_nearby()` evaluates $\exists j : \text{cave}[\text{tunnel}[j]].\text{has\_a\_bat} == 1$. (Distance = 1).
   - `pit_nearby()` evaluates $\exists j : \text{cave}[\text{tunnel}[j]].\text{has\_a\_pit} == 1$. (Distance = 1).
   - `wump_nearby()` evaluates whether `wumpus_loc` is reachable in 1 hop or 2 hops along outbound tunnels from `player_loc`. (Distance $\le 2$).
6. **Bat Transportation Loop:**
   - Entering a room with a bat causes the player to be transported to a random room $1 \le \text{loc} \le R$.
   - The destination is evaluated immediately for secondary hazards (pits, Wumpus, or chained bats).
7. **Pit Outcrop Check:** Stepping into a pit room triggers an immediate roll: if $r \in [0, 11] < 2$, player survives and remains clinging to the rock outcrop; otherwise, player plunges to death.
8. **Arrow Flight Rules:**
   - Maximum path length is 5 hops.
   - If specified room $r_{k}$ is not connected to $r_{k-1}$, arrow randomly diverts into a connected neighbor.
   - Distance decay: At hop 3, arrow has a 20% chance ($2/10$) of bowstring failure. At hop 4, arrow has a 60% ($6/10$) chance of flight decay.
   - Arrow striking `room_num + 1` redirects into a random room.
9. **Wumpus Disturbance:**
   - Bumping into a wall has a 1-in-6 ($16.67\%$) chance of waking the Wumpus.
   - A missed arrow shot checks: `(random() % (EASY ? 12 : 9)) < (lastchance += 2)`. If triggered, the Wumpus migrates into an adjacent room (`cave[wumpus_loc].tunnel[random() % link_num]`), and `lastchance` resets to `random() % 3`.

---

## Difficulty Levels & Setup Configuration

The game provides explicit difficulty modes and configurable parameters that directly govern cave generation and runtime entity behaviors:

### 1. Difficulty Level Modes (`level`)
- **`EASY` (Default):**
  - Base hazard allocation: $B = 3$, $P = 3$.
  - Wumpus agitation modulus: $12$ (requires higher `lastchance` to wake creature).
  - Player spawn restriction: `player_loc != wumpus_loc`.
- **`HARD` (Flag `-h`):**
  - Base hazard escalation:
    $$B_{\text{hard}} = B + \text{Uniform}(1, \lfloor R/2 \rfloor)$$
    $$P_{\text{hard}} = P + \text{Uniform}(1, \lfloor R/2 \rfloor)$$
  - Wumpus agitation modulus: $9$ (wakes and moves much more aggressively on misses).
  - Player spawn restriction: If $L/R < 0.4$, player cannot spawn within 2 hops of Wumpus (`wump_nearby() == 0`).

### 2. Setup Validation Invariants
Before generating the cave, the parameters must satisfy:
1. $10 \le R \le 250$ (Cave size).
2. $2 \le L \le 25$ and $L \le R - \lfloor R/4 \rfloor$ (Cave structural integrity; avoids graph collapse).
3. $B \le \lfloor R/2 \rfloor$ (Bat capacity).
4. $P \le \lfloor R/2 \rfloor$ (Pit capacity).

### 3. Session Replay Semantics
- **Replay in Same Cave (`clear_things_in_cave()`):** The graph $(V, E)$ remains constant; only entity locations are cleared and re-rolled.
- **Replay in New Cave (`cave_init()`):** Full graph synthesis from scratch.

---

## Object & Entity Inventory

Although `wump` generates its cave procedurally, all game objects, entities, and hazards are strictly governed by state models and spawn invariants:

| Object / Entity | Type / Enum | Category | Initial Location / Spawn Rule | Properties & Mechanics | Puzzle / Gameplay Role |
|---|---|---|---|---|---|
| **The Hunter** | `player_loc` | Player Actor | Random room $r \in [1, R]$, $r \ne \text{wumpus\_loc}$, and safe distance $>2$ on HARD | Tracks current room index, detects nearby sensory cues (smell, draft, rustle). | Primary controllable protagonist. |
| **The Wumpus** | `wumpus_loc` | Boss Monster / Hazard | Random room $w \in [1, R]$ | Slumbers until disturbed. Missed shots or wall bumps trigger migration. Devours player instantly on room entry. | Primary target to slay with crooked arrow to win. |
| **Super Bats** | `has_a_bat` | Mobile Creature Hazard | $B$ rooms (default 3, up to $\lfloor R/2 \rfloor$), mutually exclusive with pits | Drops player into a completely random room upon entry. Bat remains in room. | Disruption hazard; can drop player into pits or Wumpus's mouth. |
| **Bottomless Pits** | `has_a_pit` | Stationary Hazard | $P$ rooms (default 3, up to $\lfloor R/2 \rfloor$), mutually exclusive with bats | $2/12$ survival roll on ledge outcrop; $10/12$ fatal plummet to death. | Lethal obstacle detected by feeling drafts in adjacent rooms. |
| **Magic Quiver & Crooked Arrows** | `arrows_left` | Item / Weapon Inventory | In player inventory; initial capacity = 5 (or flag `-a <n>`) | Can bend around corners across 1 to 5 rooms. Trajectory decays or deflects. Self-strike kills player. Depletion causes loss. | Only lethal weapon capable of eliminating the Wumpus. |
| **Rock Outcrop / Ledge** | Environmental | Stationary Fixture | Exists in every pit room | Passive save mechanic: $16.67\%$ chance of player clinging to ledge upon falling into a pit. | Emergency second-chance survival mechanism. |
| **Magic Tunnel Portal** | `jump()` | Anomaly Feature | Accessible via virtual room ID $R+1$ | Anomaly corridor that warps the traveler to a random cave node without standard edge traversal. | Emergency escape or non-Euclidean transit easter egg. |

---

## RNG Usage

| Subsystem | Distribution | Condition / Trigger | Consequence |
|---|---|---|---|
| `cave_init()` | Uniform $[1, R-1]$ | Step delta search | Rejection sampled until $\gcd(R, \delta + 1) == 1$ |
| `cave_init()` | Uniform $[1, R]$ | Additional links $j \in [2, L-1]$ | Adds cross-chords; 50% chance to reciprocal-link back |
| `initialize_things_in_cave()` | Uniform $[1, R]$ | Entity placement | Places bats, pits, wumpus, and player |
| `take_action()` | Uniform $[0, 14]$ | Unknown input string | If result $== 1$, prints `"Que pasa?"` |
| `move_to()` | Uniform $[0, 5]$ | Player walks into non-existent tunnel | If result $== 1$, wakes Wumpus |
| `move_to()` | Uniform $[1, R]$ | Magic tunnel $R+1$ entered | Teleports player via `jump()` |
| `move_to()` | Uniform $[0, 11]$ | Player enters pit room | $< 2$ survives on outcrop; $\ge 2$ falls to death |
| `move_to()` | Uniform $[1, R]$ | Player enters bat room | Teleports player to new random room |
| `shoot()` | Uniform $[0, 9]$ | Arrow hop 3 | $< 2$ bowstring breaks; arrow drops |
| `shoot()` | Uniform $[0, 9]$ | Arrow hop 4 | $< 6$ arrow wavers and falls |
| `shoot()` | Uniform $[0, L-1]$ | Arrow misses specified target | Wild deflection into tunnel index |
| `shoot()` | Uniform $[0, \text{bound}]$ | Missed arrow shot | Wumpus moves if roll $< \text{lastchance}$; resets `lastchance` |
| `move_wump()` | Uniform $[0, L-1]$ | Wumpus moves | Moves to tunnel neighbor |

**Seed Strategy:** In BSD original, seeded with `srandom((int)time(NULL))` during `cave_init()`. The port should support an optional `--seed <int>` flag for deterministic testing and reproducible challenge runs.

---

## Scoring

The original BSD `wump` has **no numeric scoring or score file** (`.scores`).
Winning or losing is purely binary:
- **Victory:** Wumpus slain with arrows remaining.
- **Defeat:** Devoured, fallen, shot, or out of arrows.

---

## Termination Conditions

1. **Win (Victory):** `arrow_location == wumpus_loc` $\rightarrow$ prints victory dialogue (`kill_wump()`), prompts "Care to play another game? (y-n)".
2. **Defeat (Wumpus Devour):** `player_loc == wumpus_loc` $\rightarrow$ prints devour message (`wump_kill()`), prompts for rematch.
3. **Defeat (Bottomless Pit):** Pit check fails $\rightarrow$ prints plummet message (`pit_kill()`), prompts for rematch.
4. **Defeat (Self-Shoot):** Arrow ricochets into `player_loc` $\rightarrow$ prints arrow injury message (`shoot_self()`), prompts for rematch.
5. **Defeat (Quiver Depleted):** `arrows_left == 0` without hit $\rightarrow$ prints quiver empty rampage message (`no_arrows()`), prompts for rematch.
6. **Quit:** `q`, `Q`, `x`, or EOF on stdin $\rightarrow$ exits process with code `0`.

---

## Not in Scope (Modernization Boundary)

- **Hardcoded TTY Pagers:** The original forked `/bin/sh -c $PAGER` to read an external `/usr/share/games/wump.info` file. In the port, instructions will be built-in natively or formatted in rich terminal text.
- **Setgid Bit Drop:** Original invoked `setregid(getgid(), getgid())` for historical Unix score security privileges (even though `wump` didn't write to a shared score file). Redundant on modern systems.
