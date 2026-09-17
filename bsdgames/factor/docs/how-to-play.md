# How to Play `factor`

> **There is no scoreboard and no timer — just you, a number, and its prime factors.**

---

## Controls / Commands

`factor` is a command-line utility. It accepts zero or more integer arguments and reads from standard input if no arguments are given.

```sh
factor [value ...]
```

## Basic Usage

Factor a single number:

```sh
$ factor 60
60: 2 2 3 5
```

Factor several numbers at once:

```sh
$ factor 12 100 97
12: 2 2 3
100: 2 2 5 5
97: 97
```

Read numbers from standard input:

```sh
$ echo 1234567890 | factor
1234567890: 2 3 3 5 3607 3803
```

Or from a file:

```sh
$ factor < numbers.txt
```

## Input Rules

- Only non-negative decimal integers are accepted.
- Negative numbers produce the error: `negative numbers aren't permitted.`
- Invalid numeric formats produce: `<value>: illegal numeric format.`

## How to "Win"

There is no win condition. The satisfying moment is when a large, mysterious number collapses into a short list of primes.

## Tips & Tricks

- **Pipes:** `factor` works well in pipelines. Try `seq 2 100 | factor` to see factorisations for a range.
- **Spot primes:** If the output contains only the number itself (e.g., `97: 97`), the input is prime.
- **Watch the table limit:** Without OpenSSL, `factor` may stop trial division and print a large remainder. If the remainder looks composite, the build lacks Pollard p−1 support.
- **Avoid zero:** Input `0` silently exits the program — a historical quirk, not a feature.

## Scoring Mechanism

None.

## Easter Eggs

- The source header advertises "for a good prime call: 391581 * 2^216193 - 1" — Landon Curt Noll's prime-hunting calling card.

## Difficulty Levels & Setup Configuration

There are no difficulty modes. The complexity is entirely input-driven:

| Input type | Expected behaviour |
|---|---|
| Small composite | Instant output |
| Large prime | Exhausts prime table; OpenSSL build confirms primality |
| Large composite | OpenSSL build uses Pollard p−1; non-OpenSSL build prints remainder |

## See Also

- [`spec.md`](./spec.md) — formal rules and invariants.
- [`architecture.md`](./architecture.md) — how the algorithm works.
- [`test-scenarios.md`](./test-scenarios.md) — manual test scripts.
