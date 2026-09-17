# Lessons from `factor`

> Techniques a beginner can extract from the original source, with file:line references.

Upstream tree: <https://github.com/vattam/BSDGames/tree/master/factor>.

---

## 1. Build-Time Sieving Beats Runtime Sieving

The prime table in `primes.h` is generated once at build time, not at runtime. This keeps the executable fast and self-contained.

- **Why it matters:** For a fixed problem domain (here, 32-bit integers), pre-computing data is often cheaper than computing it on demand.
- **Reference:** `factor.c:96-98` explains why the table limit `65537` is sufficient.

## 2. Abstract Data Types with Compile-Time Backends

The `BIGNUM`/`BN_ULONG` macros let the same code use either OpenSSL bignums or native `long` values.

```c
// factor.c:76-89
#ifdef HAVE_OPENSSL
#include <openssl/bn.h>
#else
typedef long    BIGNUM;
typedef u_long  BN_ULONG;
// ...
#endif
```

- **Why it matters:** Conditional compilation lets one codebase serve both high-capability and minimal-dependency environments.
- **Reference:** `factor.c:76-89`, `factor.c:338-358` (fallback implementations).

## 3. Graceful Degradation When Algorithms Differ

Without OpenSSL, the program cannot run Pollard p−1, so it simply prints any remainder that survives trial division. With OpenSSL, it attacks that remainder recursively.

- **Why it matters:** Not every deployment has optional libraries. Degrading cleanly is better than crashing or refusing to run.
- **Reference:** `factor.c:227-244`.

## 4. Reject Bad Input Early and Clearly

The program checks for negative signs and invalid numeric formats before attempting factorisation.

```c
// factor.c:171-174
if (*p == '-')
    errx(1, "negative numbers aren't permitted.");
if (BN_dec2bn(&val, buf) == 0)
    errx(1, "%s: illegal numeric format.", argv[0]);
```

- **Why it matters:** Early validation prevents confusing downstream errors and gives the user actionable messages.
- **Reference:** `factor.c:171-174`, `factor.c:180-184`.

## 5. Flush stdout to Show Progress

`pr_fact()` calls `fflush(stdout)` after each factor is printed.

- **Why it matters:** On buffered terminals, a long-running factorisation could appear frozen. Flushing keeps the user informed.
- **Reference:** `factor.c:254`.

## See Also

- [`architecture.md`](./architecture.md) — full code analysis.
- [`references.md`](./references.md) — primary sources.
