# `random` — Man Page Mirror + Annotation

> Mirror of the original `.6` man page with modern commentary.

---

## Name

`random` — random lines from a file or random numbers.

## Synopsis

```sh
random [-er] [denominator]
```

## Description

`random` reads lines from standard input and copies them to standard output with probability `1/denominator`. The default denominator is `2`.

## Options

- `-e` — Do not read or write anything. Exit with a random status between `0` and `denominator-1` inclusive.
- `-r` — Guarantee that output is unbuffered.

## Examples

```sh
$ cat words.txt | random 10
$ random -e 5 && echo success || echo failure
```

## Annotation

The man page is concise. Implementation details not explicitly documented:

- RNG seeding uses `gettimeofday` plus `getpid()`.
- Selection is Bernoulli per line, not a fixed-size sample.
- `MAXRANDOM` is defined as `2147483647`.

These are covered in [`architecture.md`](./architecture.md) and [`spec.md`](./spec.md).

## See Also

- [`how-to-play.md`](./how-to-play.md)
- [`architecture.md`](./architecture.md)
- [`spec.md`](./spec.md)
