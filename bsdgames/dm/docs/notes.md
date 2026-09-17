# `dm` — Working Notes

> Free-form working notes for the `dm` documentation.

---

## 2026-09-17 — Documentation Phase

- Documentation phase completed.
- Port explicitly skipped by
  [`decisions/dm-001-skip-port.md`](./decisions/dm-001-skip-port.md).
- 4 deep docs written per user's editorial brief:
  - [`about.md`](./about.md) — intro for modern programmers +
    "advanced for its time" trivia.
  - [`architecture.md`](./architecture.md) — line-by-line
    walkthrough of the 335 LOC.
  - [`lessons.md`](./lessons.md) — 12-row table of 1987
    mechanism → 2026 padanan.
  - [`lineage.md`](./lineage.md) — genealogy of the ideas.
- Also written:
  - [`manpage.md`](./manpage.md) — annotated `dm(8)` +
    `dm.conf(5)`.
  - [`references.md`](./references.md) — citations.
  - [`decisions/dm-001-skip-port.md`](./decisions/dm-001-skip-port.md)
    — the ADR.
- Stub docs (spec.md, how-to-play.md, port-ideas.md,
  test-scenarios.md, diff-log.md) point at the skip ADR.

## Key findings from source analysis

- **335 lines of C do a lot.** The whole game-access policy
  engine is one file, one screenful of logic.
- **`argv[0]` dispatch** was in production 9 years before
  BusyBox popularized the idiom.
- **Setgid + hidden `/usr/libexec/`** is a proto-container
  sandbox using nothing but Unix filesystem permissions.
- **The `/etc/nogames` kill switch** — literally file presence
  as feature flag — is elegantly minimal.
- **`getloadavg()[2]`** (15-minute avg) shows the authors
  understood signal-noise trade-offs in scheduling. The right
  smoothing window is still the right smoothing window in 2026.
- **Silent tolerance in the config parser** (skip malformed
  lines) is antithetical to modern strict-validation norms, but
  arguably correct for sysadmin-authored files.
- **`#ifdef LOG`** for the audit log is the least defensible
  design choice by modern standards.

## Why documenting `dm` matters even without a port

Multi-user shared Unix is a **foreign environment** to most
programmers under 40. Without seeing code from that era, it's
easy to assume the modern layered stack (containers → cgroups →
namespaces → filesystem) was always necessary. `dm` proves it
wasn't. The 1987 engineers achieved surprisingly close outcomes
with far fewer primitives.

Reading `dm.c` is a **compression exercise**: everything the
authors knew about resource management, access control, and
policy enforcement, distilled into 335 lines. The distillation
teaches something the layered modern stack obscures.

## Open questions (for future readers)

- **When did BSD 4.3 Tahoe stop shipping `dm`?** The tool is
  still in NetBSD source but rarely mentioned in modern BSD
  documentation. When did it fall out of typical `bsdgames`
  installations?
- **Who wrote `dm` originally?** The source header lists no
  individual author beyond "The Regents of the University of
  California, 1987, 1993". A little archaeology in the NetBSD
  commit history might turn up specific names.
- **Are there any surviving `dm.conf` files** from real 1988-era
  Berkeley VAXes? An interesting historical artifact if so.

## Style notes for future editors

- **Preserve the pedagogical framing.** These docs teach modern
  programmers about the past; don't lose that voice.
- **Keep the 1987 vs 2026 juxtaposition explicit.** Every
  section benefits from "here's how they did it, here's how we
  do it now, here's why both work."
- **Don't apologize for `dm`'s design.** It was excellent for
  its constraints. Modern isn't always better; different
  problems get different tools.
- **Cite modern equivalents.** LaunchDarkly, K8s, systemd,
  cgroups. Readers should leave with a mental map of where
  these ideas live now.

<!--
Future iteration notes:
- A "diff-view" appendix showing the same policy in dm.conf,
  systemd unit file, Kubernetes ResourceQuota YAML, and Rego
  might be pedagogically powerful. Consider adding.
- A screenshot of the DENIAL flow (running hack when
  load>threshold) could be captured against a real BSD system —
  someone with a NetBSD 10 VM could do this. Non-blocking.
- Consider a short "reading guide" for someone approaching dm
  cold — which file to read first, what to notice.
-->
