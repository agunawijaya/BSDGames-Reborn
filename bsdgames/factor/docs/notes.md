# Working Notes — `factor`

- Prime table generated at build time from `primes.h`; limit `65537` chosen so `65537^2 > 2^32-1`.
- OpenSSL build adds Pollard p−1 fallback; non-OpenSSL build is pure trial division on native `long`.
- Negative input and `0` have surprising behaviour worth documenting in `about.md` and `spec.md`.
- No randomness, no state, no persistence.
