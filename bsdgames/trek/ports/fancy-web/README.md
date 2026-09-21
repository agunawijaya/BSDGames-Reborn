# trek · fancy-web

> A **spiritual successor** to BSD `trek(6)` (Eric Allman, 1980), reimagined
> as a browser-based cinematic turn-based space combat sim: you command the
> USS Enterprise, hunt Klingons across an 8×8 galaxy, refuel at starbases,
> and beat the stardate clock before the Federation falls.

[![status](https://img.shields.io/badge/status-in--progress-orange)](../../../../docs/progress.md)
[![style](https://img.shields.io/badge/style-fancy--web-ff00ff)](../../../../docs/decisions/006-multi-port-architecture.md)
[![license](https://img.shields.io/badge/license-MIT-blue)](../../../../LICENSE)

## Play

Open [`index.html`](./index.html) in any modern browser. No build step,
no server, no dependencies.

### Difficulty tiers

- **Novice** — 8 Klingons · 40 stardates (training)
- **Standard** — 15 Klingons · 30 stardates (default challenge)
- **Expert** — 25 Klingons · 22 stardates (tight schedule)

### Command reference

Type each command at the `Command >` prompt and press Enter.

| Keystrokes | Meaning |
|---|---|
| `phaser 500` | Fire phasers with 500 energy units at all Klingons in this quadrant |
| `torpedo 3.5` | Fire photon torpedo at bearing 3.5 (0=E, 3=N, 6=W, 9=S) |
| `move 3 4` | Move — course 3, warp factor 4 (moves between quadrants) |
| `impulse 3` | Impulse move — course 3 (small step within current sector) |
| `srscan` | Short-range scan — refresh current quadrant view |
| `lrscan` | Long-range scan — reveal adjacent quadrants |
| `damages` | Damage report — status of all 8 subsystems |
| `dock` | Dock at adjacent starbase (refuel + repair) |
| `shields up` | Raise shields (costs 50 energy) |
| `shields down` | Lower shields |
| `shields 300` | Transfer 300 energy from reserves to shields |
| `computer` | Trajectory calculator |
| `help` | Full command list |
| `quit` | End mission |
| **V** key | Toggle Tactical / Galaxy Chart view |
| **Enter** | Execute command |
| **Backspace** | Delete last char |
| **Esc** | Clear buffer |

Most commands accept short aliases: `p` = phaser, `t` = torpedo,
`m` = move, `sr` = srscan, `lr` = lrscan, `d` = damages, `s` = shields.

### Bearings — clock convention

```
              3.0 (N)
                │
                │
   4.5 ─── ○ ─── 1.5
   6.0 ─── ● ─── 0.0 (E)
   7.5 ─── ○ ─── 10.5
                │
                │
              9.0 (S)
```

Fire torpedo at bearing 3 to launch north, 6 for west, 0 or 12 for east.

## What is this game?

BSD `trek(6)`, written by Eric Allman at UC Berkeley in 1980, is a
turn-based **space command simulator** — you are the captain of the
USS Enterprise, defending Federation space from a Klingon invasion.
Every command consumes stardate time; Klingons roam and expand while
you delay. Destroy all Klingons before the stardate budget runs out
to win.

BSD `trek(6)` is the ancestor of an entire genre:
- **Star Fleet Battles** (1979, board game — direct analog)
- **Master of Orion** (1993, turn-based space 4X)
- **FTL: Faster Than Light** (2012, real-time-with-pause tactical)
- **Star Sector** (2011, single-ship tactical space combat)

This port preserves the BSD command grammar (typed commands, discrete
turns) and modernises the presentation with cinematic space visuals.

## Positioning

Lives in the **BSD typed-radar-command lineage**, sister port to
[`atc`](../../atc/ports/fancy-web/) (real-time controller sim).
Together they form the *typed-command simulator* pair.

Explicitly **NOT** a Star Trek IP product — Star Trek is trademarked,
and BSD trek was released using generic terminology (Enterprise,
Federation, Klingons) which pre-dates the modern IP framework. Our
port preserves the same generic terminology used by BSD trek.

## Tech stack

- **Vanilla JavaScript** (ES modules, no framework, no bundler)
- **Canvas 2D** for cinematic space rendering:
  - Parallax star field (3 depth layers)
  - Painted nebula gradients
  - Programmatic ship sprites (Enterprise + Klingon)
  - Phaser beam glow + impact effects
  - Photon torpedo particle trails
  - Shield bubble effects
- **CSS 3** for HUD overlays with backdrop-blur
- **Google Fonts:** Orbitron (sci-fi headings) + Share Tech Mono (body)
- **No dependencies.** No build step.

Rationale: see
[`docs/decisions/001-tech-stack.md`](./docs/decisions/001-tech-stack.md).

## Documentation

- **[`docs/diff-log.md`](./docs/diff-log.md)** — what was preserved,
  changed, added, or deferred vs BSD `trek(6)`.
- **[`docs/decisions/`](./docs/decisions/)** — port-level ADRs.
- **[`tests/`](./tests/)** — 28 tests (engine + parser).

## Canonical game docs

At [`../../docs/`](../../docs/) — same for every port of `trek`.

## Attribution

- **Original BSD `trek(6)`** © Eric Allman (UC Berkeley, 1980;
  BSD 3-clause).
  Upstream: <https://github.com/vattam/BSDGames/tree/master/trek>.
- **Port design and implementation:** Agun Wijaya + Claude Opus.

## Roadmap

**v1 (current):**
- ✅ Headless engine (galaxy + quadrant + ship + combat)
- ✅ Cinematic combat scene (parallax stars, ship sprites, weapons FX)
- ✅ Strategic galaxy chart view (fog of war, klingon indicators)
- ✅ Typed command grammar (phaser, torpedo, move, dock, shields, etc.)
- ✅ HUD panels (ship status, systems damage, sector info, bridge log)
- ✅ Title screen with difficulty picker (novice/standard/expert)
- ✅ Win / loss conditions (klingons destroyed, hull, energy, stardate)
- ✅ 28/28 tests pass

**v2 (deferred):**
- Klingon AI variants (aggressive, cloaked, cowardly)
- Photon trajectory computer (helps aim torpedoes)
- Cinematic bridge cutaways for major moments
- Damage system detail (subsystem-specific effects)
- Web Audio ambient bridge + weapon SFX
- Long-range sensor scan animation
- Novice / experienced player mode selection
- Deploy to live URL

## License

MIT, matching the repository default.
