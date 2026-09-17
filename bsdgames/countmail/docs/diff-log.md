# `countmail` — Original → Port Diff Log

Tracks every deliberate change from the original BSDGames `countmail`
to the modern port.

---

## Preserved

| Feature | Original | Port |
|---|---|---|
| Core behaviour | Count mail and shout the result | Same |
| Number-to-words engine | Shell `case` pattern matching | Same algorithm |
| Scale words | THOUSAND → SEPTILLION | Same |
| Plural handling | ONE MAIL MESSAGE vs N MAIL MESSAGES | Same |
| Final laugh | HAHAHAHAHA! | Same |
| Too-much-mail error | > SEPTILLION | Same |

## Modernised

| Feature | Original | Port |
|---|---|---|
| Implementation | POSIX `/bin/sh` | TBD by language ADR |
| Mail backend | `from \| wc -l` | Configurable backend or mock mode |
| Error output | Mixed stderr | Clear stderr only |
| Portability | Unix with `from` | Cross-platform where feasible |

## Reinterpreted

- The joke of "obnoxiously announcing mail" could become a desktop
  notification or chat-bot feature in a modern port.

## Removed

| Feature | Reason |
|---|---|
| Hard dependency on `from(1)` | Modern systems lack it; replaced by plugin backend. |

## See Also

- [`port-ideas.md`](./port-ideas.md) for proposed future changes.
