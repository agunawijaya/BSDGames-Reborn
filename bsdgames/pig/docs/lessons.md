# `pig` — Lessons from the Original Code

> **A textbook.** For each interesting technique in the original C
> source, a short lesson entry.
>
> Upstream tree: <https://github.com/vattam/BSDGames/tree/master/pig>

---

## Suggested Reading Order

1. **Lesson 1 — Streaming Word Translation** — the core filter pattern.

---

## Lesson 1 — Streaming Word Translation

**File:** `pig.c:80-92` and `pig.c:96-135`  
**Functions:** `main()`, `pigout()`

**What it teaches:** How to process a stream of text word-by-word without loading the whole input.

**The excerpt:**

```c
for (len = 0; (ch = getchar()) != EOF;) {
    if (isalpha(ch)) {
        if ((size_t)len >= sizeof(buf))
            errx(1, "ate too much!");
        buf[len++] = ch;
        continue;
    }
    if (len != 0) {
        pigout(buf, len);
        len = 0;
    }
    (void)putchar(ch);
}
```

**Why it matters:** The program accumulates alphabetic characters into a small buffer; any non-letter flushes the buffer and is printed verbatim. This is the Unix filter pattern in miniature: bounded memory, streaming I/O, stateful but simple. The same pattern appears in tokenisers, log parsers, and lexical analysers.

## See Also

- [`architecture.md`](./architecture.md)
- [`../../../docs/glossary.md`](../../../docs/glossary.md)
- [`references.md`](./references.md)
