# `wargames` — Reverse Specification

> Implementation-independent specification of the `wargames`
> launcher/Easter egg.

---

## Objective

Accept a single line of input from the user. If the sanitized input
names a file in the games directory, clear the screen and run that
game. Otherwise print the famous *WarGames* quote.

## State Variables

| Variable | Meaning |
|---|---|
| `x` (raw) | The line typed by the user |
| `x` (sanitized) | The same line after removing all characters except `[-a-z0-9]` |

## Actions / Commands

| Action | Effect |
|---|---|
| Print prompt | Display `Would you like to play a game? ` without a trailing newline |
| Read input | Read one line into `x` |
| Sanitize input | `x = filter(x, [-a-z0-9])` |
| Lookup game | Test whether `<games-dir>/$x` exists as a regular file |
| Launch game | Clear screen and `exec <games-dir>/$x` |
| Print quote | Output the three-line movie quote and exit |

## Legal Rules & Invariants

1. The program performs exactly one prompt/response cycle.
2. Input is reduced to the character class `[-a-z0-9]` before any
   filesystem lookup.
3. The lookup path is `<games-dir>/$x`. In the original,
   `<games-dir>` is `/usr/games`.
4. If the file exists, the terminal is cleared before the game is
   executed.
5. If the file does not exist, the program prints the quote and exits
   with status `0`.
6. The launched game inherits the original standard input, output,
   and error streams.

## Difficulty Levels & Setup Configuration

There are no difficulty levels and no runtime configuration flags in
the original. A modern port might add:

- `--games-dir <path>` to override the lookup directory.
- `--no-clear` to skip the screen-clear before launching.
- `--quote` to print the quote without prompting.

## RNG Usage

None. `wargames` is fully deterministic.

## Termination Conditions

1. **Launch:** `exec` replaces the process with the requested game.
2. **Quote:** The script prints the quote and exits normally.

## Session Replay Semantics

Replaying with the same input always produces the same result, unless
the set of installed games changes between runs.

## See Also

- [`architecture.md`](./architecture.md) — how the original implements
  this spec.
- [`how-to-play.md`](./how-to-play.md) — user-facing examples.
- [`test-scenarios.md`](./test-scenarios.md) — manual verification
  scripts.
