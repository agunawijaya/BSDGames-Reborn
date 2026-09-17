# `monop` — Port Ideas

> Concrete design decisions the port needs to make. Not a plan —
> a menu.

---

## 1. Renaming (mandatory)

**"Monopoly" is a Hasbro trademark.** Debian's `bsdgames`
package omits `monop` for this reason. Any port must rename.

Suggested candidates:

- **`metronopoly`** — pun-forward, playful.
- **`streets`** — generic, evokes real-estate.
- **`estate`** — Zillow-era vocabulary.
- **`boardwalk`** — evokes the game without invoking trademarks.
  (Careful: "Boardwalk" itself is Parker Brothers property name.
  So maybe not.)
- **`deedgame`** — pragmatic.
- **`realtor`** — modern.
- **`bergerac`** — a nod to Cyrano, French for a Napoleon-era
  street game.

**Recommendation:** `streets` — short, unclaimed, tone-neutral.

Property naming must also change: replace Atlantic City boardwalk
names (Baltic, Boardwalk, Park Place) with generic districts. For a
themed pack, cities-of-the-world or fictional-planets are safe.

## 2. Language

*(Awaits project-wide ADR-005 / language decision.)*

Candidates:

- **Rust** — strong typing, tests, cross-platform. Card and rule
  types map naturally to enums. Deterministic RNG easy.
- **Python** — fastest to prototype; makes a web front-end almost
  trivial via Flask/FastAPI. Slower for AI opponent training but
  fine for the referee loop.
- **Go** — clean concurrency for future multi-terminal mode.
- **TypeScript + Node** — best story for a web multiplayer front
  end.
- **C++20** — closest to the original C.

Considerations: this is a rules engine + state machine + UI. The
choice matters most for the UI. Consider decoupling: a Rust rules
engine + a TS or React UI is a defensible split.

## 3. Platforms

- **CLI** — must exist. Original UX.
- **Web** — most reachable for casual players. Rooms with
  invite links.
- **Native GUI** (Qt/GTK/Electron) — optional.
- **Mobile** — optional but attractive; hot-seat mobile Monopoly
  is a viable niche.
- **Discord bot** — an interesting UI experiment.

## 4. Multiplayer

Original: **hot-seat only** on a single terminal.

Port options:

- **Preserve hot-seat.** Default. Cheap. Works on a phone.
- **Add LAN mode.** Each player at their own terminal.
- **Add internet multiplayer.** Rooms, invites, matchmaking.
  Requires a server.
- **Add turn-based-by-email / async mode.** No server needed;
  send state file as attachment or link.
- **Add AI opponent.** The obvious feature Ken Arnold didn't
  build.

Recommendation: hot-seat default; async (state-file) as v0.2;
online multiplayer as v1.0.

## 5. What NOT to Change

Preserve these to keep the spirit:

1. **Text-mode is a first-class UI.** A CLI mode must exist,
   not as a legacy option but as a viable way to play.
2. **1–9 players.** The player-count range is definitional.
3. **The 16 commands.** They're the UX contract. Add commands
   (undo, hint), don't rename existing ones.
4. **`?`-help at every prompt.** Universal help contract.
5. **Unique-prefix parsing.** `p` → `print` UX.
6. **The debt loop.** "Fix the problem before continuing."
7. **The 2-solvent-player auction skip** as a house-rule option
   (with the standard rule as the default).
8. **Save/restore.** Must remain a first-class command.
9. **`printline()`-style visual dividers in the log.** Simple
   and effective.
10. **Random flavor text pool** for advancement cards
    (`lucky_mes[]` equivalent).
11. **The banker's tone.** Curt, precise, no hand-holding.

## 6. Open Questions

Design questions to resolve before finalizing:

1. **Content pack format?** JSON, YAML, TOML, custom DSL?
   Recommendation: JSON with a `$schema` reference.
2. **Card semantics format?** How to encode "advance to nearest
   railroad" declaratively? A small effect DSL (`move_to_type:
   railroad, direction: forward`) beats hard-coded C functions.
3. **AI opponent difficulty tiers?** Beginner (accepts every
   trade), intermediate (heuristics: prioritize orange/red
   groups), expert (Q-learning). How many tiers?
4. **Persistent player profiles?** Cross-session ELO / win rates?
   Or is each game standalone?
5. **Save file format?** JSON is human-editable — pro and con.
   SQLite is tamper-resistant. Signed JSON is a middle ground.
6. **Undo?** Original doesn't have it. Adding it changes the
   game's texture. Poll players.
7. **Real-money features?** Absolutely not — but the port might
   be pitched at tabletop enthusiasts; consider whether a
   "tournament mode" with formal rulings is worth designing.

## 7. Modernizations worth adopting

- **Deterministic RNG via `--seed`** — for testing and
  reproducible bug reports.
- **`--rules` flag** to choose rule variants (Hasbro standard,
  Ken Arnold variant, custom).
- **Structured game log** (JSON lines) — every event recorded
  for replay/analysis.
- **`--replay saveN.log`** — step through a game from its log.
- **Screen reader friendly output** — clear labels, no ASCII
  art for players who use screen readers.
- **Color output** with `NO_COLOR` opt-out.
- **Localization** (i18n). Card texts especially.
- **Undo N** with confirmation.
- **Trade UX overhaul** — an interactive multi-step trade
  builder instead of one linear prompt.
- **`tutorial` mode** — a guided first game.

## 8. AI opponent design (deferred)

The one big gap. Sketch:

- **Rule-based AI** for beginner and intermediate. Buy anything
  affordable; prioritize monopolies; trade for orange/red.
- **Q-learning AI** for expert. State-action-value table trained
  offline via self-play. See academic papers on Monopoly AI
  (Yale, Georgia Tech).
- **Human-mimicking AI** as a stretch goal — replay-log-trained
  neural agent.

## 9. Web multiplayer sketch

- Rooms with 6-char join codes.
- WebSocket-based turn synchronization.
- Chat channel (game log + free-text).
- Spectator mode.
- Rejoin-after-disconnect (state persisted server-side).
- Time controls (e.g., 3-minute per turn Blitz mode).

## 10. Anti-goals

- **Do not build a 3D board.** The original is text; keep it
  text-adjacent. A 2D SVG of the board is fine; skeuomorphic
  gambling-style Monopoly clones already exist.
- **Do not add micro-transactions.** Never. This is a preservation
  project.
- **Do not add "premium properties" or "special dice".** Stay
  faithful to the 1980 rules with documented variants.
- **Do not silently break save format between versions.** Version
  the save file; refuse to load incompatible versions with a
  clear message.

## See also

- Architecture: [`architecture.md`](./architecture.md).
- Lessons: [`lessons.md`](./lessons.md).
- Working notes: [`notes.md`](./notes.md).
- Decisions log: [`decisions/`](./decisions/).
