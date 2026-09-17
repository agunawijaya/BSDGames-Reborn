# Port Ideas for `rain`

> Modernisation brainstorm for the `rain` screensaver.

---

## Gameplay Modernisation

- **Interactive rain:** Mouse or touch moves a "cloud" that spawns drops.
- **Sound:** Add gentle rain ambience.
- **Weather presets:** Drizzle, shower, thunderstorm with varying drop density and speed.
- **Collect drops:** A playful mode where the user steers a bucket to catch drops.

## UI/UX Design Ideas

- **Web demo:** HTML5 Canvas with animated raindrops and a delay slider.
- **Terminal port:** True-colour gradients, Unicode rain characters, and resizable layout.
- **Wallpaper mode:** Run as a desktop background or screensaver on modern OSes.

## Internet Multiplayer Design

Not applicable for a screensaver.

## Persistence / Cloud / Cross-Device

- **Saved presets:** Remember favourite delay and colour settings.
- **Shared scenes:** Export a rain animation as a GIF or video.

## Other Modernisation Angles

- **Accessibility:** Audio description of the animation for visually impaired users.
- **Performance:** GPU-accelerated particle system for thousands of drops.
- **Theme packs:** Matrix-style green rain, snow, falling leaves.

## What NOT to Change

- Do not turn `rain` into a competitive game — its identity is calm and passive.
- Preserve the ASCII-art aesthetic in the terminal version.
- Keep `Ctrl-C` as the universal stop gesture.

## Open Questions

- Should the web demo support sound by default or require user activation?
- Should the terminal port use true colour or stick to the retro palette?
- Is there value in a mobile "rain as relaxation" app?

## See Also

- [`architecture.md`](./architecture.md) — original code analysis.
- [`spec.md`](./spec.md) — current mechanics.
