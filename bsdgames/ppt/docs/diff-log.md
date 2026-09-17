# `ppt` — Original → Port Diff Log

> Feature-by-feature comparison of the original BSD `ppt` and the modern port.

---

| Feature | Original | Port (planned) |
|---|---|---|
| Encode | Text → paper-tape rows | Preserved |
| Decode | `-d` flag | Preserved |
| Output | ASCII `\| o . \|` rows | Preserved + graphical options |
| Web / API | None | Optional encode/decode endpoint |
| Animation | None | Optional tape-reel animation |

## Notes

- The core encode/decode behaviour will be preserved exactly.
- Modern graphical and API features are opt-in.

## See Also

- [`port-ideas.md`](./port-ideas.md) — brainstorm for future features.
- [`architecture.md`](./architecture.md) — original code analysis.
