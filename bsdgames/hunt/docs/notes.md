# `hunt` — Working Notes & Engine Quirks

> Technical observations, network packet formats, and reflection geometry in the `hunt` codebase.

---

## 1. The Geometry of 90-Degree Projectile Reflection

In [`shots.c`](https://github.com/vattam/BSDGames/tree/master/hunt/huntd/shots.c), when a bullet coordinate collides with a slanted character:
- Collision with `/`:
  - $\Delta x' = -\Delta y$
  - $\Delta y' = -\Delta x$
  - Example: A bullet flying right ($\Delta x = 1, \Delta y = 0$) becomes $\Delta x' = 0, \Delta y' = -1$ (heading North).
- Collision with `\`:
  - $\Delta x' = \Delta y$
  - $\Delta y' = \Delta x$
  - Example: A bullet flying right ($\Delta x = 1, \Delta y = 0$) becomes $\Delta x' = 0, \Delta y' = 1$ (heading South).

This exact linear algebraic transformation inverts velocity vectors instantly without trigonometry.

---

## 2. Packet Wire Protocol (`hunt.h`)

Communications between client and server use compact C structs transmitted in raw network byte order:
- `IDENT_REQ`: Client introduces username, terminal dimensions, and requested team name.
- `PLAYER_MOVE`: Client sends raw keystrokes (`h`, `j`, `k`, `l`, `f`, `g`, `s`, `c`).
- `SCREEN_UPDATE`: Server sends a stream of cursor addressing byte sequences (`\033[y;xH`) followed by changed characters.

---

## 3. The `talk` Daemon Collision

Historical versions of `hunt` interfaced with the ancient 4BSD `talkd` daemon (`ctl.c`, `faketalk.c`) to alert logged-in users that a game of Hunt was underway on the local machine. This mechanism is completely obsolete on modern Unix systems and will be replaced by standard socket connections.
