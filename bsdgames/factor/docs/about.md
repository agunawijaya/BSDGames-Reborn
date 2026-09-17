# About `factor`

> **The UNIX command-line answer to "what two numbers multiply to this?"**

---

## What Is `factor`?

`factor` is a small BSD utility that takes one or more integers and prints their prime factorisation. Give it `60` and it replies `60: 2 2 3 5`. Give it a large semiprime and it patiently grinds through trial division, stopping only when every prime factor has been found. It is not a game in the traditional sense, but it shares the BSD tradition of turning a tiny mathematical task into a crisp, satisfying command-line interaction.

## Screenshots

*Screenshots captured via [`docs/scripts/capture-screenshots.sh`](../../../docs/scripts/capture-screenshots.sh).*

![A small composite number](../media/01-command.png)
*Factoring a modest integer — the output is immediate and readable.*

![A larger number with repeated factors](../media/02-example.png)
*Repeated prime factors are printed each time they divide the input.*

![A prime near the 32-bit limit](../media/03-large.png)
*A large prime is recognised once trial division exhausts the prime table.*

## Authors & Publisher

- **Author(s):** Landon Curt Noll (`chongo@toad.com`), then at Sun/Tolsoft.
- **Publisher / distributor:** University of California, Berkeley; later NetBSD.
- **Release year:** 1989 (shipped in 4.3BSD-Reno).
- **Language:** C.

## The Era

`factor` arrived in the late 1980s, when workstations had 32-bit CPUs and factoring large numbers was still a respectable recreational programming challenge. The program targets the command line and standard I/O, so it works equally well in a pipeline or an interactive shell. Its compact size and lack of dependencies (in the non-OpenSSL build) made it a natural fit for the BSDGames collection.

## Why It's Interesting

- **Tiny but useful:** A complete prime-factor tool in under 400 lines of C.
- **Historical dual mode:** The same source compiles with or without OpenSSL, switching from pure trial division to Pollard p−1 for oversized inputs.
- **Pedagogical gem:** It demonstrates prime sieving, bignum abstraction macros, and graceful degradation when a factor exceeds the built-in prime table.
- **Real math cred:** Landon Curt Noll is a noted prime-number enthusiast; his signature in the source even advertises a then-record Mersenne-like prime.

## Difficulty & Progression

There is no explicit difficulty or progression. The "challenge" is entirely determined by the input number: small composites finish instantly, while large primes require the program to exhaust the entire prime table. In the OpenSSL build, Pollard p−1 adds a second phase for numbers that survive trial division.

## Making-Of / Anecdotes

The source header contains Noll's whimsical signature: `chongo <for a good prime call: 391581 * 2^216193 - 1> /\oo/\`, a nod to the prime-hunting community of the era. The program also encodes a deliberate rejection of negative numbers, even though mathematically `(-n)` could be factored as `-1 × n`.

## Cultural Impact

`factor` is the ancestor of countless online prime-factor calculators and a staple of introductory number-theory programming exercises. Modern descendants include browser-based factorisation toys, cryptographic key-size demonstrators, and educational tools that visualise the Sieve of Eratosthenes.

## Known Bugs (Historical)

- **Zero handling:** `pr_fact()` calls `exit(0)` on input `0` rather than printing `0: 0` or treating it as an error. This is historical practice but surprising.
- **OpenSSL build required for large composites:** Without OpenSSL, any remainder larger than the square of the largest table prime is printed as-is, even if it is composite.
- **Duplicate macros:** The non-OpenSSL compatibility layer duplicates `BN_new`, `BN_is_zero`, and `BN_is_one` definitions.

## See Also

- [`how-to-play.md`](./how-to-play.md) — for actually using the tool.
- [`architecture.md`](./architecture.md) — for the code side.
- [`lineage.md`](./lineage.md) — for descendants.
- [`references.md`](./references.md) — for source citations.
