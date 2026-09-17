# Working Notes — `quiz`

---

## Source Notes

- `quiz.c` — main program, file parsing, question loop.
- `quiz.h` — data structures and regexp engine interface.
- `rxp.c` — custom mini-regexp implementation.
- `datfiles/` — bundled question/answer data files.
- `pathnames.h.in` — default index directory placeholder.

## Porting Considerations

- `pathnames.h` must be generated or replaced.
- The custom regexp engine can be replaced by standard regex in a
  modern port, but the original syntax must be documented.
- Data files are plain text and easy to preserve.

## Open Questions

- See [`port-ideas.md`](./port-ideas.md) §Open Questions.
