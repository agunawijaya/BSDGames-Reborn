# `dab` — Original → Port Diff Log

Tracks every deliberate change from the original BSDGames `dab` to the
modern port.

---

## Preserved

| Feature | Original | Port |
|---|---|---|
| Rules | Dots and Boxes | Same |
| Board sizes | Configurable `xdim ydim` | Same |
| Player types | Human / Computer | Same |
| Turn replay on box completion | Yes | Same |
| AI strategy | Closure / safe / min-damage | Same |

## Modernised

| Feature | Original | Port |
|---|---|---|
| UI | ncurses terminal | Web/GUI/mobile (TBD by language ADR) |
| Input | vi keys | Mouse/touch plus optional keyboard |
| AI | Fixed heuristic | Stronger engine option |
| Multiplayer | Hot-seat only | Network multiplayer |

## Reinterpreted

- A modern port might add undo, hints, and tutorials.

## Removed

None yet.

## See Also

- [`port-ideas.md`](./port-ideas.md) for proposed future changes.
