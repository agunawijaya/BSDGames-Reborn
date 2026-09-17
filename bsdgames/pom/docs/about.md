# About `pom`

> **`pom`** — a pocket planetarium that tells you what the Moon is
> doing right now.

---

## What Is `pom`?

`pom` (Phase Of the Moon) is a command-line utility that computes the
Moon's illumination and phase from the current system time, or from a
date you supply. It can tell you whether the Moon is New, Full,
Waxing Crescent, Waning Gibbous, or at one of the Quarter phases, and
gives an approximate percentage of fullness.

The program has been a fixture of Unix systems since the 1980s,
often consulted by hackers who needed an excuse for a late night or a
dramatic release-window decision.

## Screenshots

![Default output](../media/01-start.png)
*Running `pom` with no arguments shows the current lunar phase.*

![Specific date](../media/02-midgame.png)
*You can ask for the phase on a particular date.*

![Quarter phase](../media/03-gameover.png)
*A first- or last-quarter moon is reported by comparing today's phase
with tomorrow's.*

## Authors & Publisher

- **Author(s):**
  - Keith E. Brandt — original program (1984).
  - Paul Janzen — update to the third edition of Duffett-Smith's book
    (1998).
- **Publisher / distributor:** University of California / NetBSD /
  BSDGames package.
- **Release year:** 1989 / 1993 (BSD 4.3); NetBSD revisions through
  2004.
- **Language:** C.

## The Era

`pom` was written when Unix workstations sat in university labs and
research offices. Its playful man page notes that it is "useful for
selecting software completion target dates and predicting managerial
behavior" — a wink at the superstition that releases should align with
favourable omens.

## Why It's Interesting

- **Real astronomy in under 300 lines of C.**
- **Self-contained algorithm** — no network, no database, just math.
- **Dry humour** — the man page treats lunar phases as a project
  management tool.
- **A living textbook example** of converting a published algorithm
  into code.

## Difficulty & Progression

`pom` is not a game. There is no difficulty or progression. The
"result" is the Moon phase for a given moment in time.

## Making-Of / Anecdotes

The source comments cite *Practical Astronomy with Your Calculator*
section numbers, making the code a direct map from textbook to
program. The EPOCH is 1990 Jan 0.0 TDT, and the code deliberately
ignores the sub-minute difference between TDT and UTC.

## Cultural Impact

`pom` is the ancestor of every "Moon phase" widget, watch face, and
astrology app. It represents the Unix tradition of putting scientific
and reference tools at the user's fingertips.

## Known Bugs (Historical)

- Does not correct for TDT vs UTC (about one minute).
- Dates must be within the Unix epoch range.
- The year parsing has a hard-coded rollover at 69 for the 2000 hack.

## See Also

- [`how-to-play.md`](./how-to-play.md) — command-line usage.
- [`architecture.md`](./architecture.md) — the astronomical algorithm.
- [`lineage.md`](./lineage.md) — descendants.
- [`references.md`](./references.md) — sources.
