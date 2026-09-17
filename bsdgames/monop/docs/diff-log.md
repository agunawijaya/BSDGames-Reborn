# `monop` — Diff Log

> Chronological log of changes and observations during the
> documentation phase. When the port begins, upgrade to a
> real changelog per [Keep a Changelog](https://keepachangelog.com).

---

## 2026-09-17

- **Documentation phase kickoff.** Owner: Agun via Claude.
- Read `monop.6.in`, `monop.h`, `monop.c`, `monop.def`,
  `execute.c`, `cards.c`, `malloc.c` from upstream
  <https://github.com/vattam/BSDGames/tree/master/monop>.
- Built `monop` binary locally from upstream to enable
  screenshot capture. Build steps (WSL2, Debian):
  ```
  cp -r <upstream>/monop /tmp/monop-build
  cd /tmp/monop-build
  # Patch 1: replace non-portable <sys/endian.h> with <endian.h>
  sed -i 's|#include <sys/endian.h>|#include <endian.h>|' cards.c
  # Patch 2: BE64TOH macro → be64toh() function
  #   (in-place edit of cards.c set_up() to call be64toh(dp->offsets[i]))
  # Patch 3: create a pathnames.h stub defining _PATH_CARDS
  echo '#define _PATH_CARDS "/tmp/monop-build/cards.pck"' > pathnames.h
  gcc -o initdeck initdeck.c
  ./initdeck cards.inp cards.pck
  gcc -D__RCSID\(x\)= -D__COPYRIGHT\(x\)= -I. \
      -o monop cards.c execute.c getinp.c houses.c jail.c \
        malloc.c misc.c monop.c morg.c print.c prop.c rent.c \
        roll.c spec.c trade.c
  ```
- Captured 7 screenshots via WSL + tmux; embedded in
  [`about.md`](./about.md):
  1. Player-count prompt.
  2. First turn (Bob rolled 10 → goes first).
  3. After roll (Chance card: "Chairman of the Board").
  4. `?` help — full command list.
  5. `print` — the 40-square board.
  6. `where` — player positions.
  7. `holdings` — prompt.
- Note: `monop` is **not** in the Debian `bsdgames` package;
  users must build from upstream. Trademark reason documented in
  [`about.md`](./about.md) and [`AGENTS.md`](../AGENTS.md).
- Verified: `srand(getpid())` seeding in `monop.c`; matches
  Ken Arnold's other games (`robots`, `snake`).
- Verified: `MAX_PL = 9`, starting money = 1500 (line ~150
  in `monop.c`).
- Verified: `comlist[]` has 16 entries + trailing empty string
  (RETURN alias).
- Verified: `func[]` parallel dispatch table maps to real
  function pointers in `monop.def`.

## Upstream commit reference

- **Commit at documentation time:** upstream `master` HEAD (Vattam
  fork). Because we do not vendor the source into this repo,
  cite upstream URLs when referring to specific line numbers.

## Files created

```
bsdgames/monop/
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
    ├── 01-players-prompt.png (+.txt)
    ├── 02-first-turn.png (+.txt)
    ├── 03-after-roll.png (+.txt)
    ├── 04-help.png (+.txt)
    ├── 05-board.png (+.txt)
    ├── 06-where.png (+.txt)
    └── 07-holdings.png (+.txt)
```

Total: 15 markdown files + 7 PNGs + 7 raw captures.

## Not yet done

- `capture_monop()` addition to
  `docs/scripts/capture-screenshots.sh` (blocked: script requires
  `monop` on PATH; needs a `BIN=<optional>` env var pattern —
  design pending).
- `src/` — port source (empty; awaits language ADR).
- `data/` — content pack (JSON schema pending).
- `tests/` — automated tests (pending).

## Anticipated changes on port

- Rename program (see [`AGENTS.md`](../AGENTS.md) §Naming).
- Rename properties.
- Rewrite card texts.
- Delete `malloc.c` (custom allocator no longer needed).
- Delete `#define bool char` in favor of language native.
- Save format: JSON or SQLite instead of binary struct dump.
- RNG: expose `--seed` flag.
- Content pack: JSON schema for board, cards, monopolies.
- Card effect DSL.
- AI opponent (rule-based tier 1, learning-based tier 2).
- Multi-terminal / online multiplayer (v1.0 goal).

## See also

- Notes: [`notes.md`](./notes.md).
- Architecture: [`architecture.md`](./architecture.md).
