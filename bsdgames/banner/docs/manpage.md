# `banner` — Man Page Mirror + Annotation

> Mirror of the original `.6` man page with modern commentary.

---

## Name

`banner` — print large banner on printer.

## Synopsis

```sh
banner [-w width] [message ...]
```

## Description

`banner` prints a large, high quality banner on standard output. If the message is omitted, it prompts for and reads one line of standard input.

If `-w` is given, the output is scrunched down from a width of 132 to `width`, suitable for a narrow terminal.

The output should be printed on paper of the appropriate width, with no breaks between pages.

## Bugs

Several ASCII characters are not defined, notably `< > [ ] \ ^ _ { } | ~`. Also, the characters `"`, `'`, and `&` are funny looking (but in a useful way).

The `-w` option is implemented by skipping some rows and columns. The smaller it gets, the grainier the output. Sometimes it runs letters together.

## Author

Mark Horton.

## Annotation

The man page focuses on the printer use case. The implementation details of the glyph encoding are documented in [`architecture.md`](./architecture.md).

## See Also

- [`how-to-play.md`](./how-to-play.md)
- [`architecture.md`](./architecture.md)
- [`spec.md`](./spec.md)
