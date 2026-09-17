# `primes` — Mechanical Specification

> Implementation-independent reverse-specification of the `primes` utility.

---

## Objective

Print all prime numbers `p` such that `start <= p < stop`, one per line, in ascending order.

## State Variables

`primes` is stateless between inputs. Internally it tracks:

| Variable | Meaning |
|---|---|
| `start` | Lower bound of the range (inclusive) |
| `stop` | Upper bound of the range (exclusive) |
| `table[]` | Sieve window for odd numbers |
| `prime[]` / `pr_limit` | Pre-computed small primes |
| `pattern[]` / `pattern_size` | Wheel pattern for 3, 5, 7, 11, 13 |

## Actions / Commands

- `primes [start [stop]]` — generate primes in the given range.
- `primes` with no arguments — read `start` from stdin, default `stop` = 2^32-1.

## Legal Rules & Invariants

- `start` and `stop` are non-negative integers.
- `start < stop` must hold; otherwise the program exits with an error.
- `stop` must not exceed 4294967295.
- Negative inputs are rejected.
- Output is one prime per line, ascending.
- If `stop <= 3`, no primes are printed.

## RNG Usage / Distributions

None. `primes` is fully deterministic.

## Termination Conditions

- The program exits after printing all primes in the range.
- It also exits on malformed input or range errors.

## Difficulty Levels & Setup Configuration

There are no difficulty modes. The only configuration is the `start` and `stop` range.

## Session Replay Semantics

Replaying the same range always produces the same output.

## See Also

- [`architecture.md`](./architecture.md) — how the original implements this spec.
- [`how-to-play.md`](./how-to-play.md) — user-facing examples.
- [`test-scenarios.md`](./test-scenarios.md) — manual verification scripts.
