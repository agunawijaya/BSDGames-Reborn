# `fish` — Original → Port Diff Log

Tracks every deliberate change from the original BSDGames `fish` to
the modern port.

---

## Preserved

| Feature | Original | Port |
|---|---|---|
| Rules | Go Fish | Same |
| Hand size | 7 cards | Same |
| Books | 4 of a kind | Same |
| Normal AI | Cycles ranks | Same |
| Pro AI | Memory + heuristic + rare cheat | Same |
| Instructions | Pager from `fish.instr` | Same mechanism |

## Modernised

| Feature | Original | Port |
|---|---|---|
| UI | Plain text | Card graphics / web / mobile |
| Multiplayer | Single-player only | Optional online multiplayer |
| AI | Two modes | Multiple personalities |
| Sound | None | Optional effects |

## Reinterpreted

- The "rare cheat" could become an explicit difficulty option or
  easter egg.

## Removed

None yet.

## See Also

- [`port-ideas.md`](./port-ideas.md) for proposed future changes.
