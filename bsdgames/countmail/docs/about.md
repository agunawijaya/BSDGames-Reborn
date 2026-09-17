# About `countmail`

> **`countmail`** — a tiny shell script that counts your unread mail
> and shouts the answer at you. Obnoxiously.

---

## What Is `countmail`?

`countmail` is a joke utility from the BSDGames package. It asks the
`from(1)` command how many messages are waiting in your mailbox,
translates that number into loud, all-caps English (`TWELVE MAIL
MESSAGES!`), and signs off with a burst of maniacal laughter
(`HAHAHAHAHA!`).

It is the command-line equivalent of a novelty mug that brags about
your inbox size.

## Screenshots

![One message](../media/01-start.png)
*With exactly one message, `countmail` is almost polite.*

![Several messages](../media/02-midgame.png)
*As the count grows, the shouting begins.*

![Empty mailbox](../media/03-gameover.png)
*Even zero messages gets the full dramatic treatment.*

## Authors & Publisher

- **Author(s):**
  - Noah Friedman — original version (1993).
  - Charles M. Hannum — NetBSD rewrite (1998, revised 2002).
- **Publisher / distributor:** NetBSD / BSDGames package.
- **Release year:** First appeared in NetBSD 1.3 (1998).
- **Language:** POSIX shell (`/bin/sh`).

## The Era

`countmail` was written in the early 1990s, when Unix users read mail
on multi-user servers and the arrival of new mail was a genuine event.
The program lampoons the pride (and horror) of an overflowing inbox at
a time when "you've got mail" was still exciting.

## Why It's Interesting

- **A complete number-to-words engine** written using only POSIX shell
  builtins and `case` pattern matching.
- **Deliberately obnoxious UX** — a rare example of a tool designed to
  be annoying.
- **Self-deprecating caveats** — the author admits the pure-shell read
  loop would be horrendously slow, so it shells out to `from | wc -l`.

## Difficulty & Progression

`countmail` is not a game. There are no levels, scores, or difficulty
settings. The "experience" scales only with the size of your mailbox:
more messages mean more uppercase words and, eventually, the error
message *"YOU HAVE TOO MUCH MAIL!"*.

## Making-Of / Anecdotes

The man page is unusually honest: *"The read loop is horrendously slow
on every shell implementation tried."* The pure-shell counting code is
still present but commented out; the shipped version uses `from(1)`
and `wc(1)` for speed.

## Cultural Impact

`countmail` is a direct ancestor of every "unread notification badge"
and inbox-zero brag. Its spirit lives on in mail clients that proudly
display "1,247 unread" and in the modern anxiety of notification
overload.

## Known Bugs (Historical)

- The pure-shell read loop (commented out) is intentionally slow.
- Numbers beyond `SEPTILLION` are treated as an error condition rather
  than converted to words.

## See Also

- [`how-to-play.md`](./how-to-play.md) — how to run it.
- [`architecture.md`](./architecture.md) — how the number-to-words
  engine works.
- [`lineage.md`](./lineage.md) — descendants.
- [`references.md`](./references.md) — sources.
