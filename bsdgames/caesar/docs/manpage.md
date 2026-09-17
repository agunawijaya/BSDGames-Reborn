# `caesar` — Man Page Mirror

> Mirrored and cleaned from the original BSD man page `caesar.6`,
> preserving its copyright and attribution.
>
> Source: <https://github.com/vattam/BSDGames/tree/master/caesar/caesar.6>

---

## Copyright

```
Copyright (c) 1989, 1991, 1993
	The Regents of the University of California.  All rights reserved.

@(#)caesar.6	8.2 (Berkeley) 11/16/93
```

## Name

`caesar`, `rot13` — decrypt Caesar ciphers

## Synopsis

```
caesar [rotation]
```

## Description

The `caesar` utility attempts to decrypt Caesar ciphers using English letter frequency statistics. It reads from standard input and writes to standard output.

The optional numerical argument `rotation` may be used to specify a specific rotation value.

## Letter Frequencies

The frequency of English letters, from most common to least, is:

```
ETAONRISHDLFCMUGPYWBVKXJQZ
```

Their approximate frequencies as percentages are:

| Letter | % | Letter | % | Letter | % | Letter | % |
|---:|---:|---:|---:|---:|---:|---:|---:|
| E | 13 | T | 10.5 | A | 8.1 | O | 7.9 |
| N | 7.1 | R | 6.8 | I | 6.3 | S | 6.1 |
| H | 5.2 | D | 3.8 | L | 3.4 | F | 2.9 |
| C | 2.7 | M | 2.5 | U | 2.4 | G | 2.0 |
| P | 1.9 | Y | 1.9 | W | 1.5 | B | 1.4 |
| V | 0.9 | K | 0.4 | X | 0.15 | J | 0.13 |
| Q | 0.11 | Z | 0.07 | | | | |

## Notes

Rotated postings to USENET and some databases used by `fortune(6)` are rotated by 13 characters.

## Authors

- **Stan King, John Eldridge** — based on an algorithm suggested by **Bob Morris**.
- Derived from software contributed to Berkeley by **Rick Adams**.

## Historical Notes

This utility is a small but practical demonstration of frequency analysis, one of the oldest techniques in cryptography. The inclusion of `rot13` as a common case reflects the USENET era, when rotating text by 13 characters was a widely used (and easily reversed) obfuscation.
