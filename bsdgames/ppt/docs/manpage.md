# `ppt` — Man Page Mirror + Annotation

> Mirror of the relevant section of the shared `.6` man page with modern commentary.

---

## Name

`ppt` — reformat input as paper tape.

## Synopsis

```sh
ppt [-d] [string ...]
```

## Description

`ppt` reads the given input and reformats it in the form of paper tape. Acceptable input is command-line arguments or standard input.

The `-d` option decodes `ppt` output back into the original text.

## Standards

The original man page references ECMA-10 (ECMA Standard for Data Interchange on Punched Tape).

## Annotation

The man page is shared with `bcd` and `morse`. It documents the synopsis but not the bit layout or feed-hole position. Those details are covered in [`architecture.md`](./architecture.md).

## See Also

- [`how-to-play.md`](./how-to-play.md)
- [`architecture.md`](./architecture.md)
- [`spec.md`](./spec.md)
