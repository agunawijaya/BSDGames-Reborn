# `bcd` — Mechanical Specification

> Implementation-independent reverse-specification of the `bcd` utility.

---

## Objective

Given a line of text, render it as an ASCII-art IBM-style punched card.

## State Variables

| Variable | Meaning |
|---|---|
| `holes[256]` | 12-bit punch pattern for each input byte |
| `cardline[80]` | Input buffer |
| `COLUMNS` | Maximum card width (48) |

## Actions / Commands

- `bcd [string ...]` — print each argument as a punched card.
- `bcd` with no arguments — read lines from stdin and print each as a card.

## Legal Rules & Invariants

- Input is converted to uppercase before lookup.
- Input longer than 48 characters is truncated.
- Newlines are stripped.
- Each output card has a top border, a text row, 12 hole rows, and a bottom border.
- A punched position prints `]`; an unpunched position prints the row label character.
- Most control characters map to no holes and render as blank columns.

## RNG Usage / Distributions

None. `bcd` is fully deterministic.

## Termination Conditions

- The program exits after processing all arguments or reaching EOF on stdin.

## Difficulty Levels & Setup Configuration

There are no difficulty levels or runtime configuration flags.

## Session Replay Semantics

The same input always produces the same card.

## See Also

- [`architecture.md`](./architecture.md) — how the original implements this spec.
- [`how-to-play.md`](./how-to-play.md) — user-facing examples.
- [`test-scenarios.md`](./test-scenarios.md) — manual verification scripts.
