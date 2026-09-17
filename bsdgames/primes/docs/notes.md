# Working Notes — `primes`

- Uses Sieve of Eratosthenes in segmented windows.
- Wheel pattern for 3, 5, 7, 11, 13 copied with memcpy.
- Pre-computed prime table up to 65537 from pr_tbl.c.
- Default stop is 2^32-1 = 4294967295.
- Negative inputs rejected.
- Validation check: 664579 primes between 0 and 10^7.
