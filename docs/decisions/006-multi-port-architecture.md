# ADR-006: Multi-Port Architecture — One Spec, Many Implementations

- **Status:** Accepted
- **Date:** 2026-09-17
- **Deciders:** Agun Wijaya (repo owner)
- **Scope:** Root default (governs how every game in the repo is
  implemented, deployed, and contributed to)

## Context

This ADR closes a gap opened when the owner clarified the project
vision on 2026-09-17. Two facts, previously unstated, are now
explicit:

1. **The repo will be a public open-source project accepting
   community contributions.** Contributors may care about only a
   subset of games (one, two, three) — not all 43.
2. **A single game may be ported in multiple ways.** One
   contributor may want a "classic conventional web version,
   nothing more." Another may want the same game "as a beautiful
   modern web app." A third may want "mobile with gimmicks —
   haptics, gestures, effects." All three should coexist.

The prior ADRs did not anticipate this:

- [ADR-001](./001-monorepo-flat-structure.md) — monorepo with 43
  flat game folders. Still valid, but silent on multi-port.
- [ADR-002](./002-porting-philosophy.md) — spiritual successor.
  Still valid *per port*, but "the port" is now not a single
  thing.
- [ADR-004](./004-per-game-doc-taxonomy.md) — 14-file
  per-game doc set. Written under a one-port assumption.
- [ADR-005](./005-target-language-and-ui-stack.md) — TypeScript +
  Vite + PWA as a *root default*, applied to all 43 games. The
  scope claim is now too broad — it presupposes a single mandated
  stack.

The correct analog is the emulator community, not the vertical
game studio. There is not one canonical NES emulator; there are
dozens (Nestopia, FCEUX, Mesen, higan, …) each with different
priorities. This ADR aligns the repo with that pattern.

## Options Considered

### Option A — Single-port monoculture (status quo before this ADR)

**Description:** One officially blessed implementation per game.
All contributors work on that same implementation. Tech stack is
fixed at root level; deviation requires a per-game ADR override.

**Pros:**
- Simplest to reason about — one deploy, one CI matrix, one stack.
- Shared code is deeply shared (no duplication).
- Onboarding cost is low; a new contributor learns one stack.
- Fewer boundaries to police in review.

**Cons:**
- Kills variety. Every port to a given game must look, feel, and
  ship the same way. The vision explicitly wants variety.
- Locks tech choice for all 43 games irrevocably. If TypeScript
  loses relevance in ten years, the whole repo migrates or dies.
- Contributors who prefer Rust, Go, Python, Godot, or C simply
  cannot contribute. Excludes a large slice of the community.
- Fails the emulator-community analog. One NES emulator, one
  philosophy, one style — not a healthy long-term open-source
  shape.

**Suitable when:** A single owner or small team is building a
specific commercial product. Not our situation.

### Option B — Multi-port at top level (flat)

**Description:** Every port is a top-level sibling under
`bsdgames/`: `bsdgames/robots-classic-web/`,
`bsdgames/robots-fancy-web/`, `bsdgames/robots-mobile-gimmicks/`.
Canonical docs (spec, about, architecture) live in a separate
top-level place per game — perhaps `bsdgames/robots-spec/` or a
sibling `specs/robots/`.

**Pros:**
- Every port is unambiguously a first-class citizen.
- No nested folder depth.
- Uniform depth of URLs / imports.

**Cons:**
- Loses the "one folder per game" invariant from ADR-001 and
  `AGENTS.md` §2. That invariant is load-bearing: every doc
  cross-reference in the repo assumes it.
- Canonical docs orphaned from ports. Reader lands in
  `robots-classic-web/`, has no doc there, must go find
  `robots-spec/`.
- Repo navigability suffers. 43 games × ~3 ports each ≈ 130
  top-level folders. `ls bsdgames/` becomes unreadable.
- Related ports aren't visually grouped; sorting by name mostly
  works but breaks when a game name is a substring of another
  (`worm` / `worms` / `wormsuperball`).
- Every port name must carry the game as a prefix — bureaucratic.

**Suitable when:** Ports vastly outnumber games and games are
minor organizational units. Not our shape (games are the primary
noun).

### Option C — Multi-port sub-folder game (recommended)

**Description:** Every game keeps its top-level folder
(`bsdgames/robots/`) and its canonical docs (`docs/spec.md`,
`docs/about.md`, etc.). Ports live under
`bsdgames/<game>/ports/<port-name>/`, each a self-contained
subtree with its own build system, source, tests, and
port-specific docs.

Structure:

```
bsdgames/robots/
├── README.md                     Game landing page + port index
├── AGENTS.md, CLAUDE.md
├── docs/                         CANONICAL — about the game, not any port
│   ├── spec.md                   The contract every port must honor
│   ├── architecture.md, manpage.md, lessons.md, references.md
│   ├── about.md, how-to-play.md, lineage.md, notes.md, port-ideas.md
│   ├── test-scenarios.md         Universal acceptance scenarios
│   └── decisions/                Game-level ADRs (rare)
├── media/                        Screenshots of the ORIGINAL binary
└── ports/
    ├── classic-web/              Port A — TypeScript + Vite (reference)
    │   ├── package.json
    │   ├── vite.config.ts
    │   ├── src/, tests/
    │   ├── media/                Port-specific screenshots
    │   ├── README.md             Pitch + tech + live URL
    │   └── docs/
    │       ├── diff-log.md       Feature-by-feature choices
    │       └── decisions/        Port-specific ADRs
    ├── fancy-web/                Port B — maybe Svelte + Phaser
    │   └── ...
    └── retro-terminal/           Port C — Rust + ratatui, if a contributor wants
        └── Cargo.toml, src/, tests/
```

**Pros:**
- **Preserves the "one folder per game" invariant** from ADR-001;
  no cascade of doc-path rewrites elsewhere.
- **Canonical docs stay adjacent to implementations.** A
  contributor navigating to `bsdgames/robots/` sees the spec,
  ports, and media at once.
- **Related ports are visually grouped.** `ls
  bsdgames/robots/ports/` shows the port landscape for that game.
- **Repo scales cleanly.** 43 game folders, each with 1–N port
  children. Discoverable at every depth.
- **Port folders can host any tech stack** without polluting the
  game namespace or forcing prefix bureaucracy.
- **Canonical docs act as a "trunk"** that every port shares —
  reduces duplication and keeps the "teach" pillar centralized.

**Cons:**
- Deeper folder nesting (`bsdgames/<game>/ports/<port>/src/…`).
- Requires updating [ADR-004](./004-per-game-doc-taxonomy.md) to
  split doc taxonomy into game-level (canonical) vs port-level.
- Slight indirection for a maintainer navigating from game to port
  vs top-level.
- Discoverability of ports per game requires reading the game's
  root README (mitigated by convention: every game README
  auto-lists its `ports/*` children).

**Suitable when:** Games are conceptually primary; ports are
variants of a common spec. This is our shape.

### Option D — Federation (canonical here, ports in external repos)

**Description:** This repo hosts only canonical docs, specs, and
media. Actual port implementations live in separate GitHub repos
maintained by their authors (`bsdgames-robots-classic-web`,
`bsdgames-robots-fancy-web-alice`, …). A link registry in this
repo lists known ports per game.

**Pros:**
- Absolute zero coupling between ports.
- Each port has its own git history, issues, releases, CI, and
  licensing.
- Contributors have full ownership of their subtree without any
  shared-repo etiquette.
- Very open — anyone can spin up a port without a PR to this repo.

**Cons:**
- **Discoverability collapses.** 100+ external repos of wildly
  varying quality, some abandoned within months.
- Attribution and quality signaling become hard. Which port is
  "the good one"? No mechanism.
- Broken links inevitable. Contributors delete repos, rename them,
  make them private.
- Onboarding harder — clone canonical docs here, then clone one
  or more port repos, then hope the versions match.
- License audit becomes N times harder — every port has its own
  license file, some may be incompatible with the intended
  spirit.
- "One repo to fork the whole project" story is lost.

**Suitable when:** The project is enormous (many hundreds of
ports) or ports have fundamentally different legal/licensing
requirements that can't coexist in one repo. Neither is our
situation, and moving to federation later is a much cheaper
migration than moving away from it.

## Sub-Decision — Language & Platform Uniformity

Within Option C, a secondary axis: should all ports share a single
language and platform, or can they be freely polyglot?

### Sub-Option C1 — JS/TS monoculture

**Description:** Multi-port allowed, but every port must be
TypeScript / JavaScript. Ports differ in framework and aesthetic
only (e.g. React vs Svelte vs vanilla; Canvas vs DOM; PWA vs
Capacitor).

**Pros:**
- One CI story. One dependency graph. Shared `@bsdgames/shared`
  package benefits every port.
- Reviewers can read every PR without a language context switch.
- Type sharing across ports is trivial.

**Cons:**
- Excludes contributors whose expertise is Rust, Go, Python,
  Dart, GDScript, C, C#, Swift, Kotlin. Kills a large swath of
  the community.
- Locks the pedagogy to JS/TS idioms. A key part of "teach" is
  showing how the same game logic maps to different paradigms —
  monoculture forecloses this.
- Doesn't match the vision.

### Sub-Option C2 — Polyglot ports (recommended)

**Description:** Multi-port allowed. Each port picks its own
language, framework, platform, build system, and distribution.
Coexistence in the same monorepo is governed by the Universal
Port Contract (below).

**Pros:**
- Matches the vision. One game, many implementations, many stacks.
- Serves the emulator-community analog directly.
- Enables Rust TUI ports, Godot ports, Flutter ports, C ports,
  and TypeScript PWA ports side by side.
- Contributors bring their own expertise instead of being
  forced through a single stack.
- The `@bsdgames/shared` package (from ADR-005) becomes helpful,
  not mandatory — it serves TS/JS ports; other-language ports
  ignore it or grow their own equivalents (`bsdgames-rust-shared`
  crate, `bsdgames-py-shared` package, etc.) when ≥ 2 ports in
  that language exist.

**Cons:**
- Polyglot monorepo — build tooling varies per subtree. CI needs
  language-aware routing.
- No single lingua franca across the repo. Cross-port
  refactoring is harder (but rare in practice — ports rarely
  refactor each other).
- Reviewing every PR requires broad familiarity across stacks.
  Mitigation: per-port CODEOWNERS.
- Different licensing concerns per port. Mitigation: root MIT +
  each port declares its own compatible license in its README.

## Decision

**We chose Option C + Sub-Option C2 — multi-port sub-folder
architecture with polyglot ports.**

*(Status remains Proposed until the owner confirms; §10 of
`AGENTS.md` reserves that decision.)*

The mission's three pillars are best served by a pluralistic,
polyglot model:

- **Preserve.** `spec.md` remains the contract. Every port must
  faithfully implement the mechanics defined there. The original
  is preserved *canonically* at the game level, regardless of
  how ports diverge in style or tech.
- **Modernize.** Different ports lean modernization differently.
  A `classic-web` port stays minimal. A `fancy-web` port explores
  modern UI craft. A `mobile-gimmicks` port explores haptics
  and gestures. A `retro-terminal` port stays close to the
  original ncurses feel. Together they cover the modernization
  spectrum without a single port having to compromise.
- **Teach.** Multiple implementations of the same spec produce
  richer pedagogy than one. A reader can compare how the same
  game logic maps to different paradigms — functional (Elm-style
  bubbletea), object-oriented (React class components),
  data-oriented (ECS), or imperative (vanilla loops). No other
  structure supports that comparison.

Ownership is **first come first serve** with quality gating.
The first contributor to submit a port under a unique name owns
that port. Maintainer review is limited to the Universal Port
Contract (below), not to concept or tech choice. Duplicate
concepts (two `classic-web` ports for the same game) are not
allowed; naming conventions (below) exist to make this concrete
without a bureaucratic process.

Options A (monoculture) and B (flat top-level) are rejected on
architectural grounds — they fight the game-primary shape of the
repo. Option D (federation) is not rejected but deferred: if the
repo ever grows past organic scale, migration to federation is
cheap; the reverse is not.

## Universal Port Contract

Every port, regardless of language, platform, framework, or
aesthetic, **must** comply with these six requirements. This list
is the maintainer's review checklist for accepting a new port.

1. **Spec compliance.** The port must faithfully implement the
   mechanics defined in `bsdgames/<game>/docs/spec.md`. Any
   deliberate deviation from spec (added feature, altered rule,
   removed mechanic) must be documented as an ADR under the
   port's own `docs/decisions/` folder. Silent deviation is a
   review-blocker.
2. **Location convention.** The port lives at
   `bsdgames/<game>/ports/<port-name>/`. No exceptions.
3. **Minimum doc set.**
   - `README.md` — pitch, tech stack, target platform, live URL
     (once deployed), install/build instructions, author &
     contact, license (if not repo default MIT).
   - `docs/diff-log.md` — feature-by-feature narrative of what
     was kept, changed, added, or removed vs. the original.
   - `docs/decisions/` — any port-specific ADRs (may be empty).
4. **Test compliance.** The port must pass every scenario in
   `bsdgames/<game>/docs/test-scenarios.md`. If the port adds
   features (e.g. multiplayer in an originally single-player
   game), extra scenarios go in the port's own
   `docs/test-scenarios.md`.
5. **Attribution.** Original BSDGames authors credited (linked
   from the port README or a `NOTICE` file). Upstream URL
   `https://github.com/vattam/BSDGames` cited. The port author's
   own attribution goes in the port README.
6. **AGENTS.md pointer.** The port folder contains a thin
   `AGENTS.md` pointing to the game's `AGENTS.md` and the root
   `AGENTS.md`. Consistent with the pointer-file pattern
   (ADR-003).

**Not** required:

- Any specific language, framework, build system, or platform.
- Use of `@bsdgames/shared` (or its future non-JS analogues).
- Multiplayer, offline, save/leaderboard — unless the canonical
  spec requires them.
- App Store / Play Store distribution.
- Passing the maintainer's *taste* — as long as spec + doc + tests
  hold, the port is accepted.

## Port Naming Conventions

**Recommended, not enforced.** The goal is that a reader scanning
`ls bsdgames/robots/ports/` can predict a port's character
without opening it.

Two axes are encoded in the name:

- **Fidelity** — `classic-*` means *strictly faithful to the
  original* (translation of platform, not of experience). Any
  other prefix implies additive freedom (may add features,
  modernize UX, change aesthetics).
- **Platform** — `-web`, `-terminal`, `-mobile`, `-desktop`, etc.

### Style-based names

| Slug | Fidelity | Platform | Aesthetic | Additions allowed? |
|---|---|---|---|---|
| `classic-web` | **Strictly faithful** — player experience indistinguishable from original binary in a terminal | Web (browser + PWA) | **Retro terminal required** (monospace, ASCII exactly matching original, palette approximating terminal) | Only platform translation (PWA install, offline, touch→keyboard mapping, localStorage saves) |
| `classic-terminal` (or `retro-terminal`) | **Strictly faithful** — same as running original binary, rewritten in modern language | Native TUI | ASCII, palette matching original | Only platform translation (modern language conventions, unit tests) |
| `fancy-web` | Additive OK | Web (browser + PWA) | Modern polish (animations, sprites, sound) | Multiplayer, leaderboards, achievements, sound, gamepad, etc. |
| `mobile-gimmicks` | Additive OK (touch and haptics are inherently reinterpretations) | Mobile-first (Capacitor / RN / native) | Contributor's choice | Full mobile-native UX |
| `native-desktop` | Contributor's choice | Desktop app (Tauri / Electron / native) | Contributor's choice | Contributor's choice |
| `game-engine` | Additive typical | Multi-target via engine | Engine-native | Full engine capabilities |

**Rule of thumb for `classic-*` styles:** if a player of the port
gets a **different experience** than a player of the original
binary — different visuals, different controls, different rules,
different feature set beyond platform necessities — it is *not*
classic. Use a different prefix.

### Tech-suffix when disambiguation matters

Two ports of the same style but different tech get a suffix:

| Slug | Meaning |
|---|---|
| `classic-web-svelte` | Classic-web done in Svelte (if there's already `classic-web` in Vanilla TS) |
| `classic-terminal-rust` | Classic-terminal in Rust (if there's already one in Go) |
| `fancy-web-phaser` | Fancy-web using Phaser engine |

### Reserved

Do not use as a port name:

- `shared`, `common`, `base`, `canonical`, `reference` (reserved
  for shared infrastructure).
- The game name itself (`bsdgames/robots/ports/robots/` is
  meaningless).
- Personal identifiers (`alice`, `bob`) as the sole name — style
  first, initials only as tiebreaker (`classic-web-alice` is
  acceptable if `classic-web` is taken and the style is the same
  but the code is a distinct fork).

### Registration

No central registry. First PR merging a port under a given name
locks that name. Later duplicates must pick a different slug (or
fork the existing port and evolve it there).

## Consequences

### Positive

- **Contribution model becomes pluralistic.** Contributors don't
  have to agree on tech to work in the same repo.
- **The `spec.md` files gain load-bearing status.** They stop
  being documentation and become the definition of "what this
  game is." This elevates the "teach" pillar directly.
- **Fork surface expands.** Someone interested in only `robots`
  can shallow-clone that folder and ship their own port
  independently. Someone interested in a *style* across many
  games (say, "retro-terminal for every game") can carve a slice.
- **No lock-in on any language or platform.** The project outlives
  any specific stack's popularity cycle.
- **Attribution is per-port and explicit.** Every port folder is a
  natural author-attribution unit.

### Negative / Risks

- **CI cost grows non-linearly** with port count and language
  diversity. Mitigation: each port declares its own CI (or none);
  the repo-level CI only enforces the Universal Port Contract
  checks (doc presence, structural conformance, license
  presence). Language-specific test running is per-port.
- **Review burden per port** is higher for maintainers who don't
  know all languages. Mitigation: per-port CODEOWNERS, and
  explicit acceptance that a maintainer may only verify the
  Universal Port Contract without evaluating idiomatic code
  quality in an unfamiliar language.
- **Dead ports are inevitable.** A contributor abandons a port
  after a month; it lingers. Mitigation: introduce a "port
  status" field in the port README (Active / Maintained /
  Frozen / Archived) with a `Frozen` = no updates in 12 months,
  `Archived` = broken build. Regular repo audits can promote
  Frozen → Archived. Do not delete Archived ports — they remain
  pedagogically useful.
- **Cross-port confusion** — a user may install two ports of the
  same game expecting them to be identical. Mitigation: each port
  README is explicit about what makes it distinct.
- **`shared/` scope shrinks.** From "the foundation for every
  port" to "the foundation for JS/TS ports that opt in." That's
  fine — it's an opt-in library, not a mandate.

### Follow-on Work

- **Revise [ADR-004](./004-per-game-doc-taxonomy.md)** — split
  doc taxonomy into (a) canonical game-level docs and (b)
  port-level docs. The 14-file list gets partitioned.
- **Revise [ADR-005](./005-target-language-and-ui-stack.md)** —
  narrow scope to "reference stack for the `@bsdgames/shared`
  package and default `classic-web` ports." Explicitly document
  that other ports are unconstrained by ADR-005.
- **Update root `AGENTS.md`** — §2 (repo structure) to show the
  ports/ subtree; §6 (per-game taxonomy) to split canonical vs
  port-level; add a new §7-equivalent on port lifecycle and
  Universal Port Contract enforcement.
- **Update `docs/templates/`** — split into game-level templates
  (canonical) and port-level templates (port README, port
  package.json, port vite.config.ts, port diff-log.md, port
  AGENTS.md). Add a `templates/ports/<style>/` starter kit per
  common style — `classic-web` first.
- **Update `docs/progress.md`** — dashboard becomes per-port, not
  per-game. Format: each row = game + port + status + owner +
  live-URL.
- **Update every existing game's `README.md`** — replace prose
  with a landing page listing that game's ports (auto-generated
  or manually maintained).
- **Create `shared/` as `@bsdgames/shared`** — workspace package,
  publish-ready (npm publish is optional; the shape is what
  matters).
- **Build `bsdgames/robots/ports/classic-web/`** as the reference
  pilot port. Serves two roles: proves the architecture works
  and gives future `classic-web` port authors a template to
  imitate.

## References

- [ADR-001 — Monorepo flat structure](./001-monorepo-flat-structure.md)
- [ADR-002 — Porting philosophy: spiritual successor](./002-porting-philosophy.md)
- [ADR-003 — Multi-model AGENTS.md convention](./003-multi-model-agents-md.md)
- [ADR-004 — Per-game doc taxonomy](./004-per-game-doc-taxonomy.md)
  (will be revised as follow-on to this ADR)
- [ADR-005 — Target language & UI stack](./005-target-language-and-ui-stack.md)
  (scope will be narrowed as follow-on to this ADR)
- Root [`AGENTS.md`](../../AGENTS.md) §1 (mission), §5 (porting
  philosophy), §6 (per-game doc taxonomy — to be updated), §10
  (owner consent model).
- Owner directive, 2026-09-17: multi-port + polyglot + FCFS
  ownership + standalone deploy per port + no aggregated hub.
- Emulator community analog — NES emulators (Nestopia, FCEUX,
  Mesen, higan) as an example of one spec, many faithful
  implementations with different priorities. Not a citation; a
  design analog.
