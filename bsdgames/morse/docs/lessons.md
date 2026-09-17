# `morse` — Lessons from the Original Code

> **A textbook.** For each interesting technique in the original C
> source, a short lesson entry.
>
> Upstream tree: <https://github.com/vattam/BSDGames/tree/master/morse>

---

## Suggested Reading Order

1. **Lesson 1 — Lookup Tables for Encoding and Decoding** — the core data structure.

---

## Lesson 1 — Lookup Tables for Encoding and Decoding

**File:** `morse.c:52-111`  
**Functions:** global tables; `morse()`, `decode()`

**What it teaches:** Use small tables to map characters to codes and back.

**The excerpt:**

```c
static const char *const alph[] = {
    ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....",
    "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.",
    "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-",
    "-.--", "--..",
};
```

**Why it matters:** The Morse alphabet is a perfect lookup-table problem. Storing it as an array of strings keeps the code tiny and the mapping obvious. Decoding reuses the same table by comparing input tokens against each entry. This pattern appears in encoders, emulators, and any program that maps one symbol set to another.

## See Also

- [`architecture.md`](./architecture.md)
- [`../../../docs/glossary.md`](../../../docs/glossary.md)
- [`references.md`](./references.md)
