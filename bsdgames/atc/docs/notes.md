# `atc` — Working Notes

> Free-form working notes for the `atc` port.

---

## 2026-09-16 — Pre-Port Documentation Phase

- All 12 pre-porting docs generated from source analysis
  (`main.c`, `update.c`, `struct.h`, `grammar.y`, `atc.6.in`,
  playfield `default`).
- Screenshots captured via WSL/tmux/wkhtmltoimage script — 3
  states (`01-fresh-start`, `02-command-prompt`,
  `03-after-updates`) — matching the game's real-time nature.
- Added `capture_atc()` function to
  [`docs/scripts/capture-screenshots.sh`](../../../docs/scripts/capture-screenshots.sh).

## Key Findings from Source Analysis

- **`SIGALRM` + `setitimer` game loop** (`main.c:163-176`) is the
  architectural centrepiece. Ed James pulls it off in 1986 with
  no threads.
- **Yacc/lex used TWICE** — once for playfield DSL, once for
  command grammar — sharing a lex tokeniser. This is unusual and
  clever.
- **`?` command completion is grammar-driven** — LALR(1) parser
  state tables know what tokens come next. Not hand-coded help
  text.
- **Plane physics is 3-line discrete calculus** (altitude ±1,
  direction ±2 per tick, then displacement lookup). See
  [`architecture.md`](./architecture.md) §Plane Movement.
- **17 hand-designed playfields** — no procedural generation.
  Each expresses a different puzzle challenge.
- **Ed James signs the radar** — `ATC - by Ed James` visible
  permanently. Unusual authorial gesture.
- **`BUGS` file** ships with 4 known bugs — Ed's honest
  documentation.

## Open Design Questions (Track for ADRs)

- Real-time loop: `SIGALRM` port vs proper async runtime vs
  event loop. Modern default: async (Tokio for Rust, or an
  event loop). Signal-driven is authentic but has portability
  and safety pitfalls.
- Command parser: preserve yacc-style grammar for the `?`
  completion feature? Or hand-write with awareness of grammar
  state? Modern parser combinators (nom, chumsky, pest) can
  expose state for completion.
- Playfield format: keep original yacc DSL for community-authored
  compatibility, or add JSON/YAML alternative with converter?
- Pause: original forbids. Modernise with accessibility mode
  (paused doesn't count for score)?

## Compared to My Other Pilots

- **robots**: trivial AI, discrete grid; atc has no AI but complex
  entity state per plane.
- **snake**: chase pattern; atc has no chase — planes fly
  deterministically.
- **gomoku**: deep AI, no real-time; atc has no AI but real-time is
  central.
- **wump** (via Gemini): procedural graph; atc is data-driven
  playfields.

atc uniquely tests:
- Real-time game loop (via signal).
- yacc/lex parser generator.
- Multiple concurrent entity state machines.
- Data-driven external DSL files.

<!--
Notes for future iterations:
- Consider if the SIGALRM handler doing curses I/O is worth
  documenting more thoroughly as an unsafe-but-works pattern.
- Consider adding a section on "how Ed James's grammar exposes
  completion state" — this is a genuinely novel technique.
-->
