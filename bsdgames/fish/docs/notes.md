# Working Notes — `fish`

---

## Source Notes

- `fish.c` is the only source file.
- `fish.instr` contains the instruction text displayed via a pager.
- `pathnames.h.in` defines `_PATH_INSTR` and `_PATH_MORE`.
- The program uses `fork()` + `execl()` to launch the pager.

## Porting Considerations

- The pager mechanism is Unix-specific; a port may inline the
  instructions or use a platform-native viewer.
- `pathnames.h` must be generated or replaced with runtime paths.
- The rare cheat (1/1024 peek) is part of the original's personality.

## Open Questions

- See [`port-ideas.md`](./port-ideas.md) §Open Questions.
