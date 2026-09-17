# worm · fancy-web

> A **spiritual successor** to BSD `worm(6)` (Michael Toy, 1980) —
> the growing-worm game where you eat numbered fruit for score and
> length. Same **chained-bonus** and **progressive-growth** math
> as the original, wrapped in 8 cosmetic themes and a settings row
> for speed. Player-first UX: retro faithful, modern smooth.

[![status](https://img.shields.io/badge/status-released-brightgreen)](../../../../docs/progress.md)
[![style](https://img.shields.io/badge/style-fancy--web-ff00ff)](../../../../docs/decisions/006-multi-port-architecture.md)
[![license](https://img.shields.io/badge/license-MIT-blue)](../../../../LICENSE)

## Play

Open [`index.html`](./index.html) in any modern browser.

Double-click, drag to Chrome/Firefox — no build, no server, no
deps. All 8 themes, settings, and localStorage persistence work
offline.

### Controls

- **`W A S D`** or **`↑ ← ↓ →`** — steer the worm's head
- Any key on Game Over screen — restart (after 550 ms lockout)
- **Cannot** reverse 180° into own neck (spec-faithful)

### Settings row

Below the theme picker: three speed modes.

| Mode | Tick rate | Feel |
|---|---|---|
| **Classic  ·  3×** | 3 ticks / sec | Comfortable retro pace |
| **Fast  ·  6×** | 6 ticks / sec | Modern arcade |
| **Progressive  ·  3→6×** *(default)* | Starts at Classic (3/sec) when length = 5; ramps toward Fast (6/sec) at length 45+ | Natural difficulty curve |

*BSD `worm(6)` originally ticked at exactly 1× (1 sec/tick). That
felt uncomfortably slow in playtest, so the three modes here start
at 3× and above. If you want the pure-original feel, edit
`updateTickInterval` in [`index.html`](./index.html) — set
`interval = 1000` in the `classic` branch.*

Setting persists across sessions in localStorage.

### Themes

Same 8 as the sibling `snake/ports/fancy-web/` port:

| # | Theme | Palette |
|--:|---|---|
| 1 | Neon Grid | cyan / magenta / navy |
| 2 | Savanna | sky / grass / earth |
| 3 | Jungle | canopy green |
| 4 | Desert | pale sand / warm gold |
| 5 | River | water blue gradient |
| 6 | Aztec | terracotta / gold / turquoise |
| 7 | Origami | cream / coral / pastel |
| 8 | Midnight | deep purple / silver + moon |

Screenshots of each in [`media/`](./media/).

## What is this game?

BSD `worm(6)`, written by Michael Toy (co-author of Rogue) in
1980, is the **growing-worm** genre — you steer a worm on a
bounded grid, eat digit food (1-9) which grows your body by that
number of segments over the next N ticks, and try not to hit
walls or your own tail. Score accumulates via a **chained
bonus**: eat while still growing and the bonus stacks.

This port preserves the mechanics verbatim and modernizes
everything else:

- Digit character `7` → **apple with the digit "7" on it**, sized
  and colored by value
- Text grid on TTY → **canvas** with retro-modern aesthetics
- Static grid-step motion → discrete cell logic with **visual
  interpolation** between ticks
- Single control speed → **3 speed modes** as a user setting
- Zero polish → particles, glow, ambient drift, restart flow,
  8 cosmetic themes

## Tech stack

- **Vanilla JavaScript** (no framework, no bundler)
- **Canvas 2D API** (procedural rendering — zero raster assets)
- **CSS 3** (light-mode gallery frame)
- **localStorage** (best score + settings persistence)

**No dependencies.** ~1500 LOC in one HTML file. Runs offline.

Why single-file? See
[`docs/decisions/fancy-web-003-shipping-format.md`](./docs/decisions/fancy-web-003-shipping-format.md)
(same rationale as the snake port's ADR of the same number).

## Documentation

- **[`docs/diff-log.md`](./docs/diff-log.md)** — feature-by-feature
  narrative vs BSD original.
- **[`docs/decisions/`](./docs/decisions/)** — port-level ADRs:
  - [`fancy-web-001-spec-deviations.md`](./docs/decisions/fancy-web-001-spec-deviations.md)
    — visual reinterpretation under ADR-002 (spiritual successor)
    + ADR-006 (`fancy-web` style).
  - [`fancy-web-002-additive-features.md`](./docs/decisions/fancy-web-002-additive-features.md)
    — themes, settings, particles, persistence.
  - [`fancy-web-003-shipping-format.md`](./docs/decisions/fancy-web-003-shipping-format.md)
    — single-file HTML now, Vite + TS later.
- **[`docs/test-scenarios.md`](./docs/test-scenarios.md)** — port
  acceptance tests (chained bonus, progressive scaling, 180°-turn
  guard, wall death, etc.).

## Canonical game docs

At [`../../docs/`](../../docs/) — the same for every port of
`worm`. `spec.md` is the mechanical contract every port must honor.

## Performance

- **Target:** 60 fps on 2020-era mid-range laptop, all 8 themes.
- Techniques inherited from
  [`snake/ports/fancy-web/`](../../../snake/ports/fancy-web/):
  1. **Single-pass body glow** — the whole worm is drawn as one
     stroke path with shadow, then filled without shadow. Cuts
     shadow-blur ops by ~N× on high-glow themes.
  2. **Offscreen static-layer cache** — background gradient,
     vignette, grid lines, grid dots (with glow), Midnight's moon
     rendered once per theme; blitted each frame.

Details in [`docs/diff-log.md`](./docs/diff-log.md) §Performance.

## Attribution

- **Original BSD `worm(6)`** © UC Berkeley (Michael Toy, 1980).
  Upstream: <https://github.com/vattam/BSDGames/tree/master/worm>.
- **Port design and implementation:** Agun Wijaya + Claude Opus.
- **Visual toolkit** (single-pass glow, offscreen cache, theme
  system) originally developed for
  [`snake/ports/fancy-web/`](../../../snake/ports/fancy-web/) —
  reused here.

See root [`ATTRIBUTION.md`](../../../../ATTRIBUTION.md).

## Future work

Deferred to a v2 iteration:

- **Vite + TypeScript** scaffolding
- **PWA manifest + service worker** — installable + offline
- **Touch controls** — swipe gestures
- **Sound design** — Tone.js synth or CC0 samples (crunch on
  eat, warning as tick rate increases, thud on wall)
- **Automated test suite** — Vitest / Playwright
- **Deploy** — live URL published to progress dashboard
- **Growing indicator** — HUD count showing "N more segments
  coming"
- **HJKL running mode** — spec-faithful "hold Shift for burst
  speed" (currently not implemented)
- **Additional themes** — user-contributed palettes
- **Difficulty modifiers** — start length, grid size, apple value
  distribution
- **Streak / combo visualization** — highlight when chain-bonus
  triggers

## License

MIT, matching repo default.
