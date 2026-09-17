# How to Play `ppt`

> **Turn bytes into tape, or tape back into bytes.**

---

## Controls / Commands

`ppt` is a command-line utility.

```sh
ppt [-d] [string ...]
```

## Basic Usage

Encode text from arguments:

```sh
$ ppt HI
___________
|  o    o.|
|  o   o .|
|  o  o  .|
|  o o   .|
|__o_____.|
```

Encode text from stdin:

```sh
$ echo "HELLO" | ppt
```

Decode ppt output back to text:

```sh
$ echo "HELLO" | ppt | ppt -d
HELLO
```

## Input Rules

- In encode mode, input is read from arguments or stdin.
- In decode mode (`-d`), input must be ppt-formatted rows from stdin; arguments are not allowed.
- Each encoded row is 10 characters wide: `|`, 8 bit positions, `.` feed hole, `|`.

## How to "Win"

There is no win condition. The satisfying moment is a perfect round-trip: `ppt | ppt -d` returns the original text.

## Tips & Tricks

- **Round-trip test:** `printf 'TEST\n' | ppt | ppt -d` should print `TEST`.
- **Visualise binary:** `ppt A` shows which bits are set in ASCII `A`.
- **Combine with `bcd`:** `bcd` for cards, `ppt` for tape, `morse` for code — a full retro toolkit.

## Scoring Mechanism

None.

## Easter Eggs

None documented.

## Difficulty Levels & Setup Configuration

There are no difficulty levels. The only flag is `-d` for decode mode.

## See Also

- [`spec.md`](./spec.md) — formal rules and invariants.
- [`architecture.md`](./architecture.md) — how encode/decode works.
- [`test-scenarios.md`](./test-scenarios.md) — manual test scripts.
