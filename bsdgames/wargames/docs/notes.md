# Working Notes — `wargames`

---

## Source Notes

- `wargames` is a single POSIX shell script, not a compiled C program.
- The script's only dependency outside the shell is `tput` for
  clearing the screen.
- The man page credits Joey Hess (1998); the script itself credits
  Berkeley (1993).

## Porting Considerations

- Because the program is so small, the documentation phase is mostly
  about preserving context and cultural meaning.
- Any port should keep the prompt text and the movie quote verbatim
  unless an explicit ADR says otherwise.
- The hard-coded `/usr/games` path is the main thing a modern port
  would make configurable.

## Open Questions

- Should the port remain a launcher/Easter egg, or should it become
  an actual micro-game inspired by the movie?
- Should the port support a configurable games directory?
