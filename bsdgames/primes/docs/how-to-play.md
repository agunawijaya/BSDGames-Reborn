# How to Play `primes`

> **There is no score — just an endless stream of primes.**

---

## Controls / Commands

`primes` is a command-line utility.

```sh
primes [start [stop]]
```

## Basic Usage

Generate primes from 2 to 100 (exclusive):

```sh
$ primes 2 100
2
3
5
7
...
97
```

Generate primes from 1000 upward to the 32-bit limit:

```sh
$ primes 1000
1009
1013
1019
...
```

Read the start value from stdin:

```sh
$ echo 50 | primes
53
59
61
...
```

Count how many primes are in a range:

```sh
$ primes 2 1000000 | wc -l
78498
```

## Input Rules

- `start` and `stop` are non-negative decimal integers.
- `start` must be less than `stop`.
- `stop` must not exceed 4294967295.
- Negative numbers produce the error: `negative numbers aren't permitted.`
- Invalid numeric formats produce: `<value>: illegal numeric format.`

## How to "Win"

There is no win condition. The satisfying moment is watching a clean list of primes scroll by.

## Tips & Tricks

- **Combine with `factor`:** `primes 2 100 | xargs -n1 factor` factors every prime up to 100.
- **Validate the sieve:** `primes 0 10000000 | wc -l` should report `664579`.
- **Use in scripts:** `primes 2 1000 | shuf -n 1` picks a random small prime.
- **Watch the limit:** Without a `stop` argument, `primes` runs all the way to 2^32-1.

## Scoring Mechanism

None.

## Easter Eggs

- The man page's BUGS section admits the program "won't get you a world record."

## Difficulty Levels & Setup Configuration

There are no difficulty modes. The only variables are `start` and `stop`.

| Range | Behaviour |
|---|---|
| Small (e.g., `2 100`) | Instant output |
| Medium (e.g., `2 1000000`) | Sub-second |
| Large (e.g., `2 4294967295`) | Long-running |

## See Also

- [`spec.md`](./spec.md) — formal rules and invariants.
- [`architecture.md`](./architecture.md) — how the sieve works.
- [`test-scenarios.md`](./test-scenarios.md) — manual test scripts.
