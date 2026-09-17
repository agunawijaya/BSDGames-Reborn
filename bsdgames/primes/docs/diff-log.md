# `primes` — Original → Port Diff Log

> Feature-by-feature comparison of the original BSD `primes` and the modern port.

---

| Feature | Original | Port (planned) |
|---|---|---|
| Range input | `start [stop]` CLI or stdin | Preserved |
| Default stop | 2^32-1 | Preserved or configurable |
| Algorithm | Segmented sieve + wheel | Preserved |
| Output | One prime per line | Preserved by default |
| 32-bit limit | Hard-coded | Extendable to 64-bit / big-int |
| Web / API | None | Optional JSON endpoint |
| Visualisation | None | Optional sieve animation |

## Notes

- The core sieve behaviour will be preserved exactly.
- Modern additions (JSON, animation, larger ranges) are opt-in.

## See Also

- [`port-ideas.md`](./port-ideas.md) — brainstorm for future features.
- [`architecture.md`](./architecture.md) — original code analysis.
