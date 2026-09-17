# `morse` — Man Page Mirror

> The original BSDGames `morse` source does not include a man page file.
> This mirror is reconstructed from the source code behavior and the
> NetBSD `morse.6` man page.
>
> Source: <https://github.com/vattam/BSDGames/tree/master/morse>
> NetBSD reference: <https://man.netbsd.org/morse.6>

---

## Name

`morse` — translate text to and from Morse code

## Synopsis

```
morse [-ds] [string ...]
```

## Description

The `morse` utility translates text to or from International Morse code.

By default, it encodes text into Morse. With `-d`, it decodes Morse back into text. With `-s`, it prints dots and dashes literally (`dit`/`daw` audio notation) instead of `.` / `-` characters.

## Options

| Flag | Meaning |
|---|---|
| `-d` | Decode Morse input into text. |
| `-s` | Use spoken-style output (`dit` / `daw`) instead of dots and dashes. |

## Supported Characters

- Letters A–Z
- Digits 0–9
- Punctuation: `. , : ? ' - / ( ) " = +`

## Authors

The Regents of the University of California.

## Historical Notes

This utility reflects the era when Morse code was still part of the technical culture of Unix users (many of whom were amateur radio operators). The code is essentially a lookup table with a small state machine for decoding.
