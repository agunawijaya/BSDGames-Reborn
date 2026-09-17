# `arithmetic` — Original → Port Diff Log

Tracks every deliberate change from the original BSDGames `arithmetic`
to the modern port.

---

## Preserved

| Feature | Original | Port |
|---|---|---|
| Core loop | Ask → check → feedback | Same |
| Operator selection | `-o +-\*x/` | Same |
| Range setting | `-r range` | Same |
| Penalty system | Linked-list weighted random | Same algorithm |
| Statistics every 20 | Rights/Wrongs/Score/Time | Same |
| No answer reveal | Program never gives answer | Same default |

## Modernised

| Feature | Original | Port |
|---|---|---|
| Implementation | C / curses-free terminal | TBD by language ADR |
| Feedback | Plain text | Optional colour, sound, animations |
| Difficulty presets | None | Easy/Medium/Hard modes |
| Reporting | Session only | Persistent stats, teacher reports |
| Multiplayer | None | Optional classroom/head-to-head modes |

## Reinterpreted

- The penalty system could be replaced or augmented with a
  spaced-repetition scheduler in a modern educational port.

## Removed

None yet.

## See Also

- [`port-ideas.md`](./port-ideas.md) for proposed future changes.
