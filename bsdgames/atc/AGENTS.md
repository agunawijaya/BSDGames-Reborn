# AGENTS.md — `atc` (BSDGames Reborn)

Context for AI agents and human contributors working on the port of
**`atc`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Simulation & Strategy
- **One-line description:** Real-time air-traffic-control
  simulation — direct planes into and out of the arena, landing at
  airports and exiting through the correct exits, without
  collisions, wrong destinations, or fuel exhaustion.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/atc>

## 2. Port Status

- **Current status:** 🟠 In Progress (documentation phase)
- **Owner:** Agun Wijaya (with Claude Opus)
- **Baseline released?** no

## 3. Folder Contents

```
atc/
├── README.md         Landing page
├── AGENTS.md         This file
├── CLAUDE.md         Thin pointer
├── docs/             12 documentation files
│   └── decisions/    Per-game ADR overrides (may be empty)
├── src/              Implementation (awaiting language ADR)
├── data/             17 game field files (default, novice, Killer, ...)
├── media/            Screenshots + text captures
└── tests/            Automated tests
```

## 4. Design Decisions Specific to `atc`

None yet. All decisions defer to root defaults.

Likely future ADRs:

- **Timer implementation.** Original uses `SIGALRM` + `setitimer`.
  Modern equivalents: OS timer, game-loop tick, async task.
- **Command parser.** Original uses `yacc` + `lex` grammar. Modern
  ports may replace with hand-written parser or peg/parser
  combinators.
- **Game field format.** Original uses a custom text DSL parsed by
  yacc. Keep? Replace with JSON/YAML? Both?
- **Pause functionality.** Original explicitly forbids suspend
  ("When was the last time an Air Traffic Controller got called
  away to the phone?"). Modernise or keep authentic pain?

## 5. Gotchas & Non-Obvious Notes

- **Real-time via `SIGALRM`.** `update()` fires from a signal
  handler triggered by `setitimer`. Empty-input Enter forces an
  immediate update. This is architecturally elegant but signal-safe
  code discipline required.
- **Jets tick every update; props tick every OTHER update.**
  `if (pp->plane_type == 0 && clck & 1) continue;` in
  `update.c:87`. Uppercase = prop, lowercase = jet.
- **Collision = adjacency in ALL 3 dimensions.**
  `too_close(p1, p2, 1)` in `update.c:392-401`. Two planes at
  altitude 7 and 6, both at (5,10), collide.
- **Max turn is 90° per update.** `dir_diff` clamped to `[-2, +2]`
  in `update.c:107-110`. `MAXDIR = 8` = 8 compass directions
  (45° each).
- **Altitude change is ±1000 ft per update.** `SGN(new_altitude -
  altitude)` in `update.c:94`.
- **Fuel starts at `width + height`.** Small maps punish slow
  play. `update.c:353`.
- **Landing requires: altitude 0, position over airport, direction
  matches airport direction.** `update.c:129-138`.
- **Exit requires: altitude 9, position at exit.** `update.c:141-149`.
- **Command grammar is `yacc`.** See `grammar.y` and `lex.l`. Real
  yacc/lex, not hand-written recursive descent.
- **`?` at any point lists valid next characters.** Command
  completion built-in. A rare feature for its era.
- **Score sorted by planes safely landed** — no time bonus.
- **17 playfields ship with the game**: default, novice, easy,
  crossover, box, two-corners, crosshatch, airports, game_2..4,
  Killer, Atlantis, OHare, Tic-Tac-Toe. Difficulty ranges wildly.
- **No suspend allowed** — SIGTSTP/SIGSTOP ignored (`main.c:149-150`).
  This is philosophy, not oversight.
- **`test_mode`**: if you play a game not in the `Game_List` file,
  scoring is disabled.

## 6. Workflow

Follow the standard 14-step workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source not committed. Cite upstream only.
- Preserve Ed James's 1987 copyright when quoting algorithms.
- Contact info in original source: `edjames@ucbvax.berkeley.edu`
  (historical; do not attempt).
