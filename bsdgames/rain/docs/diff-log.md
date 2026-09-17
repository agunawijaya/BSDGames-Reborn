# `rain` — Original → Port Diff Log

> Feature-by-feature comparison of the original BSD `rain` and the modern port.

---

| Feature | Original | Port (planned) |
|---|---|---|
| Display | Curses terminal | Terminal + web canvas + wallpaper mode |
| Characters | ASCII `. o O - \| / \\` | Preserved in retro mode; optional Unicode/graphics |
| Delay | `-d` in ms | Preserved |
| Stop signal | HUP/INT/TERM | Preserved |
| RNG seed | Default libc seed | Optional explicit seed |
| Sound | None | Optional rain ambience |
| Themes | None | Matrix, snow, leaves, etc. |

## Notes

- The default terminal experience will match the original.
- Modern versions add opt-in visuals, sound, and web demos without changing the core loop.

## See Also

- [`port-ideas.md`](./port-ideas.md) — brainstorm for future features.
- [`architecture.md`](./architecture.md) — original code analysis.
