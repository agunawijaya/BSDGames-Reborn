# How to Play `banner`

> **Type a word, get a wall of `#`.**

---

## Controls / Commands

`banner` is a command-line utility.

```sh
banner [-w width] [message ...]
```

## Basic Usage

Print a single word:

```sh
$ banner HELLO
```

Print multiple words:

```sh
$ banner HELLO WORLD
```

Read from stdin:

```sh
$ echo "PARTY" | banner
```

Fit to an 80-column terminal:

```sh
$ banner -w 80 WELCOME
```

## Input Rules

- Message length is limited to `MAXMSG` (1024 characters).
- Several ASCII characters are not defined and will print blank space.
- `-w` sets the output width; default is 132.

## How to "Win"

There is no win condition. The fun is in the oversized output.

## Tips & Tricks

- **Pipe to a file:** `banner HAPPY BIRTHDAY > sign.txt` then print on wide paper.
- **Use for demos:** A `banner` slide is an easy way to make a terminal presentation pop.
- **Watch the width:** On narrow terminals, use `-w 80` or the letters will wrap messily.
- **Avoid unsupported chars:** `< > [ ] \ ^ _ { } | ~` will leave gaps.

## Scoring Mechanism

None.

## Easter Eggs

None documented.

## Difficulty Levels & Setup Configuration

There are no difficulty modes. The only runtime option is `-w`.

| Width | Effect |
|---|---|
| (none) | 132 columns, high quality |
| `-w 80` | Scrunched for standard terminals |
| `-w 40` | Very grainy, letters may run together |

## See Also

- [`spec.md`](./spec.md) — formal rules and invariants.
- [`architecture.md`](./architecture.md) — how the glyph data works.
- [`test-scenarios.md`](./test-scenarios.md) — manual test scripts.
