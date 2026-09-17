# Templates

Skeleton files used to instantiate every game folder and every port
folder in `bsdgames/`. Under
[ADR-006](../decisions/006-multi-port-architecture.md) templates are
split into two tiers:

- **`game/`** — canonical, one-time-per-game files. Describe the
  game itself and its original C implementation.
- **`port/`** — per-port files. One set instantiated per port
  implementation.

See
[ADR-004 (revised)](../decisions/004-per-game-doc-taxonomy.md) for
the rationale of the split.

## Structure

```
templates/
├── README.md               THIS FILE
├── game/                   Canonical, one per game
│   ├── README.md
│   ├── AGENTS.md
│   ├── CLAUDE.md
│   └── docs/
│       ├── about.md
│       ├── how-to-play.md
│       ├── walkthrough.md      ⚠ Conditional — adventure games only
│       ├── world-map.md        ⚠ Conditional — fixed-map / graph games only
│       ├── architecture.md
│       ├── lessons.md
│       ├── port-ideas.md
│       ├── spec.md
│       ├── notes.md
│       ├── manpage.md
│       ├── test-scenarios.md
│       ├── lineage.md
│       ├── references.md
│       └── decisions/
│           └── README.md
└── port/                   Per port implementation
    ├── README.md
    ├── AGENTS.md
    ├── CLAUDE.md
    └── docs/
        ├── diff-log.md
        └── decisions/
            └── README.md
```

## Instantiating a new game (canonical phase)

1. Create the folder: `bsdgames/<GAME>/`.
2. Copy the contents of `templates/game/` into
   `bsdgames/<GAME>/`, preserving the subdirectory layout.
3. In every file, replace `<GAME>` with the actual game name.
4. Delete conditional docs that don't apply — see
   [ADR-004](../decisions/004-per-game-doc-taxonomy.md) §Sub-Decision
   for the applicability matrix (adventure → walkthrough, fixed-map →
   world-map, otherwise skip both).
5. Fill in `docs/spec.md` first — it is the contract every port will
   honor. Then `docs/architecture.md`, then the rest.
6. Capture original-binary screenshots with
   [`../scripts/capture-screenshots.sh <GAME>`](../scripts/) and place
   them in `bsdgames/<GAME>/media/`.
7. Embed the screenshots in `docs/about.md`.

## Instantiating a new port (port phase)

1. Pick a port name following the naming convention in
   [ADR-006 §Port Naming Conventions](../decisions/006-multi-port-architecture.md).
   Style-first (`classic-web`, `fancy-web`, `retro-terminal`,
   `mobile-gimmicks`, `native-desktop`, `game-engine`) with tech
   suffix if needed (`classic-web-svelte`, `retro-terminal-rust`).
2. Create the folder:
   `bsdgames/<GAME>/ports/<PORT-NAME>/`.
3. Copy the contents of `templates/port/` into it, preserving the
   subdirectory layout.
4. In every file, replace `<GAME>` with the game name and
   `<PORT-NAME>` with your port name. Fill in the port-specific
   sections of `README.md` and `AGENTS.md`.
5. Add your build manifest: `package.json` (Node/TS), `Cargo.toml`
   (Rust), `pyproject.toml` (Python), `go.mod` (Go), etc. Language
   and stack are your choice — see
   [ADR-006 §Universal Port Contract](../decisions/006-multi-port-architecture.md).
6. Read `../../docs/spec.md` — that is your implementation contract.
7. Implement in `src/`, test in `tests/`, capture port-specific
   screenshots in `media/` once the port is playable.
8. Keep `docs/diff-log.md` up to date as you make choices.

Reference starter kits (concrete tech configurations) will live at
`templates/port/<style>/` once the first port of each style is
built. The `classic-web` reference starter is the first one on the
roadmap — it will follow the stack decided in
[ADR-005](../decisions/005-target-language-and-ui-stack.md).

## Required-doc matrices

**Canonical (game level) — required per game:**

| Document | All games | Adventure | Board/Card | Utility |
|---|:---:|:---:|:---:|:---:|
| README, AGENTS, CLAUDE | ✅ | ✅ | ✅ | ✅ |
| about, how-to-play, manpage, references | ✅ | ✅ | ✅ | ✅ |
| architecture, lessons, port-ideas | ✅ | ✅ | ✅ | ✅ |
| spec, notes, test-scenarios, lineage | ✅ | ✅ | ✅ | ✅ |
| **walkthrough** | ❌ | ✅ | ❌ | ❌ |
| **world-map** | ❌ | ✅ (fixed map) | ❌ | ❌ |

**Port level — required per port:**

| Item | Required |
|---|:---:|
| `README.md` | ✅ |
| `AGENTS.md`, `CLAUDE.md` | ✅ |
| `docs/diff-log.md` | ✅ |
| `docs/decisions/` (folder) | ✅ |
| `src/`, `tests/` | ✅ (once implementation begins) |
| `media/` (port-specific screenshots) | ✅ once port has working src |
| Build manifest (`package.json` / `Cargo.toml` / …) | ✅ |
| `docs/test-scenarios.md` | Conditional (only if port adds features) |
| `docs/notes.md` | Optional |

## Editing These Templates

- Improvements benefit every future game or port — err toward
  keeping templates general.
- Do not commit game- or port-specific content to templates.
- Structural changes (adding/removing doc types) require an update
  to
  [`../decisions/004-per-game-doc-taxonomy.md`](../decisions/004-per-game-doc-taxonomy.md)
  and possibly
  [`../decisions/006-multi-port-architecture.md`](../decisions/006-multi-port-architecture.md).

## Automation

A future scaffolding script (not yet written) will automate the
copy/rename/replace steps for both game and port instantiation.
Until it exists, do the steps by hand or keep a shell alias /
PowerShell function.
