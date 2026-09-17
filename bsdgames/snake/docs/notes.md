# `snake` — Working Notes

---

## 2026-09-16

- Documentation-phase pilot. All 12 pre-porting docs generated
  from source analysis (Claude Opus).
- **Important clarification for readers:** this is not the Nokia
  snake. It is a *chase* game where the snake pursues you. Must
  be emphasised prominently in `README.md` and `about.md`.
- Chose *not* to unify with Nokia-style mechanic in default port
  mode. See [`port-ideas.md`](./port-ideas.md) §6.
- Dynamic scoring formula tuned to 3 empirical data points is a
  wonderful design lesson. See [`lessons.md`](./lessons.md)
  Lesson 2.
- `chase()` primitive reuse for setup and AI is elegant. See
  Lesson 1.

<!--
Use this file for:
- Half-baked ideas that may or may not turn into ADRs.
- Questions raised during porting to research later.
- Snippets, todo lists, gotchas that surface during work.
-->
