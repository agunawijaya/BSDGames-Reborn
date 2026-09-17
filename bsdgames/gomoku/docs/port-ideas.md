# `gomoku` — Port Design Ideas

> Brainstorm for modernisation. Spiritual successor: preserve rules
> and the heuristic AI as a *foundation*, modernise everything else.

Every non-obvious choice → per-game ADR under
[`./decisions/`](./decisions/) or a root ADR.

---

## Guiding Question

> If `gomoku` were being written today, what would we do differently
> while keeping it recognisable?

---

## 1. Gameplay Modernisation

### AI

The original heuristic AI is *good* but not modern. Options:

- **Retain original heuristic as "Classic" difficulty.** Ships as
  Level 1–3 opponent.
- **Add MCTS on top** as intermediate difficulty (bootstrapped from
  the heuristic evaluator). Level 4–6.
- **Optional neural-policy** — a small trained network as the
  strongest difficulty. Level 7. Trained on self-play. This is a
  stretch goal.

The heuristic *stays* — it is the pedagogical anchor. See
[`architecture.md`](./architecture.md) and
[`lessons.md`](./lessons.md).

### Mechanics

- **Rule variants:**
  - *Free gomoku* (default, original rules).
  - *Renju* — the tournament standard: 15×15 board, Black has
    forbidden move rules (no double-three, no double-four,
    no overlines). Toggle via a flag or in-game menu.
  - *Caro / Ninuki-Renju / Pente* — related variants with capture
    or other twists. Optional add-ons.

- **Board sizes:** 19×19 (default, original) or configurable
  15×15, 13×13, 9×9 for shorter games.

- **Time controls:** blitz, standard, correspondence. Optional.

### Content

- **Opening books** — a small database of tournament openings for
  the AI to draw from in the first ~10 moves.
- **Puzzle mode** — "White to play and win in 5" positions.
  Excellent pedagogical addition.
- **Post-game analysis** — show which moves the AI thought were
  best; highlight mistakes with alternative lines. Like chess.com's
  post-game analysis.

## 2. UI / UX Design

### Visual Direction

- **Two modes:**
  - **Classic TUI** — a faithful `curses`-style board with
    ASCII stones (`O` / `X` or `●` / `○`), retains the retro feel.
  - **Modern** — high-res board, wood texture background,
    animated stone placement (subtle "click" sound). Similar in
    spirit to a mobile Go / gomoku app.
- Colourblind-friendly palette (dark grey stone + light grey stone
  works fine without colour).

### Interaction Paradigm

- Primary: keyboard-first entry (`K10<enter>`) matching the
  original.
- Secondary: mouse/touch — click / tap the intersection.
- Tertiary: keyboard cursor navigation (arrow keys move a highlight,
  Enter places).

### Layout

- Board occupies the majority of the window; sidebar shows move
  history, current colour, and (optional) AI's "think bubble"
  showing top 3 candidate moves.
- Bottom bar: available commands.

### Accessibility

- Colourblind palettes.
- Screen-reader: announce every move (e.g. "White plays K10").
  Board state summary on request.
- High-contrast mode.
- No time pressure by default.

## 3. Multiplayer / Networking

The original supports hot-seat (`-u`) and computer opponents. Add:

- **Online play via matchmaking.** Elo rating, time controls,
  spectator mode.
- **Async correspondence games.** One move a day, notification
  when opponent moves.
- **Live ranked matches.** Real-time, but seconds/move not
  seconds/game.
- **Tournament infrastructure.** The `-b` background mode was a
  precursor — turn it into a proper tournament server for AI vs.
  AI competitions.

## 4. Persistence

- Save files in **SGF format** (Smart Game Format, the standard for
  Go and gomoku). Portable and readable.
- Optional cloud storage for account users.
- Puzzle progress tracking.
- Match history with analysis attached.

## 5. Other Modernisation Angles

- **Telemetry:** opt-in, anonymised. Track: opening move
  popularity, average game length, most-common winning
  combinations. Useful for AI training and content design. Never
  track: personal info.
- **Configuration:** flags map to original (`-u`, `-b`, `-c`) plus
  new (`--rules renju`, `--seed 42`, `--ai-level N`).
- **i18n:** minimal string set — mostly board notation. Trivially
  localised. Consider Japanese notation as an option.
- **Modding:** community-authored opening books, difficulty
  configurations, custom board sizes.

## 6. What NOT to Change

Preserve to remain recognisably `gomoku`:

- **Rules of five-in-a-row.** No adding chess pieces or capture
  rules by default.
- **19×19 grid as default.**
- **Turn-based, Black moves first.**
- **The `K10` opening move** (in Classic AI) is documented
  behaviour — keep it.
- **`save`/`resign`/`quit`** commands.
- **The heuristic AI** — remains a shipped, playable opponent.
  Don't remove it in favour of a black-box neural net.

## 7. Open Questions (need ADRs)

- Should Renju be the default rule variant (competitive standard)
  or free gomoku (original)? → Per-game ADR.
- Should online play require an account? → Root ADR (affects
  other multiplayer games).
- Should the AI's "thinking" (candidate moves) be visible to the
  opponent? Interesting UX + strategic question. → Per-game ADR.
- Neural network as strongest AI: dependency creep vs. showcase
  value. → Per-game ADR.

## See Also

- [`architecture.md`](./architecture.md) — what we start from.
- [`spec.md`](./spec.md) — mechanic identity to preserve.
- [`./decisions/`](./decisions/) — per-game ADRs.
- Root [ADR-002 Porting Philosophy](../../../docs/decisions/002-porting-philosophy.md).
