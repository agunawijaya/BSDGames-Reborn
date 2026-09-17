# `robots(6)` — Original Man Page (Annotated)

> Mirror of the original `robots.6.in` man page from BSDGames,
> converted to Markdown.
>
> Upstream source:
> <https://github.com/vattam/BSDGames/blob/master/robots/robots.6.in>

---

```
Copyright (c) 1991, 1993
    The Regents of the University of California. All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the conditions of the standard
3-clause BSD license are met. Full notice: see robots.6.in.

@(#)robots.6  8.1 (Berkeley) 5/31/93
```

## NAME

**robots** — fight off villainous robots

## SYNOPSIS

```
robots [-Asjtan] [scorefile]
```

## DESCRIPTION

`robots` pits you against evil robots, who are trying to kill you
(which is why they are evil). Fortunately for you, even though they
are evil, they are not very bright and have a habit of bumping into
each other, thus destroying themselves. In order to survive, you
must get them to kill each other off, since you have no offensive
weaponry.

Since you are stuck without offensive weaponry, you are endowed with
one piece of defensive weaponry: a teleportation device.

When two robots run into each other or a junk pile, they die. If a
robot runs into you, you die. When a robot dies, you get 10 points,
and when all the robots die, you start on the next field. This
keeps up until they finally get you.

Robots are represented on the screen by a `+`, the junk heaps from
their collisions by a `*`, and you (the good guy) by a `@`.

### Commands

| Key | Meaning |
|:---:|---|
| `h` | move one square left |
| `l` | move one square right |
| `k` | move one square up |
| `j` | move one square down |
| `y` | move one square up and left |
| `u` | move one square up and right |
| `b` | move one square down and left |
| `n` | move one square down and right |
| `.` | (also space) do nothing for one turn |
| `HJKLBNYU` | run as far as possible in the given direction |
| `>` | do nothing for as long as possible |
| `t` | teleport to a random location |
| `w` | wait until you die or they all do |
| `q` | quit |
| `^L` | redraw the screen |

All commands can be preceded by a count.

If you use the `w` command and survive to the next level, you will
get a bonus of 10% for each robot which died after you decided to
wait. If you die, however, you get nothing. For all other commands,
the program will save you from typos by stopping short of being
eaten. However, with `w` you take the risk of dying by miscalculation.

Only five scores are allowed per user on the score file. If you
make it into the score file, you will be shown the list at the end
of the game. If an alternative score file is specified, that will
be used instead of the standard file for scores.

## OPTIONS

| Option | Meaning |
|---|---|
| `-s` | Don't play, just show the score file. |
| `-j` | Jump: when you run, don't show any intermediate positions; only show things at the end. This is useful on slow terminals. |
| `-t` | Teleport automatically when you have no other option. |
| `-a` | Advance into the higher levels directly, skipping the lower, easier levels. |
| `-A` | Auto-bot mode. Lets the game play itself. |
| `-n` | Increase the number of games played by one. |

## AUTHOR

Ken Arnold. Auto-bot mode contributed by Christos Zoulas.

## FILES

- `@robots_scorefile@` — the score file (typically
  `/var/games/robots.scores` on classic installs).

## BUGS

> Bugs?
> You *crazy*, man?!?

*(This is the man page's actual bug-report section, retained
verbatim as a period authorial flourish. In practice, there are
minor `curses`-implementation quirks and the FANCY compile-time
modes are minimally documented.)*

---

## Historical Notes (Editor's Additions)

- **Autobot mode (`-A`)** is not part of the original 1984 game.
  Christos Zoulas added it during the NetBSD era. It runs the game
  autonomously — a demo mode, but also a useful smoke test for the
  AI code.
- **The `FANCY` compile-time flag** (see `main.c:88-99`) enables
  two undocumented modes triggered by score-file names:
  `pattern_roll` and `stand_still`. Not covered by the man page.
- **`-r` (real-time)** existed in some versions (`Real_time` in the
  code and `move_robs.c:53-54`) but is not always listed in the
  man page.
- **Terminal size requirement:** the game requires at least 80×24.
  In the 1980s, this was a safe assumption. `main.c:154-163`
  enforces it.
- **PID as seed:** `main.c:165` — quaint but effective; see
  `lessons.md` Lesson 4.

## See Also

- [`about.md`](./about.md) — brochure and history.
- [`references.md`](./references.md) — full citation of the man
  page source.
- [`architecture.md`](./architecture.md) — code-level explanation
  of what the man page describes.
