# dm — Dungeon Master

> The 1987 BSD **game-access regulator**. Not a game itself — a
> gatekeeper program that decided *who* could play *which* game
> *when*, based on system load, TTY, time of day, and configured
> per-game policy. A small (~335 LOC) sysadmin tool that solved a
> distinctly-1987 problem in a distinctly-elegant way.

- **Author:** UC Berkeley, 1987 (BSD 4.3 Tahoe). Later NetBSD
  maintenance.
- **Category:** Administration / policy enforcement.
- **Complexity:** S (~1–3 days work).
- **Status:** 📖 **Docs only — port SKIPPED by
  [ADR dm-001](./docs/decisions/dm-001-skip-port.md).** The
  original problem (shared multi-user Unix host with 20 grad
  students playing Hack on the departmental VAX) no longer
  exists in 2026. Modern equivalents — cgroups, MDM, Screen Time,
  Kubernetes ResourceQuotas — solve it better.

## Why documentation without a port?

Because **the ideas in `dm` are worth teaching, even though the
tool itself is dead.** In 335 lines of C, dm demonstrates:

- **Symlink-as-dispatcher** (`argv[0]`-based multiplexing) — the
  same pattern BusyBox and Perl's `perl` binary would later use.
- **Setgid-hidden binaries** — access control before ACLs and
  before Docker.
- **Declarative policy files** — before Puppet, Ansible, or
  Kubernetes YAML.
- **Load-average gating** — resource-aware scheduling before
  autoscalers.
- **Time-window enforcement** — scheduled access before
  business-hour SSO.
- **Real-time user counting via utmp** — awareness of shared-
  system dynamics before observability tooling.

For modern programmers who've never worked on a shared machine,
`dm` is a compact case study in "how did they even do this without
X" (X ∈ containers, cgroups, systemd, Kubernetes).

## What lives here

```text
dm/
├── AGENTS.md                — instructions for AI agents
├── CLAUDE.md                — pointer to AGENTS.md
├── README.md                — this file
├── docs/
│   ├── about.md             — what dm is + advanced-for-its-time
│   ├── architecture.md      — how it worked around limitations
│   ├── lessons.md           — modern padanan for every trick
│   ├── manpage.md           — annotated original man page
│   ├── lineage.md           — where these ideas evolved
│   ├── notes.md
│   ├── references.md
│   ├── spec.md              — brief formalization
│   ├── how-to-play.md       — n/a (not a game)
│   ├── port-ideas.md        — port skipped; see ADR
│   ├── test-scenarios.md    — n/a
│   ├── diff-log.md
│   └── decisions/
│       ├── README.md
│       └── dm-001-skip-port.md  — the skip decision
├── src/                     — empty; port skipped
├── media/                   — no screenshots (no interactive UI)
└── tests/                   — empty
```

## Start here

- **New reader?** → [`docs/about.md`](./docs/about.md).
- **Curious about the mechanism?** → [`docs/architecture.md`](./docs/architecture.md).
- **Want the modern equivalent of each trick?** →
  [`docs/lessons.md`](./docs/lessons.md).
- **Why isn't it being ported?** →
  [`docs/decisions/dm-001-skip-port.md`](./docs/decisions/dm-001-skip-port.md).

## Attribution & Licensing

Original © 1987, 1993 The Regents of the University of California,
released under the BSD 3-clause licence. Later NetBSD maintenance
under the same terms.

See root [`ATTRIBUTION.md`](../../ATTRIBUTION.md).
