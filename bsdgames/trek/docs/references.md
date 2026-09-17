# `trek` — References & Sources

> Every historical or technical claim traces back to a source
> listed here.

---

## Primary Sources

- **BSDGames upstream:**
  <https://github.com/vattam/BSDGames/tree/master/trek>
- **Man page `trek.6.in`:**
  <https://github.com/vattam/BSDGames/blob/master/trek/trek.6.in>
- **Extended documentation `trek.me`** (nroff format, shipped in
  BSD `trek/DOC` and `USD.doc`):
  <https://github.com/vattam/BSDGames/blob/master/trek/DOC>
- **Source files analysed:**
  - `main.c` — entry, argument parsing, main loop with setjmp
  - `play.c` — turn loop and `Comtab[]` command dispatch
  - `trek.h` — all data structures
  - `help.c` — starbase emergency transporter
  - Attribution chain in `main.c:60-121` — remarkably rich

## Historical & Cultural Sources

- **Eric P. Allman** — biography on `sendmail` history sites and
  Wikipedia. `sendmail` is his enduring legacy but `trek` is his
  early Berkeley work.
- **`sendmail` history** — <https://en.wikipedia.org/wiki/Sendmail>
- **Mike Mayfield's 1971 BASIC Star Trek** — Wikipedia article,
  Creative Computing archives.
- **David H. Ahl (1978)**, *BASIC Computer Games: Microcomputer
  Edition*. Workman Publishing, New York. ISBN 0-89480-052-3.
  Contains multiple Star Trek listings.
- **The BSD 4BSD release notes and Marshall Kirk McKusick's
  essays on BSD history.**
- **Netrek history** — <http://www.netrek.org/> for the multiplayer
  descendant.

## Technical Sources

- **Brian W. Kernighan & Dennis M. Ritchie**, *The C Programming
  Language*, 2nd ed. (1988) — for `setjmp(3)`, general C idioms.
- **W. Richard Stevens**, *Advanced Programming in the Unix
  Environment* (1992) — for `signal(2)`, `sigaction(2)`, terminal
  I/O.
- **The Design and Implementation of the 4.4BSD Operating
  System** by McKusick, Bostic, Karels, Quarterman (Addison-Wesley,
  1996) — background on BSD's Unix philosophy.
- **The Art of Computer Programming, Volume 2** by Knuth — RNG
  discussion relevant to `ranf`.

## Author Biography

- **Eric P. Allman** (b. 1955) — computer programmer and author.
  Best known for `sendmail`. Started at UC Berkeley in 1971
  studying maths, transitioned to CS. Wrote `trek` in 1976 as a
  student. Later founded Sendmail, Inc. (1998). Still active in
  networking/mail security work. Contact from the era in trek
  source: `Eric P. Allman, Project INGRES, Electronics Research
  Laboratory, Cory Hall, UC Berkeley, CA 94720`.

## Attribution Chain (from `trek/main.c:60-117`)

Faithfully preserved from Eric Allman's own comments:

- **C version by Eric P. Allman**, 5/76, U.C. Berkeley
- **Thanks to** Jeff Poskanzer, Pete Rubinstein, Nick Whyte (named
  the `capture` command)
- **FORTRASH version** by Kay R. Fisher (DEC)
- **Original BASIC** by Mike Mayfield (Centerline Engineering)
- **FORTRAN version** by David Matuszek & Paul Reynolds at LBL
  (also available at LLL and LMSC), maintained by Andy Davidson
- **Battelle Version 7A** by Joe Miller (Battelle-Columbus) and
  Ross Pavlac (Battelle Memorial Institute)
- **Battelle adapted from** FTN version by Ron Williams (CDC
  Sunnyvale)
- **Additional "swiped stuff"** from T. T. Terry, Jim Korp
  (U. Texas), Hicks (U. Penn), Rick Maus (Georgia Tech)

## Similar / Related Games

- **`sst`** (Super Star Trek) by Tom Almy.
- **`xtrek` / Netrek** — <http://www.netrek.org/>.
- **Star Fleet Command series** — Interstel / Interplay.
- **FTL: Faster Than Light** — Subset Games. <https://subsetgames.com/ftl.html>.
- **EVE Online** — CCP Games.

## Citation Style

- Code references use `file:line` format for reproducibility
  against upstream.
- URLs use permalinks / archive.org snapshots for fragile links.

## See Also

- Root [`ATTRIBUTION.md`](../../../ATTRIBUTION.md).
- [`lineage.md`](./lineage.md).
