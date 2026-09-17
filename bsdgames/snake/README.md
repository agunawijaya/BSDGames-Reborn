# snake

> **Grab all the money you can. Don't get eaten by the six-segment snake that hunts you across the terminal.**

**Category:** Arcade & Action
· **Status:** 🟠 In Progress (documentation phase)
· **Original authors:** UC Berkeley programmers (copyright 1980, 1993)
· **First released:** ~1980 (BSD 4.1-era)

---

## About This Folder

The modernised port of **`snake`** — a display-based chase game from
the original BSDGames package. Not to be confused with the modern
snake-eats-food-to-grow variant popularised by Nokia phones; the
BSD `snake` is a **chase game** where the snake is *chasing you*,
and you play a human collecting money.

## Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Brochure — history, why it's fun, authors |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | Controls, tips, scoring, spacewarp |
| [`docs/architecture.md`](./docs/architecture.md) | Snake AI, RNG placement, dynamic scoring |
| [`docs/lessons.md`](./docs/lessons.md) | Techniques for beginners |
| [`docs/port-ideas.md`](./docs/port-ideas.md) | Modernisation brainstorm |
| [`docs/spec.md`](./docs/spec.md) | Rules and state specification |
| [`docs/notes.md`](./docs/notes.md) | Working notes |
| [`docs/manpage.md`](./docs/manpage.md) | Mirror of the original `snake.6` |
| [`docs/diff-log.md`](./docs/diff-log.md) | Feature diff log |
| [`docs/test-scenarios.md`](./docs/test-scenarios.md) | Manual test scripts |
| [`docs/lineage.md`](./docs/lineage.md) | Genre siblings (Nokia snake, agar.io, ...) |
| [`docs/references.md`](./docs/references.md) | Sources & citations |

*Not applicable:* `walkthrough.md`, `world-map.md` — the game field
is dynamic and generated fresh each game.

## Sub-tools

The original ships **`snscore`** alongside `snake` — a small
utility that lists high scores without launching the game. The port
should include an equivalent (as `--scores` subcommand or a
separate binary).

## Running the Port

*(Not implemented yet.)*

## Attribution

Based on the original **`snake`** as shipped in 4.1BSD-era games.
See [`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
