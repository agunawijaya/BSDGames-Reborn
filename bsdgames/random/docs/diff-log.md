# `random` — Original → Port Diff Log

> Feature-by-feature comparison of the original BSD `random` and the modern port.

---

| Feature | Original | Port (planned) |
|---|---|---|
| Line filter | Bernoulli `1/denominator` | Preserved |
| Exit-code mode | `-e` | Preserved |
| Unbuffered mode | `-r` | Preserved |
| RNG seed | time + PID | Preserved; optional `--seed` |
| Sampling type | Bernoulli only | + reservoir, weighted, shuffle |
| Output format | Plain text | Plain text + JSON |
| Web / API | None | Optional `POST /sample` |

## Notes

- Default behaviour will remain identical to the original.
- New sampling modes will be opt-in via flags.

## See Also

- [`port-ideas.md`](./port-ideas.md) — brainstorm for future features.
- [`architecture.md`](./architecture.md) — original code analysis.
