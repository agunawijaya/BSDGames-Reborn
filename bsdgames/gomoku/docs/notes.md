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

## 2026-09-17

- **First port shipped** — `fancy-web` at 🟢 Released. React 18 +
  native SVG + Vite, 47/47 vitest pass, TypeScript strict clean,
  49.67 KB gzipped. See
  [`ports/fancy-web/docs/diff-log.md`](../ports/fancy-web/docs/diff-log.md).
- **Palette follow-up** — same day, user rejected the initial
  dark-slate aesthetic; port was re-skinned to a traditional
  Japanese gomoku board (kaya wood + slate + hamaguri stones +
  vermillion cinnabar). Rationale in the port diff-log's
  *2026-09-17 palette update* entry. **Design lesson:** even
  when a board-game port has strong "modern game UI" precedent,
  a physical-board aesthetic often reads better because the
  game itself is centuries older than any digital UI convention
  — worth considering for future board-game ports (backgammon,
  cribbage pegboard, monopoly).

## 2026-09-18

- **Port-level docs finalised** — added
  [`ports/fancy-web/docs/test-scenarios.md`](../ports/fancy-web/docs/test-scenarios.md)
  (20 port-specific scenarios) and
  [`ports/fancy-web/docs/notes.md`](../ports/fancy-web/docs/notes.md)
  (follow-ups + gotchas). Canonical docs unchanged — the
  additive features are documented at the port level, not
  retro-fitted into the canonical spec, per
  [ADR-006](./decisions/) rule "canonical describes the game,
  ports describe the port".

<!--
Use this file for:
- Half-baked ideas that may or may not turn into ADRs.
- Questions raised during porting to research later.
- Snippets, todo lists, gotchas that surface during work.
-->
