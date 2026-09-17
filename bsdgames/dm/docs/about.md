# `dm` — About

> **Not a game.** A 1987 sysadmin tool that regulated who was
> allowed to play the *other* games on a shared Berkeley Unix
> machine. Named after the "Dungeon Master" — the referee in
> Dungeons & Dragons, and by extension the human at the console
> who kept the resource peace.

---

## What `dm` is

If you're reading this in 2026, you've probably never faced the
problem `dm` solves. So start there.

Imagine the Berkeley Computer Science department in 1987. There's
**one VAX 11/780**. Twenty-five graduate students and thirty
undergraduates share it. It has 8 MB of RAM. There is no cloud, no
personal Unix workstation (yet), no laptops, no VMs, and no
containers. When you SSH in — well, when you dial in via a serial
terminal in the basement — you land on the same physical machine
as everyone else. Every `cc`, every `emacs`, every `hack` competes
for the same CPU and the same memory.

Now imagine that at 2 PM on a Tuesday, three grad students are
running finite-element simulations for their thesis, and a fourth
undergrad decides it would be fun to start `hack`. The `hack`
binary is CPU-hungry (it re-computes the map every turn, redraws
via curses every animation frame). Load average jumps from 3 to 8.
The simulations start swapping. The thesis advisor emails the
sysadmin.

`dm` is the sysadmin's answer.

## What `dm` does, in one paragraph

`dm` is a **gatekeeper** installed in front of every game binary
on the system. When a user types `hack`, the shell finds
`/usr/games/hack` — but that isn't the real Hack. It's a symlink
to `/usr/games/dm`. `dm` looks at its own `argv[0]`, sees "hack",
consults `/etc/dm.conf`, checks the current time-of-day, the
TTY the user is on, the load average, and the count of logged-in
users. If all constraints are satisfied, `dm` `execv()`s the
*real* Hack binary from a hidden directory (`/usr/libexec/`) that
users cannot read. If any constraint fails, `dm` prints a polite
denial and exits. The user never sees the real binary path.

The sysadmin controls policy through a config file:

```
badtty  /dev/tty19
time    Monday    8    17
game    hack      5    10    *
game    default   *    15    *
```

Which reads: *"No games on the uucp dialout line ever. No games at
all on Monday between 8 AM and 5 PM. Hack requires load ≤ 5 and
users ≤ 10; other games only require users ≤ 15."*

That's it. In 335 lines of C.

## What was advanced for its time

For an undergraduate reading this in 2026, the code looks
unremarkable — a policy engine, a config parser, some system
calls, exec. But **step back into 1987** and count what didn't
exist yet:

| Modern feature that didn't exist in 1987 | What `dm` did instead |
|---|---|
| **Containers** (Docker: 2013) | `execv()` from a hidden setgid-only directory. |
| **cgroups** (Linux: 2007) | Read `getloadavg()`, gate by threshold. |
| **systemd resource control** (2010+) | `setpriority()` from config. |
| **Access Control Lists (ACLs)** | Filesystem `700` on `/usr/libexec/` + setgid binary. |
| **RBAC / policy engines** (OPA, Kyverno) | 4-column keyword lines in `/etc/dm.conf`. |
| **Kubernetes ResourceQuota** | `game hack 5 10 *`. |
| **SSO business-hours enforcement** | `time Monday 8 17`. |
| **BusyBox-style multiplexed binary** (1996) | `argv[0]` dispatch — but nine years earlier. |
| **Screen Time / parental controls** | The literal `dm` config schema, mostly unchanged. |
| **Prometheus + Grafana observability** | The optional `#ifdef LOG` block appending to `/var/log/dm.log`. |

`dm` was **declarative before Puppet, load-aware before Nagios,
setgid-hidden before Docker, and argv-multiplexed before
BusyBox**. In a codebase you can read in an afternoon.

The 1987 engineers didn't have the vocabulary "policy as code" or
"resource quotas" or "role-based access control". They had `sscanf`
and `execv` and `getloadavg`. They composed those to produce the
essence of what all those modern systems do.

## Where its ideas live now

Every trick `dm` used has a modern descendant. See
[`lessons.md`](./lessons.md) for the full mapping. Highlights:

- **`argv[0]` dispatch** → BusyBox (1996), Perl's `perl` command,
  Git's plumbing commands (`git-checkout`, `git-status` symlinks).
- **Setgid-hidden binaries** → Docker layers, snap/flatpak
  confinement, macOS's `/usr/libexec/`.
- **`getloadavg()` gating** → Kubernetes admission controllers,
  autoscaler cooldown logic.
- **`time Monday 8 17`** → SSO conditional access ("no
  administrative logins outside business hours"), MDM's
  work-hour app blocking, Screen Time's app-hour limits.
- **utmp user counting** → observability. `prometheus-node-
  exporter` still reads utmp; the metric is still valuable.
- **`/etc/nogames` kill switch** → feature flags,
  circuit-breakers, `/etc/motd` maintenance messages.

## Not to be confused with

- **`dm(4)`** — Linux device-mapper driver (different `dm`
  entirely).
- **`dm-crypt`** — Linux disk encryption (device-mapper based).
- **A game called Dungeon Master** — 1987 FTL Games real-time
  dungeon crawler. Same name, unrelated program. Just an
  amusing collision.
- **Dungeons & Dragons DM** — the human "dungeon master" that
  gave this program its name.

## What `dm` did not do

Worth calling out, because they're implicit assumptions:

- **No sandboxing.** Once `dm` decided you could play `hack`, it
  handed control off entirely. Hack could then do anything Hack
  could do (which was quite a lot on a 1987 system).
- **No quota tracking.** `dm` didn't limit *how long* you played.
  Once past the gate, you were free.
- **No per-user policy.** Config was system-wide; `dm` couldn't
  say "grad students only" or "no games for user `bob`".
- **No lock inheritance.** If a `hack` process crashed and left
  garbage in `/tmp`, `dm` didn't clean up.
- **No revocation.** Once the config allowed a game, running
  processes weren't killed if the config changed.

These gaps are why modern tools (SLURM, K8s, cgroups) evolved.

## Why we're not porting it

Read [`decisions/dm-001-skip-port.md`](./decisions/dm-001-skip-port.md)
for the full reasoning. The short version: **the problem is
gone**. No one shares a physical Unix machine anymore. Modern
tools solve every use case of `dm` — better and with vastly more
functionality. Porting `dm` to 2026 would produce a curiosity
without a user.

We preserve it here as **documentation and history**, not as
running code.

## Quick facts

- **First shipped:** BSD 4.3 Tahoe (June 1988).
- **Original author(s):** UC Berkeley staff (not individually
  credited in source).
- **Lines of C:** 335 in `dm.c`; another ~200 in `utmpentry.c`.
- **Config schema:** 3 keywords (`badtty`, `game`, `time`) +
  optional `/etc/nogames` kill file.
- **Runtime constraints checked:** load average, user count,
  TTY, weekday, hour of day.
- **Actions:** allow (with optional `nice(1)`-style priority
  adjustment) or deny with a message.

## Where to go next

- Mechanism walkthrough: [`architecture.md`](./architecture.md).
- Modern equivalents for each trick:
  [`lessons.md`](./lessons.md).
- Genealogy of the ideas: [`lineage.md`](./lineage.md).
- The skip decision:
  [`decisions/dm-001-skip-port.md`](./decisions/dm-001-skip-port.md).

## Author's note

`dm` is the smallest and least "fun" thing in BSDGames. It's not
a game and it doesn't have a UI. But it's arguably the most
educational file in the collection for a modern programmer,
because it forces you to reason about a computing environment you
have never lived in — and to see that many of the ideas we
consider "modern" were invented before you were born, in 335 lines
of C, by people who didn't have Google.
