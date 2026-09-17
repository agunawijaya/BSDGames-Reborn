# How to Play `worms`

> **There is no score — just worms.**

---

## Controls / Commands

`worms` is a curses screensaver. Run it from a terminal:

```sh
worms [-ft] [-d delay] [-l length] [-n number]
```

## Basic Usage

Run with defaults:

```sh
$ worms
```

Run with 5 worms of length 32 and a 50 ms delay:

```sh
$ worms -n 5 -l 32 -d 50
```

Fill the screen with "WORM" first:

```sh
$ worms -f
```

Leave trails behind each worm:

```sh
$ worms -t
```

## How to Stop

Press `Ctrl-C` to send `SIGINT`. The program restores the terminal and exits.

## Input Rules

- `-d delay` — frame delay in milliseconds (`1`–`1000`).
- `-l length` — worm length (`2`–`1024`), default `16`.
- `-n number` — number of worms (`>=1`), default `3`.
- `-f` — fill screen with "WORM" before starting.
- `-t` — leave a trail of `.` instead of erasing.

## How to "Win"

There is no win condition. Enjoy the animation or verify it renders correctly.

## Tips & Tricks

- **Bigger terminals look better.** More screen space lets worms wander freely.
- **Use `-t` for spaghetti art.** Trails create tangled, organic patterns.
- **Use `-f` to watch the screen get eaten.** Worms erase the "WORM" text as they crawl.
- **Combine flags:** `worms -f -t -d 100` is a relaxing retro scene.

## Scoring Mechanism

None.

## Easter Eggs

- The `-f` flag uses the ASCII-art "WORMS" header from the source file as the background texture.

## Difficulty Levels & Setup Configuration

There are no difficulty levels. Configuration is entirely through flags.

| Flag | Default | Range | Effect |
|---|---|---|---|
| `-d` | `0` | `1–1000` ms | Frame delay |
| `-l` | `16` | `2–1024` | Worm length |
| `-n` | `3` | `>=1` | Number of worms |
| `-f` | off | — | Fill screen with "WORM" |
| `-t` | off | — | Leave `.` trail |

## See Also

- [`spec.md`](./spec.md) — formal rules and invariants.
- [`architecture.md`](./architecture.md) — how the animation works.
- [`test-scenarios.md`](./test-scenarios.md) — manual test scripts.
