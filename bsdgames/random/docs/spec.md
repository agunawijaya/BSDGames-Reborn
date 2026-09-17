# `random` — Mechanical Specification

> Implementation-independent reverse-specification of the `random` utility.

---

## Objective

Either:
1. Copy lines from stdin to stdout with independent probability `1/denominator` per line, or
2. Exit with a random integer status in `[0, denominator-1]`.

## State Variables

| Variable | Meaning |
|---|---|
| `denom` | Denominator controlling selection probability or exit range |
| `random_exit` | `1` if in exit-code mode |
| `unbuffer_output` | `1` if stdout should be unbuffered |
| `selected` | Whether the current line is being copied |

## Actions / Commands

- `random [denominator]` — line filter with default denominator `2`.
- `random -e [denominator]` — random exit code, no I/O.
- `random -r [denominator]` — line filter with unbuffered output.

## Legal Rules & Invariants

- Default denominator is `2`.
- Denominator must be non-zero and parseable as a number.
- Each line's selection is independent of other lines.
- In exit-code mode, the returned value is `(denom * random()) / MAXRANDOM` where `MAXRANDOM = 2147483647`.
- In line-filter mode, a line is selected when `(denom * random()) / MAXRANDOM == 0`.
- Selection is evaluated at the start of each line and at every newline.

## RNG Usage / Distributions

- `random()` returns a value in `[0, MAXRANDOM]`.
- Seeded once via `srandom(tv_usec + tv_sec + getpid())`.
- All selection decisions are derived from a single uniform integer scaled to the desired range.

## Termination Conditions

- Exit-code mode terminates immediately after computing the status.
- Line-filter mode terminates at EOF on stdin.
- Parse errors terminate with usage message.

## Difficulty Levels & Setup Configuration

There are no difficulty levels. Runtime knobs:

| Knob | Values | Default | Effect |
|---|---|---|---|
| `denominator` | non-zero number | `2` | Selection probability `1/denominator` or exit range |
| `-e` | flag | off | Exit-code mode |
| `-r` | flag | off | Unbuffered output |

## Session Replay Semantics

Because the seed includes microsecond time and PID, exact replay is not guaranteed unless the RNG seed is captured or fixed.

## See Also

- [`architecture.md`](./architecture.md) — how the original implements this spec.
- [`how-to-play.md`](./how-to-play.md) — user-facing examples.
- [`test-scenarios.md`](./test-scenarios.md) — manual verification scripts.
