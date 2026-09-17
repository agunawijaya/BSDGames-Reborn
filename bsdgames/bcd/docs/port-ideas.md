# Port Ideas for `bcd`

> Modernisation brainstorm for the `bcd` utility.

---

## Gameplay Modernisation

- **Card-deck mode:** Print multiple cards stacked vertically with feed holes.
- **Colour mode:** Use terminal colours to make punched holes stand out.
- **Animation:** Feed a card through a virtual reader row by row.

## UI/UX Design Ideas

- **Web demo:** Type text and download an SVG punch card.
- **Terminal UI:** Highlight holes in green and add a realistic card border.
- **Mobile app:** Generate punch-card wallpapers or shareable images.

## Internet Multiplayer Design

Not applicable.

## Persistence / Cloud / Cross-Device

- **Saved cards:** Store frequently used phrases as card images.
- **Shared gallery:** Users submit punch-card art.

## Other Modernisation Angles

- **SVG export:** Produce scalable punch-card images.
- **80-column mode:** Support the full IBM card width.
- **EBCDIC/ASCII toggle:** Show how the same text maps to different encodings.
- **Accessibility:** Screen-reader description of hole patterns.

## What NOT to Change

- Preserve the retro ASCII-art aesthetic in the default terminal mode.
- Keep the uppercase conversion behaviour.
- Do not silently change the hole-bit semantics.

## Open Questions

- Should the port default to 48 or 80 columns?
- Should the web demo target history educators or retro-computing enthusiasts?
- Is there value in generating physical card images for laser cutting?

## See Also

- [`architecture.md`](./architecture.md) — original code analysis.
- [`spec.md`](./spec.md) — current mechanics.
