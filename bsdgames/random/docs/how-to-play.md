# How to Play `random`

> **Roll the dice on every line of input.**

---

## Controls / Commands

`random` is a command-line utility.

```sh
random [-er] [denominator]
```

## Basic Usage

Print each line with 50% probability (default denominator `2`):

```sh
$ cat words.txt | random
```

Print each line with 10% probability:

```sh
$ cat words.txt | random 10
```

Force unbuffered output (useful for live logs):

```sh
$ tail -f log.txt | random -r 100
```

Generate a random exit code from `0` to `denominator-1`:

```sh
$ random -e 5
$ echo $?
3
```

## Input Rules

- Reads lines from standard input unless `-e` is used.
- The denominator must be a non-zero number; default is `2`.
- `-r` only affects line-filter mode, not exit-code mode.

## How to "Win"

There is no win condition. The utility is a tool for sampling and randomisation.

## Tips & Tricks

- **Sample logs:** `cat big.log | random 1000` gives a 0.1% sample.
- **Pick one winner:** Pipe a list through `random` repeatedly until one line remains, or use `shuf -n 1` for a fixed-size sample.
- **Simulate flaky commands:** `random -e 3 && success_cmd || fail_cmd` exercises both branches.
- **Independent lines:** Each line is evaluated independently; the total count is random.

## Scoring Mechanism

None.

## Easter Eggs

None documented.

## Difficulty Levels & Setup Configuration

There are no difficulty modes. The runtime configuration is:

| Flag / Arg | Effect |
|---|---|
| (none) | Denominator `2`, buffered output |
| `-e` | Random exit code `0..denominator-1`, no I/O |
| `-r` | Unbuffered line-filter output |
| `denominator` | Set probability to `1/denominator` |

## See Also

- [`spec.md`](./spec.md) — formal rules and invariants.
- [`architecture.md`](./architecture.md) — how the RNG works.
- [`test-scenarios.md`](./test-scenarios.md) — manual test scripts.
