# `hunt` — References & Historical Sources

> Citations, archival documents, primary source code links, and early networking literature.

---

## 1. Upstream Primary Source Code

- **Debian / NetBSD BSDGames Upstream Mirror:**
  [`vattam/BSDGames/tree/master/hunt`](https://github.com/vattam/BSDGames/tree/master/hunt)
  - Key Modules:
    - [`hunt/hunt/hunt.c`](https://github.com/vattam/BSDGames/tree/master/hunt/hunt/hunt.c) — Client entry point, socket initialization, argument parsing.
    - [`hunt/hunt/connect.c`](https://github.com/vattam/BSDGames/tree/master/hunt/hunt/connect.c) — UDP auto-discovery and TCP stream connection routines.
    - [`hunt/hunt/playit.c`](https://github.com/vattam/BSDGames/tree/master/hunt/hunt/playit.c) — Client input handling and curses rendering.
    - [`hunt/hunt/otto.c`](https://github.com/vattam/BSDGames/tree/master/hunt/hunt/otto.c) — Algorithmic autonomous bot player ("Otto").
    - [`hunt/huntd/driver.c`](https://github.com/vattam/BSDGames/tree/master/hunt/huntd/driver.c) — Main daemon event loop and `select()` multiplexer.
    - [`hunt/huntd/makemaze.c`](https://github.com/vattam/BSDGames/tree/master/hunt/huntd/makemaze.c) — Procedural maze generation with mirrors and slime traps.
    - [`hunt/huntd/shots.c`](https://github.com/vattam/BSDGames/tree/master/hunt/huntd/shots.c) — Ballistics simulation, 90° mirror reflections, and projectile steps.
    - [`hunt/huntd/expl.c`](https://github.com/vattam/BSDGames/tree/master/hunt/huntd/expl.c) — Grenade explosion dynamics and wall disintegration.
    - [`hunt/huntd/draw.c`](https://github.com/vattam/BSDGames/tree/master/hunt/huntd/draw.c) — Double-buffered differential terminal redraw engine.

---

## 2. Unix Networking History & Academic Literature

1. **Leffler, Samuel J., Fabry, Robert S., & Joy, William N. (1983):**
   - *A 4.2BSD Interprocess Communication Primer*. Computer Systems Research Group (CSRG), University of California, Berkeley.
2. **Huang, Conrad, Chung, Kenneth, & Couch, Greg (1985):**
   - *Hunt: A Multi-User Combat Game for Berkeley Unix*. Computer Graphics Laboratory, University of California, San Francisco.
3. **Stevens, W. Richard (1990):**
   - *UNIX Network Programming*. Prentice Hall. Englewood Cliffs, New Jersey. (Classic textbook detailing the `select()` paradigm utilized in `huntd`).
4. **Kushner, David (2003):**
   - *Masters of Doom: How Two Guys Created an Empire and Transformed Pop Culture*. Random House. (Historical context on the evolution of LAN multiplayer deathmatches).
