# `arithmetic` — Specification

A formal reverse-specification of the original `arithmetic` game.

---

## Objective

Drill the player on simple arithmetic problems and report accuracy and
speed.

## State Variables

| Variable | Initial | Meaning |
|---|---|---|
| `keys` | `"+-"` | Active operator characters. |
| `nkeys` | `2` | Number of active operators. |
| `rangemax` | `10` | Maximum operand / result value. |
| `nright` | `0` | Count of correct answers. |
| `nwrong` | `0` | Count of wrong answers. |
| `qtime` | `0` | Total seconds spent on correct answers. |
| `penalty[4][2]` | `0` | Total extra weight per operator/operand. |
| `penlist[4][2]` | `NULL` | Linked lists of penalised values. |

## Actions & Commands

| Action | Syntax |
|---|---|
| Start default drill | `arithmetic` |
| Choose operators | `arithmetic -o +x/` |
| Set range | `arithmetic -r 50` |
| Combined | `arithmetic -o +-\*x -r 20` |

## Legal Rules & Invariants

1. Operators must be a subset of `+-x/`. Unknown operators cause an
   error.
2. Range must be a positive integer.
3. Each problem selects one operator from `keys` uniformly at random.
4. For `+` and `x`, both operands are in `[0, rangemax]`.
5. For `-`, the result and subtrahend are in `[0, rangemax]`; the
   minuend is their sum.
6. For `/`, the divisor is in `[1, rangemax]`, the quotient is in
   `[0, rangemax]`, and the dividend is `divisor * quotient + remainder`
   with `0 <= remainder < divisor`.
7. The user must enter the exact integer result to proceed.
8. Non-numeric input prints *"Please type a number."* and repeats the
   same problem.
9. Wrong answers increment `nwrong` and add penalties to the involved
   numbers.
10. After every 20 problems, statistics are printed and the program
    waits for a newline before continuing.
11. EOF or `SIGINT` ends the session and prints final statistics.

## RNG Usage

- `srandom(time(NULL))` seeds the generator at startup.
- `random()` selects operators, operands, results, and division
  remainders.
- Penalty weights bias operand selection.

## Termination Conditions

- **Normal:** EOF on stdin or `SIGINT`.
- **Error:** Invalid flags → exit `1`.

## Difficulty Levels & Setup Configuration

| Flag | Effect |
|---|---|
| `-r N` | Set operand/result range. |
| `-o OPS` | Choose operator set. |

No in-game difficulty ramp; the user restarts with new flags.
