# `countmail` — Specification

A formal reverse-specification of the original `countmail` utility.

---

## Objective

Count the user's mailbox messages and announce the total in loud,
all-caps English.

## State Variables

| Variable | Source | Meaning |
|---|---|---|
| `v` | `from | wc -l` | Number of mail messages, zero-padded to a multiple of 3 digits. |
| `g` | Incremented | Current 3-digit group index (0 = units, 1 = thousands, ...). |
| `x` | Lookup from `g` | Scale word for the current group. |
| `y` | Pattern match | Tens-and-units word for the current group. |
| `z` | Pattern match | Hundreds word for the current group. |
| `p` | Set from result | Plural suffix (`S` or empty). |

## Actions & Commands

| Action | Syntax |
|---|---|
| Run | `countmail` |

## Legal Rules & Invariants

1. The program takes no arguments.
2. It obtains the message count from `from | wc -l`.
3. The count is padded with leading zeros so its length is a multiple
   of three.
4. Each 3-digit group is converted to words and paired with a scale
   word (`THOUSAND`, `MILLION`, ...).
5. Empty groups are skipped.
6. If the scale index exceeds `SEPTILLION`, the program exits `1`
   with *"YOU HAVE TOO MUCH MAIL!"* on stderr.
7. The final word list is pluralised (`S` unless the value is `ONE`).
8. Output format is:
   ```
   <WORDS>!

   <WORDS> MAIL MESSAGE<S>!

   HAHAHAHAHA!
   ```

## RNG Usage

None.

## Termination Conditions

- **Success:** Count converted and announced → exit `0`.
- **Too much mail:** Count greater than `SEPTILLION` → exit `1`.

## Difficulty Levels & Setup Configuration

Not applicable. The only configuration is the user's mailbox.
