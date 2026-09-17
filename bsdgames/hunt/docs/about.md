# About `hunt`

> *"There are no rooms, no treasures, and no monsters. Instead, you wander around a maze, find grenades, trip mines, and shoot down walls and players."* — `hunt(6)`

---

## The Pitch

In 1983, a decade before id Software revolutionized PC gaming with *Doom*, a small team of computer scientists at the University of California, San Francisco (UCSF) asked a visionary question: *What if multiple programmers sitting at different video terminals across campus could battle inside the exact same virtual maze in real time?*

The result was **`hunt`**, one of the very first real-time multiplayer network deathmatches in computing history. Designed to take full advantage of 4BSD's newly invented Internet socket APIs (`AF_INET`, UDP broadcast, and stream sockets), *Hunt* connected dozens of remote ASCII terminals to a centralized driver daemon (`huntd`).

Equipped with laser shots, full-automatic spray bursts, bouncing fragmentation grenades, corrosive slime canisters, and deployable tripmines, players stalked corridor corners, bounced shots off slanted reflector walls, and cloaked themselves in optical camouflage. Fast-paced, ruthless, and tactically sophisticated, *Hunt* was so intensely addictive that university lab administrators in the 1980s famously had to restrict its playtime due to severe campus network saturation and terminal keyboard wear.

---

## Visual Presentation

![Hunt Arena Overview](../media/01-arena.png)
*Figure 1: The shared multiplayer maze with walls, reflector mirrors, and player facing vectors.*

![Real-Time Combat and Explosions](../media/02-deathmatch.png)
*Figure 2: Active fire combat with bullet trails, ricochets, and real-time damage telemetry.*

---

## Historical & Cultural Background

| Metadata | Details |
|---|---|
| **Original Title** | *Hunt — a multi-player multi-terminal game* |
| **Authors** | Conrad Huang, Kenneth Chung, and Greg Couch |
| **Institution** | Computer Graphics Laboratory, University of California, San Francisco (UCSF) |
| **Release Era** | 1983–1985 (Integrated into 4.3BSD in 1986) |
| **Architecture** | Client-Server Architecture over BSD Sockets (`hunt` client, `huntd` server) |
| **Upstream Code** | [`vattam/BSDGames/tree/master/hunt`](https://github.com/vattam/BSDGames/tree/master/hunt) |

### The VAX Load & Network Warnings

In the original `hunt/README` file, the authors published a delightfully frank warning about the physical toll of early network gaming:

> *"hunt uses a fair amount of CPU time, both in user time and system time. We found that a VAX-11/750 can support about three users before the system is noticeably impacted. The number goes up to about 8 or 10 for a VAX 8650... Hunt may be dangerous to your health. 'Arthritic pain' and 'lack of circulation' in fingers have been reported by hunt abusers. Hunt may also be addictive, and the withdrawal symptoms are not pretty :-)"*

Because BSD sockets were cutting-edge technology in 1983, *Hunt* pioneered techniques for broadcast discovery: if a player started `hunt` without specifying a server host, the client broadcast UDP discovery packets across the local subnet (`255.255.255.255`), listening for an active `huntd` daemon to automatically join the fray.

---

## Why It's Fun

1. **Pure Adrenaline & Spatial Reflexes:** Unlike turn-based roguelikes, *Hunt* operates in continuous, real-time microsecond ticks. Pausing to think gets you disintegrated by an incoming grenade.
2. **Brilliant Ballistics (The Reflector Angle):** Corridors feature diagonal mirrors (`/` and `\`). Skilled players bounce bullets around 90-degree corners to assassinate opponents without ever exposing themselves to line-of-sight return fire.
3. **Arsenal Diversity:** Single shots conserve ammo; full-auto bursts tear down destructible maze walls; grenades clear entire rooms in rolling fireball explosions; slime canisters blind and encumber opponents.
4. **Autonomous AI Sparring ("Otto"):** If no human players are online, the built-in bot `otto` (`otto.c`) joins the server. Otto maneuvers corridors, hunts targets via pathfinding heuristics, and dodges incoming fire with superhuman reflex times.
5. **Team Warfare:** Grouping into rival squads (`-t RED`, `-t BLUE`) enables cooperative corridor sweeps, perimeter defense, and shared scoreboard glory.

---

## Difficulty & Progression

Because *Hunt* is an open-ended multiplayer arena deathmatch, difficulty is emergent and driven by opponent skill, team configurations, and server parameters:

### Difficulty Scaling Dimensions

1. **Player Skill Tiers & Stalking Mechanics:**
   - **Novice:** Wanders blindly into open corridors; triggers stationary tripmines; wastes ammunition firing at concrete walls.
   - **Intermediate:** Mastered diagonal ricochet angles (`/` and `\`); utilizes cloaking (`c`) to lay ambushes.
   - **Expert / Bot Masters:** Calculates grenade bounce arcs; coordinates cross-fire killboxes with squadmates; tracks opponent ammo depletion.
2. **AI Bot Scaling ("Otto"):**
   - Invoking automated bot instances via `hunt -b` introduces relentless, unerring combatants that push human players to their tactical limits.
3. **Maze Complexity & Hazard Density:**
   - `makemaze.c` procedural generator dials: density of destructible walls, frequency of bouncing reflectors, slime trap placement, and electrical teleport doors.

---

## Known Quirks & Bugs in the Original

1. **UDP Broadcast Permission Failure:**
   - On modern Unix networks, unprivileged non-root users cannot broadcast raw UDP packets without specific firewall rules, causing client auto-discovery to hang unless the server host is passed explicitly.
2. **Terminal Interrupt Bottlenecks:**
   - On early serial terminals (1200–9600 baud), receiving rapid grenade explosion updates could overwhelm the TTY buffer, causing character lag ("typing ahead").
3. **Slime Persistence Edge Cases:**
   - Getting hit by slime (`s`) reduces movement speed by half. Multiple rapid slime hits could stack movement delays to near-immobility.

---

## See Also

- [`how-to-play.md`](./how-to-play.md) — Controls, weapons, and tactical survival.
- [`spec.md`](./spec.md) — Network protocol, ballistics physics, and damage mechanics.
- [`architecture.md`](./architecture.md) — Daemon architecture and socket event loops.
