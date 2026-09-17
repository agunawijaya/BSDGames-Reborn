# About `wtf`

> **`wtf`** — the original command-line slang translator. Tell it an
> acronym, and it tells you what it means.

---

## What Is `wtf`?

`wtf` is a tiny utility that expands acronyms. Run `wtf IIRC` and it
answers "as far as I know" ... wait, no, that is `AFAIK`. Run `wtf
AFAIK` and it answers "as far as I know". The program ships with a
curated database of internet and office abbreviations (`AFK`, `BBL`,
`FYI`, `RTFM`, ...) and a second computer-focused database (`CPU`,
`RAM`, `TLA`). If it does not know the acronym, it asks `whatis(1)`
whether the word is a command on the system.

It is small, fast, and deliberately crude — a perfect example of the
Unix philosophy of doing one thing well.

## Screenshots

![Basic lookup](../media/01-start.png)
*A simple acronym lookup: `wtf RTFM`.*

![Natural usage](../media/02-midgame.png)
*The optional `is` syntax: `wtf is LOL`.*

![Unknown acronym](../media/03-gameover.png)
*When an acronym is not in the database, `wtf` falls back to `whatis` or
admits defeat.*

## Authors & Publisher

- **Author(s):** Public domain; maintained by the NetBSD project.
  The original commit history shows `jmmv` (Juan Manuel M. Palacios)
  committing a rewrite in 2003, but the utility existed earlier in the
  public-domain BSDGames collection.
- **Publisher / distributor:** NetBSD / BSDGames package.
- **Release year:** First appeared in NetBSD 1.5 (1998).
- **Language:** POSIX shell (`/bin/sh`).

## The Era

`wtf` was written when Usenet, IRC, and early instant messaging were
making acronym-heavy English a daily problem for system administrators.
Rather than ask a human what `BOFH` meant, you could ask the machine.
The tool fits neatly into the 1990s Unix command-line culture where
small text filters solved social friction.

## Why It's Interesting

- **Solves a real communication problem** with under 70 lines of shell.
- **Demonstrates classic Unix composition:** `getopt`, `tr`, `fgrep`,
  `sed`, and `whatis` glued together.
- **Has a built-in easter-egg grammar:** `wtf is WTF` reads like
  natural language because the word `is` is silently ignored.
- **Public domain** — unusually unencumbered even by BSD standards.

## Difficulty & Progression

`wtf` is a utility, not a game. There is no difficulty curve, score, or
progression. The "challenge" is simply whether the acronym you typed is
in the database; if not, you may need to expand it yourself.

## Making-Of / Anecdotes

The man page officially notes that `wtf` "first appeared in NetBSD 1.5"
and that the word `is` is ignored so users can type `wtf is WTF`. That
one-line design choice has kept the program memorable for decades.

## Cultural Impact

`wtf` is the ancestor of every `/explain` bot, IRC factoid plugin, and
modern acronym-expander feature in search engines. Its spirit lives on
in `tldr`, `cheat`, and Stack Overflow's "What does X mean?" questions.

## Known Bugs (Historical)

- The original `fgrep` lookup is case-insensitive only because the
  input is upper-cased with `tr`. It does not perform fuzzy matching,
  so `wtf afk` works but `wtf a.f.k.` does not.
- The fallback to `whatis(1)` only works on systems with a man-page
  database; otherwise every unknown acronym produces the "Gee... I
  don't know" message.

## See Also

- [`how-to-play.md`](./how-to-play.md) — command-line usage.
- [`architecture.md`](./architecture.md) — how the shell script works.
- [`lineage.md`](./lineage.md) — descendants and siblings.
- [`references.md`](./references.md) — sources.
