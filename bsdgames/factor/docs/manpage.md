# `factor` — Man Page Mirror + Annotation

> Mirror of the original `.6` man page with modern commentary.

---

## Name

`factor` — factor a number into primes.

## Synopsis

```sh
factor [value ...]
```

## Description

The `factor` utility factors each positive integer argument into its prime factors. If no arguments are provided, `factor` reads numbers from standard input.

## Output Format

Each line of output has the form:

```
number: factor1 factor1 factor2 factor3 ...
```

Factors are printed in ascending order, with repetition to indicate multiplicity.

## Options

The original `factor` does not define any command-line options. The only build-time option is `HAVE_OPENSSL`, which enables Pollard p−1 factorisation for large remainders.

## Errors

- `negative numbers aren't permitted.` — input began with `-`.
- `<value>: illegal numeric format.` — input could not be parsed as a decimal integer.

## Annotation

The man page is short because the tool is simple. Notable omissions from the man page:

- The special handling of `0` (silent exit) is not documented.
- The OpenSSL build's Pollard p−1 path is not mentioned.
- The prime table limit (`65537`) is not explained.

These gaps are filled in [`architecture.md`](./architecture.md) and [`spec.md`](./spec.md).

## See Also

- [`how-to-play.md`](./how-to-play.md)
- [`architecture.md`](./architecture.md)
- [`spec.md`](./spec.md)
