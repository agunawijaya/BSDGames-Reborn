# `hunt` — How to Play

> Complete player manual: terminal controls, movement, ballistics, cloaking, and combat strategy.

---

## 1. Objective

Enter the shared labyrinth, stalk opposing hunters, lay ambushes, and score kills while surviving enemy fire, tripmines, and slime bombs.

---

## 2. Controls & Movement (Vi-Style Navigation)

*Hunt* uses traditional Unix *vi* cursor keys for high-speed single-stroke execution:

| Key | Movement / Facing Action |
|:---:|---|
| `h` | Move / Face Left (`<`) |
| `j` | Move / Face Down (`v`) |
| `k` | Move / Face Up (`^`) |
| `l` | Move / Face Right (`>`) |
| `H` / `J` / `K` / `L` | Face Direction without moving forward (pivot in place). |
| `y` / `u` / `b` / `n` | Diagonal movements (if supported by terminal layout). |

---

## 3. Weapon Arsenal & Firing Controls

All offensive actions fire in the direction your character is currently facing (`^`, `v`, `<`, `>`):

| Key | Munition / Weapon | Ammo Cost | Flight Behavior & Tactical Effect |
|:---:|---|:---:|---|
| `f` | **Single Bullet** | 1 | High-speed projectile; reflects 90° off `/` and `\` mirrors; inflicts 20% damage. |
| `F` | **Full-Auto Burst** | 5 | Rapid stream of 5 bullets in succession; penetrates and demolishes destructible walls. |
| `g` | **Fragmentation Grenade** | 2 | Moderate-speed bomb; bounces off walls and explodes into a 3x3 fiery shrapnel burst. |
| `G` | **Big Grenade (Mortar)**| 4 | Long-range heavy ordnance; explodes into a massive 5x5 devastating fireball. |
| `s` | **Slime Canister** | 3 | Spatters corrosive goo; slows victim's movement by 50% for 15 seconds. |
| `S` | **Large Slime Canister**| 6 | Covers wide corridor area in sticky green sludge; coats walls and blinds enemies. |
| `m` | **Deploy Tripmine** | 1 | Drops an invisible proximity mine beneath you; detonates when stepped on. |
| `M` | **Deploy Supermine** | 3 | Drops heavy proximity mine with high-yield blast radius. |
| `c` | **Cloaking Field** | 5 | Renders character invisible on enemy screens until firing or taking damage. |

---

## 4. Corridor Features & Ballistics

### 1. Slanted Reflector Mirrors (`/` and `\`)
- Bullets, slime, and grenades ricochet off diagonal reflectors following geometric reflection laws:
  - Bullet heading East (`>`) hitting `/` bounces North (`^`).
  - Bullet heading East (`>`) hitting `\` bounces South (`v`).
  - Bullet heading North (`^`) hitting `/` bounces East (`>`).
  - Bullet heading North (`^`) hitting `\` bounces West (`<`).
- **Tactics:** Shoot reflectors to kill opponents hiding around blind corners!

### 2. Destructible vs. Indestructible Walls
- Solid steel perimeter walls (`#` or `|` / `-`) cannot be breached.
- Interior masonry walls (`+`) crumble under repeated bullet strikes (`F`) or grenade detonations (`g`), opening new flanking routes.

### 3. Slime & Hazards
- Stepping into slime (`$`) halves your movement speed.
- Running into electric teleport pads (`@`) warps you randomly across the maze.

---

## 5. Command-Line Options & Modes

```bash
hunt [-b] [-c] [-f] [-m] [-q] [-s] [-n name] [-t team] [-p port] [host]
```

### Options Breakdown

| Flag | Purpose |
|---|---|
| `-m` | **Monitor Mode:** Join as a passive spectator. You can observe all action, players, and explosions in real time without being targetable. |
| `-t <team>` | **Team Mode:** Join a designated squad (e.g. `-t RED`, `-t BLUE`). Teammates share scores and cannot kill each other with direct gunfire. |
| `-n <name>` | Sets custom player callsign / handle on the scoreboard. |
| `-b` | Spawns an automated AI bot ("Otto") to play on your behalf. |
| `-p <port>` | Overrides default UDP port (standard: 5868) for custom server setups. |
| `[host]` | Bypasses UDP broadcast auto-discovery and connects directly to specified server address. |

---

## 6. Server Setup (`huntd`)

To host a dedicated server on your local network:

```bash
# Start background driver daemon
huntd &

# Connect clients from any terminal
hunt localhost
hunt -n Alice localhost
hunt -n Bob -t RED localhost
```
