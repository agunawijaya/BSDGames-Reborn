# `rain` — Original Architecture

> Deep analysis of the original C source. What did the programmer build, and how?

Cite upstream file:line references only (never local paths). Upstream tree: <https://github.com/vattam/BSDGames/tree/master/rain>.

---

## Files & Roles

| File | Purpose | Approx. LoC |
|---|---|---:|
| `rain.c` | Curses setup, signal handling, animation loop | 158 |
| `rain.6` | Man page | — |

## High-Level Flow

```mermaid
flowchart TB
    start[main] --> parse[-d delay]
    parse --> initscr[initscr]
    initscr --> signals[Catch HUP/INT/TERM]
    signals --> initPositions[Randomise 5 drop positions]
    initPositions --> loop[Infinite loop]
    loop --> sigCheck{sig_caught?}
    sigCheck -->|yes| endwin[endwin + exit]
    sigCheck -->|no| spawn[Spawn new drop at random x,y]
    spawn --> drawTrail[Draw . o O - | trail]
    drawTrail --> refresh[refresh]
    refresh --> sleep[usleep / tcdrain]
    sleep --> loop
```

## Game Loop Detail

The loop at `rain.c:113-151` runs forever:

1. Check `sig_caught`; if set, call `endwin()` and exit.
2. Pick a random `(x, y)` inside the bordered area.
3. Draw the new drop as `.`.
4. Overwrite older drops in the circular buffer with `o`, `O`, `-`, `|`, `/`, `\`, and finally spaces to erase.
5. `refresh()` the screen.
6. Sleep for the configured delay, or call `tcdrain()` if no delay.

## Data Structures

Two fixed-size circular buffers track the last 5 drops:

```c
// rain.c:77
int xpos[5], ypos[5];
```

The index `j` cycles through `0..4`, creating the fade effect.

## AI Logic

Not applicable — `rain` is a screensaver with no agents or opponents.

## Random Events

RNG source: `random()` from the C library. The program does not explicitly seed `srandom()`, so it inherits libc's default seed (usually `srandom(1)` unless the platform seeds differently).

| Trigger site | Distribution | Outcome |
|---|---|---|
| `rain.c:110-112` | `random() % cols + 2` | Initial drop positions |
| `rain.c:118-119` | `random() % cols + 2` | New drop position each frame |

## Difficulty Progression Logic

There is no difficulty system. The only runtime variable is the frame delay, which controls perceived speed.

## What Was Clever for Its Era

- **Circular buffer for trails:** Reusing `xpos[5]` and `ypos[5]` gives each drop a 5-stage life cycle with almost no memory.
- **Character animation:** The sequence `.` → `o` → `O` → splash → erase creates a surprisingly convincing droplet.
- **Signal cleanup:** Catches `HUP`, `INT`, and `TERM` to restore the terminal via `endwin()`.

## Constraints the Original Had To Handle

- **Memory:** Only two small arrays and a few scalars.
- **Terminal size:** Uses `COLS` and `LINES` from curses; draws inside a 2-character border.
- **CPU:** Designed for slow terminals; frame pacing relies on terminal drain or `usleep`.
- **Persistence:** None.

## What This Code Would Look Like Today

A modern port might use HTML5 Canvas, WebGL, or a CSS animation with actual raindrop sprites. A terminal port could use true colour and Unicode half-blocks for smoother rendering. See [`port-ideas.md`](./port-ideas.md) for more.

## See Also

- [`lessons.md`](./lessons.md) — beginner-friendly extraction of techniques.
- [`spec.md`](./spec.md) — implementation-independent specification.
- [`references.md`](./references.md) — sources & citations.
