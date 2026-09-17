# ADR-003: `AGENTS.md` as Multi-Model Instruction Standard

- **Status:** Accepted
- **Date:** 2026-09-16
- **Deciders:** Agun Wijaya (repo owner)
- **Scope:** Root default

## Context

Multiple AI coding tools are in scope for this project: Claude Code,
Codex (OpenAI), Kimi Code (Moonshot), Gemini via AntiGravity,
possibly others.

Each tool has its own convention for a project-level instruction
file. Historically:

- **Claude Code** auto-loads `CLAUDE.md`.
- **Codex** and **GitHub Copilot Coding Agent** auto-load `AGENTS.md`.
- **Kimi Code**, **Gemini/AntiGravity**, and others are converging
  toward `AGENTS.md` too — the emerging cross-tool standard.

We need a way to keep instructions consistent across tools without
maintaining multiple parallel files.

## Options Considered

### Option A — `AGENTS.md` as single source, `CLAUDE.md` as thin pointer

**Description:** All instruction content lives in `AGENTS.md`.
`CLAUDE.md` (and any other tool-specific file) is a minimal pointer
that says "see `AGENTS.md`".

**Pros:**
- Single source of truth. Zero content drift.
- Follows the emerging cross-tool convention.
- Adding a new tool = adding one thin pointer file.
- Human contributors read exactly the same doc as agents.

**Cons:**
- Requires Claude Code (and any tool that only reads its native file)
  to follow the pointer. Recent versions do; older may not.
- Slight indirection for readers.

**Suitable when:** Multiple tools are in scope, drift avoidance is
paramount.

### Option B — Duplicate `AGENTS.md` and `CLAUDE.md` content

**Description:** Both files contain the same instructions.

**Pros:**
- Every tool loads its native file with full content.
- Zero indirection.

**Cons:**
- Content drifts within weeks. Guaranteed inconsistency.
- Doubles maintenance for every edit.
- The most-updated file wins invisibly.

**Suitable when:** Never, for anything longer than a page.

### Option C — Symlink `CLAUDE.md` → `AGENTS.md`

**Description:** Filesystem symlink from `CLAUDE.md` to `AGENTS.md`.

**Pros:**
- One physical file, two access paths.

**Cons:**
- Symlinks are unreliable on Windows without admin rights and
  developer mode.
- Git handles symlinks inconsistently across platforms.
- Some tools do not follow symlinks.

**Suitable when:** POSIX-only environments where developer mode is
guaranteed — not us (Windows is a supported dev platform).

### Option D — Everything in `CLAUDE.md`, no `AGENTS.md`

**Description:** Ignore the emerging standard; use Claude's file
name.

**Pros:**
- Simple.

**Cons:**
- Ties the project's identity to one vendor.
- Codex, Gemini, etc. do not auto-load `CLAUDE.md`.
- Every new tool requires a workaround.

**Suitable when:** Only Claude Code will ever be used. Not our
requirement.

## Decision

**We chose Option A — `AGENTS.md` as single source, `CLAUDE.md` as
thin pointer.**

This mirrors the emerging cross-tool convention while keeping Claude
Code's auto-load behaviour working via `CLAUDE.md`. Zero drift, zero
duplication, minimal indirection. Applies at every folder level
(root and per-game).

## Consequences

### Positive

- Adding a new AI tool = add one thin pointer file. No content
  rewrite.
- Human contributors and AI agents read the same file.
- Cross-tool consistency verifiable at a glance.

### Negative / Risks

- Any tool that does not follow a pointer file will see only
  "See `AGENTS.md`" — which requires the tool operator to read the
  target file. Acceptable given all major tools do follow pointers
  or auto-load `AGENTS.md` directly.

### Follow-on Work

- Per-game `AGENTS.md` and `CLAUDE.md` follow the same pattern (as
  documented in
  [`docs/templates/game-CLAUDE.md`](../templates/game-CLAUDE.md)).
- If a new tool requires its own filename convention, add another
  thin pointer file — never duplicate.

## References

- OpenAI Codex docs: <https://openai.com/> (AGENTS.md convention).
- Emerging AGENTS.md convention discussion on GitHub.
- Root [`AGENTS.md`](../../AGENTS.md) §3 (Multi-Model Support).
