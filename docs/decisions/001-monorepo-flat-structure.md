# ADR-001: Flat Monorepo Structure

- **Status:** Accepted
- **Date:** 2026-09-16
- **Deciders:** Agun Wijaya (repo owner)
- **Scope:** Root default

## Context

BSDGames contains 43 programs of very different kinds — full games
(hack, tetris, adventure), utilities (banner, factor), and one admin
tool (dm). We must decide how to lay them out in this repository.

Two dimensions of choice:

1. **Repo topology:** monorepo (all in one repo) vs. many repos.
2. **Folder grouping:** flat (all 43 side-by-side) vs. hierarchical
   (grouped by category, e.g. `games/board/gomoku/`) vs. semantic
   split (`games/` vs. `utils/`).

The project mission is *learn-and-teach*: readers benefit from being
able to compare programs, cross-reference them, and see the whole
picture at once. Cross-reference to the **original BSDGames source
tree** — where all 43 sit at one flat level — is an explicit goal.

## Options Considered

### Option A — Flat monorepo, all 43 under `bsdgames/`

**Description:** Single repository. All 43 program folders live under
`bsdgames/<name>/`, same level, no grouping.

**Pros:**
- Direct 1:1 correspondence with the original BSDGames folder layout
  — trivial cross-reference.
- Simplest possible navigation.
- Single build/test/lint setup shared across everything.
- Onboarding: one clone gets you everything.

**Cons:**
- Folder listing has 43 entries — potentially unwieldy on directory
  listings without tooling.
- Mixes "games" and "utilities" visually — the taxonomy is only in
  `catalog.md`, not in the tree.

**Suitable when:** Cross-reference to the upstream layout is a
first-class goal, or the collection is small enough (~50) that flat
still scales.

### Option B — Grouped monorepo (`bsdgames/board/gomoku/`, etc.)

**Description:** Monorepo, but 43 folders grouped by category under a
sub-hierarchy.

**Pros:**
- Category is visible in the tree — arguably more discoverable.
- Directory listings are shorter at each level.

**Cons:**
- Diverges from the upstream layout — every reference now needs an
  extra path segment.
- Category is subjective — where does `wargames` sit? Where does
  `arithmetic` (game vs. utility)?
- Renaming or recategorising is painful (path changes).

**Suitable when:** Categories are stable and important; upstream
mirroring is not a goal.

### Option C — Semantic split (`games/` vs `utils/`)

**Description:** Two top-level folders. Games in one, utilities in
another.

**Pros:**
- Semantic clarity — a stranger immediately sees the distinction.
- Better "portfolio narrative" (43 games vs. 43 programs).

**Cons:**
- Diverges from upstream layout.
- The boundary is fuzzy — `arithmetic`, `wargames`, `wtf` are
  borderline.
- Any reclassification breaks paths.

**Suitable when:** The games-vs-utilities distinction is a strong
part of the project identity.

### Option D — Many repos, one per program

**Description:** 43 separate GitHub repos.

**Pros:**
- Each program independently versioned.
- Contributors can focus on one repo.

**Cons:**
- 43× the maintenance overhead.
- No shared library or shared docs feasible.
- Cross-reference becomes 43 external links.
- Onboarding = 43 clones.
- Renders the pedagogical "living textbook" concept impractical.

**Suitable when:** Programs have wildly different release cadences
and no shared dependencies — not our case.

## Decision

**We chose Option A — flat monorepo, all 43 under `bsdgames/`.**

The mission (§1 of [`AGENTS.md`](../../AGENTS.md)) explicitly values
teaching and cross-reference. Option A gives us the cleanest path to
that: any doc that says "compare `tetris` to `robots`" resolves to
two peer folders. Any reader who has the upstream tree open sees the
same shape here.

Option B's discoverability benefit is redundant — `catalog.md`
already provides an authoritative category index, and a
[mindmap](../catalog.md#package-overview) visualises it. Option C's
semantic clarity is provided by the same catalog. Option D would
destroy the shared-library and shared-docs benefits of a monorepo.

## Consequences

### Positive

- 1:1 path correspondence with upstream.
- Shared build/test tooling.
- Cross-reference between game folders trivial.

### Negative / Risks

- Directory listing is long. Contributors should navigate through
  `docs/catalog.md`, not by scrolling `bsdgames/`.

### Follow-on Work

- `catalog.md` remains the authoritative index of category & type.
- Progress dashboard must group by category to compensate for the
  flat structure.
- Root `AGENTS.md` §6 documents this layout.

## References

- [`docs/catalog.md`](../catalog.md) — the category index.
- Original layout: <https://github.com/vattam/BSDGames>
