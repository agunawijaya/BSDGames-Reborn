# `dm` — Diff Log

> Chronological log of changes during the documentation phase.

---

## 2026-09-17 — Documentation-only phase

- Documentation phase kickoff. Owner: Agun via Claude.
- Read upstream `dm.c`, `dm.8.in`, `dm.conf.5.in`,
  `utmpentry.c` from
  <https://github.com/vattam/BSDGames/tree/master/dm>.
- **Decision:** port skipped. Documented in
  [`decisions/dm-001-skip-port.md`](./decisions/dm-001-skip-port.md).
  Rationale: the problem `dm` solves (shared multi-user
  Unix machines competing for CPU) no longer exists.
- Written per user's editorial brief: teach modern programmers
  how 1987 engineers worked around the absence of containers,
  cgroups, systemd, and Kubernetes.
- **Files created:**
  - `README.md` — folder overview with "docs-only, port skipped"
    banner.
  - `AGENTS.md` — instructions for agents including the skip
    note.
  - `CLAUDE.md` — thin pointer.
  - `docs/about.md` — reader intro + "advanced for its time".
  - `docs/architecture.md` — 335-LOC walkthrough with modern
    context callouts.
  - `docs/lessons.md` — 12-row table of 1987 mechanism → 2026
    padanan.
  - `docs/lineage.md` — genealogy of the ideas.
  - `docs/manpage.md` — annotated `dm(8)` + `dm.conf(5)`.
  - `docs/notes.md` — dev notes on the doc phase.
  - `docs/references.md` — citations.
  - `docs/spec.md` — brief formal spec (for consistency; port
    skipped).
  - `docs/how-to-play.md` — pointer noting "not a game".
  - `docs/port-ideas.md` — pointer to ADR.
  - `docs/test-scenarios.md` — pointer to ADR.
  - `docs/decisions/README.md` + `dm-001-skip-port.md`.
- **Files not created:**
  - `src/` — empty; port skipped.
  - `tests/` — empty; nothing to test.
  - `data/` — empty; `dm.conf` is user-authored not shipped.
  - `media/` — empty; `dm` has no interactive UI.

## Anticipated future changes

- If the project decides to reproduce the 1987 environment for
  educational purposes (e.g., a NetBSD-in-a-Docker demo), we
  might revisit and add a `data/` folder with sample `dm.conf`
  files.
- If a modern reinterpretation project spins off (parental
  controls, HPC teaching tool), a link in `references.md`
  should be added.
- Screenshot capture (against a real BSD system running dm)
  could be added later — non-blocking.

## See also

- Notes: [`notes.md`](./notes.md).
- Skip ADR: [`decisions/dm-001-skip-port.md`](./decisions/dm-001-skip-port.md).
