# `hangman` — BSDGames Reborn

> A spiritual-successor port of the classic BSD terminal hangman game.

---

## Quick Links

- [`docs/about.md`](./docs/about.md) — history, authors, why this game matters.
- [`docs/how-to-play.md`](./docs/how-to-play.md) — controls, strategy, scoring.
- [`docs/spec.md`](./docs/spec.md) — formal mechanics specification.
- [`docs/architecture.md`](./docs/architecture.md) — analysis of the original C source.
- [`docs/lessons.md`](./docs/lessons.md) — textbook-style code lessons.
- [`docs/port-ideas.md`](./docs/port-ideas.md) — modernization brainstorm.
- [`docs/test-scenarios.md`](./docs/test-scenarios.md) — manual QA scripts.
- [`docs/manpage.md`](./docs/manpage.md) — mirror of the original man page.
- [`docs/lineage.md`](./docs/lineage.md) — genre descendants.
- [`docs/references.md`](./docs/references.md) — sources and citations.
- [`docs/notes.md`](./docs/notes.md) — working notes.

## What This Game Is

A classic terminal hangman game from the BSDGames package. The computer picks a word from a dictionary, draws a gallows, and the player guesses letters until the word is revealed or the stick figure is complete.

## Status

- **Current status:** 🟠 In Progress — documentation phase.
- **Owner:** Agun.
- **Baseline released?** No — implementation pending root language ADR.

## Original Source

<https://github.com/vattam/BSDGames/tree/master/hangman>

## License

MIT for the port. Original BSD source is not redistributed here; retrieve it from the upstream link above.
