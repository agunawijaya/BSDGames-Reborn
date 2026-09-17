# Port Ideas for `banner`

> Modernisation brainstorm for the `banner` utility.

---

## Gameplay Modernisation

- **Animation mode:** Reveal the banner one row at a time.
- **Scroll mode:** Print a long banner as a horizontal marquee.
- **Colour mode:** Rainbow or gradient fills for parties.

## UI/UX Design Ideas

- **Web demo:** Type text, choose a font/width, and copy the ASCII art.
- **Terminal UI:** Live preview as you type.
- **Mobile app:** Generate banners and share as text or image.

## Internet Multiplayer Design

Not applicable.

## Persistence / Cloud / Cross-Device

- **Saved banners:** Store commonly used phrases locally.
- **Shared gallery:** Users submit funny banners.

## Other Modernisation Angles

- **Font packs:** FIGlet fonts, Unicode box-drawing, emoji block art.
- **Export:** PNG/SVG export instead of plain text.
- **API:** `GET /banner?text=HELLO&width=80` returns JSON or plain text.
- **Accessibility:** Screen-reader friendly description of the rendered text.

## What NOT to Change

- Do not remove the classic `#`-based ASCII style in the default mode.
- Preserve the original 132-column default width as an option.
- Keep the program usable as a pipe-able filter.

## Open Questions

- Should the port include the original glyph set or modern FIGlet fonts?
- Should the web demo target retro aesthetics or modern design?
- Is PNG export useful, or is plain text sufficient?

## See Also

- [`architecture.md`](./architecture.md) — original code analysis.
- [`spec.md`](./spec.md) — current mechanics.
