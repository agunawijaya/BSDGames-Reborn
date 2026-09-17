# `gomoku` — Working Notes

---

## 2026-09-16

- Documentation-phase pilot. All 12 pre-porting docs generated
  from source analysis (Claude Opus).
- **Key insight:** the AI is genuinely non-trivial — worth studying
  and possibly retaining as the "Classic" difficulty in the port
  even after adding MCTS/neural options.
- Combo evaluation via pre-enumerated frames is *the* clever
  technique here. See [`lessons.md`](./lessons.md) Lesson 1.
- Consider adopting SGF as save format for the port.
- Open design question: whether to support Renju rules as default
  or keep free-gomoku. See [`port-ideas.md`](./port-ideas.md) §7.

<!--
Use this file for:
- Half-baked ideas that may or may not turn into ADRs.
- Questions raised during porting to research later.
- Snippets, todo lists, gotchas that surface during work.
-->
