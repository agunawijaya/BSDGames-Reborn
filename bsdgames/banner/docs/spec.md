# `banner` — Mechanical Specification

> Implementation-independent reverse-specification of the `banner` utility.

---

## Objective

Given a message, render each character as a large ASCII-art glyph and print the result line by line.

## State Variables

| Variable | Meaning |
|---|---|
| `message[]` | Input text to render |
| `line[]` / `print[]` | 132-column output buffers |
| `width` | Effective output width (default 132) |
| `asc_ptr[]` | Offsets into glyph data table |
| `data_table[]` | Encoded glyph drawing commands |

## Actions / Commands

- `banner [message ...]` — render the given message.
- `banner -w width [message ...]` — render at the specified width.
- `banner` with no arguments — read one line from stdin.

## Legal Rules & Invariants

- Message length is limited to 1024 characters.
- Default output width is 132 columns.
- Each glyph is rendered from the encoded data table.
- Characters without glyph definitions render as blank space.
- `-w` scales the output by skipping rows and columns.

## RNG Usage / Distributions

None. `banner` is fully deterministic.

## Termination Conditions

- The program exits after printing the rendered banner.
- It exits on invalid option usage.

## Difficulty Levels & Setup Configuration

There are no difficulty levels. The only runtime configuration is `-w`.

## Session Replay Semantics

The same input always produces the same output.

## See Also

- [`architecture.md`](./architecture.md) — how the original implements this spec.
- [`how-to-play.md`](./how-to-play.md) — user-facing examples.
- [`test-scenarios.md`](./test-scenarios.md) — manual verification scripts.
