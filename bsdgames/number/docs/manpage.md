# `number` — Man Page Mirror + Annotation

> Mirror of the original `.6` man page with modern commentary.

---

## Name

`number` — convert numbers into English.

## Synopsis

```sh
number [-l] [# ...]
```

## Description

The `number` utility prints the English equivalent of each numeric argument. If no arguments are given, it reads numbers from standard input.

## Options

- `-l` — Produce output on a single line without sentence punctuation or `...` separators.

## Examples

```sh
$ number 123
one hundred twenty-three.

$ number -l 12345
twelve thousand three hundred forty-five
```

## Annotation

The original man page is minimal. Notable implementation details not covered:

- The 65-digit input limit (`MAXNUM`).
- Fractional handling and pluralisation (`pfract`).
- The `...` separator printed between multiple inputs in default mode.

These are documented in [`architecture.md`](./architecture.md) and [`spec.md`](./spec.md).

## See Also

- [`how-to-play.md`](./how-to-play.md)
- [`architecture.md`](./architecture.md)
- [`spec.md`](./spec.md)
