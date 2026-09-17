# ADR-002: Porting Philosophy — Spiritual Successor

- **Status:** Accepted
- **Date:** 2026-09-16
- **Deciders:** Agun Wijaya (repo owner)
- **Scope:** Root default (applies to all 43 programs unless
  per-game ADR overrides)

## Context

Porting an old codebase can take many forms. This decision sets the
default philosophy — the answer to *"how faithful must the port be?"*.

The mission (§1 of [`AGENTS.md`](../../AGENTS.md)) balances three
goals: **preserve**, **modernize**, **teach**. The philosophy must
serve all three.

## Options Considered

### Option A — Faithful port (bug-for-bug)

**Description:** Replicate original behaviour exactly. Every quirk,
every historical bug, every screen-position artefact is retained.
The port is essentially a rewrite in a new language of the same
program.

**Pros:**
- Educates on the exact design decisions of the era.
- Preserves cultural artefacts (weird UI, in-jokes, historical bugs).
- Simpler scope — the target is defined by the source.

**Cons:**
- Ignores decades of UX and platform improvements.
- Uninviting to modern players.
- Constraints of the era (memory, terminal size) are irrelevant now
  but still shape the code.
- No multiplayer over internet, no cloud sync, no accessibility.

**Suitable when:** The goal is preservation (a computing-history
museum) rather than a living game.

### Option B — Spiritual successor

**Description:** Preserve core mechanics and the *feel* of the
original. Freely modernise UX, UI, AI, multiplayer, persistence,
accessibility. Reinterpret obsolete features. Every modernisation
is documented as an ADR.

**Pros:**
- Serves all three mission pillars — preserves mechanics
  (preserve), modernises everything else (modernize), documents
  every choice (teach).
- Produces something people actually want to play.
- No arbitrary limits from the era.
- Space for real design work per game (rich pedagogical output).

**Cons:**
- More decisions to make → more ADRs.
- Boundary between "core mechanic" and "changeable UX" is subjective.
- Harder to verify "did we preserve the feel?"

**Suitable when:** The port needs to be *usable and inviting* while
still honouring the original.

### Option C — Complete redesign

**Description:** Take the concept as inspiration; build a new game.
Not really a port.

**Pros:**
- Total design freedom.

**Cons:**
- Loses the connection to the original — no longer really a port.
- Undermines the "teach from the original" mission.
- The 43-program set stops being a coherent thing.

**Suitable when:** The original is only a starting idea, not the
subject. Not our case.

### Option D — Faithful + optional modern skin

**Description:** Ship two modes per game: a faithful mode and a
modern mode. Toggle at launch.

**Pros:**
- Have your cake and eat it.

**Cons:**
- 2× implementation and testing burden.
- Harder to modernise deeply — the modern mode is constrained by
  needing to coexist with the faithful mode.
- Feature bloat.

**Suitable when:** A single high-profile game (perhaps `hack` or
`adventure`) — not scalable to 43.

## Decision

**We chose Option B — spiritual successor.**

The mission's three pillars are best served together. A faithful
port (A) alone fails the "modernize" pillar and produces a museum
piece that few will play. A redesign (C) fails the "preserve" pillar
by cutting the tether to the original. Option D doesn't scale to 43
programs.

Spiritual successor gives every game folder a rich pedagogical
surface: `spec.md` captures the preserved mechanics, `port-ideas.md`
records the modernisation choices, `diff-log.md` narrates them as
they happen. Every modernisation is an ADR — including creative
reinterpretations of obsolete features (`bcd`, `ppt`, `dm`, etc.).

## Consequences

### Positive

- Every game has real design work worth documenting.
- Ports can incorporate internet multiplayer, improved AI, modern
  UI/UX, accessibility, cloud saves.
- Obsolete concepts (punch cards, admin restrictions from a
  multi-user era) can be reinterpreted creatively — great teaching
  moments.

### Negative / Risks

- Boundary between "core mechanic" (preserve) and "everything else"
  (modernize) is judgement-based. Contributors may disagree.
- Reviews will need to confirm the *feel* is preserved — subjective.
- More ADRs per game.

### Follow-on Work

- Each per-game `port-ideas.md` must consciously address what to
  preserve vs. modernise.
- Reinterpretation of obsolete-concept games (`bcd`, `ppt`, `dm`,
  `wargames`, `banner`) each needs a per-game ADR explaining the
  reinterpretation.

## References

- [`AGENTS.md`](../../AGENTS.md) §1 (Mission), §5 (Porting
  Philosophy).
- [`porting-guide.md`](../porting-guide.md) — workflow that
  operationalises this philosophy.
