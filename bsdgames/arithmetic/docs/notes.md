# Working Notes — `arithmetic`

---

## Source Notes

- `arithmetic.c` is a single C source file.
- `arithmetic.6` is the man page.
- The program uses `getopt` for `-o` and `-r`.
- The adaptive penalty system is implemented with singly-linked lists.

## Porting Considerations

- Keep the penalty decay behaviour; it is the game's defining feature.
- The division-with-remainder behaviour should be documented clearly.
- A web port can use the same state variables and RNG logic.

## Open Questions

- See [`port-ideas.md`](./port-ideas.md) §Open Questions.
