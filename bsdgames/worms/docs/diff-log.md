# `worms` — Original → Port Diff Log

> Feature-by-feature comparison of the original BSD `worms` and the modern port.

---

| Feature | Original | Port (planned) |
|---|---|---|
| Display | Curses terminal | Terminal + web canvas + wallpaper mode |
| Worm count | `-n` | Preserved |
| Worm length | `-l` | Preserved |
| Delay | `-d` | Preserved |
| Field mode | `-f` | Preserved |
| Trail mode | `-t` | Preserved |
| Characters | ASCII `O * # $ % 0 @ ~` | Preserved in retro mode |
| RNG seed | Default libc seed | Optional explicit seed |
| Collision | None (overlap allowed) | Optional game mode with collision |
| Multiplayer | None | Optional shared canvas |

## Notes

- The default screensaver experience will match the original.
- Game-like modes (food, collision, player control) are opt-in.

## See Also

- [`port-ideas.md`](./port-ideas.md) — brainstorm for future features.
- [`architecture.md`](./architecture.md) — original code analysis.
