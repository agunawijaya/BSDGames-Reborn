# `canfield` — Working Notes

> Free-form working notes for the `canfield` port.

---

## 2026-09-17 — Pre-Port Documentation Phase

- All 12 pre-porting docs generated from source overview + man
  page.
- 4 screenshots captured via WSL/tmux against Debian
  `bsdgames`' `canfield(6)` binary: instructions prompt,
  instructions text, initial deal, mid-game after moves.
- Added `capture_canfield()` entry to
  [`docs/scripts/capture-screenshots.sh`](../../../docs/scripts/capture-screenshots.sh).

## Key Findings from Source Analysis

- **Two-binary architecture** — `canfield(6)` plays,
  `cfscores(6)` reports. Both share a fixed-record binary score
  file.
- **The betting layer is where the interesting design is.**
  Kirk McKusick added it later; the game without it is a
  pedestrian solitaire.
- **Card counting toggle** with per-card fee is a genuinely
  novel gameplay idea. Info is a currency.
- **Singly-linked list pile representation** — old-school C,
  fine for 52 cards but not what a modern port would choose.
- **Instructions-first prompt** — polite defaults for
  newcomers.
- **Base rank ≠ Ace** — Canfield-specific rule; distinguishes
  from Klondike.
- **`#define bool char`** — pre-C99 idiom. Delete in port.
- **Curses hardcoded coordinates** — the whole screen layout is
  a set of `#define`s at the top of `canfield.c`.
- **Score file is setgid** — the "impossible to cheat" mechanism.
  Won't survive modern packaging.

## Contrasts with Other Card Games in BSDGames

- **`cribbage`** — has AI opponent, curses pegboard. Session-
  scoped scoring only.
- **`fish`** — Go Fish, simplest AI. Session-scoped scoring
  only.
- **`mille`** — Mille Bornes 101-card race, curses multi-
  window, AI. Session-scoped.

`canfield` is the **only** card game in the BSDGames set with a
**persistent per-user bankroll**. This is significant. It's the
proto-meta-progression system.

## Open Design Questions (Future ADRs)

- Score file: JSON per-user, SQLite, or signed JSON?
- Multi-user model: local single-user vs. web multi-user
  leaderboards?
- `--no-money` mode: pure solitaire without betting?
- Undo: yes/no, and does it cost money if yes?
- Save/resume: solitaire habits have shifted since 1980.
  Modern users expect auto-save.
- Multiple variants: does the same engine ship Klondike,
  Spider, FreeCell?
- Rendering: preserve ASCII, add box-drawing, or full
  graphics? MVC pays off if we want multiple renderers.
- Deal seeds: expose `--seed N` for reproducible deals?

## Notable design decisions to preserve

- **The economics.** $13/$13/$26/$5/$1/$1min. Every constant.
- **Card counting is a paid feature.** With per-session cap.
- **`cfscores` sidecar.** Two-binary architecture.
- **Auto-place base cards.** Save the player from busywork.
- **Instructions-first prompt.** Newcomer-friendly default.
- **3-cards-at-a-time talon deal.** Klondike-3 style.
- **Base rank rule.** Canfield's differentiator from Klondike.

## Notable code quirks to leave behind

- **Setgid score file.** Per-user files.
- **Hardcoded curses coordinates.** Compute from
  `getmaxyx()`.
- **`time()` for meter.** `CLOCK_MONOTONIC`.
- **`#define bool char`.** Language native.
- **All-globals architecture.** Encapsulate.
- **Fixed-offset binary score file.** JSON/SQLite.

## About Richard Canfield (the man)

Richard A. Canfield (1855–1914) ran the eponymous casino in
Saratoga Springs, NY. He sold you a deck of cards for $50 and paid
$5 per card you finished. Expected value: you lose. The math is
the same as this port's default $52 buy-in with $5 per foundation
card.

Historical fun fact worth including in the `about.md`.

<!--
Future iteration notes:
- The multi-variant "one engine, many rulesets" idea is
  genuinely compelling. A port that ships Klondike + Canfield +
  FreeCell + Spider from one binary would be a wonderful open-
  source solitaire.
- The betting layer generalizes beautifully to variants:
  "buy the deck" pricing, "pay per hint", "credit per card"
  are variant-independent.
- The `cfscores` file format should be designed once, well —
  it's the persistence contract that'll survive multiple
  future versions.
-->
