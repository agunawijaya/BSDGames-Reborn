# AGENTS.md — `monop`

> Instructions for AI coding agents working on the `monop` port.
> If you are Claude, Kimi, Gemini, GPT, or any other assistant:
> read this first.

## Owner and status

- **Current owner:** Agun (via Claude).
- **Phase:** Documentation.
- **Root sync:** upstream at
  <https://github.com/vattam/BSDGames/tree/master/monop>.
  Do **not** paste local filesystem paths (`E:\...`, `/mnt/...`,
  `/home/...`) into any doc — this repo will be public on GitHub.
  Cite upstream URLs only.

## What's already done

- All 12 pre-port documentation files generated.
- 7 screenshots captured from a locally-built `monop` binary.
- Chance & Community Chest card data documented.
- All 16 commands + `?`-help documented.
- Complete data-file inventory (`mon.dat`, `prop.dat`, `brd.dat`,
  `cards.inp`) in [`docs/architecture.md`](./docs/architecture.md).

## What's next (for the porter)

1. Read [`docs/architecture.md`](./docs/architecture.md).
2. Read [`docs/port-ideas.md`](./docs/port-ideas.md) — pay
   particular attention to §5 **What NOT to Change** and §6 **Open
   Questions**.
3. Decide the platform + language (project-wide ADR pending).
4. Pick a **non-trademarked name** (see §"Naming" below).
5. Extract data files from upstream into `data/`.

## Naming (trademark caution)

"Monopoly" is a Hasbro trademark. The Debian `bsdgames` package
omits `monop` for this reason. **Any port MUST rename**:

- Program name candidates: `metronopoly`, `streets`, `estate`,
  `boardwalk`, `deedgame`.
- Property names: replace Atlantic City streets with generic
  cities or fictional landmarks. Do **not** use "Boardwalk", "Park
  Place", or any Parker Brothers artwork.
- Card art: original card texts ("Advance to Boardwalk", "Chairman
  of the Board", "Bank pays you dividend of $50") are Parker
  Brothers-copyrighted — write new equivalent flavor text.

## Special mechanics to preserve

- **1–9 players, hot-seat, single terminal.**
- **16-command grammar** with unique-prefix matching (`p` matches
  `print`; `pa` matches `pay`).
- **Debt system** ("fix the problem") — a player can go negative
  temporarily but MUST become solvent before their next roll,
  either by selling houses, mortgaging, trading, or resigning.
- **2-solvent-player auction skip** — unique house rule variant:
  when a property is refused, if only 2 players are solvent, no
  auction is held and the property remains unowned. Preserve this
  as an optional rule.
- **Doubles → 3 doubles = jail** — standard.
- **Get-out-of-jail-free** cards are tracked per player and can be
  traded.
- **Save/restore** — game state serialized to a file (originally
  binary; port should use JSON or SQLite).
- **`?`-help** at any string prompt lists valid answers.

## Files and screenshots

- All screenshots in `./media/` were captured 2026-09-17 from a
  locally-built `monop` binary compiled from the upstream source
  tree. Companion `.txt` files are the raw tmux captures.
- Do **not** commit any newly captured screenshots without
  regenerating the paired `.txt`.

## Quality checklist

Follow the Quality Self-Check in root [`AGENTS.md`](../../AGENTS.md)
§12 before marking anything done.

## Contact

Questions → open an issue tagged `monop` or ping @agunawijaya.
