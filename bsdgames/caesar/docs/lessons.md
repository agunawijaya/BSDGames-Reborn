# `caesar` — Lessons from the Original Code

> **A textbook.** For each interesting technique in the original C
> source, a short lesson entry.
>
> Upstream tree: <https://github.com/vattam/BSDGames/tree/master/caesar>

---

## Suggested Reading Order

1. **Lesson 1 — Frequency Analysis as a Dot Product** — the core technique.

---

## Lesson 1 — Frequency Analysis as a Dot Product

**File:** `caesar.c:103-135`  
**Function:** `main()`

**What it teaches:** How to recover a Caesar-cipher rotation by comparing observed letter frequencies against a known distribution.

**The excerpt:**

```c
for (i = 0; i < 26; ++i)
    stdf[i] = log(stdf[i]) + log(26.0 / 100.0);

for (try = winner = 0; try < 26; ++try) {
    dot = 0;
    for (i = 0; i < 26; i++)
        dot += obs[i] * stdf[(i + try) % 26];
    if (try == 0)
        winnerdot = dot;
    if (dot > winnerdot) {
        winner = try;
        winnerdot = dot;
    }
}
```

**Why it matters:** Instead of trying to read the ciphertext, the program treats decryption as a statistical matching problem. It counts letters, shifts the known frequency table by every possible rotation, and picks the shift with the best correlation. The same idea powers spam filters, language detection, and modern cryptanalysis.

## See Also

- [`architecture.md`](./architecture.md)
- [`../../../docs/glossary.md`](../../../docs/glossary.md)
- [`references.md`](./references.md)
