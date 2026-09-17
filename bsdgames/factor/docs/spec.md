# `factor` — Mechanical Specification

> Implementation-independent reverse-specification of the `factor` utility.

---

## Objective

Given one or more non-negative integers, print each integer followed by its prime factors in non-decreasing order, with repetition.

## State Variables

`factor` is stateless between inputs. Internally, each input is stored in a single bignum value (`BIGNUM *val`) that is divided in place until it reaches `1`.

| Variable | Meaning |
|---|---|
| `val` | Current remainder of the input being factored |
| `fact` | Pointer into the static prime table |
| `prime[]` / `pr_limit` | Pre-computed primes up to `65537` |

## Actions / Commands

- `factor [value ...]` — factor the given values.
- `factor` with no arguments — read whitespace-delimited or line-based numbers from `stdin` until EOF.

## Legal Rules & Invariants

- Inputs must be non-negative decimal integers.
- Negative inputs are rejected with error message `negative numbers aren't permitted.`
- Malformed numeric input is rejected with error message `<value>: illegal numeric format.`
- Output format is `<number>: <factor> <factor> ...` with factors sorted ascending and repeated according to multiplicity.
- `0` historically causes the program to exit silently.
- `1` prints `1: 1`.

## RNG Usage / Distributions

None. `factor` is fully deterministic.

## Termination Conditions

- The program exits when all command-line arguments have been factored.
- In stdin mode, it exits on EOF or read error.
- It also exits silently inside `pr_fact()` if the input value is `0`.

## Difficulty Levels & Setup Configuration

There are no difficulty modes or runtime configuration flags. The only "knob" is the build-time `HAVE_OPENSSL` macro:

| Build | Behaviour for large remainders |
|---|---|
| `HAVE_OPENSSL` defined | Uses primality test + Pollard p−1 recursively |
| `HAVE_OPENSSL` not defined | Prints remainder as-is after trial division |

## Session Replay Semantics

Because the utility is deterministic and stateless, replaying the same input always produces the same output.

## See Also

- [`architecture.md`](./architecture.md) — how the original implements this spec.
- [`how-to-play.md`](./how-to-play.md) — user-facing examples.
- [`test-scenarios.md`](./test-scenarios.md) — manual verification scripts.
