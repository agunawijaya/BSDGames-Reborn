# `hunt` — Test Scenarios & Verification Scripts

> Manual and automated end-to-end verification scripts for multi-client networked gameplay.

---

## Scenario 1: Local Daemon Startup & Loopback Client Join

### Objective
Verify that `huntd` initializes the maze, opens port 5868, and accepts local loopback client connections.

### Steps
1. Start the daemon in the background:
   ```bash
   huntd -p 5868 &
   ```
2. In terminal 1, connect a player client:
   ```bash
   hunt -n Player1 -p 5868 localhost
   ```
3. Verify client display:
   - Maze boundaries (`#` and `|`, `-`) render on the screen.
   - Player character (`^`, `v`, `<`, or `>`) appears in an empty corridor socket.
   - Status bar displays `[IDENT: Player1] [AMMO: 15] [DAMAGE: 0%]`.

---

## Scenario 2: Two-Player Combat & Projectile Reflection

### Objective
Verify that firing bullets bounces off reflector mirrors and scores a kill on an opposing player.

### Steps
1. In terminal 2, connect a second player:
   ```bash
   hunt -n Player2 -p 5868 localhost
   ```
2. Position Player 1 facing East towards a `/` mirror.
3. Position Player 2 in the corridor directly North of the `/` mirror.
4. Player 1 fires a single bullet (`f`):
   - Expected Result:
     - Bullet travels East until hitting `/`.
     - Bullet reflects 90° North.
     - Bullet collides with Player 2.
     - Player 2 takes 20% damage.
5. Fire 5 consecutive bursts until Player 2 reaches 100% damage:
   - Expected Result:
     - Player 2 is eliminated and despawns.
     - Player 1 score increments by +100 points on scoreboard.

---

## Scenario 3: Autonomous Bot ("Otto") Integration

### Objective
Verify that `hunt -b` instantiates an automated bot that patrols corridors and engages targets.

### Steps
1. Start server and join as a monitor spectator:
   ```bash
   hunt -m -p 5868 localhost
   ```
2. In another terminal, launch the bot:
   ```bash
   hunt -b -p 5868 localhost &
   ```
3. Observe on the monitor screen:
   - Bot navigates corridors continuously without getting stuck in dead ends.
   - Bot detects obstacles and changes heading smoothly.

---

## QA Sign-Off Template

```text
================================================================================
HUNT TEST RUN SIGN-OFF
================================================================================
Platform: [ Linux / macOS / Windows WSL2 ]
Binary Version: [ bsdgames-reborn v0.1.0 ]
Date of Test: [ YYYY-MM-DD ]
Tester: [ Contributor Name / Agent ID ]

[ ] Scenario 1: Local Daemon Startup & Loopback Client Join ..... PASS / FAIL
[ ] Scenario 2: Two-Player Combat & Projectile Reflection ....... PASS / FAIL
[ ] Scenario 3: Autonomous Bot ("Otto") Integration ............. PASS / FAIL

Comments:
________________________________________________________________________________
```
