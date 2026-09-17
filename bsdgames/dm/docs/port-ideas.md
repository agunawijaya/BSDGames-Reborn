# `dm` — Port Ideas

> **The port is skipped.** See
> [`decisions/dm-001-skip-port.md`](./decisions/dm-001-skip-port.md).

No port design is being pursued. This file exists for structural
consistency with the other games' folders.

## If someone were to port `dm` anyway

Not recommended, but if you insist:

- **Language:** any. It's 335 LOC of policy.
- **Platform:** Linux-only realistically — needs `getloadavg`
  and a login database.
- **Persistence:** none (dm is stateless per invocation).
- **UX:** existing — deny messages via stderr, exit codes as
  documented in [`spec.md`](./spec.md).
- **What would need to change:**
  - Replace setgid-hidden-binary trick with something Docker-
    or capability-based (setuid binaries are increasingly
    restricted by modern package managers).
  - Handle `ttyname(0)` == NULL for non-tty invocations.
  - Reconcile the exit-code inconsistency in the original
    (some denials exit 0, some exit 1).
  - Add structured logging (drop the `#ifdef LOG`).

## If someone were to reinterpret `dm` for a modern context

**Option: Parental controls for games on a home PC.**

- "No Fortnite between 8 AM and 3 PM on school days."
- "No games when the shared family iMac has more than 2 users
  logged in."
- File-based kill switch at `/etc/no-games` (or user-space
  equivalent).
- Config file with the same 4-column format:
  ```
  time  Monday    8  15
  game  fortnite  *  1  *
  ```

This would be a **new product inspired by `dm`**, not a port. It
belongs in its own repository. Related modern products: Screen
Time (macOS), Family Safety (Windows), Digital Wellbeing
(Android), Circle Home Plus (network-level).

**Option: HPC job scheduler minimal example.**

- SLURM does everything `dm` does and more. But SLURM is
  huge. A minimalist teaching version of "policy engine +
  gatekeeper" could be pedagogically valuable in an OS course.
- Not appropriate for this BSDGames preservation project.

## Related

- [`lessons.md`](./lessons.md) — every trick's modern padanan.
- [`lineage.md`](./lineage.md) — genealogy of the ideas.
- [`decisions/dm-001-skip-port.md`](./decisions/dm-001-skip-port.md)
  — the skip decision.
