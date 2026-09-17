# `gomoku` `fancy-web` — Port Working Notes

Half-baked ideas, gotchas, and post-release polish items. Not a
substitute for [`diff-log.md`](diff-log.md) (which is the canonical
story of what shipped) or the port ADRs under
[`decisions/`](decisions/) — this file is scratch space.

---

## 2026-09-18 — Post-palette-shift observations

- **Traditional-board low-contrast is a feature, not a bug.** On a
  real kaya board, hamaguri (white shell) stones are only slightly
  brighter than the wood surface — they don't "pop" the way white
  stones on a black board do. The port intentionally keeps that
  low-contrast pairing (`#f2eddb → #d0c6a6` on `#e8c184`) rather
  than boosting the stones to pure white. It reads as authentic
  once you spend a few seconds with it.
- **Vermillion doubles as the "accent everywhere" colour.** The
  last-move ring, the win line, the "New game" button, the
  "Winner!" text, and the footer link all resolve to `#c23b22`.
  If we ever add secondary accents (hints, warnings), pick from a
  different hue — not another red — or the visual language
  collapses.
- **The dark-brown ink `#3a2a1a`** on the Mode-toggle active state
  reads well against the cream card `#f5efe0`, but if we ever swap
  to a darker card, revisit — it may lose contrast.

## Follow-ups (not blocking release)

- **Sound.** No audio yet. A subtle wood-clack on stone drop
  would complete the "real board" feeling. Needs a port-level ADR
  before landing (see [ADR-004 principle](../../../../docs/decisions/004-per-game-doc-taxonomy.md)
  and root AGENTS §4).
- **Deploy.** GitHub Pages / Vercel / Cloudflare Pages all fine —
  bundle is tiny (49.66 KB gzipped). Deploy blocks the ✨ Complete
  status per canonical [`../../../docs/progress.md`](../../../../docs/progress.md).
- **SGF save/load.** Deferred to v2 per diff-log. If someone
  picks this up, the parser needs to handle the SGF FF[4]
  standard's `AB` / `AW` (add-black / add-white) properties for
  handicap positions and `B[jd]` / `W[jd]` move syntax
  (letters a-s map to internal cols 0-18 — note the different
  letter convention from the display labels A-T-skip-I).
- **Renju rules variant.** Would need a `RuleSet` type in
  `game/state.ts` and rule-scoped legal-move check in `engine.ts`.
  A no-op passthrough for `rules === 'free'` keeps this change
  additive. See canonical [`../../../docs/port-ideas.md`](../../../docs/port-ideas.md)
  §7.
- **Smaller boards (9×9, 13×13, 15×15).** Would need `BOARD_SIZE`
  to become a `GameState` field rather than a compile-time
  constant, plus scaling the hoshi pattern per size (9×9 has 5
  hoshi at corners + centre; 13×13 has 5; 15×15 has 5; 19×19
  has 9).
- **Online play via WebRTC.** See root
  [ADR-005 §Multiplayer](../../../../docs/decisions/005-porting-tech-stack.md).
  Turn-based, so latency is not the bottleneck — sync is trivial;
  the interesting work is lobby / discovery / reconnection.

## Known gotchas

- **`useState<GameState>` is fine at 19 × 19**, but if we ever
  ship larger boards (Renju variants use 15 × 15 typically; some
  UIs go up to 21 × 21), reconsider `useReducer` for cleaner
  diffs. Right now the whole `board: Stone[][]` copies on every
  move — negligible at 361 cells, could matter at ~700.
- **`setTimeout(..., 500)` for the AI think delay** is a UX
  choice, not a genuine wait. If you swap in a real MCTS AI, this
  timeout must go — the AI should signal readiness itself so slow
  positions don't feel snappy-fake.
- **Playwright dev dependency.** The screenshot script imports
  `playwright` but it's install-on-demand via
  `npm install playwright --no-save` in the capture flow. Not
  in `package.json`. Rationale: keeps the port's install lean;
  screenshots are captured once per release, not on every
  contributor's machine.

## Bundle-size sanity

- 2026-09-17 first release: **49.67 KB gzipped**.
- 2026-09-17 after palette shift: **49.66 KB gzipped**
  (negligible change — palette lives in CSS + a few JS
  constants).
- 150 KB gzipped budget stays comfortable; anything under the
  100 KB soft threshold means we can add features without
  worrying.

<!--
Use this file for:
- Half-baked ideas that may or may not turn into port ADRs.
- Questions raised during porting to research later.
- Snippets, todo lists, gotchas that surface during work.
Do NOT use this file for:
- Anything that belongs in diff-log.md (the canonical release
  story) or a decisions/NNN-*.md ADR (a locked-in choice).
-->
