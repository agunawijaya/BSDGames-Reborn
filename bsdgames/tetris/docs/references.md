# `tetris` — References

> Sources and citations used in this game's documentation.

---

## Primary Sources

- **Original BSDGames source repository**  
  <https://github.com/vattam/BSDGames/tree/master/tetris>  
  The upstream C source for `tetris.c`, `shapes.c`, `screen.c`, `input.c`, `scores.c`, headers, build files, and the man page `tetris.6.in`.

- **NetBSD tetris source**  
  <https://cvsweb.netbsd.org/bsdweb.cgi/src/games/tetris/>  
  The canonical NetBSD version from which the BSDGames tree descends.

## Historical / Cultural Sources

- **International Obfuscated C Code Contest (IOCCC)**  
  <https://www.ioccc.org/>  
  The BSD `tetris` was adapted from an IOCCC-winning entry by Chris Torek and Darren F. Provine.

- **Tetris: The Games People Play** — Box Brown (2016)  
  A graphic novel history of Tetris, covering Alexey Pajitnov's original and the game's global spread.

- **Classic Tetris World Championship**  
  <https://thectwc.com/>  
  Modern competitive Tetris community and tournament.

## Technical Sources

- **NetBSD termcap manual**  
  <https://man.netbsd.org/termcap.5>  
  Reference for the termcap strings used in `screen.c`.

- **POSIX `flock()`**  
  <https://pubs.opengroup.org/onlinepubs/9699919799/functions/flock.html>  
  Background on the advisory file locking used for the high-score file.

- **Super Rotation System (SRS)**  
  <https://tetris.wiki/Super_Rotation_System>  
  Modern rotation standard discussed in [`port-ideas.md`](./port-ideas.md).

## Tools

- **Screenshot capture script**  
  [`docs/scripts/capture-screenshots.sh`](../../../docs/scripts/capture-screenshots.sh)  
  Used to produce the screenshots referenced in [`about.md`](./about.md).

## Notes on Attribution

- Original C source copyright: The Regents of the University of California, 1992, 1993.
- Code derived from software contributed to Berkeley by Nancy L. Tinkham and Darren F. Provine.
- Preview code added by Hubert Feyrer in 1999.
