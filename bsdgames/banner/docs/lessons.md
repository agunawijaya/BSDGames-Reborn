# Lessons from `banner`

> Techniques a beginner can extract from the original source, with file:line references.

Upstream tree: <https://github.com/vattam/BSDGames/tree/master/banner>.

---

## 1. Embed Assets as Structured Data

The entire glyph atlas lives in `data_table[]`, indexed by `asc_ptr[]`.

- **Why it matters:** Self-contained assets make the program portable and single-file.
- **Reference:** `banner.c:63-80`, `banner.c:90-1000+`.

## 2. Domain-Specific Encoding Saves Space

The glyph commands use only a few byte values to represent runs, repeats, and end-of-glyph markers.

```c
// banner.c:82-89
/* 128+n -> print current line n times.
 * 64+n  -> this is last byte of char.
 * else, put m chars at position n ...
 */
```

- **Why it matters:** A custom micro-format can be far smaller than a raw bitmap.
- **Reference:** `banner.c:82-89`.

## 3. Separate Glyph Decoding from Output Scaling

The program first renders at the native 132-column width, then optionally skips rows/columns for `-w`.

- **Why it matters:** Decoupling rendering from display scaling keeps the core algorithm simple.
- **Reference:** `banner.c:1026`, `banner.c:1125-1160`.

## 4. Validate Input Length

`MAXMSG` limits the message to 1024 characters.

- **Why it matters:** A hard limit prevents accidental huge output from runaway input.
- **Reference:** `banner.c:57`, `banner.c:1023`.

## 5. Document Known Limitations Honestly

The man page lists unsupported characters and `-w` artifacts.

- **Why it matters:** Users know what to expect and can avoid broken output.
- **Reference:** `banner.6:55-64`.

## See Also

- [`architecture.md`](./architecture.md) — full code analysis.
- [`references.md`](./references.md) — primary sources.
