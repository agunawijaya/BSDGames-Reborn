# `canfield` — Diff Log

> Chronological log of changes and observations during the
> documentation phase. When the port begins, upgrade to a
> real changelog per [Keep a Changelog](https://keepachangelog.com).

---

## 2026-09-17

- **Documentation phase kickoff.** Owner: Agun via Claude.
- Read upstream `canfield.6.in`, `canfield.c`, and `cfscores.c`
  from
  <https://github.com/vattam/BSDGames/tree/master/canfield>.
- Debian `bsdgames` package **includes** `canfield` (unlike
  `monop`) — no compile needed. Screenshots captured directly.
- Captured 4 screenshots via WSL + tmux:
  1. Instructions prompt.
  2. Instructions text.
  3. Initial deal (base rank 9, foundation 9h, tableau
     3c/10c/6s/6h).
  4. Mid-game (base rank 7 in a different seed, foundations
     7d and 7c, tableau built partially).
- Confirmed the 10-command grammar via source at
  `canfield.c` around `getcmd()`/`movecard()`.
- Confirmed the betting constants:
  ```c
  #define costofhand             13
  #define costofinspection       13
  #define costofgame             26
  #define costofrunthroughhand    5
  #define costofinformation       1
  #define secondsperdollar       60
  #define maxtimecharge           3
  #define valuepercardup          5
  ```
- Verified `cfscores.c` is a small (~250 LOC) reader-only
  companion.
- Verified the score file is a fixed-offset binary record indexed
  by UID (traditional BSD setgid `games` deployment).

## Files created

```
bsdgames/canfield/
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── docs/
│   ├── about.md
│   ├── architecture.md
│   ├── decisions/
│   │   └── README.md
│   ├── diff-log.md          ← this file
│   ├── how-to-play.md
│   ├── lessons.md
│   ├── lineage.md
│   ├── manpage.md
│   ├── notes.md
│   ├── port-ideas.md
│   ├── references.md
│   ├── spec.md
│   └── test-scenarios.md
└── media/
    ├── 01-instructions-prompt.png (+.txt)
    ├── 02-instructions-page.png (+.txt)
    ├── 03-initial-deal.png (+.txt)
    └── 04-mid-game.png (+.txt)
```

Total: 15 markdown files + 4 PNGs + 4 raw captures.

## Not yet done

- Betting-box screenshot — pressing `b` did not visibly toggle
  the right-side box in my captures; may require the game to be
  in a specific state, or an additional keystroke. Non-blocking.
- Card-counting stats screenshot — stats appear at rows 21-23
  (below the main board); need to reveal enough cards for the
  display to have content. Non-blocking.
- `capture_canfield()` addition to
  `docs/scripts/capture-screenshots.sh`.
- `src/` — port source (empty; awaits language ADR).
- `data/` — pre-rolled test deals (pending).
- `tests/` — automated tests (pending).

## Anticipated changes on port

- **Score file:** JSON per-user in `$XDG_STATE_HOME/canfield/`.
- **Curses coords:** compute from `getmaxyx()`.
- **Thinking meter:** `CLOCK_MONOTONIC` not `time(NULL)`.
- **Bool:** language native.
- **Globals:** encapsulated `GameState`.
- **RNG:** expose `--seed N`.
- **Cheat protection:** cryptographic signing of score file.
- **Multi-variant:** consider one-engine-many-rulesets so we can
  ship Klondike/FreeCell/Spider from the same binary.

## See also

- Notes: [`notes.md`](./notes.md).
- Architecture: [`architecture.md`](./architecture.md).
