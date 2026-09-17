# `dm` — Man Page (annotated)

> The original `dm(8)` and `dm.conf(5)` man pages, reproduced
> with light annotations. Original sources: `dm.8.in` and
> `dm.conf.5.in` in upstream BSDGames.
> Upstream URLs:
> - <https://github.com/vattam/BSDGames/blob/master/dm/dm.8.in>
> - <https://github.com/vattam/BSDGames/blob/master/dm/dm.conf.5.in>

Note this is **section 8** (system administration), not section
6 (games) like every other BSDGames man page. `dm` is a sysadmin
tool.

---

## `dm(8)` — DUNGEON MASTER

### NAME

**dm** — dungeon master

### SYNOPSIS

```
ln -s dm <game>
```

### DESCRIPTION

`dm` is a program used to regulate game playing. `dm` expects to
be invoked with the name of a game that a user wishes to play.
This is done by creating symbolic links to `dm`, in the directory
`<gamesdir>`, for all of the regulated games. The actual binaries
for these games should be placed in a "hidden" directory,
`<libexecdir>`, that may only be accessed by the `dm` program.
`dm` determines if the requested game is available and, if so,
runs it.

> **[Annotator's note]:** This is the `argv[0]` dispatch idiom.
> The user's shell runs `hack`, which resolves to the `dm`
> binary. `dm` reads its own `argv[0]`, discovers "hack", and
> knows which policy to apply.

The file `<configfile>` controls the conditions under which games
may be run.

The file `<nogamesfile>` may be used to "turn off" game playing.
If the file exists, no game playing is allowed; the contents of
the file will be displayed to any user requesting a game.

> **[Annotator's note]:** File-based kill switch. Sysadmins can
> `touch /etc/nogames` to disable everything instantly.
> `echo "Reboot at 6 PM" > /etc/nogames` displays that message.

### FILES

- **`<configfile>`** — configuration file (typically
  `/etc/dm.conf`).
- **`<nogamesfile>`** — turns off game playing (typically
  `/etc/nogames`).
- **`<libexecdir>`** — directory of "real" binaries (typically
  `/usr/libexec/`).
- **`<logfile>`** — game logging file (typically
  `/var/log/dm.log`, if `LOG` compiled in).

### SEE ALSO

`dm.conf(5)`

### HISTORY

The `dm` command appeared in **BSD 4.3 tahoe** (1988).

### SECURITY CONSIDERATIONS

Two issues result from `dm` running the games setgid "games".

First, all games that allow users to run Unix commands should
carefully set both the real and effective group ids immediately
before executing those commands. Probably more important is that
`dm` never be setgid anything but "games" so that compromising a
game will result only in the user's ability to play games at will.

Secondly, games which previously had no reason to run setgid and
which accessed user files may have to be modified.

> **[Annotator's note]:** The security model is subtle:
> - `dm` is setgid `games` so it can read `/usr/libexec/` (which
>   is `750 root:games`).
> - When `dm` execs the real game, the game inherits the setgid
>   `games` privilege — because `execv` doesn't drop suid/sgid.
> - This means the game itself runs as the user's UID but with
>   effective GID `games`. Games that shell out to shell
>   commands (`system(3)`, `popen(3)`) MUST drop this privilege
>   first, or the shell command will run privileged.
> - In modern terms: this is a **classic setuid/setgid
>   escalation pathway** — one of the reasons modern containers
>   were invented.

---

## `dm.conf(5)` — DUNGEON MASTER CONFIGURATION FILE

### NAME

**dm.conf** — dungeon master configuration file

### DESCRIPTION

The `dm.conf` file is the configuration file for the `dm(8)`
program. It consists of lines beginning with one of three
keywords, **badtty**, **game**, and **time**. All other lines are
ignored.

> **[Annotator's note]:** "Other lines ignored" means comments
> just work — start a line with `#` (or anything not b/g/t) and
> it's a comment. No comment syntax needs specifying.

### KEYWORDS

#### `badtty`

Any tty listed after the keyword **badtty** may not have games
played on it.

Entries consist of two white-space separated fields: the string
**badtty** and the ttyname as returned by `ttyname(3)`.

For example, to keep the uucp dialout, "tty19", from being used
for games, the entry would be:

```
badtty  /dev/tty19
```

> **[Annotator's note]:** In 2026 terms this is "conditional
> access by device". You can imagine: `badtty /dev/pts/*` to
> restrict SSH sessions, `badtty /dev/console` to allow only
> console access, etc.

#### `time`

Any day/hour combination listed after the keyword **time** will
disallow games during those hours. Entries consist of four
white-space separated fields: the string **time**, the
unabbreviated day of the week and the beginning and ending time
of a period of the day when games may not be played. The time
fields are in a 0 based, 24-hour clock.

For example, the following entry allows game playing before 8 AM
and after 5 PM on Mondays:

```
time  Monday  8  17
```

> **[Annotator's note]:** Business-hours enforcement. Modern
> equivalent: Okta conditional access "block admin logins
> outside business hours".

#### `game`

Any game listed after the keyword **game** will set parameters
for a specific game. Entries consist of five white-space
separated fields: the keyword **game**, the name of a game, the
highest system load average at which the game may be played, the
maximum users allowed if the game is to be played, and the
priority at which the game is to be run.

Any of these fields may start with a non-numeric character,
resulting in no game limitation or priority based on that field.

The game **default** controls the settings for any game not
otherwise listed, and must be the last **game** entry in the file.
Priorities may not be negative.

For example, the following entries limit the game "hack" to
running only when the system has 10 or less users and a load
average of 5 or less; all other games may be run any time the
system has 15 or less users.

```
game  hack     5   10  *
game  default  *   15  *
```

> **[Annotator's note]:** Per-game resource quotas. The 4th
> field is priority — passed to `setpriority(2)`. Modern
> equivalent: `systemd CPUWeight=` or Kubernetes
> `resources.requests.cpu`.

### SEE ALSO

`setpriority(2)`, `ttyname(3)`, `dm(8)`.

---

## Complete example `dm.conf`

Reconstruction of what a Berkeley sysadmin's `dm.conf` might have
looked like in 1988:

```
# /etc/dm.conf - game policy for the departmental VAX
#
# No games on:
#   - the uucp dialout
#   - the console (reserved for sysadmin)
badtty  /dev/tty19
badtty  /dev/console

# No games during business hours
time    Monday      8   17
time    Tuesday     8   17
time    Wednesday   8   17
time    Thursday    8   17
time    Friday      8   17

# Hack is CPU-hungry; only during light load
game    hack        3    8   10

# Adventure is CPU-light; more permissive
game    adventure   6   20   0

# Chess is CPU-heavy AI thinking; deprioritize
game    chess       4   15   15

# Default: everything else at 15 users, any load, no priority tweak
game    default     *   15    *
```

## Annotator's addenda

- **No `include`, no `import`.** One config file, no modularity.
- **No comments syntax needed.** "Any non-keyword first char" is
  the comment marker.
- **Order matters** for `game` lines: first-match wins.
- **Silent malformed-line skip.** No syntax errors reported to
  admin — arguably a bug in 2026, a feature in 1987.
- **No hot reload.** Config is read fresh on every `dm`
  invocation (once per game launch). Modern equivalent: `SIGHUP`
  or file-watchers. `dm` didn't need them because it's a
  short-lived program that runs once per game invocation.

## See also

- [`about.md`](./about.md) — the accessible intro.
- [`architecture.md`](./architecture.md) — the mechanism.
- [`lessons.md`](./lessons.md) — modern padanan.
