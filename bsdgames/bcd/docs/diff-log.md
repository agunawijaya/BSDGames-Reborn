# `bcd` — Original → Port Diff Log

> Feature-by-feature comparison of the original BSD `bcd` and the modern port.

---

| Feature | Original | Port (planned) |
|---|---|---|
| Input | CLI args or stdin | Preserved |
| Output | ASCII punch card (48 cols) | Preserved + SVG/PNG options |
| Hole table | 256-entry u_short | Preserved or generated from spec |
| Uppercase | Yes | Preserved |
| Width | 48 columns | Optional 80-column mode |
| Web / API | None | Optional SVG generator |

## Notes

- The default ASCII card will match the original.
- Modern export formats and full-width mode are opt-in.

## See Also

- [`port-ideas.md`](./port-ideas.md) — brainstorm for future features.
- [`architecture.md`](./architecture.md) — original code analysis.
