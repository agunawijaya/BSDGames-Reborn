# `dm` — Manual Test Scenarios

> **The port is skipped**, so there are no test scenarios to run
> against our own binary. See
> [`decisions/dm-001-skip-port.md`](./decisions/dm-001-skip-port.md).

This file exists for structural consistency.

## If verifying the upstream `dm(8)` binary

Sketch of test cases for the original — useful if a future
engineer wants to verify behavior on a NetBSD system:

1. **T-01 Direct invocation** — run `dm` (not via symlink) →
   exit 0.
2. **T-02 Fresh symlink** — `ln -s dm foo && ./foo` with no
   config → attempts to exec `<libexec>/foo`, fails.
3. **T-03 Kill switch** — `touch /etc/nogames && ./foo` →
   "Sorry, no games right now.", exit 1.
4. **T-04 Kill switch with reason** — `echo "reboot at 6pm" >
   /etc/nogames && ./foo` → "Sorry, no games right now.\n\nreboot
   at 6pm".
5. **T-05 badtty** — `dm.conf` with `badtty /dev/pts/0` on
   pts/0 → denied.
6. **T-06 time block** — `dm.conf` with
   `time <today> 0 24` → "not available today".
7. **T-07 time boundary** — `time <today> 8 17` at 07:59 →
   allowed; at 08:00 → denied; at 16:59 → denied; at 17:00 →
   allowed.
8. **T-08 load gate** — set `game foo 0 999 *` (impossibly low
   load) → denied.
9. **T-09 users gate** — set `game foo * 0 *` (impossibly low
   user count) → denied.
10. **T-10 priority** — set `game foo * * 5` → runs; verify
    via `ps -o nice` that priority is +5.
11. **T-11 default fallback** — no rule for `foo`, but
    `game default * 999 *` → allowed.
12. **T-12 rules are order-sensitive** — put `game default`
    before `game foo` → the default matches first and specific
    is ignored.
13. **T-13 comments** — lines starting with `#` are silently
    ignored.
14. **T-14 malformed lines** — `game hack` (missing fields) is
    silently skipped.
15. **T-15 setgid semantics** — invoke via a game that shells
    out (e.g. hack's `!command`) → verify the shelled process
    does NOT inherit `games` group. (Requires understanding
    how each game drops privs.)

## Regression from Bugs

*(None — port skipped.)*
