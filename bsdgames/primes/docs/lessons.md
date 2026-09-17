# Lessons from `primes`

> Techniques a beginner can extract from the original source, with file:line references.

Upstream tree: <https://github.com/vattam/BSDGames/tree/master/primes>.

---

## 1. Segmented Sieving Keeps Memory Constant

Instead of allocating a sieve for the entire range, `primes` sieves one window at a time and reuses `table[]`.

- **Why it matters:** You can generate primes near 2^32 without allocating gigabytes of memory.
- **Reference:** `primes.c:280-332`.

## 2. Wheel Patterns Eliminate Small Factors Cheaply

The program copies a pre-computed pattern that marks multiples of 3, 5, 7, 11, 13 using `memcpy`.

```c
// primes.c:285-293
memcpy(table, &pattern[factor], pattern_size-factor);
for (fact_lim=pattern_size-factor; ... ) {
    memcpy(&table[fact_lim], pattern, pattern_size);
}
```

- **Why it matters:** A wheel removes many composites before the main sieve loop starts, saving CPU cycles.
- **Reference:** `primes.c:103-104`, `primes.c:284-293`.

## 3. Bootstrap with a Pre-Computed Table

For candidates ≤ 65537, the program prints directly from `prime[]`.

- **Why it matters:** Reusing a known-good table avoids re-sieving the same small numbers and provides reliable factors for larger sieves.
- **Reference:** `primes.c:95-96`, `primes.c:261-274`.

## 4. Validate Input Ranges Early

`main()` checks for negatives, parse errors, and `start > stop` before calling the sieve.

- **Why it matters:** Bad input reaches the core algorithm only after it has been sanitised.
- **Reference:** `primes.c:142-183`.

## 5. Know Your Algorithmic Limits

The source documents the expected prime count up to 10^7 as a sanity check.

- **Why it matters:** A documented invariant makes it easy to verify correctness after optimisation or porting.
- **Reference:** `primes.c:63`.

## See Also

- [`architecture.md`](./architecture.md) — full code analysis.
- [`references.md`](./references.md) — primary sources.
