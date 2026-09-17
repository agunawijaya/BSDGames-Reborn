# AGENTS.md — `battlestar` Context

This file provides context for AI agents working specifically on the
`bsdgames/battlestar/` directory.

The **single source of truth** for repository-wide standards is the root
[`AGENTS.md`](../../AGENTS.md). **Read the root `AGENTS.md` completely
before doing any work.**

---

## 1. Game Identity

- **Program:** `battlestar` (a stellar-tropical parser adventure)
- **Author:** David W. Horatio Riggle (UC Berkeley Cory Hall PDP-11/70)
- **Year:** 1979 / 1983 (4.2BSD release)
- **Category:** Adventure / RPG (Fixed-Map Interactive Fiction)
- **Upstream Source:** [`vattam/BSDGames/tree/master/battlestar`](https://github.com/vattam/BSDGames/tree/master/battlestar)

---

## 2. Mandatory Taxonomy & Standards

Because `battlestar` is a fixed-map text adventure game with movable objects,
the following conditions apply:

1. **Both Conditional Documents Are Required:**
   - [`docs/world-map.md`](./docs/world-map.md): Must contain Mermaid diagrams for all five sectors and the **Master Room & Object / Entity Directory** mapping all 275 rooms to initial objects and hazards.
   - [`docs/walkthrough.md`](./docs/walkthrough.md): Must contain **two** distinct walkthroughs: (1) Shortest Speedrun Victory Path and (2) Maximum Score / Grandmaster Path.
2. **Object Inventory:**
   - [`docs/spec.md`](./docs/spec.md) must feature the complete 64-object inventory table detailing weights, bulk/encumbrance, flags, and day/night initial distributions.
3. **Difficulty & Setup Configuration:**
   - All documentation files (`spec.md`, `how-to-play.md`, `about.md`, `architecture.md`) must cover startup parameters, save/restore mechanics (`-r saved-file`), wizard mode flags (`su`), and runtime combat/fuel dials.
4. **No Local Paths:**
   - Never write local workstation filesystem paths. All code citations must be formatted as upstream URLs (`https://github.com/vattam/BSDGames/tree/master/battlestar/<file>#L...`) or relative file paths.
