# `dm` — References & Sources

---

## Primary Sources

- **BSDGames upstream:**
  <https://github.com/vattam/BSDGames/tree/master/dm>
- **Man pages:**
  - `dm(8)`:
    <https://github.com/vattam/BSDGames/blob/master/dm/dm.8.in>
  - `dm.conf(5)`:
    <https://github.com/vattam/BSDGames/blob/master/dm/dm.conf.5.in>
- **Source files analysed:**
  - `dm.c` — 335 LOC, the whole program.
  - `utmpentry.c`, `utmpentry.h` — utmp reader abstraction.
  - `pathnames.h.in` — compile-time path templates.

## Historical Sources

- **BSD 4.3 Tahoe release notes** (1988) — the release where
  `dm` first shipped.
- **Ken Arnold + Kirk McKusick, *A History of BSD Games*** —
  informal community-maintained articles on the BSDGames wiki.
- **NetBSD source repository** — long-term maintenance history
  for `dm`. Direct commit history reveals rare-but-nonzero
  post-1993 activity.
- **The Cathedral and the Bazaar** — Eric S. Raymond (1997).
  For the cultural context of BSD-era community programming.

## Technical Sources

- **W. Richard Stevens**, *Advanced Programming in the Unix
  Environment*, 2nd ed. — for `execv`, `setpriority`, `utmp`,
  `flock`.
- **Brian W. Kernighan & Dennis M. Ritchie**, *The C Programming
  Language*, 2nd ed. (1988) — the C language `dm` is written in.
- **`getloadavg(3)`** man pages across systems — BSD,
  Linux glibc 2.2+, illumos. Not POSIX standard.
- **`utmp(5)`** and **`utmpx(5)`** man pages — the login database
  `dm` counts entries in.

## Modern-equivalent Sources

For readers curious about where `dm`'s ideas landed:

- **BusyBox**: <https://busybox.net/> — for the `argv[0]`
  multiplexer pattern.
- **Kubernetes ResourceQuota**:
  <https://kubernetes.io/docs/concepts/policy/resource-quotas/>.
- **systemd resource control**:
  <https://www.freedesktop.org/software/systemd/man/systemd.resource-control.html>.
- **Linux cgroups v2**:
  <https://docs.kernel.org/admin-guide/cgroup-v2.html>.
- **Open Policy Agent**: <https://www.openpolicyagent.org/>.
- **LaunchDarkly** (feature flags): <https://launchdarkly.com/>.
- **Okta Conditional Access**:
  <https://help.okta.com/en-us/content/topics/access-management/administer-conditional-access.htm>.
- **XDG Base Directory Specification**:
  <https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html>.

## Cultural / Contextual Sources

- **Richard Canfield** (the game name inspiration for
  `canfield`) has nothing to do with dm despite the shared BSD
  origin — separate note.
- **Dungeons & Dragons** — the naming inspiration for the tool.
  A DM in D&D adjudicates the rules. dm(8) adjudicates system
  policy.
- **Dungeon Master (1987)** — FTL Games' unrelated dungeon
  crawler. Same name, same year, different program. Amusing
  collision.
- **Multics** — early 1970s multi-user OS. dm inherits Multics's
  general concern with "who gets what resources when" but
  applies it minimally.

## Citation Style

- Code references use `file:line` format where useful.
- URLs preferred over local paths; never paste local filesystem
  paths.
- Modern-equivalent citations should be permalinked when
  possible (release-tagged docs, not master-tracking URLs).

## Related root documents

- Root [`ATTRIBUTION.md`](../../../ATTRIBUTION.md).
- [`lineage.md`](./lineage.md).

## See also

- [`about.md`](./about.md) — reader intro.
- [`architecture.md`](./architecture.md) — mechanism.
- [`lessons.md`](./lessons.md) — 1987 → 2026 padanan.
- [`decisions/dm-001-skip-port.md`](./decisions/dm-001-skip-port.md)
  — the skip decision.
