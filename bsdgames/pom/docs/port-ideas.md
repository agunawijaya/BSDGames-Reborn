# `pom` — Port Ideas

`pom` is a reference utility, so modernisation means making the lunar
phase easier to visualise and more accessible.

---

## Gameplay Modernisation

- **Moon-calendar mode:** Print a month grid showing the phase for
  each day.
- **Event mode:** List upcoming New/Full/Quarter moons.
- **Location-aware corrections:** Account for the user's timezone and
  latitude more precisely.

## UI/UX Design Ideas

- **ASCII art moon:** Render a crude but recognisable moon shape in
  the terminal.
- **Rich web UI:** A page with the current moon phase, percentage, and
  a calendar of upcoming phases.
- **Widget:** A small desktop/mobile widget showing today's phase.
- **High-contrast mode:** For visually impaired users.

## Internet Multiplayer Design

Not applicable as a competitive game. A multiplayer angle could be a
shared "moon phase of the day" feed for a team or community.

## Persistence / Cloud / Cross-Device

- Remember favourite locations/timezones.
- Sync a personal moon-calendar across devices.

## Other Modernisation Angles

- **Higher precision:** Add TDT/UTC correction and improved orbital
  elements.
- **Lunar eclipses:** Extend the algorithm to predict eclipses.
- **API/library:** Expose the phase computation as a reusable library.

## Port Styles

A catalog of credible port directions under
[ADR-006](../../../docs/decisions/006-multi-port-architecture.md).
Each style is a separate slot under `ports/`.

| Style | Status |
|---|---|
| `classic-web` | 🔴 Open |
| `classic-terminal` | 🔴 Open |
| `fancy-web` | 🟢 [Released](../ports/fancy-web/) — *Selene, A Living Moon* |
| `mobile-gimmicks` | 🔴 Open |
| `native-desktop` | 🔴 Open |
| `game-engine` | 🔴 Open |

### `classic-web`

A browser page that behaves exactly like the terminal program: a
monospace prompt where the visitor types `pom` or
`pom [[[[[cc]yy]mm]dd]HH]` and gets the single BSD line back, including
`illegal time format` and the usage line. Retro palette, no pictures.
The whole engine is about 150 lines. The interesting work is the
time-zone model (`localtime`/`mktime`/`%Z`) and proving byte-exact
output against the original binary. PWA/offline is the only
modernisation allowed.

### `classic-terminal` (aka `retro-terminal`)

A native CLI in a modern language (Rust, Go, Zig) that is a drop-in
replacement for `/usr/games/pom`: same arguments, same output, same exit
codes, same 8-digit `yymmddHH` rule. Good as a teaching port of
`mktime` semantics and C `printf("%1.0f")` rounding. Could ship as a
single static binary.

### `fancy-web` — released

A full-screen night scene rendered entirely from code: a ray-traced
procedural Moon whose terminator is driven by pom’s elongation, with
earthshine, a starfield, the Milky Way and a lake. Time-travel
scrubber, timelapse, Moon calendar, principal-phase events, and the BSD
line as a caption. See
[`ports/fancy-web/README.md`](../ports/fancy-web/README.md).

### `mobile-gimmicks`

A pocket almanac. Tilt the phone to rock the Moon (device orientation),
use the compass to point at where the Moon *would* be, and add a
lock-screen widget with tonight’s phase and haptic ticks while scrubbing
through the month. A notification can fire on Full and New Moon. The
engine stays pom’s. Location is used only for the widget’s local time,
never to “correct” the algorithm without an ADR.

### `native-desktop`

A tray / menu-bar utility: the icon shows the current phase and the
menu shows the BSD line and the next principal phases. It is the modern
heir of `xphoon`, which painted the Moon onto the X11 root window. A
wallpaper mode could render the phase as the desktop background.

### `game-engine`

A Godot or Unity “observatory” scene: walk up to a telescope and look at
a Moon lit by pom’s elongation, with tides on a beach that follow the
same number. Mostly a vehicle for teaching lighting; the risk is a large
scene around a very small program.

## What NOT to Change

- Keep the algorithm based on Duffett-Smith; it is the program's
  identity.
- Preserve the dry, single-line output style as the default.

## Open Questions

- Should the port add optional Julian-date input, or stick to the
  compressed `[[[[[cc]yy]mm]dd]HH]` format? *(`fancy-web` kept the
  compressed format and added a date picker beside it.)*
- Is an ASCII moon visualisation worth the extra code? *(Still open for
  `classic-terminal`. `fancy-web` answered with a shader Moon instead.)*
- Should a port correct for TDT−UTC or use better lunar theory? That
  would change pom’s answers, so it needs an ADR and must keep the
  original output available.
