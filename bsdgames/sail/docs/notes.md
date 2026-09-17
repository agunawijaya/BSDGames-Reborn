# `sail` — Working Notes

> Free-form working notes for the `sail` port.

---

## 2026-09-16 — Pre-Port Documentation Phase

- All 12 pre-porting docs generated from source overview + man
  page deep-dive.
- 3 screenshots captured via WSL/tmux: scenario menu, chosen
  scenario, ship selection.
- Added `capture_sail()` to
  [`docs/scripts/capture-screenshots.sh`](../../../docs/scripts/capture-screenshots.sh).

## Key Findings from Source Analysis

- **`sail.6` man page is essay-length** — reads like a
  Napoleonic naval history primer plus a code retrospective.
  Preserve tone in port docs.
- **Two-program architecture** with `fork()` — player process +
  driver process — is the multiplayer heart. Very early example
  of client-server split for a game.
- **`link()`-based locking** — stolen from Jeff Cohen's
  "pubcaves". Portable but racy (`fsck` sometimes found 3 links
  on crash recovery).
- **Shared tempfile** as multi-user database. Ancestor of
  SQLite-based multi-process apps.
- **7-second poll cycle** with "pipelining" (type-ahead) is a
  clever UX response to latency.
- **32 scenarios** — most historical (1770s-1815), some
  fictional. Rich content library.
- **5 crew quality tiers** with real historical grounding
  (Elite Americans, Mundane British after long deployment).
- **8 directions, wind-relative speeds**, and complex movement
  grammar create real tactical depth.
- **Ship glyph encoding** in 2 characters is masterful info
  density.

## Compared to Other Multi-User Games

- **`sail` (1980)** — file-based IPC, fork architecture.
- **`phantasia` (1986)** — shared character file + void file,
  similar file-based multi-user.
- **`hunt`** (1980s) — UDP daemon, more sophisticated networking.

`sail` is the earliest of these and the least
network-sophisticated but conceptually cleanest.

## Open Design Questions (Future ADRs)

- `link()` lock replacement: WebSocket server? Database
  transactions? Redis?
- Poll cycle: preserve 7-second turn-based feel or go real-time?
- Multi-user: local machine multiplayer vs. internet MMO?
- Scenario mod support: full editor vs. curated content?
- AI captain sophistication: rule-based (original style) vs.
  behaviour tree vs. neural?
- Historical accuracy vs. gameplay balance: which wins in
  conflicts?

## Notable Man Page Quotes to Preserve

- *"Needless to say, the code was horrendous, not portable in
  any sense of the word, and didn't work."*
- *"Whether or not this really works is open to speculation.
  When ucbmiro was rebooted after a crash, the file system
  check program found 3 links between the Sail temporary file
  and its link file."*
- *"Constants like 2 and 10 were very frequent in the code."*
- **"Riggle Memorial Structures"** naming.
- *"still doesn't work perfectly"* (Ed Wang's angle() code).

These reflect the personality of the original — should be
preserved in port credits or dev docs.

<!--
Future iteration notes:
- Consider a dedicated ADR on how to modernize the two-program
  architecture without losing its clean separation.
- The 32 scenarios could be exported to JSON as a first step.
- Ship class balance may need modern re-tuning; historical
  accuracy vs. multiplayer balance is a genuine tension.
-->
