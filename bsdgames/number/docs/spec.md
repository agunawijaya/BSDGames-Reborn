# `number` — Mechanical Specification

> Implementation-independent reverse-specification of the `number` utility.

---

## Objective

Given one or more decimal numbers, print each number as English words.

## State Variables

`number` is stateless between inputs. Internally it tracks:

| Variable | Meaning |
|---|---|
| `lflag` | Output mode: `0` = sentence style, `1` = single-line |
| `line` / `argv` | Current input string |
| `fraction` | Pointer to fractional digits after `.` |
| `singular` | Grammar flag for fractional pluralisation |

## Actions / Commands

- `number [# ...]` — convert the given numbers.
- `number` with no arguments — read numbers from `stdin` until EOF.
- `number -l [# ...]` — produce single-line output without sentence punctuation.

## Legal Rules & Invariants

- Input must be a decimal number with optional leading `-` and a single `.`.
- Maximum 65 digits for integer part and 65 digits for fractional part.
- Negative inputs are prefixed with `minus` in output.
- Fractions are pronounced with ordinal suffixes (`tenths`, `hundredths`, ...).
- Multiple command-line inputs are separated by `...` in default mode.
- `0` prints `zero.` in default mode and `zero` in `-l` mode.

## RNG Usage / Distributions

None. `number` is fully deterministic.

## Termination Conditions

- The program exits after all command-line arguments are processed.
- In stdin mode, it exits on EOF or read error.
- Malformed input terminates with an error message.

## Difficulty Levels & Setup Configuration

There are no difficulty modes. The only runtime configuration is `-l`.

## Session Replay Semantics

Replaying the same input always produces the same output.

## See Also

- [`architecture.md`](./architecture.md) — how the original implements this spec.
- [`how-to-play.md`](./how-to-play.md) — user-facing examples.
- [`test-scenarios.md`](./test-scenarios.md) — manual verification scripts.
