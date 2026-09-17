# `canfield` — References & Sources

---

## Primary Sources

- **BSDGames upstream:**
  <https://github.com/vattam/BSDGames/tree/master/canfield>
- **Man page `canfield.6`:**
  <https://github.com/vattam/BSDGames/blob/master/canfield/canfield/canfield.6.in>
- **Source files analysed:**
  - `canfield/canfield.c` — ~1700 LOC game.
  - `canfield/canfield.6.in` — man page.
  - `canfield/pathnames.h.in` — path template.
  - `cfscores/cfscores.c` — ~250 LOC companion.

## Historical & Cultural Sources

- **Richard A. Canfield** biography:
  <https://en.wikipedia.org/wiki/Richard_A._Canfield>.
- **Canfield solitaire** rule reference:
  <https://en.wikipedia.org/wiki/Canfield_(solitaire)>.
- **Klondike vs. Canfield** comparison articles across
  solitaire references (many).
- **Foster's Complete Hoyle** (Robert Foster, 1897) — original
  solitaire encyclopedia including "Canfield" and "Klondike".
- **Bicycle Cards' rulebook** — modern equivalent, includes
  Canfield rules.

## Technical Sources

- **Ken Arnold**, `curses(3)` — the terminal library.
- **Brian W. Kernighan & Dennis M. Ritchie**, *The C Programming
  Language*, 2nd ed. (1988).
- **NetBSD source repository** — long-term maintenance history.
- **XDG Base Directory Specification** — for the modern port's
  score file location:
  <https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html>.

## Author Biography

- **Steve Levine** — Berkeley developer; wrote the original
  `canfield` game logic. Biographical info sparse.
- **Steve Feldman** — converted `canfield` to `curses` and
  debugged. Known as one of the original AT&T Bell Labs make
  developers (author of `make(1)` in the 1970s), later at
  Bellcore. Bio:
  <https://en.wikipedia.org/wiki/Stuart_Feldman> (probable
  identity match — needs verification).
- **Marshall Kirk McKusick** — added card counting + betting +
  UI polish. Prominent BSD developer, president of the FreeBSD
  Foundation, author of *The Design and Implementation of the
  4.4 BSD Operating System*. Bio:
  <https://en.wikipedia.org/wiki/Marshall_Kirk_McKusick>.
- **Mikey Olson** — added card counting alongside McKusick.
  Biographical info sparse.
- **Eric Allman** — UI cleanups; famous as the author of
  **sendmail**. Bio:
  <https://en.wikipedia.org/wiki/Eric_Allman>.
- **Richard A. Canfield** — 19th-century casino operator whose
  house rules for this solitaire variant give the game its
  name.

## Similar / Related Games

- **Klondike solitaire** — the ubiquitous variant.
- **FreeCell** — deterministic 4-cell solitaire.
- **Spider** — 10-column deep-tableau solitaire.
- **Yukon** — sliding-tableau variant of Klondike.
- **Windows Solitaire** — the mainstream digital incarnation.
- **KDE Patience Games (kpat)** — modern multi-variant collection.
- **AisleRiot** — GNOME's multi-variant collection.

## Citation Style

- Code references use `file:line` format where useful.
- URLs preferred over local paths; never paste local filesystem
  paths.
- All screenshots in `media/` were captured from Debian
  `bsdgames`' `canfield(6)` binary on 2026-09-17. See
  [`diff-log.md`](./diff-log.md) for capture details.

## Related root documents

- Root [`ATTRIBUTION.md`](../../../ATTRIBUTION.md).
- [`lineage.md`](./lineage.md).

## See also

- [`about.md`](./about.md) — reader intro.
- [`architecture.md`](./architecture.md) — code layout.
- [`port-ideas.md`](./port-ideas.md) — port design.
