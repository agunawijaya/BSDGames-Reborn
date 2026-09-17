# `banner` — Original → Port Diff Log

> Feature-by-feature comparison of the original BSD `banner` and the modern port.

---

| Feature | Original | Port (planned) |
|---|---|---|
| Input | CLI args or stdin | CLI, stdin, web form |
| Output | ASCII `#` art at 132 cols | Preserved + Unicode/PNG options |
| Width | `-w` scrunching | Preserved + pixel-perfect scaling |
| Glyph set | Original 9 KB table | Preserved + FIGlet fonts |
| Missing chars | `< > [ ] \ ^ _ { } \| ~` | May be filled in modern fonts |
| Export | Plain text | Plain text + PNG/SVG |

## Notes

- The default ASCII output will match the original.
- Modern font and export options are opt-in.

## See Also

- [`port-ideas.md`](./port-ideas.md) — brainstorm for future features.
- [`architecture.md`](./architecture.md) — original code analysis.
