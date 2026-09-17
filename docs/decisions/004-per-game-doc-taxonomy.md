# ADR-004: Per-Game Documentation Taxonomy

- **Status:** Accepted (revised 2026-09-17 per
  [ADR-006](./006-multi-port-architecture.md))
- **Original Date:** 2026-09-16
- **Revision Date:** 2026-09-17
- **Deciders:** Agun Wijaya (repo owner)
- **Scope:** Root default. Governs docs at **game level** (canonical,
  once per game) and at **port level** (per implementation).

## Revision Note (2026-09-17)

This ADR was originally accepted 2026-09-16 under a single-port
assumption — one game meant one implementation, and all fourteen
documents lived in the same folder. On 2026-09-17, ADR-006
established multi-port architecture: one game may have many
port implementations, coexisting under `bsdgames/<game>/ports/`.

The taxonomy is now split into two tiers:

1. **Canonical (game-level)** — `bsdgames/<game>/docs/` — describes
   the game itself and its original C implementation. Written once,
   used by every port.
2. **Port-level** — `bsdgames/<game>/ports/<port>/docs/` — describes
   a specific port implementation. Written per port.

The original decision — a comprehensive doc set — remains. What
changed is *where each doc lives* and *who writes it*. The original
options analysis (Options A–D below) is preserved for pedagogical
continuity.

## Context (Updated)

The original context still holds:

- Readers must be able to navigate any game folder with the same
  mental model.
- Contributors need to know exactly what to write.
- Templates must be automatable.
- The pedagogical mission ([`AGENTS.md`](../../AGENTS.md) §1) is
  systematically served — each folder is a self-contained learning
  artifact.

What multi-port adds:

- "Documenting the game" and "documenting a port" are now two
  distinct activities with different audiences and different
  lifecycles.
- Canonical docs (spec, architecture, about, …) describe *what the
  game is*. They rarely change once accurate.
- Port docs (diff-log, port ADRs) describe *how one contributor
  chose to implement it*. They churn with every port.
- Duplicating canonical docs into every port would silently drift
  the spec and destroy the "one contract, many implementations"
  premise of ADR-006.

## Options Considered

### Option A — Minimal (3 docs)

**Description:** `README.md`, `AGENTS.md`, `CLAUDE.md`, plus
source. Everything else lives in code comments or is not
documented.

**Pros:**
- Fast to spin up a new game folder.
- Low doc-writing burden.

**Cons:**
- No brochure, no port-design record, no historical context, no
  reverse-spec.
- Directly conflicts with the "teach" pillar.
- Discoverability of learnings across 43 games is nil.

**Suitable when:** The project is code-first with docs an
afterthought. Not our mission.

### Option B — Medium (5–6 docs)

**Description:** README + AGENTS + CLAUDE + about + how-to-play +
spec.

**Pros:**
- Covers the essentials (what / why / how-to-play).
- Manageable per-game burden.

**Cons:**
- Missing: original-code analysis, lessons for beginners, port
  design record, diff log, test scenarios, lineage, references.
- Only partially serves the teaching mission.

**Suitable when:** A first-iteration release where deeper docs
come later.

### Option C — Comprehensive (14 docs) [chosen]

**Description:** The full document set enumerated in
[`AGENTS.md`](../../AGENTS.md) §6:
`README + AGENTS + CLAUDE + about + how-to-play + walkthrough
(conditional) + world-map (conditional) + architecture + lessons
+ port-ideas + spec + notes + manpage + diff-log +
test-scenarios + lineage + references`, plus a `decisions/`
subfolder.

*(2026-09-17: the same set is retained, but partitioned between
game level and port level per the sub-decision below.)*

**Pros:**
- Every game (and every port) becomes a complete learning
  artifact.
- Consistency across 43 folders enables cross-game synthesis
  (glossary, timeline, learning notes).
- Every step of the porting workflow has a designated home.
- Templates make it manageable — write once, use N times.

**Cons:**
- Roughly 12–14 markdown files at the game level × 43 games +
  4–6 files per port × N ports ≈ 600+ docs eventually.
- Effort per game is real (see estimates in
  [`porting-guide.md`](../porting-guide.md)).
- Baseline for release is strict.

**Suitable when:** Learning and teaching are first-class mission
pillars.

### Option D — Ad-hoc per game

**Description:** Each game decides its own doc set.

**Pros:**
- Flexibility.

**Cons:**
- No consistency across 43 folders.
- No cross-game synthesis possible.
- Every contributor argues about what to write.
- Templates impossible.

**Suitable when:** Never for a project this size.

## Sub-Decision (2026-09-17): Canonical vs Port-Level Split

Under multi-port, the fourteen documents partition as follows.

### Canonical (game-level) — `bsdgames/<game>/docs/`

Everything that describes *the game itself*, its history, or its
original C implementation. Written once per game; read by every
port.

| Document | Purpose |
|---|---|
| `spec.md` | **The contract** every port must honor. Implementation-independent mechanics. |
| `about.md` | Brochure — authors, publisher, release year, cultural context, "why it's fun", making-of anecdotes, known bugs. |
| `how-to-play.md` | Universal rules — controls, win conditions, tips, scoring. |
| `manpage.md` | Mirror of the original `.6` man page in Markdown. |
| `architecture.md` | Analysis of the **original C source**, not any port. |
| `lessons.md` | Pedagogy anchored in the original code (file:line references to upstream). |
| `references.md` | Primary + historical + technical sources cited. |
| `lineage.md` | Genre siblings + modern descendants. |
| `port-ideas.md` | Catalog of possible port directions — the "menu" for prospective contributors. Post-ADR-006 this doc becomes especially load-bearing. |
| `test-scenarios.md` | Universal acceptance scenarios every port must pass. |
| `notes.md` | Free-form working notes at the game level. |
| `walkthrough.md` | **Conditional** — adventure games only. Two walkthroughs (shortest path + max score). |
| `world-map.md` | **Conditional** — fixed-map / graph-topology games only. Mermaid map + Master Room & Object / Entity Directory. |
| `decisions/` | **Game-level** ADRs — rare, only when a decision applies to *all* ports of this game (e.g., a trademark rename affecting every port). |

Outside `docs/`:

- `README.md` — landing page for the game, listing ports.
- `AGENTS.md`, `CLAUDE.md` — game-level agent context (pointer
  files).
- `media/` — screenshots of the **original BSDGames binary**
  (shared across ports).

### Port-level — `bsdgames/<game>/ports/<port>/`

Everything that describes *a specific port implementation*.
Written per port.

Inside `docs/`:

| Document | Purpose | Required? |
|---|---|:---:|
| `diff-log.md` | Feature-by-feature narrative of original → this port. What was kept, changed, added, removed. | ✅ |
| `decisions/` | Port-specific ADRs (tech choices, deviations from canonical spec). May be empty. | ✅ (folder), content optional |
| `test-scenarios.md` | Extra scenarios if this port adds features beyond the canonical spec (multiplayer, cloud sync, custom modes). | Optional |
| `notes.md` | Working notes specific to this port. | Optional |

Outside `docs/`:

- `README.md` — pitch, tech stack, target platform, live URL,
  install/build, author, license. **Required.**
- `AGENTS.md` — thin pointer to game AGENTS + root AGENTS.
  **Required.**
- `CLAUDE.md` — pointer. **Required.**
- `src/`, `tests/` — implementation.
- `media/` — **port-specific** screenshots (in addition to
  game-level `media/` of the original).
- `package.json` / `Cargo.toml` / `pyproject.toml` / etc. — port's
  build system.

### What port-level docs do **not** duplicate

A port's `docs/` does **not** contain: `spec.md`, `about.md`,
`how-to-play.md`, `manpage.md`, `architecture.md`, `lessons.md`,
`references.md`, `lineage.md`, `port-ideas.md`, `walkthrough.md`,
`world-map.md`. These live only at the canonical level. If a port
discovers those docs are wrong, the fix is a PR to the canonical
docs — not a port-level shadow copy that silently diverges.

## Decision

**We chose Option C from the original analysis (comprehensive doc
set), now partitioned into canonical (game-level) and port-level
tiers per the 2026-09-17 sub-decision above.**

The comprehensive surface remains right. Multi-port simply
splits that surface between "the game" (written once) and "the
port" (written per implementation).

## Consequences

### Positive

- Every game folder is a self-contained learning artifact
  (canonical).
- Every port folder is a self-contained implementation record.
- Cross-game analyses (e.g. "AI patterns across BSDGames") can be
  synthesised from consistent canonical data.
- Cross-port analyses within one game ("how did each port handle
  the AI?") can be synthesised from consistent port-level
  `diff-log.md` files.
- New contributors see the same structure at each tier.
- **New under ADR-006:** canonical docs act as a shared foundation
  — no duplication across ports. `spec.md` is written once and
  every port reads the same contract.
- **New under ADR-006:** port-level doc burden is small (README +
  diff-log + optional decisions/tests) since canonical work is
  already done. This makes port contribution accessible.

### Negative / Risks

- Sustained effort required to fill the canonical 12–14 docs per
  game.
- Progress dashboard becomes critical for tracking at both tiers.
- Some games will linger at "baseline released" for a long time.
  Acceptable — released is enough for a user; polished is a
  further stage.
- **New under ADR-006:** canonical docs may drift from reality if
  a port's implementation surfaces a spec bug that gets fixed
  in-port silently. **Mitigation:** any port that discovers a
  canonical error must open a PR to fix canonical docs, not work
  around silently. This is a Universal Port Contract expectation
  (ADR-006 §Universal Port Contract, item 1).
- **New under ADR-006:** existing games already have
  `docs/diff-log.md` and `docs/decisions/` at the game level
  (written pre-ADR-006, when there was only one port). These
  contain speculative pre-port work. **Mitigation** (mechanical
  migration):
  - `docs/diff-log.md` — content should be reviewed. Design
    ideas migrate to `docs/port-ideas.md` (canonical menu).
    Speculative implementation choices are discarded (they will
    be re-decided per port at port-level `diff-log.md`).
  - `docs/decisions/` — remain in place at canonical level.
    They already represent game-level overrides, which is
    correct.

### Follow-on Work

- Split [`docs/templates/`](../templates/) into:
  - `templates/game/` — canonical doc templates (all 13
    including conditional).
  - `templates/port/` — port-level templates (README, AGENTS,
    diff-log, package.json for classic-web, vite.config.ts, etc.).
- Update root [`AGENTS.md`](../../AGENTS.md) §6 to reflect the
  two-tier taxonomy. Update its §6.1 table to show canonical vs
  port-level.
- Update [`docs/porting-guide.md`](../porting-guide.md) — the
  workflow no longer produces a monolithic game folder; it now
  produces (a) canonical docs once, then (b) one port
  implementation. Step 10 (implement) moves from
  `bsdgames/<game>/src/` to
  `bsdgames/<game>/ports/<port>/src/`.
- Update `docs/progress.md` — dashboard rows become per-port, not
  per-game.
- For the 28 games that already have `docs/diff-log.md` at game
  level: run the migration described in Consequences → Negative
  → Mitigation. Not urgent; can happen as each game gets its
  first real port.

## References

- Root [`AGENTS.md`](../../AGENTS.md) §6.
- [ADR-001 — Monorepo flat structure](./001-monorepo-flat-structure.md).
- [ADR-002 — Porting philosophy](./002-porting-philosophy.md).
- [ADR-006 — Multi-port architecture](./006-multi-port-architecture.md)
  (the reason this ADR was revised).
- Templates: [`docs/templates/`](../templates/) — to be split
  per the Follow-on Work above.
- Porting workflow: [`porting-guide.md`](../porting-guide.md) —
  to be updated.
