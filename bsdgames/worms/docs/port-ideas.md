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
