# Working Notes — `pom`

---

## Source Notes

- `pom.c` is a single C source file using `math.h`.
- `pom.6` is the man page.
- The algorithm is from *Practical Astronomy with Your Calculator*,
  Third Edition.
- Build requires linking with `-lm`.

## Porting Considerations

- Keep the constants and algorithm intact for accuracy.
- The date parser is idiosyncratic; a port may want to support ISO
  dates as an alternative.
- The TDT/UTC correction is small but noted as a known limitation.

## Open Questions

- See [`port-ideas.md`](./port-ideas.md) §Open Questions.
