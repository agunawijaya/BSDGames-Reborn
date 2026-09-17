# `bcd` — Man Page Mirror + Annotation

> Mirror of the relevant section of the original `.6` man page with modern commentary.

---

## Name

`bcd` — reformat input as punch cards.

## Synopsis

```sh
bcd [string ...]
```

## Description

`bcd` reads the given input and reformats it in the form of punched cards. Acceptable input is command-line arguments or standard input.

## Standards

The original man page references:

- ISO 1681:1973 — Unpunched paper cards.
- ISO 1682:1973 — 80 columns punched paper cards.

## Annotation

The original man page is shared with `ppt` and `morse`. It documents the command synopsis but not the 12-bit hole encoding or the 48-column truncation. Those details are covered in [`architecture.md`](./architecture.md).

## See Also

- [`how-to-play.md`](./how-to-play.md)
- [`architecture.md`](./architecture.md)
- [`spec.md`](./spec.md)
