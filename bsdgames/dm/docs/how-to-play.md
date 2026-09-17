# `dm` — How to Play

> **`dm` is not a game.** It's a sysadmin tool that gated
> access to other games on shared 1987-era Unix hosts. It has
> no interactive UI, no gameplay, no scoring.

There is no "playing" `dm`. The only user-facing behavior:

- When you try to run a game gated by `dm`, either the game
  launches transparently, or you see one of these messages:
  - `Sorry, no games right now.` (kill switch)
  - `Sorry, you may not play games on <tty>.`
  - `Sorry, games are not available from 8am to 5pm today.`
  - `Sorry, the load average is too high right now.`
  - `Sorry, there are too many users logged on right now.`

That's the entire UX.

## For readers looking for content

- **What `dm` is and does**, in accessible terms:
  [`about.md`](./about.md).
- **How `dm` works internally**:
  [`architecture.md`](./architecture.md).
- **Original man page** (`dm(8)` + `dm.conf(5)`):
  [`manpage.md`](./manpage.md).
- **Why we're not porting it**:
  [`decisions/dm-001-skip-port.md`](./decisions/dm-001-skip-port.md).

## For sysadmins in 2026 who still want to run dm

The upstream source at
<https://github.com/vattam/BSDGames/tree/master/dm> compiles on
modern BSD systems. On Linux you'd need to substitute
`getloadavg()` (fine, glibc has it) and adapt `utmpentry.c` for
Linux `utmp` layout. Debian's `bsdgames` package does not ship
`dm` (nor does the trademark-affected `monop`).

But: **you don't want to run `dm`.** Modern equivalents solve
every use case better. Read [`lessons.md`](./lessons.md) for
where to look instead.
