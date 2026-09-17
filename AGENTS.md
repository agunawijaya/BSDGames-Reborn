# AGENTS.md — BSDGames Reborn

This file is the **single source of truth** for AI agents (Claude Code,
Codex, Kimi Code, Gemini via AntiGravity, etc.) and human contributors
working on this repository. All tool-specific pointer files
(`CLAUDE.md` and any equivalents) redirect here.

**If you are an AI agent or a new contributor: read this file
completely before touching anything else.**

---

## 1. Project Mission

**BSDGames Reborn** is a *spiritual successor* port of the classic
[BSDGames](https://github.com/vattam/BSDGames) package (43 programs)
to modern platforms and languages.

The mission has three equal-weight pillars:

1. **Preserve.** Retain the mechanics, feel, and cultural significance
   of every original program.
2. **Modernize.** Improve UX/UI, add internet multiplayer, upgrade AI,
   provide accessibility, exploit constraints no longer present in
   modern hardware.
3. **Teach.** Every game folder is a self-contained learning artifact.
   Documentation is as much a deliverable as code.

The original C source is **not** in this repository. It is retrieved
from the upstream link above; see [`ATTRIBUTION.md`](./ATTRIBUTION.md).

## 2. Repository Structure

```
BSDGames-Reborn/
├── README.md              Landing page / public pitch
├── AGENTS.md              THIS FILE — primary instructions
├── CLAUDE.md              Thin pointer to AGENTS.md
├── ATTRIBUTION.md         Original credits & upstream link
├── LICENSE                MIT
│
├── docs/                  Meta-documentation
│   ├── catalog.md         Game index by category
│   ├── heritage.md        Historical context on BSDGames
│   ├── multiplayer.md     Pre-Internet multiplayer architecture
│   ├── porting-guide.md   Standard workflow for porting a game
│   ├── progress.md        Per-port status dashboard
│   ├── glossary.md        Cross-game technical terms
│   ├── timeline.md        BSD + BSDGames + influence timeline
│   ├── decisions/         Root-level ADRs
│   ├── templates/         Skeletons — split into game/ and port/
│   └── learning/          Cross-cutting learning notes
│
├── shared/                Reference package @bsdgames/shared for JS/TS ports (ADR-005).
│                          Opt-in engine + UI primitives. Other-language ports have
│                          their own equivalents (or none).
│
└── bsdgames/              43 game folders (one canonical, N ports each — ADR-006)
    └── <game>/            One folder per game
        ├── README.md      Game landing + port index
        ├── AGENTS.md      Game-level agent context
        ├── CLAUDE.md
        ├── docs/          CANONICAL docs — describe the game (spec, about, …)
        ├── media/         Screenshots of the ORIGINAL BSDGames binary
        └── ports/         One or more port implementations
            └── <port>/    e.g. classic-web/, fancy-web/, retro-terminal/
                ├── README.md, AGENTS.md, CLAUDE.md
                ├── docs/  Port docs: diff-log, port ADRs
                ├── src/, tests/, media/
                └── package.json | Cargo.toml | pyproject.toml | …
```

## 3. Multi-Model Support

The convention: **`AGENTS.md`** is the primary instruction file.
It is read (natively or on request) by all major AI coding tools:
Claude Code, Codex/OpenAI, Gemini via AntiGravity, GitHub Copilot
Coding Agent. Any tool-specific file (`CLAUDE.md` etc.) is a **thin
pointer**, not duplicated content.

**Rule:** Never duplicate instruction content across files. If a new
tool needs its own file, make it a pointer to `AGENTS.md`.

## 4. Decision Framework — ADRs

Every non-trivial decision must be recorded as an **Architecture
Decision Record** in the appropriate `decisions/` folder. This is a
**pedagogical requirement**: readers must be able to reconstruct
*why* a choice was made, including the alternatives that were
considered.

### 4.1 ADR Locations & Numbering

- **Root defaults**: `docs/decisions/NNN-<slug>.md` (numbering from 001).
- **Per-game overrides**: `bsdgames/<game>/docs/decisions/NNN-<slug>.md`
  (independent numbering per game folder).

### 4.2 Inheritance

Root ADRs set *defaults* that apply to every game. A per-game ADR is
**only** created when that specific game needs to override a default.
Silence = defer to root default.

### 4.3 Format

All ADRs follow
[`docs/decisions/000-adr-template.md`](./docs/decisions/000-adr-template.md).
Required sections: **Status / Context / Options Considered /
Decision / Consequences**.

**Options analysis is mandatory** — even when a decision is already
taken. New readers must see the alternatives that were considered and
why they were rejected. This is what makes the ADR pedagogical.

## 5. Porting Philosophy — Spiritual Successor

We are **not** doing a faithful port. We are doing a *spiritual
successor* (see
[`docs/decisions/002-porting-philosophy.md`](./docs/decisions/002-porting-philosophy.md)).
Rules:

- **Preserve** core mechanics and the *feel* of the original.
- **Modernize** UX, UI, AI, multiplayer, persistence, accessibility.
- **Reinterpret** where the original is obsolete (e.g. `bcd` prints
  IBM punch cards — port might reinterpret as a modern receipt-printer
  visualiser, ANSI art generator, or QR code).
- **Every modernization choice = an ADR.** Don't silently redesign.

## 6. Per-Game & Per-Port Documentation Taxonomy

Under [ADR-006](./docs/decisions/006-multi-port-architecture.md),
documentation is split into two tiers:

1. **Canonical (game-level)** — `bsdgames/<game>/docs/`. Describes
   the game itself and its original C implementation. Written once
   per game; used by every port.
2. **Port-level** — `bsdgames/<game>/ports/<port>/docs/`. Describes
   a specific port implementation. Written per port.

See
[ADR-004 (revised 2026-09-17)](./docs/decisions/004-per-game-doc-taxonomy.md)
for the full rationale of this split. Templates live in
[`docs/templates/`](./docs/templates/), split into
`templates/game/` and `templates/port/`.

```
bsdgames/<game>/
├── README.md              Game landing + port index
├── AGENTS.md              Game-level agent context
├── CLAUDE.md              Thin pointer
├── docs/                  CANONICAL — describe the game, not any port
│   ├── about.md           Brochure: authors, publisher, year, story, bugs
│   ├── how-to-play.md     Universal rules: controls, win, tips, scoring
│   ├── walkthrough.md     ⚠ Conditional — adventure games only
│   ├── world-map.md       ⚠ Conditional — fixed-map / graph games only
│   ├── architecture.md    Analysis of ORIGINAL C source (+ AI + RNG)
│   ├── lessons.md         Techniques + file:line references to upstream
│   ├── port-ideas.md      CATALOG of possible port directions
│   ├── spec.md            THE CONTRACT every port must honor
│   ├── notes.md           Game-level working notes
│   ├── manpage.md         Mirror of original .6 man page
│   ├── test-scenarios.md  UNIVERSAL scenarios every port must pass
│   ├── lineage.md         Genre siblings + modern descendants
│   ├── references.md      Sources & citations
│   └── decisions/         Game-level ADRs (rare — apply to all ports)
├── media/                 Screenshots of the ORIGINAL BSDGames binary
└── ports/                 One or more port implementations
    └── <port>/            e.g. classic-web/, fancy-web/, retro-terminal/
        ├── README.md      Pitch + tech + target + live URL + author
        ├── AGENTS.md      Port-level pointer
        ├── CLAUDE.md
        ├── docs/
        │   ├── diff-log.md         Feature-by-feature original → this port
        │   ├── decisions/          Port-specific ADRs (may be empty)
        │   ├── test-scenarios.md   Optional — only if port adds features
        │   └── notes.md            Optional — port working notes
        ├── src/                    Implementation
        ├── tests/                  Automated tests
        ├── media/                  PORT-SPECIFIC screenshots
        └── package.json | Cargo.toml | pyproject.toml | …
```

### 6.1 Required Documents — Canonical (game level)

| Document | All games | Adventure | Board/Card | Utility |
|---|:---:|:---:|:---:|:---:|
| README, AGENTS, CLAUDE | ✅ | ✅ | ✅ | ✅ |
| about, how-to-play, manpage, references | ✅ | ✅ | ✅ | ✅ |
| architecture, lessons, port-ideas | ✅ | ✅ | ✅ | ✅ |
| spec, notes, test-scenarios, lineage | ✅ | ✅ | ✅ | ✅ |
| **walkthrough** | ❌ | ✅ | ❌ | ❌ |
| **world-map** | ❌ | ✅ (fixed map) | ❌ | ❌ |

### 6.2 Required Documents — Port level

Required in every port folder:

| Item | Required |
|---|:---:|
| `README.md` | ✅ |
| `AGENTS.md`, `CLAUDE.md` (pointer files) | ✅ |
| `docs/diff-log.md` | ✅ |
| `docs/decisions/` (folder; may be empty) | ✅ |
| `src/`, `tests/` | ✅ |
| `media/` (port-specific screenshots) | ✅ once port has working src |
| Build manifest (`package.json` / `Cargo.toml` / …) | ✅ |
| `docs/test-scenarios.md` (only if port adds features) | Conditional |
| `docs/notes.md` | Optional |

A port's `docs/` does **not** contain: `spec.md`, `about.md`,
`how-to-play.md`, `manpage.md`, `architecture.md`, `lessons.md`,
`references.md`, `lineage.md`, `port-ideas.md`, `walkthrough.md`,
`world-map.md`. Those live only at the canonical level. If a port
discovers those are wrong, the fix is a PR to canonical — not a
port-level shadow copy.

### 6.3 Content Requirements — Canonical (game level)

- `about.md` must cover: author(s), publisher (if any), release
  year, cultural/historical significance, "why it's fun",
  making-of stories, known bugs, **difficulty & progression**
  (how many levels or stages, what changes as you advance, or —
  if there are none — an explicit statement of "no explicit
  progression" and what the game does instead), and **must embed
  at least 2 screenshots** from `../media/` (see §6.5). Written
  as a brochure — inviting.
- `how-to-play.md` must cover: controls / commands, how to win,
  tips & tricks, scoring mechanism, known easter eggs, and
  **difficulty levels & setup configuration** (universal — how
  the game works, not any port's UI).
- `spec.md` must cover: objective, formal state variables, actions
  & commands, legal rules & invariants, RNG usage distributions,
  termination conditions, **difficulty levels & setup
  configuration** (CLI flags, runtime knobs, arena/board/cave
  dimensions, validation invariants/collapse bounds, and session
  replay semantics such as same-map vs new-map), and **complete
  object & entity inventory** (all portable items, tools,
  treasures, and stationary obstacles or creatures with initial
  locations, property flags, and puzzle roles). **This is the
  contract every port must honor.**
- `walkthrough.md` (adventure games) must include **two**
  walkthroughs: the shortest path to victory *and* the maximum
  score path.
- `world-map.md` (fixed-map games) uses **Mermaid** for the map
  and **must include a Master Room & Object / Entity Directory**
  mapping every key room or sector to the objects, tools,
  treasures, hazards, and creatures found within it, along with
  their puzzle purposes.
- `architecture.md` must explicitly cover: (a) game loop / control
  flow, (b) AI logic if any, (c) random-event system if any — how
  probabilities are computed and how they affect state (e.g., "in
  scene X, a werewolf appears 20% of the time; if present, instant
  death; otherwise +50 bonus score"), and (d) **difficulty
  progression & runtime setup logic** — how "level" or difficulty
  is represented in code, what changes per level (enemy count, AI
  depth, timing, content), how setup knobs and CLI flags affect
  runtime generation (e.g. grid/cave size, hazard density,
  stability limits), and session replay mechanisms, citing
  `file:line` in the upstream C source. If no explicit
  progression, explain the constant-difficulty design and any
  implicit scaling. Use Mermaid + code excerpts.
- `lessons.md` must reference specific file / line / procedure in
  the original C source, so a beginner can locate the technique
  and learn from real code.
- `port-ideas.md` under ADR-006 is especially load-bearing — it
  is the **catalog** of possible port directions that prospective
  contributors browse. Must list credible port styles
  (`classic-web`, `fancy-web`, `retro-terminal`, `mobile-gimmicks`,
  `native-desktop`, `game-engine`) with a one-paragraph sketch of
  what each would look like for this specific game.

### 6.4 Content Requirements — Port level

- `README.md` must cover: pitch (1–2 lines), tech stack, target
  platform(s), live URL (once deployed), install/build
  instructions, author name/contact, license (if different from
  root MIT), status (Active / Maintained / Frozen / Archived).
- `docs/diff-log.md` must be a running narrative of choices — what
  was kept from spec, what was added, what was changed, what was
  removed, and why. This is the *story of the port* and is often
  more read than any other port doc.
- `docs/decisions/` — port-specific ADRs. Any deliberate deviation
  from `../../docs/spec.md` requires an ADR here.

### 6.5 Media Requirements

**Game-level `media/`** (screenshots of the ORIGINAL binary):

- **Minimum 2 PNG screenshots**, ideally 3, captured from the
  original BSDGames binary. Common shots: `01-start.png`,
  `02-midgame.png`, `03-death.png` / `03-victory.png`.
- Each PNG has a sibling `.txt` with the raw text capture
  (diffable, regeneratable, accessible).
- Captured via
  [`docs/scripts/capture-screenshots.sh`](./docs/scripts/capture-screenshots.sh).
  Requires WSL2 or Linux with `bsdgames`, `tmux`, `imagemagick`,
  `wkhtmltopdf`, `python3`. See
  [`docs/scripts/README.md`](./docs/scripts/README.md).
- Retro terminal palette (`#39FF14` on `#0d1117`) by default.
  Change in the script if a game needs different aesthetics.
- **Embedded and captioned** in the game's `docs/about.md` so a
  reader gets the visual pitch immediately.
- `bsdgames-2.17` (Debian) and NetBSD-current produce effectively
  identical output for our purposes; either is acceptable.

**Port-level `media/`** (screenshots of the PORT itself):

- Minimum 2 PNG, or one short GIF, or one `asciinema` `.cast` of
  the port running, once it has working src/.
- **Embedded and captioned** in the port's `README.md`.

### 6.6 Baseline for a "Released" Port

A **port** is considered *released* when it has, at minimum:
`README.md + AGENTS.md + CLAUDE.md + docs/diff-log.md + working
src/ + tests/ + media/ (port-specific)`, AND passes every scenario
in the canonical `../../docs/test-scenarios.md`.

A **game** is considered *released* when its canonical docs are
complete AND at least one port is at Released status.

### 6.7 Universal Port Contract

Every port, regardless of language / platform / style, must
comply with the six requirements below — the maintainer's review
checklist for accepting a new port. Defined authoritatively in
[ADR-006](./docs/decisions/006-multi-port-architecture.md):

1. **Spec compliance** — faithful implementation of
   `bsdgames/<game>/docs/spec.md`. Deviations require a
   port-level ADR.
2. **Location** — `bsdgames/<game>/ports/<port-name>/`.
3. **Minimum doc set** — README + `docs/diff-log.md` +
   `docs/decisions/` (may be empty).
4. **Test compliance** — passes canonical
   `docs/test-scenarios.md`.
5. **Attribution** — original BSDGames authors credited, upstream
   URL cited.
6. **AGENTS.md pointer** — thin pointer to game AGENTS + root
   AGENTS.

**Not required:** any specific language, framework, platform,
build system, or `@bsdgames/shared` usage.

### 6.8 Port Naming Conventions

Recommended (not enforced) style prefixes. Two axes are encoded
in every name: **fidelity** (`classic-*` = strictly faithful;
anything else = additive freedom) and **platform**.

| Slug | Fidelity | Platform | Aesthetic | Additions allowed? |
|---|---|---|---|---|
| `classic-web` | **Strictly faithful** — player experience indistinguishable from original binary in a terminal | Web (browser + PWA) | **Retro terminal required** (monospace, ASCII exactly matching original, retro palette) | Only platform translation (PWA install, offline, touch→keyboard mapping, localStorage saves) |
| `classic-terminal` (aka `retro-terminal`) | **Strictly faithful** — same as original binary, rewritten in modern language | Native TUI | ASCII, palette matching original | Only platform translation |
| `fancy-web` | Additive OK | Web (browser + PWA) | Modern polish (animations, sprites, sound) | Multiplayer, leaderboards, achievements, gamepad, etc. |
| `mobile-gimmicks` | Additive OK | Mobile-first | Contributor's choice | Full mobile-native UX (gestures, haptics) |
| `native-desktop` | Contributor's choice | Desktop app (Tauri / Electron / native Swift-Kotlin) | Contributor's choice | Contributor's choice |
| `game-engine` | Additive typical | Multi-target via engine | Engine-native | Full engine capabilities |

**Rule of thumb for `classic-*`:** if a player of the port gets a
*different experience* than a player of the original binary —
different visuals, different controls, different rules, different
feature set beyond platform necessities — it is **not** classic.
Use another prefix.

Tech-suffix when disambiguation is needed (`classic-web-svelte`,
`classic-terminal-rust`, `fancy-web-phaser`). Reserved: `shared`,
`common`, `base`, `canonical`, `reference`, and the game name
itself. See
[ADR-006](./docs/decisions/006-multi-port-architecture.md) for
the complete convention.

## 7. Porting Workflow

The standard workflow is documented in
[`docs/porting-guide.md`](./docs/porting-guide.md). Under
[ADR-006](./docs/decisions/006-multi-port-architecture.md) it
runs in two phases:

1. **Canonical phase** — write the game-level docs in
   `bsdgames/<game>/docs/`, capture original-binary screenshots.
   Done once per game.
2. **Port phase** — create a `bsdgames/<game>/ports/<port-name>/`
   folder, implement, write `docs/diff-log.md`, capture
   port-specific screenshots. Done per port; multiple contributors
   may do this in parallel for different port styles.

Every port must satisfy the [Universal Port Contract](#67-universal-port-contract)
before being merged.

**Original-binary screenshot capture** happens during the
canonical phase (step 12 in the guide). Run
[`docs/scripts/capture-screenshots.sh <game>`](./docs/scripts/capture-screenshots.sh)
after the canonical documentation is complete.

## 8. Standards & Conventions

### File Naming

- Content docs: `kebab-case.md` (e.g. `how-to-play.md`, `port-ideas.md`).
- Repo metadata: `SCREAMING-CAPS.md` (README, LICENSE, ATTRIBUTION,
  CLAUDE, AGENTS, CHANGELOG).
- ADRs: `NNN-slug.md` (three-digit prefix + kebab-case slug).

### Diagrams

- All diagrams: **Mermaid**, inside fenced ` ```mermaid ` blocks.
- Never use ASCII art for anything more complex than a simple tree.

#### Mermaid Syntax Rules

These rules avoid render failures across GitHub, VS Code, Cursor,
and other viewers. Learned the hard way from renderer bugs during
the `atc` pilot.

- **Never use double quotes (`"`) inside edge labels.** They
  confuse the parser in `-.label.->` and `-->|label|` syntax.
  Hyphenate or reword instead.
  - ❌ `atc -.abstract "route entities" DNA.-> minimetro`
  - ✅ `atc -.route-entities DNA.-> minimetro`
- **Use `·` (middle dot U+00B7) instead of comma** in multi-item
  node labels. Commas parse inconsistently across Mermaid
  versions.
  - ❌ `[Modern engines<br/>Yixin, Katagomo]`
  - ✅ `[Modern engines<br/>Yixin · Katagomo]`
- **Prefer `<br/>` over `\n` for multi-line** in node labels —
  universal support.
- **Keep edge labels short** (< 30 chars). Long labels overflow
  layout in most renderers.
- **Quote node labels that contain special characters**
  (`!`, `?`, `()`, `/`, `:`, `[`, `]`):
  - ❌ `A[Room 1 (start)]`
  - ✅ `A["Room 1 (start)"]`
- **Test complex diagrams** at <https://mermaid.live> before
  committing. `mmdc` local render also works if Chromium is
  installed.
- **Do not mix `graph` and `flowchart` keywords** in the same
  diagram — pick one per block. `flowchart` is the modern
  successor; both render identically.

### Language

- User-facing docs (README, about, how-to-play, walkthrough, port-ideas):
  **English**.
- Internal notes / commit messages: contributor's choice; English
  preferred.

### Commit Messages

- Conventional Commits: `type(scope): summary`.
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `port`.
- Example: `port(hack): implement dungeon generation`,
  `docs(monop): write about.md`.

### Emoji

- Emoji **allowed** in markdown docs where it improves clarity or
  brochure appeal.
- Emoji **not allowed** in source code, config files, or commit
  messages.

## 9. Attribution Rules

- Never copy the original C source into this repository.
- Every ported game's `about.md` and `references.md` links to
  [github.com/vattam/BSDGames](https://github.com/vattam/BSDGames).
- Individual game authors are credited in `about.md` per game and
  aggregated in root [`ATTRIBUTION.md`](./ATTRIBUTION.md).
- Where feasible, the original BSD copyright/authorship line is
  preserved (as a comment) in the ported source.

## 10. Owner Consent Model

The repo owner (Agun) is the sole decision-maker for structural and
scope changes. Agents must:

- **Not** generate multiple files or make structural changes without
  an explicit "OK generate" from the owner.
- **Not** invent design decisions. If unsure → ask.
- **Not** skip ADRs to save time.
- **Do** propose plans first when the scope is non-trivial.
- **Do** cite sources: every historical claim in `about.md` or
  `lessons.md` requires an entry in `references.md`.

## 11. What NOT to Do

- ❌ **Include local filesystem paths anywhere in the repo.** No
  `E:\...`, `C:\...`, `/home/...`, `/Users/...`, `/mnt/...`. This
  repo is public. Personal paths leak workstation info and are
  useless to any other reader. Cite upstream URLs and relative
  file:line only. Anything you would have written as a local path
  → rewrite as an upstream GitHub URL.
- ❌ Copy original C source into the repo.
- ❌ Skip options analysis in an ADR.
- ❌ Duplicate instruction content between `AGENTS.md` and `CLAUDE.md`.
- ❌ Add features that break a game's core mechanic identity.
- ❌ Leave a game folder half-populated without noting status in
  [`docs/progress.md`](./docs/progress.md).
- ❌ Use ASCII-art diagrams when Mermaid works.
- ❌ Silently reinterpret an obsolete feature — write an ADR.

## 12. Quality Self-Check Before Completion

Before an agent (AI or human) emits a "documentation phase complete"
handoff for a game, run through this checklist. If any item fails,
fix it *before* declaring done. Reviewers use this list too.

### Anti-Patterns — Must Be Absent

- [ ] **No local filesystem paths anywhere.** No `E:\...`,
  `C:\...`, `/home/...`, `/Users/...`, `/mnt/...`, `~`. Substitute
  with upstream URLs or relative `file:line` references.
- [ ] No duplicated content between `AGENTS.md` and `CLAUDE.md`
  (thin-pointer pattern).
- [ ] No ADR without an explicit **Options Considered** section.
- [ ] No fabricated code excerpts — every `file:line` reference must
  resolve in the upstream source at
  <https://github.com/vattam/BSDGames>.
- [ ] No walkthrough presented as real when it is actually a
  constructed pedagogical example — mark such scenarios clearly.

### Content Coverage — Must Be Present

- [ ] All required docs from §6.1 exist.
- [ ] `about.md` covers author(s), publisher, release year, cultural
  context, why-it's-fun, making-of, known bugs, **difficulty &
  progression**, and embeds **≥2 screenshots** with captions.
- [ ] `architecture.md` covers game loop, AI (if any), RNG (if any),
  and **difficulty progression logic** with `file:line` citations.
- [ ] `spec.md` covers objective, state variables, actions, rules,
  RNG, termination, **difficulty levels & setup configuration**,
  and **complete object & entity inventory** (where items exist).
- [ ] `how-to-play.md` covers controls, win conditions, tips,
  scoring, easter eggs, and **difficulty modes**.
- [ ] `port-ideas.md` covers gameplay modernisation, UI/UX,
  multiplayer, persistence, other angles, **What NOT to Change**,
  and **Open Questions**.
- [ ] `walkthrough.md` (adventure games only) has **two**
  walkthroughs (shortest path + max score) or a Universal Deductive
  Protocol (for procedural games).
- [ ] `world-map.md` (fixed-map or graph-topology games) uses
  Mermaid and includes a **Master Room & Object / Entity Directory**
  mapping items/hazards to rooms.
- [ ] `lessons.md` has `file:line` references, code excerpts, and a
  "why it matters" rationale per lesson.
- [ ] `references.md` cites primary sources, historical sources, and
  technical sources.
- [ ] Screenshots in `media/` are embedded and captioned in
  `about.md` (not just linked).

### Cross-Reference Integrity

- [ ] All internal markdown links resolve to existing files.
- [ ] Relative paths correct (`../media/`, `../../AGENTS.md`,
  `../../../docs/decisions/`).
- [ ] Upstream URLs are specific and current
  (`github.com/vattam/BSDGames/tree/master/<game>`).

### Structural Hygiene

- [ ] `decisions/README.md` exists inside `docs/decisions/`
  explaining the folder's purpose (even when empty).
- [ ] `test-scenarios.md` includes a sign-off template.
- [ ] Progress dashboard (`docs/progress.md`) reflects current
  status for this game.
- [ ] Filename convention followed (kebab-case content docs,
  SCREAMING-CAPS metadata).
- [ ] Diagrams are Mermaid (no ASCII art beyond simple trees).

**If you are an AI agent producing output: verify every checkbox
above BEFORE emitting your final response.** Silent gaps become
audit findings later.

## 13. Onboarding Checklist (New Contributor)

1. Read this file (`AGENTS.md`) completely.
2. Read [`README.md`](./README.md).
3. Read [`docs/heritage.md`](./docs/heritage.md) for historical
   context.
4. Read [`docs/catalog.md`](./docs/catalog.md) for the program map.
5. Read [`docs/porting-guide.md`](./docs/porting-guide.md).
6. Read
   [`docs/decisions/002-porting-philosophy.md`](./docs/decisions/002-porting-philosophy.md)
   for the spirit of the work.
7. Pick an unclaimed game from
   [`docs/progress.md`](./docs/progress.md).
8. Follow the porting workflow.

Welcome aboard.
