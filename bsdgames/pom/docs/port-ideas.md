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

## What NOT to Change

- Keep the algorithm based on Duffett-Smith; it is the program's
  identity.
- Preserve the dry, single-line output style as the default.

## Open Questions

- Should the port add optional Julian-date input, or stick to the
  compressed `[[[[[cc]yy]mm]dd]HH]` format?
- Is an ASCII moon visualisation worth the extra code?
