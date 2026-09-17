# `hunt` — Reverse Specification

> Low-level formal specification of the client-server protocol, game loop, ballistics physics, and damage equations.

---

## 1. Objective

- **Goal:** Maximize kills and kill-to-death ratio while surviving within a real-time multiplayer maze.
- **Victory / Defeat:** Continuous arena combat; there is no formal single "win" screen. Rankings are maintained dynamically on the active server scoreboard.

---

## 2. State Variables

### Global Daemon State (`huntd`)

| Variable | Type | Range | Initial Value | Description |
|---|---|---|---|---|
| `Maze` | `char[HEIGHT][WIDTH]` | $24 \times 80$ grid | Procedural walls & mirrors | The master game arena grid. |
| `Nplayer` | `int` | $0 \dots 32$ | 0 | Current active connected human and bot players. |
| `Player[]` | `PLAYER` struct array | 32 slots | Empty | Array of player state structs. |
| `Shot_head`| Pointer to linked list | Dynamic | `NULL` | Linked list of active in-flight projectiles. |
| `Daemon` | `SOCKET` | Valid socket descriptor | Bound port 5868 | Listening master socket descriptor. |

### Per-Player State (`PLAYER`)

| Field | Type | Range | Description |
|---|---|---|---|
| `p_ident` | String | 16 chars | Player login name / handle. |
| `p_team` | String | 16 chars | Player team identifier (`\0` if solo). |
| `p_x, p_y` | `int, int` | $1..78, 1..22$ | Player coordinate in the maze. |
| `p_face` | `char` | `^`, `v`, `<`, `>` | Facing vector direction. |
| `p_ammo` | `int` | $0 \dots 50$ | Available ammunition reserves (replenishes slowly). |
| `p_damage` | `int` | $0 \dots 100\%$ | Accumulated damage. Reaching 100% causes death. |
| `p_kills` | `int` | $0 \dots \infty$ | Cumulative opposing players eliminated. |
| `p_deaths` | `int` | $0 \dots \infty$ | Cumulative times eliminated. |
| `p_cloak` | `int` | $0 \dots 100$ | Remaining cloaking energy ticks. |
| `p_slimer` | `int` | $0 \dots 50$ | Remaining slime slow-down duration ticks. |

---

## 3. Complete Weapon, Munition & Hazard Inventory

Extracted from `hunt.h`, `shots.c`, and `makemaze.c`:

| Entity / Munition | Key / Symbol | Category | Ammo Cost | Velocity | Damage / Blast Radius | Special Properties & Invariants |
|---|:---:|---|:---:|:---:|:---:|---|
| **Standard Bullet** | `f` / `.` or `*` | Projectile | 1 | 3 cells/tick | 20% Direct Hit | Bounces 90° off `/` and `\`; stopped by `#` walls. |
| **Full-Auto Burst** | `F` | Stream | 5 | 3 cells/tick | $5 \times 15\%$ | Fires 5 consecutive bullets; chips away masonry walls. |
| **Frag Grenade** | `g` / `o` | Explosive | 2 | 2 cells/tick | $3 \times 3$ Blast (50%) | Bounces off solid walls; detonates on contact with entity. |
| **Mortar Bomb** | `G` / `O` | Heavy Explosive | 4 | 1 cell/tick | $5 \times 5$ Blast (100%) | Massive annihilation explosion; demolishes all soft walls. |
| **Slime Canister** | `s` / `$` | Hazard | 3 | 2 cells/tick | 10% + 50% Slow | Coats victim in sticky residue; reduces speed by half. |
| **Large Slime** | `S` | Heavy Hazard | 6 | 1 cell/tick | 20% + Wide Splash | Covers $3 \times 3$ area in sticky green sludge. |
| **Tripmine** | `m` / Invisible | Trap | 1 | Stationary | 40% Proximity | Triggers instantly when stepped on by opponent. |
| **Supermine** | `M` / Invisible | Trap | 3 | Stationary | 80% Proximity | High-yield lethal proximity mine. |
| **Reflector Mirror**| `/` and `\` | Obstacle | — | Stationary | Indestructible | Bounces all projectiles at exact 90-degree angles. |
| **Solid Wall** | `#` or `|`, `-` | Barrier | — | Stationary | Indestructible | Outer perimeter boundary. |
| **Masonry Wall** | `+` | Barrier | — | Stationary | Destructible | Absorbs 3 bullet hits or 1 grenade before collapsing. |
| **Electric Teleport**| `@` | Anomaly | — | Stationary | Warp Portal | Stepping into `@` warps player to random empty cell. |

---

## 4. Ballistics & Reflector Reflection Matrix

In [`shots.c:120-180`](https://github.com/vattam/BSDGames/tree/master/hunt/huntd/shots.c#L120-L180), projectile collision with mirrors calculates:

$$\begin{pmatrix} \text{Heading} & \text{Mirror } / & \text{Mirror } \backslash \\ \text{North } (0, -1) & \text{East } (1, 0) & \text{West } (-1, 0) \\ \text{South } (0, 1) & \text{West } (-1, 0) & \text{East } (1, 0) \\ \text{East } (1, 0) & \text{North } (0, -1) & \text{South } (0, 1) \\ \text{West } (-1, 0) & \text{South } (0, 1) & \text{North } (0, -1) \end{pmatrix}$$

---

## 5. Scoring Formula

Score is computed per kill and adjusted for accuracy:

$$\text{Points} = (\text{Kills} \times 100) - (\text{Deaths} \times 50) + \text{Bonus}(\text{Accuracy})$$

Team score equals the direct sum of all active squad member points.
