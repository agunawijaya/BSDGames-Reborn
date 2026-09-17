# atc

> **You are the air traffic controller. Land the jets. Guide the props. Don't let them run out of fuel, exit through the wrong door, or — worst of all — collide.**

**Category:** Simulation & Strategy
· **Status:** 🟠 In Progress (documentation phase)
· **Original author:** Ed James, UC Berkeley (1986)
· **First released:** ~1986; entered BSD as of 4.3BSD-Reno / 1990

---

## About This Folder

This folder is the modernised port of **`atc`** — Ed James's cult
air-traffic-control simulator — from the original BSDGames package.
It is a self-contained learning artifact: code + history + design
record + technical breakdown.

## Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Brochure — history, Ed James, why it's fun, bugs |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | Radar reading, commands, strategy, difficulty modes |
| [`docs/architecture.md`](./docs/architecture.md) | Real-time loop, plane state machine, yacc/lex parser, difficulty |
| [`docs/lessons.md`](./docs/lessons.md) | Beginner-friendly lessons: SIGALRM, yacc, state machine |
| [`docs/port-ideas.md`](./docs/port-ideas.md) | Modernisation — voice input, TCAS, multiplayer, VR tower |
| [`docs/spec.md`](./docs/spec.md) | Formal spec: state, rules, RNG, termination, setup |
| [`docs/notes.md`](./docs/notes.md) | Working notes |
| [`docs/manpage.md`](./docs/manpage.md) | Mirror + annotation of `atc.6.in` |
| [`docs/diff-log.md`](./docs/diff-log.md) | Feature-by-feature original → port log |
| [`docs/test-scenarios.md`](./docs/test-scenarios.md) | Manual playthrough scripts |
| [`docs/lineage.md`](./docs/lineage.md) | Genre siblings, ATC descendants, tower sims |
| [`docs/references.md`](./docs/references.md) | Sources & citations |

*Not applicable to this game:* `walkthrough.md`, `world-map.md`
— `atc` has no fixed win state and its "map" is one of 17
data-driven playfields (see `data/`).

## Running the Port

*(Not implemented yet — pending platform/language ADRs.)*

## Media

See [`media/`](./media/) — 3 screenshots from the original binary
captured via
[`docs/scripts/capture-screenshots.sh`](../../docs/scripts/capture-screenshots.sh).

## Attribution

Based on the original **`atc`** by Ed James (edjames@ucbvax.berkeley.edu)
as shipped in 4.3BSD-Reno/4.4BSD. See
[`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
