# canfield

> **Berkeley Canfield.** The 1980 Steve Levine curses solitaire —
> the "gambling" variant where you buy the deck for $13, pay $26
> for the game itself, get $5 per card off, and are charged for
> every second of thinking time. Ships with a companion
> `cfscores(6)` account-balance viewer.

- **Authors:** Steve Levine (original), Steve Feldman (curses
  port), Kirk McKusick + Mikey Olson (card counting), Eric Allman +
  Kirk McKusick (UI), Kirk McKusick (betting).
- **Genre:** Single-player card game / solitaire.
- **Players:** 1 (no AI opponent — solitaire).
- **Complexity:** S (~1–3 days work).
- **Status:** Released — canonical docs complete; the `fancy-web` port is released (see [`ports/fancy-web/`](./ports/fancy-web/)).

## What lives here

```text
canfield/
├── AGENTS.md                — instructions for AI agents
├── CLAUDE.md                — pointer to AGENTS.md
├── README.md                — this file
├── docs/                    — pre-porting documentation
│   ├── about.md
│   ├── how-to-play.md
│   ├── architecture.md
│   ├── lessons.md
│   ├── port-ideas.md
│   ├── spec.md
│   ├── notes.md
│   ├── manpage.md
│   ├── diff-log.md
│   ├── test-scenarios.md
│   ├── lineage.md
│   ├── references.md
│   └── decisions/
│       └── README.md
├── media/                   — screenshots captured from live binary
├── src/                     — port source (empty until Phase 2)
├── data/                    — reserved for pre-rolled hands / test decks
└── tests/                   — automated tests (empty until Phase 2)
```

## Start here

- New reader? Read [`docs/about.md`](./docs/about.md).
- Playing? Read [`docs/how-to-play.md`](./docs/how-to-play.md).
- Porting? Read [`docs/architecture.md`](./docs/architecture.md)
  then [`docs/port-ideas.md`](./docs/port-ideas.md).
- Contributing? See root
  [`AGENTS.md`](../../AGENTS.md) + local
  [`AGENTS.md`](./AGENTS.md).

## Attribution & Licensing

Original © 1980, 1993 The Regents of the University of California,
released under the BSD 3-clause licence. Later NetBSD maintenance
under the same terms.

See root [`ATTRIBUTION.md`](../../ATTRIBUTION.md).
