# Working Notes — `countmail`

---

## Source Notes

- `countmail` is a POSIX `/bin/sh` script.
- `countmail.6` is the man page.
- The script uses `from(1)` and `wc(1)` rather than the commented-out
  pure-shell read loop.
- The number-to-words vocabulary stops at `SEPTILLION`.

## Porting Considerations

- A direct port can remain a shell script or become a small compiled
  utility.
- Modern systems may not have `from(1)` installed; the port should
  support a fallback or mock mode.
- The BSD copyright notice must be preserved.

## Open Questions

- See [`port-ideas.md`](./port-ideas.md) §Open Questions.
