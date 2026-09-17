# `quiz` — Original → Port Diff Log

Tracks every deliberate change from the original BSDGames `quiz` to
the modern port.

---

## Preserved

| Feature | Original | Port |
|---|---|---|
| Data-driven subjects | Index + data files | Same |
| Reversible categories | `quiz cat1 cat2` / `quiz cat2 cat1` | Same |
| Colon-separated format | Same |
| Tutorial mode | `-t` | Same |
| Scoring | rights/wrongs/guesses percentage | Same |

## Modernised

| Feature | Original | Port |
|---|---|---|
| UI | Plain terminal | Web/GUI/mobile |
| Regexp engine | Custom `rxp.c` | Standard regex (with compatibility layer) |
| Learning algorithm | Tutorial bias | Optional spaced repetition |
| Content authoring | Plain text | Web editor + imports |

## Reinterpreted

- Some bundled subjects may be moved behind an opt-in filter.

## Removed

None yet.

## See Also

- [`port-ideas.md`](./port-ideas.md) for proposed future changes.
