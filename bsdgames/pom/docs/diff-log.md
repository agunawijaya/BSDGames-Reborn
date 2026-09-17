# `pom` — Original → Port Diff Log

Tracks every deliberate change from the original BSDGames `pom` to the
modern port.

---

## Preserved

| Feature | Original | Port |
|---|---|---|
| Algorithm | Duffett-Smith sections 46, 65, 67 | Same |
| Output style | Single-line phase description | Same default |
| Date format | `[[[[[cc]yy]mm]dd]HH]` | Same |
| Constants | EPOCH, EPSILONg, etc. | Same |

## Modernised

| Feature | Original | Port |
|---|---|---|
| Build system | BSD make | Modern toolchain (TBD by language ADR) |
| Date input | Compressed digits only | Optional ISO / natural-language input |
| Output | Plain text | Optional ASCII moon, colour, JSON |
| Portability | Unix epoch | Cross-platform time handling |

## Reinterpreted

- A future port could add a visual ASCII moon or calendar view while
  keeping the original one-liner as the default.

## Removed

None yet.

## See Also

- [`port-ideas.md`](./port-ideas.md) for proposed future changes.
