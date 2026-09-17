# `ppt` — Mechanical Specification

> Implementation-independent reverse-specification of the `ppt` utility.

---

## Objective

Either:
1. Encode each input byte as a paper-tape row showing its 8 bits plus a feed hole, or
2. Decode paper-tape rows back into bytes.

## State Variables

| Variable | Meaning |
|---|---|
| `dflag` | `1` if in decode mode |
| `EDGE` | Top/bottom border string `"___________"` |

## Actions / Commands

- `ppt [string ...]` — encode text from arguments or stdin.
- `ppt -d` — decode ppt-formatted rows from stdin.

## Legal Rules & Invariants

- Encode output is framed by top and bottom `EDGE` lines.
- Each encoded byte is one row: `|`, bits 7..0, feed hole `.` at position 5 (between bits 5 and 4), `|`.
- Set bits print as `o`; unset bits print as space.
- Decode mode reads rows, locates `.`, and reconstructs the byte from the 8 surrounding positions.
- Decode mode does not accept command-line arguments.

## RNG Usage / Distributions

None. `ppt` is fully deterministic.

## Termination Conditions

- Encode mode exits after printing the bottom edge.
- Decode mode exits at EOF on stdin.

## Difficulty Levels & Setup Configuration

There are no difficulty levels. The only flag is `-d`.

## Session Replay Semantics

Replaying the same input always produces the same output.

## See Also

- [`architecture.md`](./architecture.md) — how the original implements this spec.
- [`how-to-play.md`](./how-to-play.md) — user-facing examples.
- [`test-scenarios.md`](./test-scenarios.md) — manual verification scripts.
