# AGENTS.md — `canfield`

> Instructions for AI coding agents working on the `canfield` port.
> If you are Claude, Kimi, Gemini, GPT, or any other assistant:
> read this first.

## Owner and status

- **Current owner:** Agun (via Kimi for `fancy-web` port).
- **Phase:** Released — `fancy-web` port complete; canonical docs complete.
- **Root sync:** upstream at
  <https://github.com/vattam/BSDGames/tree/master/canfield>.
  Do **not** paste local filesystem paths (`E:\...`, `/mnt/...`,
  `/home/...`) into any doc — this repo will be public on GitHub.
  Cite upstream URLs only.

## What's already done

- All 12 pre-port documentation files generated.
- 4 screenshots captured: instructions prompt, instructions text,
  initial deal, mid-game after moves.
- Full command grammar (`s#`, `sf`, `t#`, `tf`, `##`, `#f`, `ht`,
  `c`, `b`, `q`) documented.
- Betting economics table extracted from the source.
- `cfscores` companion tool documented as a first-class citizen.

## Special mechanics to preserve

- **The bet economics.** This is the game's identity:
  - $13 to buy the deck (initial deal).
  - $13 more to *inspect* (make foundation-safe moves without
    committing).
  - $26 more to *commit* to the game (unlock all moves).
  - $5 per card that reaches foundation.
  - $5 per re-run through the hand after the first.
  - $1 per unknown card revealed by the counting toggle (capped
    at $34 for full deck info).
  - $1 per minute of thinking time (capped at $3 per move —
    `maxtimecharge`).
- **The card counting toggle.** Priced per revealed card, capped.
  A working expert tool, not a free hint.
- **The `cfscores` sidecar.** Persistent per-user bank balance
  file — the "gambling" theme carries across sessions.
- **The three-cards-at-a-time talon deal** (Klondike-3 variant).
- **Base card = whatever the first foundation card is.** Not
  necessarily Ace — this is Canfield-specific.

## Anti-patterns to unwind

- **Shared world-writable score file** (setgid `games` group in
  original). A port MUST use per-user files or a proper database.
- **Curses hardcoded row/column constants** — bad for
  responsive resize.
- **`time()`-based thinking-time meter** — clock jitter, sleep
  suspension, and time-zone changes make this fragile.

## Files and screenshots

- All screenshots in `./media/` were captured 2026-09-17 from
  the Debian `bsdgames` package's `canfield(6)` binary via
  WSL + tmux. Companion `.txt` files are the raw tmux captures.

## Quality checklist

Follow the Quality Self-Check in root [`AGENTS.md`](../../AGENTS.md)
§12 before marking anything done.

## Contact

Questions → open an issue tagged `canfield` or ping @agunawijaya.
