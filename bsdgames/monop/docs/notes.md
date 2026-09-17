# `monop` — Working Notes

> Free-form working notes for the `monop` port.

---

## 2026-09-17 — Pre-Port Documentation Phase

- All 12 pre-porting docs generated from source overview + man
  page deep-dive.
- **`monop` is NOT in the Debian `bsdgames` package** due to the
  Hasbro trademark on "Monopoly". Had to compile from upstream
  source. Build steps documented in
  [`diff-log.md`](./diff-log.md).
- 7 screenshots captured via WSL + tmux against the locally-built
  binary: player-prompt, first-turn, after-roll (with a Chance
  card resolution), help, board printout, where, holdings.
- Added `capture_monop()` to
  [`docs/scripts/capture-screenshots.sh`](../../../docs/scripts/capture-screenshots.sh)
  (Note: separate helper script may be needed since the binary
  is not on PATH — see script comment).

## Key findings from source analysis

- **Ken Arnold** is the author. This is another Arnold BSD game
  after `snake`, `robots`, `rogue` — a genuine giant of early
  Unix systems. He also wrote `curses(3)`.
- **~2900 lines of C** across 16 files. Not tiny.
- **Custom malloc.c** in the tree is **Chris Kingsley's 1982
  Caltech allocator** — not stock. This is a footnote-level trivia
  point but worth capturing for accuracy.
- **Data-driven design** — 4 external data files decouple content
  from engine: `mon.dat`, `prop.dat`, `brd.dat`, `cards.inp`.
- **Table-driven commands** — `comlist[]` + `func[]` parallel
  arrays in `monop.def`.
- **Unique-prefix parser** in `getinp.c` — elegantly simple.
- **The debt "fix the problem" loop** in `force_morg()` is the
  cleanest state-machine idea in the code.
- **The 2-solvent-player auction skip** is a documented house
  rule variant, not a bug.
- **Save format is binary** — struct dump. Not portable.
  Requires wholesale replacement in a port.
- **`heapstart = sbrk(0)`** is the classic pointer-relocation
  trick for save/restore.

## Trademark risk (important)

- "Monopoly" is a Hasbro/Parker Brothers registered trademark.
- Debian omits `monop` from `bsdgames` for this reason.
- Card texts and property names are Parker Brothers-copyrighted.
- **Any port MUST**:
  1. Rename the program.
  2. Rewrite card flavor text.
  3. Rename properties (Atlantic City → generic).
  4. Avoid Parker Brothers artwork or trade dress.
- Recommendation in AGENTS.md: `streets` as the working port name.

## Chance & Community Chest — a design note

The card system in `cards.c` reads shuffled cards from `cards.pck`.
Card effects are hard-coded in C — not data-driven. **This is a
gap.** A modern port should push card effects into the data pack
via a small declarative effect DSL:

```json
{
  "id": "chance-move-boardwalk",
  "text": "Advance to Boardwalk.",
  "effects": [
    {"type": "move_to_square", "square": "boardwalk",
     "collect_go": true}
  ]
}
```

## Compared with other multi-player BSDGames

- **`monop` (1980)** — hot-seat single-terminal, 1–9 players.
  Simplest multi-player model.
- **`sail` (1980)** — `fork()`-based multi-process, file locks.
- **`phantasia` (1986)** — shared file, multi-user login-based.
- **`hunt` (1980s)** — UDP daemon, multi-terminal real-time.

`monop` is the least ambitious in networking but arguably the
most sophisticated in rules and state.

## Open design questions (future ADRs)

- Rename: pick one candidate and lock it in ADR-monop-001.
- Save format: JSON vs SQLite vs signed JSON.
- Content pack format: JSON schema needs designing.
- Card effect DSL: how declarative?
- AI opponent: rule-based, learning-based, or both?
- Multiplayer: hot-seat only, LAN, or online too?
- Web UI: real-time WebSocket or long-polling?
- Undo: yes or no?
- Tournament mode: needed?

## Notable design decisions to preserve as documented lore

- **`printline()`** — the horizontal-rule visual delimiter.
- **`lucky_mes[]`** — random flavor text for advancement cards.
- **The 2-solvent-player auction skip** — house rule variant.
- **Unique-prefix command matching** — the elegant UX baseline.
- **`?`-help contract** — universal help key.
- **Save/restore expected as baseline** — not a nice-to-have.

## Notable code quirks to leave behind

- **`#define bool char`** — use language native.
- **XOR-swap macro** — educational, but delete.
- **`goto ret;`** in `do_move()` — refactor to early returns.
- **Global state** — encapsulate.
- **Custom `malloc.c`** — delete.
- **`sbrk` in save** — replace with real serializer.

<!--
Future iteration notes:
- The card effect DSL is genuinely worth spending an ADR on —
  it's the difference between porting the game and porting
  a content-pack system.
- The AI opponent gap is the single feature that would most
  broaden the audience. Consider it a v1.0 must-have.
- Consider whether the port should be one program with multiple
  content packs, or multiple sibling games. My inclination:
  one engine, many packs.
- The 2-solvent auction skip should be an optional rule tagged
  in the content pack, not a code-level constant.
-->
