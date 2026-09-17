# `dm` — Specification

> Formal spec of `dm`'s behavior. Kept brief because the port is
> skipped ([`decisions/dm-001-skip-port.md`](./decisions/dm-001-skip-port.md)).
> This file exists for structural consistency with other games
> and to serve as a machine-readable rules summary.

---

## Invocation

```
<argv[0]>  [args...]
```

`argv[0]` must be a symlink to `dm`. If invoked as `dm` directly
(unwrapped), `dm` exits 0 immediately without action.

## Runtime inputs

- **`argv[0]`** — determines the requested game name.
- **`ttyname(0)`** — determines the source terminal.
- **`time(NULL)`** — determines the current instant.
- **`getloadavg()`** — determines the 15-minute load average.
- **`getutentries()`** — determines the count of logged-in
  users.
- **`_PATH_NOGAMES`** — kill-switch file (typically `/etc/nogames`).
- **`_PATH_CONFIG`** — policy file (typically `/etc/dm.conf`).
- **`_PATH_HIDE`** — hidden binary directory (typically
  `/usr/libexec/`).

## Decision procedure

1. If `_PATH_NOGAMES` exists:
   - Write `"Sorry, no games right now.\n\n"` to stderr.
   - Write file contents to stderr.
   - Exit 1.

2. If `argv[0]` basename == `"dm"`:
   - Exit 0.

3. Read `_PATH_CONFIG`, applying rules in order:
   - **`badtty <tty>`**: if user's tty matches, deny with
     `"Sorry, you may not play games on <tty>."`.
   - **`time <day> <start> <stop>`**: if current day matches
     and current hour ∈ [start, stop), deny with
     `"Sorry, games are not available from <start> to <stop>
     today."` (or `"...not available today."` when
     [start, stop) == [0, 24)).
   - **`game <name> <load> <users> <priority>`**: if `<name>`
     matches the requested game, or `<name>` == `"default"` and
     no prior game rule matched:
     - Set `found = 1`.
     - If load field is numeric and current 15-min load average
       > that value, deny with `"Sorry, the load average is
       too high right now."`.
     - If users field is numeric and current user count ≥ that
       value, deny with `"Sorry, there are too many users
       logged on right now."`.
     - If priority field is numeric, store it for exec.

4. If not denied:
   - Call `setpriority(PRIO_PROCESS, 0, priority)` if priority
     > 0.
   - `execv(<_PATH_HIDE><game>, argv)`.

## Config file grammar

```
config      := line*
line        := badtty-line | time-line | game-line | ignored-line
badtty-line := 'badtty' WS <tty-path> EOL
time-line   := 'time' WS <day> WS <start-hour> WS <stop-hour> EOL
game-line   := 'game' WS <game-name> WS <load> WS <users> WS <priority> EOL
ignored-line:= anything else, silently skipped
```

- `WS` = one or more whitespace characters.
- `<tty-path>` = a valid pathname (e.g., `/dev/tty01`).
- `<day>` = case-insensitive weekday: sunday, monday, tuesday,
  wednesday, thursday, friday, saturday.
- `<start-hour>`, `<stop-hour>` = decimal integer 0–24. If not
  digits, the entire time rule is silently ignored.
- `<game-name>` = the game's argv[0] basename, or the literal
  `default`.
- `<load>`, `<users>`, `<priority>` = decimal integer, OR any
  non-digit string (e.g., `*`) to disable that specific check.
- `<priority>` MUST be non-negative if numeric.

## Output messages

Denials use `errx(0, ...)`, which prints to stderr and exits.
The exit code varies:

| Cause | Exit code |
|---|---:|
| `/etc/nogames` present | 1 |
| Bad tty | 1 |
| Bad time window | 0 |
| Load too high | 0 |
| Too many users | 0 |
| exec failed | 1 |
| Success (game runs) | (whatever the game returns) |

Note the inconsistency — some denials exit 0, some exit 1. This
appears to be an oversight in the original code.

## Log format

If compiled with `-DLOG`, on each successful invocation `dm`
appends to `_PATH_LOG` (typically `/var/log/dm.log`):

```
<username>\t<game>\t<tty>\t<ctime>
```

Locked with `flock(LOCK_EX)`, up to 5 retries at 1-second
intervals.

## Environment

- **`TZ`** is `unsetenv`'d at startup to normalize to system
  timezone.

## Constants (from `dm.c`)

| Constant | Value | Meaning |
|---|---:|---|
| Denial retry count for flock | 5 | Bail after 5 failures |
| `strrchr('/')` on argv[0] | — | Extract basename |
| Load index | 2 (of 0/1/2) | 15-minute smoothing |

## What the port would look like

Skipped — see
[`decisions/dm-001-skip-port.md`](./decisions/dm-001-skip-port.md).

## Errors and edge cases

- **Missing `_PATH_CONFIG`**: silently permissive — every game
  runs.
- **Malformed lines**: silently skipped.
- **Priority < 0**: rejected during parse (silently — no error).
- **`_PATH_HIDE<game>` missing**: `execv` fails, `err(1,
  "...")` prints and exits.
- **User has no tty (e.g. via `at(1)` batch)**: `ttyname(0)`
  returns NULL; `dm` would segfault trying to dereference it
  in `c_tty()`. Modern port MUST handle this.
- **Config lines longer than BUFSIZ**: truncated by `fgets`,
  potentially corrupting parse. Unlikely in practice.

## Test scenarios

The port is skipped, so no test scenarios are required. If a
future engineer wanted to verify behavior against the upstream
binary, the natural cases would be:

1. Fresh symlink + no config → game runs.
2. `/etc/nogames` present with message → message shown, exit 1.
3. `badtty /dev/pts/0` on current tty → denied.
4. `time <today> 0 24` → "not available today".
5. `game <name> 0 0 *` (impossibly low thresholds) → denied.
6. `game default 0 0 *` with no prior game rule → denied for
   any game.
7. `game <name> * * 5` → runs with priority 5.
8. Direct `dm` invocation (not via symlink) → exit 0.

## See also

- [`architecture.md`](./architecture.md) — how each spec item is
  implemented.
- [`manpage.md`](./manpage.md) — original man page.
