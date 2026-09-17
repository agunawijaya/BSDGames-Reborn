# `primes` — Man Page Mirror + Annotation

> Mirror of the original `.6` man page with modern commentary.

---

## Name

`primes` — generate primes.

## Synopsis

```sh
primes [start [stop]]
```

## Description

The `primes` utility prints primes in ascending order, one per line, starting at or above `start` and continuing until, but not including, `stop`.

The `start` value must be at least 0 and not greater than `stop`. The `stop` value must not be greater than 4294967295. The default value of `stop` is 4294967295.

When invoked with no arguments, `start` is read from standard input. `stop` is taken to be 4294967295. The `start` value may be preceded by a single `+` and is terminated by a non-digit character. The input line must not be longer than 255 characters.

## Diagnostics

Out of range or invalid input results in an appropriate error message being written to standard error.

## Bugs

`primes` won't get you a world record.

## Annotation

The man page correctly describes the interface but does not explain the segmented sieve, wheel pattern, or prime table. Those implementation details are covered in [`architecture.md`](./architecture.md).

## See Also

- [`how-to-play.md`](./how-to-play.md)
- [`architecture.md`](./architecture.md)
- [`spec.md`](./spec.md)
