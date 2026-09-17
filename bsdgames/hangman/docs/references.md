# `hangman` — References

> Sources and citations used in this game's documentation.

---

## Primary Sources

- **Original BSDGames source repository**  
  <https://github.com/vattam/BSDGames/tree/master/hangman>  
  The upstream C source for `main.c`, `setup.c`, `playgame.c`, `getword.c`, `getguess.c`, `prdata.c`, `prman.c`, `prword.c`, `endgame.c`, `extern.c`, `hangman.h`, and the man page `hangman.6.in`.

- **NetBSD hangman source**  
  <https://cvsweb.netbsd.org/bsdweb.cgi/src/games/hangman/>  
  The canonical NetBSD version from which the BSDGames tree descends.

## Historical / Cultural Sources

- **Ken Arnold** — original author of `hangman` and the `curses` library.
- **4.3BSD** (1986) — the BSD release in which this version of Hangman was widely distributed.

## Technical Sources

- **NetBSD `curses` manual**  
  <https://man.netbsd.org/curses.3>  
  Reference for the terminal UI functions used throughout the source.

- **POSIX `rand()` / `srand()`**  
  <https://pubs.opengroup.org/onlinepubs/9699919799/functions/rand.html>  
  Background on the RNG used for word selection.

## Tools

- **Screenshot capture script**  
  [`docs/scripts/capture-screenshots.sh`](../../../docs/scripts/capture-screenshots.sh)  
  Used to produce the screenshots referenced in [`about.md`](./about.md).

## Notes on Attribution

- Original C source copyright: The Regents of the University of California, 1983, 1993.
- Game written by Ken Arnold.
