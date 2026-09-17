# ADR dm-001: Skip the `dm` port

## Status

**Accepted** — 2026-09-17.

## Context

`dm` is a 1987 BSD tool that regulated access to games on
shared multi-user Unix hosts. It gated game execution based on:

- System load average.
- Number of logged-in users.
- TTY of the requesting session.
- Time of day and day of week.
- Per-game policy in `/etc/dm.conf`.

The tool solved a real 1987 problem: **20 grad students sharing
one VAX**, some of whom wanted to play `hack` at 2 PM while
others needed the machine for thesis simulations.

In 2026, this problem no longer exists in any meaningful form:

- No one shares a physical Unix host for interactive workloads.
- Everyone has a personal laptop or dedicated cloud VM.
- Multi-tenant compute lives in Kubernetes or SLURM clusters
  which have vastly more sophisticated policy engines.
- Time-based access control is a solved problem via SSO
  conditional-access, MDM, and parental-control frameworks.

## Options

### Option A: Port as-is

Rewrite `dm` in the port's target language, targeting the same
use case: gating access to games.

**Pros:**
- Consistent with the project's "port everything" goal.
- Preserves the code as running artifact.

**Cons:**
- **The use case is dead.** No modern user would install this.
- Would require re-implementing setgid semantics (or an
  equivalent) in a way that works on macOS, Windows, and Linux
  — a significant undertaking with negative return.
- The output would be a curiosity, not a tool with users.

### Option B: Reinterpret as parental controls

Rewrite the concept for the modern home-computer context.
"No Fortnite during school hours" would replace "no Hack when
load > 5".

**Pros:**
- Real problem people have today.
- Preserves the design ideas in a new coat.

**Cons:**
- **Not a preservation project anymore.** It's a new product
  inspired by dm.
- Screen Time (macOS/iOS), Family Safety (Windows), Digital
  Wellbeing (Android), and OpenDNS Family Shield all solve this
  well. The market is saturated.
- Documentation about `dm` doesn't teach anything about
  Fortnite blocking; the two problems are only superficially
  similar.

### Option C: Reinterpret as game-launcher-with-quota

Rewrite as a Steam-Family-Sharing-like tool: track hours,
enforce daily caps, per-game policy.

**Pros:**
- Ships a useful modern product.
- Uses `dm`'s architectural ideas.

**Cons:**
- Still not preservation.
- Same market-saturation problem.
- The project's stated goal is to port BSDGames, not to build a
  new game-launcher.

### Option D: Skip the port — document only

Write comprehensive documentation about what `dm` was, how it
worked, and where its ideas live now. Skip the port itself.
Leave `src/`, `tests/`, `data/`, and `media/` empty.

**Pros:**
- Honest about the tool's obsolescence.
- Preserves the *knowledge* embedded in `dm` (which is genuinely
  valuable — see [`../about.md`](../about.md) and
  [`../architecture.md`](../architecture.md)).
- Zero maintenance burden.
- Frees porter attention for the 42 games that DO benefit from
  porting.

**Cons:**
- Breaks the "port everything" symmetry of the project.
- Might disappoint completionists.

## Decision

**Option D — Skip the port; document extensively.**

Rationale:

1. **The problem `dm` solves is gone.** No 2026 user would run
   `dm`. A port would be dead-on-arrival software.

2. **The ideas in `dm` are worth teaching.** In 335 lines of C,
   `dm` demonstrates: `argv[0]` dispatch (pre-BusyBox by 9
   years), setgid-hidden binaries (pre-Docker by 26 years),
   declarative policy files (pre-Puppet by 18 years),
   load-aware scheduling (pre-cgroups by 20 years), and
   file-based kill switches (still the correct answer for small
   deployments in 2026).

3. **A port would obscure, not illuminate.** Rewriting `dm` in
   Rust or TypeScript would produce a curiosity, not a
   teaching tool. The value is in reading the 1987 code and
   understanding the 1987 constraints. Modernizing it destroys
   the pedagogical exhibit.

4. **The user explicitly requested this framing.** The user
   said: *"Programmer jaman sekarang bisa belajar, bagaimana
   cara orang di masa lalu bisa mengakali keterbatasan. Tulis
   juga apa yang advance pada masanya."* The right output is
   deep, thoughtful documentation — not new code.

5. **Reinterpretation belongs elsewhere.** If someone wants to
   build a modern parental-controls tool inspired by `dm`, that's
   a valuable project. But it belongs in its own repository,
   with its own README, and its own user base. It should not
   be conflated with a BSDGames preservation effort.

## Consequences

**What follows from this decision:**

- `bsdgames/dm/src/` remains empty (or is deleted).
- `bsdgames/dm/tests/` remains empty.
- `bsdgames/dm/media/` remains empty (no interactive UI to
  screenshot).
- `bsdgames/dm/data/` remains empty.
- `bsdgames/dm/docs/` is populated with high-quality
  educational content:
  - `about.md` — reader intro + "advanced for its time".
  - `architecture.md` — mechanism walkthrough.
  - `lessons.md` — 1987-to-2026 padanan for every trick.
  - `lineage.md` — genealogy of the ideas.
  - `manpage.md` — annotated original man page.
  - `references.md` — citations.
  - `notes.md` — dev notes.
  - Other doc files (spec, how-to-play, port-ideas,
    test-scenarios, diff-log) become stubs pointing at this
    ADR.
- `docs/progress.md` marks `dm` as "🟠 Docs only — port skipped
  by ADR".

**What this decision does NOT preclude:**

- Someone building a modern parental-controls or game-launcher
  tool inspired by `dm` — as an independent project.
- Revisiting this decision if the project's goals change (e.g.
  if the target audience turns out to be sysadmin educators
  who want a running artifact).
- Reproducing the `dm` binary from upstream for anyone who
  wants to run it on a real BSD system — the upstream source
  compiles fine.

## Alternatives that were considered and rejected

- **Rewrite as a "gaming resource meter" for streamer setups.**
  Too niche and unrelated to the original design intent.
- **Rewrite as a shared-container job scheduler.** This is
  literally what SLURM and Kubernetes are for. Building a third
  is unhelpful.
- **Rewrite as a proof-of-concept for teaching operating
  systems.** Educational rewrites have merit but belong in an
  OS course, not a preservation project.

## Review

This ADR should be revisited if:

- The project's target audience shifts toward sysadmin
  educators.
- A demonstrably useful modern reinterpretation surfaces (in
  which case it goes in a separate repo).
- The upstream `dm(8)` is removed from NetBSD (currently still
  present, though rarely maintained).

Until then: skip.
