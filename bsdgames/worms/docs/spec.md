# `worms` — Mechanical Specification

> Implementation-independent reverse-specification of the `worms` screensaver.

---

## Objective

Animate one or more segmented worms moving randomly around a terminal screen until interrupted by a signal.

## State Variables

| Variable | Meaning |
|---|---|
| `worm[]` | Array of worms, each with orientation, head index, and position queues |
| `ref[LI][CO]` | Reference grid counting worms per cell |
| `CO`, `LI` | Screen columns and lines |
| `length` | Worm body length |
| `number` | Number of worms |
| `trail` | Character used when erasing a tail (` ` or `.`) |
| `delay` | Frame delay in microseconds |
| `sig_caught` | Flag set by signal handler |

## Actions / Commands

- `worms [-ft] [-d delay] [-l length] [-n number]` — start the screensaver.
- `Ctrl-C` / `SIGINT` — stop and restore terminal.

## Legal Rules & Invariants

- Worms move one cell per frame.
- Each worm's body is a fixed-length circular queue.
- A cell is erased only when its reference count reaches zero.
- At screen edges/corners, the next orientation is chosen from a constrained table to keep the worm inside the screen.
- Worms are drawn with characters from `flavor[]`: `O * # $ % 0 @ ~`.
- If `-f` is set, the screen is filled with the repeating text "WORM" before animation starts.
- If `-t` is set, tails are erased with `.` instead of a space.

## RNG Usage / Distributions

- `random()` returns a uniform integer.
- Orientation selection: `random() % op->nopts` from the current boundary table.
- The RNG is not explicitly seeded.

## Termination Conditions

- The program terminates cleanly when `sig_caught` becomes non-zero.
- It calls `endwin()` before exiting.
- Invalid flag values terminate with an error message.

## Difficulty Levels & Setup Configuration

There are no difficulty levels. Runtime configuration:

| Flag | Default | Range | Effect |
|---|---|---|---|
| `-d` | `0` | `1–1000` ms | Frame delay |
| `-l` | `16` | `2–1024` | Worm length |
| `-n` | `3` | `>=1` | Number of worms |
| `-f` | off | — | Fill screen with "WORM" |
| `-t` | off | — | Leave `.` trail |

## Session Replay Semantics

Because the RNG is not explicitly seeded, replaying the same session is not deterministic.

## See Also

- [`architecture.md`](./architecture.md) — how the original implements this spec.
- [`how-to-play.md`](./how-to-play.md) — user-facing instructions.
- [`test-scenarios.md`](./test-scenarios.md) — manual verification scripts.
