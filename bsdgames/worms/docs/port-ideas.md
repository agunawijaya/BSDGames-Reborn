# Port Ideas for `worms`

> Modernisation brainstorm for the `worms` screensaver.

---

## Gameplay Modernisation

- **Food mode:** Worms seek randomly placed "food" pellets and grow.
- **Collision mode:** Worms die or bounce when they hit each other.
- **Player worm:** Let the user steer one worm with arrow keys.
- **High-score survival:** Classic snake-style mode with increasing speed.

## UI/UX Design Ideas

- **Web demo:** Canvas-based worms with colour per worm and speed slider.
- **Terminal port:** True colour, Unicode body segments, resizable layout.
- **Wallpaper / screensaver:** Native OS screensaver package.

## Internet Multiplayer Design

- **Shared tank:** Multiple users steer worms in the same web canvas (casual multiplayer).
- **Battle royale:** Last worm alive wins.

## Persistence / Cloud / Cross-Device

- **Saved configs:** Favourite `-n`, `-l`, `-d`, colour schemes.
- **Shared replays:** Record a worm animation and share as GIF/video.

## Other Modernisation Angles

- **Accessibility:** Audio panning that follows worm movement.
- **Performance:** GPU instancing for hundreds of worms.
- **Themes:** Neon, nature, matrix, candy colour palettes.

## Port Styles

Credible port directions under
[ADR-006](../../../docs/decisions/006-multi-port-architecture.md):

| Style | Status |
|---|---|
| `classic-web` | 🔴 Open |
| `classic-terminal` | 🔴 Open |
| `fancy-web` | 🟢 [Released](../ports/fancy-web/) — *Abyssal Worms* |
| `mobile-gimmicks` | 🔴 Open |
| `native-desktop` | 🔴 Open |
| `game-engine` | 🔴 Open |

### `classic-web`

A browser terminal that is indistinguishable from `worms` in an xterm:
monospace cells, the same characters, `-f` and `-t`, and `?args=` for
the flags. The engine (glibc `random()` with seed 1) can be checked
screen-for-screen against the original, as the `fancy-web` port does.
Only platform translation is allowed (PWA, fullscreen).

### `classic-terminal` (aka `retro-terminal`)

A drop-in replacement binary in Rust, Go or Zig, with ANSI output,
proper `SIGWINCH` resizing, and the original flags and messages. It is
a good teaching port for ring buffers and reference counting.

### `fancy-web` — released

A bioluminescent deep-sea screensaver: translucent glowing worms (one
species per flavor character) lighting the sea floor, luminous `-t`
trails, a plankton “WORM” `-f` field, classic and split views, and
procedural sound, all from code. See
[`ports/fancy-web/README.md`](../ports/fancy-web/README.md).

### `mobile-gimmicks`

A pocket aquarium: tilt the phone and the worms’ turn choices lean
downhill; tap to drop food that attracts heads (a clearly labelled game
mode, per the Open Questions); haptic ticks when worms cross; a
lock-screen widget.

### `native-desktop`

A real OS screensaver (`.scr` on Windows, a `.saver` bundle on macOS,
an XScreenSaver hack on Linux), which is where `worms` spiritually
belongs. Multi-monitor worms that crawl across screens.

### `game-engine`

A Godot or Unity terrarium in 3-D with soil layers, where worms tunnel
using the same boundary logic per slice. A vehicle for teaching
procedural animation rigs.

## What NOT to Change

- Do not remove the default passive screensaver mode.
- Preserve the original ASCII character set in the retro terminal version.
- Keep `Ctrl-C` as the stop gesture.

## Open Questions

- Should the port include a true game mode, or remain a screensaver?
- Should the web demo be single-player or multiplayer first?
- Is there interest in a native mobile "worms" relaxation app?

## See Also

- [`architecture.md`](./architecture.md) — original code analysis.
- [`spec.md`](./spec.md) — current mechanics.
