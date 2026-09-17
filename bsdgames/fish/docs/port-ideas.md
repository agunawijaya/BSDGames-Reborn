# `fish` — Port Ideas

`fish` is a social card game at heart. Modernisation means making it
multiplayer, prettier, and more accessible.

---

## Gameplay Modernisation

- **Multiple AI personalities:** Timid, aggressive, memory-based,
  cheater.
- **Difficulty levels:** Easy (random asks), Medium (memory), Hard
  (full bookkeeping).
- **Undo last ask:** Forgiving mode for learners.
- **Tutorial:** Interactive guide to Go Fish rules.

## UI/UX Design Ideas

- **Card art:** Render actual card faces instead of text ranks.
- **Web UI:** Drag cards to ask, animated Go Fish draw.
- **Sound:** Card slide, splash for Go Fish, fanfare for books.
- **Mobile:** Touch to ask, swipe to draw.

## Internet Multiplayer Design

- **2–6 players:** Classic Go Fish supports more than two.
- **Turn-based rooms:** WebSocket server manages hands and asks.
- **Spectator mode:** Watch AI games.

## Persistence / Cloud / Cross-Device

- Save win/loss records and favourite AI personality.
- Sync multiplayer games across devices.

## Other Modernisation Angles

- **Localisation:** Card rank names and messages in multiple
  languages.
- **Accessibility:** Screen-reader friendly hand descriptions.
- **Statistics:** Track most-asked ranks, win rate per difficulty.

## What NOT to Change

- Keep the rule that you must hold a rank to ask for it.
- Preserve the core Go Fish loop: ask → transfer or draw → books.

## Open Questions

- Should the rare cheat remain in a modern port, or be configurable?
- Should the game support more than two players?
