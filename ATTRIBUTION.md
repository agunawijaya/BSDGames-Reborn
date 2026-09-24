# Attribution

**BSDGames Reborn** is a spiritual-successor port of the classic
BSDGames package. This document credits the sources on which the
project is based.

## Upstream Source

The upstream source for this port is:

> **BSDGames** — a Linux/GNU-Hurd port of the games from NetBSD-current,
> maintained by **Joseph S. Myers**.
> Repository: <https://github.com/vattam/BSDGames>

Joseph's port itself derives from **NetBSD**'s games, which trace back
to the games shipped with the original **Berkeley Software Distribution
(BSD)** of Unix in the late 1970s and 1980s.

**The original C source is not redistributed in this repository.**
Retrieve it from the upstream repository above under its original
license (mostly BSD 3-Clause; some files under original UCB terms).

## Per-Game Authorship

Individual programs in BSDGames were written by a variety of authors
over more than two decades. Notable contributors include but are not
limited to:

- **Ken Arnold** — `curses` library, `snake`, `rogue` co-author
- **Michael Toy**, **Glenn Wichman**, **Ken Arnold** — `rogue` /
  seminal roguelike design (foundation of `hack` in this package)
- **Ed James** — `atc`
- **Ken Thompson**, **Dennis Ritchie** — early Unix games heritage
- **Will Crowther**, **Don Woods** — the original *Colossal Cave
  Adventure* on which `adventure` is based
- **Eric S. Raymond** — later maintenance of `adventure`
- **Bruce Holloway** — `boggle`, `mille` and others
- **Chris Torek** — `fortune`, `rain` and others
- **Eric P. Scott** (Caltech High Energy Physics, 1980) — `worms`
  (`worms.c` header), a Unix version of the DEC-2136 program
- **Ted Hess**, **Kirk McKusick**, **Alan Chapman** — `phantasia`
- **Conrad Huang**, **Gregory Couch** — `hunt`
- **Keith E. Brandt**, **Paul Janzen** — `pom`, after Peter
  Duffett-Smith’s *Practical Astronomy with Your Calculator*

Full authorship for each game is documented in
`bsdgames/<game>/docs/about.md` and
`bsdgames/<game>/docs/references.md` inside each game folder.

Where source files in this repository derive directly from the
original algorithm or structure, the original copyright notice /
authorship line is preserved as a comment.

## Licence of This Project

The port code and all documentation authored in this repository are
released under the [MIT license](./LICENSE) by **Agun Wijaya** and
contributors.

The original C source retains its own BSD license — obtain it upstream
and abide by its terms if you use it directly.

## Third-Party Assets

Game data files that are directly derivative of the originals (e.g.
`fortune` databases, `boggle` word lists, `quiz` question sets) may
be included when their original license permits redistribution.
Provenance and license of each such file is documented in
`bsdgames/<game>/data/README.md` or an equivalent notice.

## Contact

Repository owner: **Agun Wijaya**
For attribution questions or corrections, please open an issue on
GitHub.
