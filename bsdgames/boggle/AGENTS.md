# AGENTS.md — `boggle` Context

This file provides context for AI agents working specifically on the
`bsdgames/boggle/` directory.

The **single source of truth** for repository-wide standards is the root
[`AGENTS.md`](../../AGENTS.md). **Read the root `AGENTS.md` completely
before doing any work.**

---

## 1. Game Identity

- **Program:** `boggle` (terminal 4x4 word search game)
- **Author:** Barry Brachman
- **Year:** 1988 / 1993 (4.4BSD release)
- **Category:** Puzzle & Word Games
- **Upstream Source:** [`vattam/BSDGames/tree/master/boggle`](https://github.com/vattam/BSDGames/tree/master/boggle)

---

## 2. Mandatory Taxonomy & Standards

As a word/puzzle game:
1. Standard 15-document suite required. `walkthrough.md` and `world-map.md` are omitted as per §6.1.
2. [`docs/spec.md`](./docs/spec.md) must feature the **Complete 16-Cube Face Inventory Table** detailing each cube's six faces and adjacency relations.
3. [`docs/how-to-play.md`](./docs/how-to-play.md), [`docs/spec.md`](./docs/spec.md), and [`docs/architecture.md`](./docs/architecture.md) must explicitly document all setup parameters and CLI flags (`-t`, `-w`, `-s`, `-b`, custom board specification, `+`/`++` cube reuse).
4. Strictly NO local filesystem paths anywhere in the documentation. Use upstream URLs or relative links only.
