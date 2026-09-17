# Lessons from `bcd`

> Techniques a beginner can extract from the original source, with file:line references.

Upstream tree: <https://github.com/vattam/BSDGames/tree/master/bcd>.

---

## 1. Bit Masks Encode Visual Patterns Compactly

Each punch pattern is a 12-bit value where a set bit means "hole punched."

```c
// bcd.c:125
#define bit(w,i)    ((w)&(1<<(i)))
```

- **Why it matters:** A small integer can represent a complex 2-D pattern.
- **Reference:** `bcd.c:87-120`, `bcd.c:204-211`.

## 2. Lookup Tables Replace Runtime Computation

The program never computes a hole pattern; it just looks it up in `holes[256]`.

- **Why it matters:** Pre-computed tables turn expensive rules into O(1) access.
- **Reference:** `bcd.c:87-120`, `bcd.c:189-192`, `bcd.c:207`.

## 3. Normalise Input Early

`printcard()` strips newlines, truncates to 48 chars, and uppercases letters before rendering.

- **Why it matters:** The renderer can assume clean, bounded input.
- **Reference:** `bcd.c:164-174`.

## 4. Document Data Bugs and Fixes

The source header explains the `Q`/`R` table error and its correction.

- **Why it matters:** Future maintainers understand why the table looks the way it does.
- **Reference:** `bcd.c:67-76`.

## 5. Keep Rendering Separated from I/O

`main()` handles where input comes from; `printcard()` only knows how to draw a card.

- **Why it matters:** Separation of concerns makes the code easier to test and reuse.
- **Reference:** `bcd.c:130-152`, `bcd.c:156-223`.

## See Also

- [`architecture.md`](./architecture.md) — full code analysis.
- [`references.md`](./references.md) — primary sources.
