# Lessons from `random`

> Techniques a beginner can extract from the original source, with file:line references.

Upstream tree: <https://github.com/vattam/BSDGames/tree/master/random>.

---

## 1. Seed the RNG with High-Entropy Sources

The program seeds with microseconds, seconds, and PID to make repeated runs differ.

```c
// random.c:114-115
(void)gettimeofday(&tp, NULL);
srandom((u_int)(tp.tv_usec + tp.tv_sec + getpid()));
```

- **Why it matters:** Seeding only with `time(NULL)` can produce identical outputs if two processes start in the same second.
- **Reference:** `random.c:114-115`.

## 2. Stream Processing Uses O(1) Memory

`random` reads one character at a time and never stores the whole input.

- **Why it matters:** You can sample multi-gigabyte logs without running out of RAM.
- **Reference:** `random.c:135-146`.

## 3. Per-Line State with Per-Character Output

A single boolean `selected` tracks whether the current line is being copied.

- **Why it matters:** State machines can be tiny but powerful; here one boolean controls the entire filter.
- **Reference:** `random.c:134`, `random.c:136-137`, `random.c:144`.

## 4. One Binary, Multiple Modes

The `-e` flag turns the line filter into an exit-code generator without adding much code.

- **Why it matters:** Small orthogonal flags can dramatically extend a tool's usefulness.
- **Reference:** `random.c:82-84`, `random.c:118-119`.

## 5. Validate User-Supplied Scaling Factors

The denominator is checked for zero and parse errors before use.

- **Why it matters:** Division or scaling by invalid input is a common source of crashes or wrong results.
- **Reference:** `random.c:101-108`.

## See Also

- [`architecture.md`](./architecture.md) — full code analysis.
- [`references.md`](./references.md) — primary sources.
