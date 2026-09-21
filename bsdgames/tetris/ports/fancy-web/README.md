# `tetris` — Fancy Web Port

> **Tetris: Broken Well.** The classic falling-block puzzle, but the well can be reshaped: narrow canyons, split wells, hourglass necks, donut obstacles, stepped floors, and more. Start from a clean board or from a random garbage stack, then play Marathon or Survival.

## Pitch

This port keeps the core Tetris loop intact — seven tetrominoes, line clears, gravity, and scoring — but reinterprets the *stage* as a configurable, non-rectangular well. Players pick a board preset and a starting stack before the game begins, so every round feels different. It is designed as a browser-first, keyboard-first experience with touch controls for mobile.

## Tech Stack

- Vanilla ES2018 JavaScript (no framework, no build step)
- HTML5 Canvas 2D for rendering
- CSS custom properties for the neon/cyber theme
- Node.js for the smoke-test suite

## Target Platform

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Desktop and mobile
- Works offline as a single-page app; deployable to any static host

## Status

🟠 **In Progress — functional prototype.**

The engine, settings screen, eight board presets, Marathon/Survival modes, next-piece preview, and touch controls are implemented and passing smoke tests. Port-specific screenshots and a live deploy URL are still pending.

## How to Run

From this folder:

```bash
# Serve locally (any static server works)
npx serve .
# or
python -m http.server 8080
```

Then open `http://localhost:8080`.

No build step is required; `index.html` loads `src/*.js` and `src/styles.css` directly.

## How to Test

```bash
node tests/test-smoke.js
```

The smoke test exercises board initialization, piece spawn, movement, rotation, hard drop, line clear, garbage generation, and the Canyon/Split wall presets without a browser DOM.

## Controls

| Key | Action |
|---|---|
| ← / → or A / D | Move left / right |
| ↑ / W / X | Rotate clockwise |
| Z | Rotate counter-clockwise |
| ↓ / S | Soft drop |
| Space | Hard drop |
| P | Pause / resume |

Touch buttons appear automatically on narrow screens.

## Project Structure

```
bsdgames/tetris/ports/fancy-web/
├── index.html          # Entry point / game shell
├── src/
│   ├── settings.js     # Settings form, presets, config
│   ├── game.js         # Tetris engine, rendering, input
│   └── styles.css      # Neon/cyber UI styles
├── tests/
│   └── test-smoke.js   # Headless smoke tests
├── docs/
│   ├── diff-log.md     # Original → this port
│   └── decisions/      # Port-specific ADRs
├── media/              # Port screenshots (pending capture)
└── package.json        # Serve / test scripts
```

## Diff Highlights

See [`docs/diff-log.md`](./docs/diff-log.md) for the full feature-by-feature comparison. Major additions:

- Custom/non-rectangular board presets (Canyon, Split, Hourglass, Donut, Staircase, Tower, Wide).
- Configurable starting garbage stack (height + hole density).
- Survival mode with rising garbage rows.
- Next-piece preview panel.
- On-screen touch controls.
- Basic wall-kick rotation and lock delay.

## Attribution

Original BSD `tetris` by Chuck Simmons (1992). Upstream source at <https://github.com/vattam/BSDGames/tree/master/tetris>.

## License

MIT, same as the root project.

## Author

Agun — port implementation for BSDGames Reborn.

## Live URL

*(Pending deployment.)*

## Media

Screenshots will be added to [`media/`](./media/) once the visual polish is finalized.
