# `number` — Original → Port Diff Log

> Feature-by-feature comparison of the original BSD `number` and the modern port.

---

| Feature | Original | Port (planned) |
|---|---|---|
| Input | CLI arguments or stdin | CLI, stdin, web form, API |
| Output | English text | English text + JSON + audio |
| Max digits | 65 | 65 by default, extendable in web/API mode |
| Fractions | Supported with ordinal suffixes | Preserved |
| Negative numbers | "minus" prefix | Preserved |
| Line mode | `-l` flag | Preserved |
| Localisation | English only | Multiple languages (future) |
| Currency mode | None | Optional cheque/currency mode |

## Notes

- The core conversion algorithm and output phrasing will be preserved.
- Modern additions (JSON, audio, localisation) are optional and off by default.

## See Also

- [`port-ideas.md`](./port-ideas.md) — brainstorm for future features.
- [`architecture.md`](./architecture.md) — original code analysis.
