# monop

> **Reminiscent of the Parker Brothers game Monopoly.** Ken Arnold's
> 1980 BSD implementation for 1–9 players on a shared terminal.
> Full board, 16 commands, save/restore, chance & community chest
> cards, mortgages, houses, hotels, trades, resignation, and jail —
> all in an interactive text prompt.

- **Author:** Ken Arnold (Berkeley, 1980), later maintenance by
  Joseph Samuel Myers (NetBSD).
- **Genre:** Board game / economic simulation.
- **Players:** 1–9 hot-seat (single terminal).
- **Complexity:** M (~7 days work, per project scale).
- **Status:** Documentation phase.

## What lives here

```text
monop/
├── AGENTS.md                — instructions for AI agents on this game
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
├── data/                    — mon.dat, prop.dat, brd.dat, cards.inp
│                              (extracted at port time)
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
released under the BSD 3-clause licence. Later NetBSD maintenance ©
Joseph Samuel Myers under the same terms. Custom `malloc.c` in the
tree is Chris Kingsley's 1982 Caltech allocator.

**Trademark note:** "Monopoly" is a registered trademark of Hasbro
(via Parker Brothers). Debian's default `bsdgames` package **omits
monop** for this reason; the game is included in the upstream
BSDGames source but requires a manual build. Any port should choose
a distinct name (e.g., **Metronopoly**, **Streets**, **Estate**) and
generic property names to avoid trademark issues while preserving
the game feel.

See root [`ATTRIBUTION.md`](../../ATTRIBUTION.md).
