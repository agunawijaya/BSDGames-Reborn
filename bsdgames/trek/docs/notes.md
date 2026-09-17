# `trek` — Working Notes

> Free-form working notes for the `trek` port.

---

## 2026-09-16 — Pre-Port Documentation Phase

- All 12 pre-porting docs generated from source analysis
  (`main.c`, `play.c`, `trek.h`, `help.c`, `setup.c` skim,
  `trek.6.in`).
- 5 screenshots captured via WSL/tmux/wkhtmltoimage:
  startup, mission briefing, srscan, lrscan, damages.
- Added `capture_trek()` to
  [`docs/scripts/capture-screenshots.sh`](../../../docs/scripts/capture-screenshots.sh).

## Key Findings from Source Analysis

- **Eric Allman is *that* Eric Allman** — the `sendmail` creator.
  `trek` is his early Berkeley work. Preserve the attribution.
- **Command table pattern** — 23 entries in `Comtab[]`, function
  pointer dispatch. Elegant C. Matches Command Pattern before it
  was named.
- **`cvntab` prefix matching** with suffix continuation gives
  natural command completion in a game 20 years before `bash`
  tab-completion.
- **13 lose codes** — the number of ways to die is a design
  choice. Every failure mode is enumerated and named.
- **14 devices** each with a `person` field naming who repairs
  it. Sulu, Scotty, Uhura, etc. Character depth via minor NPCs.
- **Event scheduler** with 12 event types + 25-slot queue. Trek
  handles distress calls, supernovas, Klingon reproduction,
  captures, device repairs — all as scheduled events firing on
  stardate.
- **Snapshot-based time-warp** via `memcpy` of 3 structs into a
  `char[]` buffer.
- **`setjmp`/`longjmp`** for game-over from any depth.
- **Parametric difficulty** via `Param` struct — every knob in
  one place, indexed by skill × length.
- **Klingon FSM** — 6 states (KM_OB, KM_OA, KM_EB, KM_EA, KM_LB,
  KM_LA) with `moveprob[]` and `movefac[]` arrays.

## Rich Attribution Chain

The provenance is worth reading. Eric Allman openly names his
sources and honours the tradition. This is model behaviour for
adapting code.

Chain: Mayfield 1971 BASIC → DEC BASIC → Battelle FORTRAN 1974 →
LBL FORTRAN 1975 → Allman C 1976 → BSD 1980 → here 2026.

## Compared to Other Pilot Games

- **robots** was 2-line AI. **trek** is per-Klingon state machine
  with 6 states.
- **snake** was 1 file. **trek** is 55 files.
- **gomoku** had elegant one-purpose AI. **trek** has an entire
  event scheduler + FSM + parametric difficulty.
- **wump** had procedural graph generation. **trek** has
  procedural 8×8 galaxy + per-quadrant procedural sector layouts.
- **atc** had real-time via SIGALRM. **trek** is turn-based but
  has an event scheduler that handles the "time-flow" abstraction.

## Open Design Questions (Future ADRs)

- Preserve `setjmp`/`longjmp` (unusual in modern C) or replace
  with `Result<()>` / exceptions?
- Command dispatch: preserve prefix-matching + suffix-completion
  or use modern parser combinator?
- Snapshot save format: raw memcpy (fragile) or structured JSON?
- Klingon AI: preserve 6-state FSM or upgrade to behaviour tree?
- Multiplayer: what to add (see port-ideas.md §3)?
- Should `shell` (in man page, not in code) be implemented in the
  port?

## Trek Cultural Significance

For CS students who took Berkeley courses in the 1980s and
1990s, `trek` is often their **most vivid memory of the era**.
Something about the command line, the Klingons, the Uhura
dialogue, and the ticking clock made it uniquely memorable.

Port with reverence.

<!--
Notes to future iterations:
- Consider writing a lesson specifically on Eric Allman's
  attribution style. Rare and worth teaching.
- Consider adding an "Eric Allman highlights" section to about.md.
- The `?` completion feature deserves its own architecture
  writeup someday.
-->
