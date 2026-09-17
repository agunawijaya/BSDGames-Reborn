# `random` — Original Architecture

> Deep analysis of the original C source. What did the programmer build, and how?

Cite upstream file:line references only (never local paths). Upstream tree: <https://github.com/vattam/BSDGames/tree/master/random>.

---

## Files & Roles

| File | Purpose | Approx. LoC |
|---|---|---:|
| `random.c` | Argument parsing, RNG seeding, line filter / exit-code logic | 158 |
| `random.6` | Man page | — |

## High-Level Flow

```mermaid
flowchart TB
    start[main] --> parse[Parse -e, -r, denominator]
    parse --> mode{Mode?}
    mode -->|exit code| seed[Seed RNG]
    mode -->|line filter| seed
    seed --> e{-e flag?}
    e -->|yes| exitCode[Return denom * random / MAXRANDOM]
    e -->|no| select[Select first line?]
    select --> loop[For each char]
    loop --> print{selected?}
    print -->|yes| putchar[Output char]
    putchar --> newline{newline?}
    newline -->|yes| reselect[Reselect next line]
    reselect --> loop
```

## Game Loop Detail

The line-filter loop (`random.c:134-146`) reads one character at a time. A boolean `selected` decides whether the current line is being copied. On every newline, a new `selected` value is drawn.

## Data Structures

Only local scalar variables:

- `denom` — the user-supplied denominator.
- `random_exit` — flag for exit-code mode.
- `unbuffer_output` — flag for unbuffered stdout.
- `selected` — whether the current line is being output.

## AI Logic

Not applicable — `random` is a probabilistic filter, not a game.

## Random Events

RNG source: `random()` from the C library, seeded once with high-entropy time and PID.

| Trigger site | Distribution | Outcome |
|---|---|---|
| `main:115` | `gettimeofday()` + `getpid()` | Seed value |
| `main:119` | `denom * random() / MAXRANDOM` | Exit code `0..denom-1` |
| `main:134` | `denom * random() / MAXRANDOM == 0` | First line selected? |
| `main:144` | Same formula | Next line selected? |

### Consequence Flow

```mermaid
flowchart LR
    read[Read char] --> selected{selected?}
    selected -->|yes| out[Print char]
    selected -->|no| drop[Drop char]
    read --> newline{newline?}
    newline -->|yes| roll[Roll 0..MAXRANDOM]
    roll -->|value < MAXRANDOM/denom| sel[selected = true]
    roll -->|otherwise| unsel[selected = false]
```

## Difficulty Progression Logic

There is no difficulty system. The only runtime variable is `denom`, which controls selection probability.

## What Was Clever for Its Era

- **Single-pass streaming:** `random` never stores the input; it decides per character in one pass.
- **Character-level copying:** Even though selection is per-line, the program copies characters individually, avoiding any line buffer.
- **Dual-mode binary:** One tiny program serves two unrelated use cases (filter + exit code).

## Constraints the Original Had To Handle

- **Memory:** O(1) — no input buffering beyond libc.
- **Terminal size:** No screen manipulation; pure stdin/stdout.
- **CPU:** One random draw per line, negligible.
- **Persistence:** None.

## What This Code Would Look Like Today

A modern port might add reservoir sampling, weighted sampling, or a web API that returns random subsets. See [`port-ideas.md`](./port-ideas.md) for more.

## See Also

- [`lessons.md`](./lessons.md) — beginner-friendly extraction of techniques.
- [`spec.md`](./spec.md) — implementation-independent specification.
- [`references.md`](./references.md) — sources & citations.
