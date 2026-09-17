# References — `factor`

> Sources and citations used in this game's documentation.

---

## Primary Sources

- **Original source tree:** <https://github.com/vattam/BSDGames/tree/master/factor>
  - `factor.c` (NetBSD revision 1.15, 2004/02/08)
  - `factor.6` (BSD man page)
  - `primes.h` (generated prime table)

## Historical Sources

- Landon Curt Noll, original author. Contact line in source header: `chongo@toad.com`.
- 4.3BSD-Reno release notes and man pages for `factor(6)`.

## Technical Sources

- Sieve of Eratosthenes — standard algorithm for generating prime tables.
- Pollard p−1 factorisation — fallback algorithm in the OpenSSL build (`factor.c:284-336`).

## See Also

- [`../../../docs/heritage.md`](../../../docs/heritage.md) — project-wide historical context.
- [`../../../ATTRIBUTION.md`](../../../ATTRIBUTION.md) — aggregated credits.
