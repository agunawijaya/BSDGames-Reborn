# `dab` — Port Ideas

`dab` is a well-known board game with a simple ruleset and a modest
AI. Modernisation can go in several directions.

---

## Gameplay Modernisation

- **Stronger AI:** Replace the heuristic with minimax, MCTS, or a
  trained neural net.
- **Undo/redo:** Let players take back accidental moves.
- **Hint mode:** Show a recommended move for learners.
- **Match options:** First-to-N-games series with persistent totals.

## UI/UX Design Ideas

- **Mouse support:** Click between dots to draw lines.
- **Responsive web UI:** Play in a browser with SVG graphics.
- **Colour themes:** Highlight the current player, completed boxes,
  and possible moves.
- **Mobile app:** Touch-based dots and boxes with single-player and
  pass-and-play.

## Internet Multiplayer Design

- **Real-time 1v1:** Two players connect via WebSocket; server
  validates moves.
- **Turn-based async:** Make a move, opponent gets notified.
- **Spectator mode:** Watch computer-vs-computer games.

## Persistence / Cloud / Cross-Device

- Save match history and Elo ratings.
- Sync ongoing games across devices.

## Other Modernisation Angles

- **Tutorials:** Teach chain theory and the double-cross strategy.
- **Variants:** Different board shapes, scoring twists, or timed turns.
- **Accessibility:** Screen-reader descriptions of the board state.

## What NOT to Change

- Keep the rule that completing a box grants another turn.
- Preserve the simple 2D grid topology.

## Open Questions

- Should the port keep the exact three-tier AI or replace it with a
  stronger engine?
- Should board sizes be restricted to what fits a terminal, or allow
  scrolling/zooming?
