# `hunt` — Modernization & Port Ideas

> Brainstorming modern internet multiplayer architectures, WebSockets, lobby matchmakers, and UI enhancements.

---

## 1. Internet Multiplayer & Matchmaking

In 1983, *Hunt* relied on local UDP broadcasts across a shared university campus Ethernet segment (`255.255.255.255`). Today, players reside behind home NAT routers and firewalls.

```mermaid
flowchart TD
    PlayerWeb["Web Browser (xterm.js)"] <==>|Secure WebSocket (WSS)| Gateway["Modern Cloud Gateway"]
    PlayerCLI["Terminal Client (CLI)"] <==>|TLS / TCP Stream| Gateway
    
    Gateway --> Lobby["Lobby Matchmaker (Quick Play / Custom Rooms)"]
    Lobby --> Instance1["Server Instance: Classic Arena (Free For All)"]
    Lobby --> Instance2["Server Instance: Team Deathmatch (Red vs Blue)"]
    Lobby --> Instance3["Server Instance: Bot Arena (Practice)"]
```

### Modern Networking Enhancements
- **Secure WebSockets (`wss://`):** Allows instant zero-install browser play from any modern device.
- **Server Discovery via Rendezvous API:** Replace UDP broadcast with a lightweight HTTP JSON lobby API (`api.bsdgames.org/hunt/lobbies`).
- **Lag Compensation & Client Prediction:** Interpolate player movements smoothly during network jitter.

---

## 2. UI / UX Design Ideas

### ANSI Color Palette & Particle Effects
- Color-code player callsigns, bullet trails, and slime splatter:
  - **Red:** High-explosive grenade blast radii.
  - **Bright Cyan:** Laser bullet trails reflecting off mirrors.
  - **Lime Green:** Corrosive slime puddles.
  - **Dim Amber:** Darkened corridor shadows.

### Tactical Minimap & Leaderboards
- Render a live HUD panel on the side of the arena showing:
  - Real-time Kill / Death ratio leaderboard.
  - Remaining ammunition gauge and cloaking battery level.
  - Mini radar beacon indicating nearby gunshots.

---

## 3. Bot Leagues & AI Modernization

- **Configurable Bot Difficulties:** Provide three bot skill tiers:
  - *Easy Bot ("Novice"):* Sluggish reaction times; rarely uses grenades.
  - *Normal Bot ("Classic Otto"):* Canonical 1983 dodging and bank shot behavior.
  - *Hard Bot ("Aimbot Otto"):* Calculates multi-bounce ricochets and predicts human movement trajectories.
- **Headless Bot Battle Royale:** Allow running automated bot leagues for competitive algorithmic tournaments.

---

## 4. What NOT to Change (Preservation Invariants)

1. **The Core Grid Ballistics:** The 90-degree reflection physics off `/` and `\` mirrors are the signature tactical mechanic of *Hunt*. Never alter these geometric invariants.
2. **The Terminal Character Aesthetic:** Characters like `>`, `<`, `^`, `v` for players and `*`, `o`, `$` for ordnance must remain the canonical visual representation.
3. **The Weapon Arsenal:** Retain the distinct roles of single shots, bursts, grenades, slime, and tripmines.

---

## 5. Open Questions

1. **Tick Rate Standardization:**
   - The original ran at variable microsecond delays (`TICK_USEC`). Should the port lock simulation to a standard 20 Hz or 30 Hz server tick rate?
   - *Recommendation:* Yes. A fixed 30 Hz tick rate provides crisp responsiveness while remaining lightweight for network transmission.
