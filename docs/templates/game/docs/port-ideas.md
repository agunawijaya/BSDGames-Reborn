# `<GAME>` — Port Design Ideas

> **Brainstorm for modernisation.** Cover every dimension below.
> Where a dimension doesn't apply, write "N/A" with a one-line
> reason.

We are doing a **spiritual successor** (ADR-002). Preserve the *core
mechanic*; freely modernise everything else. Every non-obvious
choice becomes a per-game ADR under
[`./decisions/`](./decisions/) or a root ADR if it affects multiple
games.

---

## Guiding Question

> If this game were being designed *today*, with no era constraints,
> what would we do?

---

## 1. Gameplay Modernisation

### AI

*If the game has computer opponents — how could their AI be
improved?*

- Current: [heuristic / minimax depth N / rule-based / N/A]
- Ideas: [MCTS, neural policy, adaptive difficulty, personality
  profiles, ...]

### Mechanics

- New mechanics that fit the spirit but were impossible before.
- Tuning changes (pacing, balance, difficulty curve).

### Content

- Additional levels / puzzles / cards / maps.
- Procedural extensions.

## 2. UI / UX Design

**This section is mandatory.** Even for a TUI-first port, articulate
the UX.

### Visual Direction

- Reference art / palette / typography / mood-board pointer.
- Preserve terminal aesthetic? Neo-retro? Fully modern?

### Interaction Paradigm

- Keyboard-only? Mouse-optional? Touch? Controller?
- Command language vs. menus vs. direct manipulation.

### Layout

- Screen regions. Responsive to different terminal sizes.
- ASCII-art / Unicode-block / glyph decisions.

### Accessibility

- Colorblind-friendly palette.
- Screen-reader friendliness (semantic structure of output).
- Configurable input timing (for players with slower reflexes).

## 3. Multiplayer / Networking

*If the original supports multiplayer, or if the mechanic could.*

- Local (hot-seat): keep? drop?
- LAN: keep the pattern?
- **Internet:** design the modern equivalent. Matchmaking? Lobby?
  Spectator? Anti-cheat?
- Communication: chat / voice / emote / none.

If N/A: [state why.]

## 4. Persistence

- Save / load format.
- Local vs. cloud sync.
- Cross-device continuity.
- Leaderboards.

## 5. Other Modernisation Angles

- **Telemetry:** what to collect, what to never collect.
- **Configuration:** flags, environment variables, config file.
- **Internationalisation:** if strings matter (`fortune`, `wtf`,
  `quiz`), plan for i18n.
- **Modding:** can users add content?
- **Ports / distribution:** desktop, web, mobile, embedded.

## 6. What NOT to Change

*The mechanic identity of the game. Explicitly state what must be
preserved to keep this recognisable as `<GAME>`.*

- ...
- ...

## 7. Open Questions

Questions this brainstorm raised that need a decision (usually via
ADR):

- ...
- ...

## See Also

- [`architecture.md`](./architecture.md) — what we start from.
- [`spec.md`](./spec.md) — the mechanic identity to preserve.
- [`./decisions/`](./decisions/) — where per-game ADRs live.
- Root [ADR-002 Porting Philosophy](../../docs/decisions/002-porting-philosophy.md).
