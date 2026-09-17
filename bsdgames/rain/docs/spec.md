# `rain` — Mechanical Specification

> Implementation-independent reverse-specification of the `rain` screensaver.

---

## Objective

Display an animated raindrop screensaver on a terminal until interrupted by a signal.

## State Variables

| Variable | Meaning |
|---|---|
| `xpos[5]`, `ypos[5]` | Circular buffer of the last 5 drop positions |
| `j` | Index into the circular buffer |
| `cols`, `lines` | Drawable area (`COLS-4`, `LINES-4`) |
| `delay` | Frame delay in microseconds |
| `sig_caught` | Flag set by signal handler to request clean exit |

## Actions / Commands

- `rain [-d delay]` — start the screensaver.
- `Ctrl-C` / `SIGINT` — stop and restore terminal.

## Legal Rules & Invariants

- Drops spawn at random `(x, y)` within the bordered drawable area.
- Each new drop is drawn as `.`.
- Older drops in the buffer are redrawn as `o`, `O`, `-`, `|`, `/`, `\`, and finally erased with spaces.
- The buffer index wraps modulo 5.
- Frame delay is configurable in milliseconds (`1`–`999`); default is `0`.
- On `SIGHUP`, `SIGINT`, or `SIGTERM`, the program restores the terminal and exits.

## RNG Usage / Distributions

- `random()` returns a uniform integer.
- New drop x position: `random() % cols + 2`.
- New drop y position: `random() % lines + 2`.
- The RNG is not explicitly seeded; it uses the libc default.

## Termination Conditions

- The program terminates cleanly when `sig_caught` becomes non-zero.
- It calls `endwin()` before exiting to restore the terminal.

## Difficulty Levels & Setup Configuration

There are no difficulty levels. The only runtime configuration is the frame delay.

| Delay | Effect |
|---|---|
| `0` | Fastest, paced only by terminal drain |
| `1–999` | Sleep that many milliseconds between frames |

## Session Replay Semantics

Because the RNG is not explicitly seeded, replaying the same session is not deterministic.

## See Also

- [`architecture.md`](./architecture.md) — how the original implements this spec.
- [`how-to-play.md`](./how-to-play.md) — user-facing instructions.
- [`test-scenarios.md`](./test-scenarios.md) — manual verification scripts.
