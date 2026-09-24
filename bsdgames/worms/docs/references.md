# References — `worms`

> Sources and citations used in this game's documentation.

---

## Primary Sources

- **Original source tree:** <https://github.com/vattam/BSDGames/tree/master/worms>
  - `worms.c` (NetBSD revision 1.16, 2004/09/12)
  - `worms.6` (BSD man page)

## Historical Sources

- Eric P. Scott, original author (Caltech High Energy Physics).
- DEC-2136 `worms` program, acknowledged in the man page.
- 3BSD / 4.3BSD release notes for `worms(6)`.

## Technical Sources

- `curses` / `ncurses` terminal manipulation library.
- POSIX `random()`, `malloc()`, and signal handling.
- glibc `stdlib/random_r.c`: the TYPE_3 additive-feedback generator
  behind `random()`, and `srandom_r()`’s behaviour when a program never
  seeds (seed 1). <https://sourceware.org/git/?p=glibc.git;a=blob;f=stdlib/random_r.c>
- `tmux capture-pane`, used to capture the original program’s screens
  for the `fancy-web` port’s golden tests.

## Port Verification

- The `fancy-web` port reproduces screens captured from a binary built
  from `worms.c` cell for cell; method and caveats in
  [`../ports/fancy-web/docs/notes.md`](../ports/fancy-web/docs/notes.md).

## See Also

- [`../../../docs/heritage.md`](../../../docs/heritage.md) — project-wide historical context.
- [`../../../ATTRIBUTION.md`](../../../ATTRIBUTION.md) — aggregated credits.
