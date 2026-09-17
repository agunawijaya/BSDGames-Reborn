# `canfield` — Port Ideas

> Concrete design decisions the port needs to make. Not a plan —
> a menu.

---

## 1. Language

*(Awaits project-wide ADR-005 / language decision.)*

Candidates:

- **Rust** — strong typing for `Card`, `Suit`, `Rank`. Enums map
  perfectly. Deterministic PRNG easy. `crossterm` for cross-
  platform TUI.
- **Python** — fastest to prototype; `blessed` or `rich` for TUI.
- **Go** — clean, `tcell` for TUI, easy cross-platform builds.
- **TypeScript + Node** — best story for web front-end via
  `blessed-contrib` or a browser UI.
- **C++20** — closest to the original.

Recommendation: card games map beautifully to Rust enums; strong
type-safety catches "you tried to compare rank to suit" bugs at
compile time. Also easy to have a headless rules engine as a
library.

## 2. Platforms

- **CLI (TUI)** — must exist. Original UX.
- **Web** — solitaire is a natural browser fit. Real card
  graphics optional.
- **Native GUI** (Qt/GTK) — optional.
- **Mobile** — attractive. Solitaire is a phone-genre.

## 3. UI direction

The classic curses ASCII-card view (`| Kh|`) is charming but
uncompetitive with the Windows Solitaire aesthetic. Options:

1. **Preserve ASCII layout exactly.** Retro purity.
2. **Add box-drawing chars** (`┌───┐│Kh │└───┘`). Same layout,
   nicer look.
3. **Full graphical cards** in web/GUI, ASCII in CLI. Two
   renderers, one engine.

Recommendation: **path 3.** MVC pays off here.

## 4. What NOT to Change

Preserve these to keep the spirit:

1. **The betting economics.** $13/$13/$26/$5/$1/$1min are
   sacred numbers.
2. **The 10-command grammar** (`s#`, `sf`, `t#`, `tf`, `##`,
   `#f`, `ht`, `c`, `b`, `q`).
3. **`ht` deals 3 cards at a time.** Klondike-3 style.
4. **Base rank = first foundation card.** Not Ace.
5. **Foundations wrap around** (after King, Ace).
6. **Empty tableau spots filled only from stock** (until stock
   is exhausted).
7. **Move whole tableau piles as units**, not just top cards.
8. **Foundation base auto-place.** No busywork.
9. **Card counting toggle** with per-reveal charge, capped at
   $34.
10. **`cfscores` companion tool.** Two-binary architecture.
11. **Instructions-first prompt.** New-player friendly.
12. **Thinking-time meter, capped per move.** Decisive but not
    punishing.

## 5. Open Questions

1. **Score file format?** JSON, SQLite, TOML, custom binary?
   Recommendation: JSON in `$XDG_STATE_HOME/canfield/scores.json`.
2. **Multi-user model?** Original assumed shared UNIX host.
   Modern: single-user per-machine. But if online multiplayer, do
   we do global leaderboards?
3. **`--no-money` mode?** For pure solitaire without the
   betting layer.
4. **Undo?** Original has none. Adding it changes the "commit"
   decision. Poll.
5. **Save/resume?** Original has none. Modern solitaire always
   auto-saves. Add it?
6. **Multiple variants?** Klondike, Spider, FreeCell in the same
   binary?
7. **Deal seeds?** Should a user be able to replay the same deal?
   (E.g., `canfield --seed 42`.)
8. **Rendering theme?** Retro green-on-black, or nicer default?
9. **Sound?** Original was silent. Add optional card-flip
   sound?

## 6. Modernizations worth adopting

- **Deterministic PRNG via `--seed N`** — for reproducible deals
  and tournaments.
- **`--stats` flag** to dump the score DB as JSON.
- **`--replay N`** to step through a saved game.
- **Structured game log** (JSON lines) — every event recorded.
- **`SIGWINCH` handler** — resize gracefully.
- **True-color** (24-bit RGB) suit colors when supported.
- **Screen-reader friendly** output — label everything.
- **i18n** — card ranks are already language-agnostic; only need
  to translate the UI chrome.
- **Undo N** (optional; comes with a price penalty?).
- **Configurable house rules** — 3-card deal vs 1-card, base
  card selection, foundation wrap, etc.

## 7. Anti-goals

- **Do not shed the betting layer.** It's the identity.
- **Do not use setgid + shared file.** Per-user always.
- **Do not require Java, Electron, or Docker to run the CLI.**
  Single static binary if at all possible.
- **Do not ship a "premium currency".** The bankroll is
  in-game only.
- **Do not remove the `cfscores` companion.** Two-binary
  architecture ships.

## 8. Multiple solitaire variants (stretch)

If the port goes well, the same engine could support:

- **Klondike** (Windows Solitaire).
- **Spider** (2-suit and 4-suit variants).
- **FreeCell**.
- **Yukon**.
- **Golf**.
- **Pyramid**.
- **Canfield** (this game).

Each variant is a **rule-set** plugin: base card behavior,
foundation direction, tableau build direction, deal size, reserve
pile presence.

## 9. Score file design (concrete)

```jsonc
{
  "$schema": "https://canfield.example/scores.schema.json",
  "version": 1,
  "user": "agunawijaya",
  "created": "2026-09-17T15:00:00Z",
  "games": [
    {
      "id": "6f3a...",
      "date": "2026-09-17T15:04:00Z",
      "seed": 1234,
      "variant": "canfield",
      "spend": {
        "hand": 13,
        "inspection": 13,
        "game": 26,
        "runs": 5,
        "information": 12,
        "thinktime": 3
      },
      "wins": 40,
      "net": -32
    }
  ],
  "total_net": -32
}
```

Signed with an HMAC for tamper-resistance if the "impossible to
cheat" claim matters.

## 10. Web multiplayer sketch

Solitaire multi-user is unusual. Options:

- **Global leaderboards** for wins/losses net worth.
- **Daily seed** — everyone plays the same deal for the day.
  Highest net-worth wins.
- **Race mode** — same seed, first to complete wins.
- **Coach mode** — one user plays, others watch and comment.

## See also

- Architecture: [`architecture.md`](./architecture.md).
- Lessons: [`lessons.md`](./lessons.md).
- Working notes: [`notes.md`](./notes.md).
- Decisions log: [`decisions/`](./decisions/).
