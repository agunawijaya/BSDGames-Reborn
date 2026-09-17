# Working Notes — `dab`

---

## Source Notes

- Written in C++ with ncurses.
- Key files: `main.cc`, `board.cc/h`, `box.cc/h`, `algor.cc/h`,
  `human.cc/h`, `player.cc/h`, `gamescreen.cc/h`, `ttyscrn.cc/h`,
  `random.cc/h`.
- The `BOARD` class stores edges per box; `BOX` interprets the four
  directions.
- `ALGOR` is the only AI player; `HUMAN` reads keyboard input.

## Porting Considerations

- The ncurses dependency can be replaced by a GUI/web renderer behind
  the `GAMESCREEN` interface.
- The C++ class structure maps cleanly to most modern languages.
- The AI can be improved independently of the UI.

## Open Questions

- See [`port-ideas.md`](./port-ideas.md) §Open Questions.
