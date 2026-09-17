# How to Play `rain`

> **There is no score — just rain.**

---

## Controls / Commands

`rain` is a curses screensaver. Run it from a terminal:

```sh
rain [-d delay]
```

## Basic Usage

Run with the recommended delay:

```sh
$ rain -d 120
```

Run with default delay (very fast on modern terminals):

```sh
$ rain
```

## How to Stop

Press `Ctrl-C` to send `SIGINT`. The program will restore the terminal and exit cleanly.

## Input Rules

- `-d delay` — delay between frames in milliseconds. Valid range is `1` to `999`.
- No other options or arguments.

## How to "Win"

There is no win condition. The goal is to enjoy the animation or verify that the screensaver runs correctly.

## Tips & Tricks

- **Use `-d 120` on fast terminals.** The default `0` was designed for 9600-baud terminals.
- **Resize the terminal** for different rain densities; drops spawn within `COLS-4` by `LINES-4`.
- **Run it in a small tmux pane** for a desktop-widget feel.
- **Combine with `cmatrix` or `worms`** for a retro terminal aesthetic.

## Scoring Mechanism

None.

## Easter Eggs

None documented.

## Difficulty Levels & Setup Configuration

There are no difficulty levels. The only configuration is the frame delay.

| Delay | Visual effect |
|---|---|
| `0` | Maximum speed (historical default) |
| `120` | Comfortable rain speed |
| `500` | Slow, relaxing drops |

## See Also

- [`spec.md`](./spec.md) — formal rules and invariants.
- [`architecture.md`](./architecture.md) — how the animation works.
- [`test-scenarios.md`](./test-scenarios.md) — manual test scripts.
