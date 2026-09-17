# Fortune — Port Modernization Ideas

Brainstorming architectural enhancements, database format evolutions, and interactive features
for the modern spiritual successor of BSD Fortune.

---

## 1. Storage & Data Architecture Modernization

### UTF-8 & Multi-Byte Safety
The 1979 implementation assumed single-byte ASCII. A modern port must treat all text as valid UTF-8:
- Multi-byte characters must not be split across line wraps.
- Delimiter `%` matching must ensure the character is an ASCII `%` at byte boundary 0, avoiding
  clashes with multi-byte Asian or emoji character encodings.

### Pluggable Backend Adapters
While preserving 100% backward compatibility with classic `.dat` files, the modern engine should
support pluggable storage backends:
1. **Classic Strfile (`.dat`):** The authentic Ken Arnold binary index format.
2. **SQLite Backend (with FTS5):** Enables lightning-fast full-text search, author tagging,
   rating systems, and zero-configuration single-file distribution.
3. **JSON / TOML Collections:** For modern developer convenience and git-diffable quote contributions.

---

## 2. Interactive Terminal TUI & Fuzzy Search

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │  F O R T U N E   E X P L O R E R          Database: 14,280 quotes      │
 ├────────────────────────────────────────────────────────────────────────┤
 │  Search > Dijkstra                                            [FTS5]   │
 ├────────────────────────────────────────────────────────────────────────┤
 │  [#104] Simplicity is prerequisite for reliability.                    │
 │  [#289] If debugging is the process of removing bugs, then programming │
 │  [#412] The question of whether machines can think is about as relevant│
 │  [#890] Elegance is not a dispensable luxury, but a factor that decide │
 ├────────────────────────────────────────────────────────────────────────┤
 │  PREVIEW:                                                              │
 │                                                                        │
 │  "Simplicity is prerequisite for reliability."                         │
 │                                                                        │
 │          -- Edsger W. Dijkstra (1970)                                  │
 │                                                                        │
 │  [Enter] Copy to Clipboard   [r] Randomize   [c] Cowsay   [q] Quit     │
 └────────────────────────────────────────────────────────────────────────┘
```

- **Built-in Fuzzy Search:** An interactive terminal mode (invoked via `fortune -i` or `fortune browse`)
  allowing users to filter the entire quote database live using fuzzy matching, instant preview,
  and clipboard copying.
- **Native ASCII Art Integration (`--cow`):** A built-in cow/character speech bubble generator
  eliminates the need for external `cowsay` dependencies while preserving the classic aesthetic.

---

## 3. Web & Cloud Microservice Architecture

- **WebAssembly (Wasm) Engine:** Compile the core `fortune` engine and quotation database into a
  single compact Wasm module for instantaneous client-side fortune cookies on personal websites.
- **REST / JSON API:** Standalone server mode:
  ```http
  GET /v1/fortune?category=computing&max_length=160
  ```
  Returns structured JSON with quotation text, author, tags, and category.

---

## 4. What NOT to Change (Core Identity)

- **The Standard CLI Flags:** `-a`, `-o`, `-s`, `-l`, `-m pattern`, `-f` must continue to behave
  identically to 4.3BSD.
- **The Delimiter Convention:** A single `%` on a line by itself remains the universal delimiter.
- **Weighted Probability Syntax:** `40% fileA 60% fileB` must remain supported.
- **Zero-Latency Retrieval:** Must maintain sub-millisecond retrieval regardless of whether reading
  from binary `.dat` or SQLite.

---

## 5. Open Questions for Discussion

1. *Should the standard database be compiled directly into the binary via compile-time embedding
   (for a self-contained zero-dependency executable), with an option to read external folders?*
2. *How should modern content warnings be represented alongside historical ROT13 obfuscation?*
