# How to Play `number`

> **Type a number, hear it in English.**

---

## Controls / Commands

`number` is a command-line utility.

```sh
number [-l] [# ...]
```

## Basic Usage

Convert a single number:

```sh
$ number 123
one hundred twenty-three.
```

Convert several numbers:

```sh
$ number 7 42 1001
seven.
...
forty-two.
...
one thousand one.
```

Read from standard input:

```sh
$ echo 2024 | number
two thousand twenty-four.
```

## The `-l` Flag

The `-l` (line) flag produces output on a single line without sentence-final periods, which is useful for piping into other programs.

```sh
$ number -l 12345
twelve thousand three hundred forty-five
```

## Input Rules

- Decimal digits only, with optional leading `-` and a single `.` for fractions.
- Maximum 65 digits for the integer part and 65 digits for the fractional part.
- Negative numbers are prefixed with `minus`.
- Embedded whitespace or multiple decimal points produce an error.

## How to "Win"

There is no win condition. The satisfying output is a correctly spelled English phrase.

## Tips & Tricks

- **Use `-l` for scripts:** The single-line format is easier to parse or concatenate.
- **Batch conversions:** `cat prices.txt | number` converts a whole list.
- **Fractions:** `number 0.5` → `five tenths.`; `number 0.01` → `one hundredth.`
- **Listen for hyphenation:** `21` becomes `twenty-one`, `101` becomes `one hundred one`.

## Scoring Mechanism

None.

## Easter Eggs

None documented.

## Difficulty Levels & Setup Configuration

There are no difficulty modes. The only runtime option is `-l`.

| Flag | Effect |
|---|---|
| (none) | Sentence-style output with `...` separators and final period |
| `-l` | Single-line output, no periods |

## See Also

- [`spec.md`](./spec.md) — formal rules and invariants.
- [`architecture.md`](./architecture.md) — how the algorithm works.
- [`test-scenarios.md`](./test-scenarios.md) — manual test scripts.
