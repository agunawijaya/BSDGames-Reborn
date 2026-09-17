# gomoku

> **Get five in a row before your opponent does. Sounds simple. Try beating the built-in AI.**

**Category:** Board Games
· **Original author:** Ralph Campbell (contributed to UC Berkeley, 1994)
· **Board display:** based on `goref` by Peter Langston
· **First released:** 1994 (4.4BSD-era)

---

## About This Folder

Under [ADR-006](../../docs/decisions/006-multi-port-architecture.md)
each game has two tiers:

1. **Canonical** (this folder's `docs/` and `media/`) — describes
   the game itself and its original C implementation. Written
   once; shared by every port.
2. **Ports** — under [`ports/`](./ports/). Each port is a
   self-contained implementation with its own tech stack,
   author, license, and deploy target.

## Canonical Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Brochure — history, author, why it's fun |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | Rules, controls, tips, scoring |
| [`docs/architecture.md`](./docs/architecture.md) | AI analysis — combo evaluation, frames, force detection |
| [`docs/lessons.md`](./docs/lessons.md) | Lessons for beginners from the AI code |
| [`docs/port-ideas.md`](./docs/port-ideas.md) | Modernisation brainstorm — better AI, UI/UX, online play |
| [`docs/spec.md`](./docs/spec.md) | **The contract** every port must honor — rules + state |
| [`docs/notes.md`](./docs/notes.md) | Working notes |
| [`docs/manpage.md`](./docs/manpage.md) | Mirror + annotation of the original `gomoku.6` |
| [`docs/test-scenarios.md`](./docs/test-scenarios.md) | Universal scenarios every port must pass |
| [`docs/lineage.md`](./docs/lineage.md) | Genre siblings (Renju, Connect Four, etc.) |
| [`docs/references.md`](./docs/references.md) | Sources & citations |

*Not applicable to this game:* `walkthrough.md`, `world-map.md`.

*Note:* `diff-log.md` moved to port level per ADR-006 revision —
see each port's `docs/diff-log.md`.

## Ports

| Port | Status | Style | Tech | Owner | Live URL |
|---|:---:|---|---|:---:|---|
| [`fancy-web`](./ports/fancy-web/) | 🟢 **Released 2026-09-17** | Traditional Japanese board — kaya-wood SVG surface, black grid ink, matte-slate + clamshell stones, vermillion cinnabar last-move mark, animated pulsing win-line. Heuristic AI + hot-seat. Palette locked 2026-09-17 (see [port diff-log](./ports/fancy-web/docs/diff-log.md)). Full [port README](./ports/fancy-web/README.md). | React 18 + TypeScript + native SVG + Vite | Agun | *(pending deploy)* |
| `classic-web` | 🔴 Unclaimed | Faithful curses-board reproduction with ASCII stones | TypeScript + Vite + PWA (per ADR-005) | — | — |

## Media

See [`media/`](./media/) for screenshots of the **original**
BSDGames binary (shared across every port). Port-specific media
lives under each port's own `media/`.

## Attribution

Based on the original **`gomoku`** by Ralph Campbell. See
[`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
