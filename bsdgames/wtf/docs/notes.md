# Working Notes — `wtf`

---

## Source Notes

- `wtf.in` is a POSIX `/bin/sh` script, not C.
- `wtf.6.in` is the man page source.
- `acronyms` contains 252 general/chat acronyms.
- `acronyms.comp` contains computer/technical acronyms.
- The install-time placeholders (`@wtf_acronymfile@`) are replaced by
  the BSD build system.

## Porting Considerations

- A direct port can stay a shell script, or become a tiny compiled
  utility for portability.
- The database is plain text, so no parsing library is required.
- The `whatis(1)` fallback is Unix-specific; a cross-platform port may
  omit it or replace it with a web search fallback.

## Open Questions

- See [`port-ideas.md`](./port-ideas.md) §Open Questions.
