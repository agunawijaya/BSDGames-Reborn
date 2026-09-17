# About `pig`

> **Brochure.** History, authors, cultural notes, and why this utility
> matters.

---

## What Is `pig`?

A tiny Unix filter that translates English text into Pig Latin. Feed it a report, an email, or a README and it prints the same text back with every word transformed: consonant-starting words move their initial consonants to the end and add `-ay`; vowel-starting words add `-way`.

## Screenshots

*To be captured from the original BSDGames binary via
[`docs/scripts/capture-screenshots.sh`](../../../docs/scripts/capture-screenshots.sh).*

![Translate a sentence](../media/01-start.png)
*A sentence piped into `pig` comes out in Pig Latin.*

![Mixed case](../media/02-midgame.png)
*The filter preserves title case and all-caps words.*

![Punctuation](../media/03-gameover.png)
*Non-letters pass through unchanged, flushing each word.*

## Authors & Publisher

- **Author(s):** The Regents of the University of California.
- **Publisher / distributor:** BSD / NetBSD.
- **Release year:** 1992 (source header); man page 1993.
- **Language:** C.

## The Era

The early 1990s saw BSD ship a suite of small text toys alongside its games. `pig` is the kind of program that exists because someone thought it would be funny to generate monthly reports in Pig Latin — and the man page confirms it.

## Why It's Interesting

- **It is a complete translator in 142 lines.**
- **It handles case correctly.** All-caps, title-case, and lowercase words get appropriate suffixes.
- **It treats `qu` as a consonant cluster.** A subtle linguistic detail.

## Difficulty & Progression

No progression. The utility is a pure stateless filter.

## Making-Of / Anecdotes

- **Monthly reports.** The man page deadpans: "Useful for generating monthly reports."
- **No options.** The program accepts no flags; you just pipe text in.

## Cultural Impact

Pig Latin is a classic children's language game. The BSD utility is a minor piece of hacker humor, demonstrating that even a joke can be implemented with care.

## Known Bugs (Historical)

- **Internal capitals flattened.** Words like `eBay` lose their internal case after consonant rotation.
- **Y-as-vowel only for consonant-start words.** A word starting with `y` is treated as a consonant, not a vowel.

## See Also

- [`how-to-play.md`](./how-to-play.md)
- [`architecture.md`](./architecture.md)
- [`lineage.md`](./lineage.md)
- [`references.md`](./references.md)
