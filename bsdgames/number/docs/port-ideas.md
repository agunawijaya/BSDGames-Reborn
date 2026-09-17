# Port Ideas for `number`

> Modernisation brainstorm for the `number` utility.

---

## Gameplay Modernisation

- **Currency mode:** Automatically format inputs as dollars and cents (`$123.45` → `one hundred twenty-three dollars and forty-five cents`).
- **Cheque mode:** Produce cheque-safe output with exact cent phrasing.
- **Range mode:** Convert every number in a range (`number 1..100`).

## UI/UX Design Ideas

- **Web demo:** A single input field that speaks the number aloud using the Web Speech API.
- **Terminal UI:** Live preview as you type, with colour-coded scale names.
- **Mobile app:** Voice input — say a number and see it written out.

## Internet Multiplayer Design

Not applicable for a utility.

## Persistence / Cloud / Cross-Device

- **History:** Save recent conversions locally.
- **Favourites:** Bookmark commonly used numbers (e.g., invoice amounts).

## Other Modernisation Angles

- **Localisation:** Support Spanish, French, Indonesian, and other languages.
- **Big-number support:** Extend beyond 65 digits using arbitrary-precision libraries.
- **API:** `GET /spell/12345` returns JSON with integer, fractional, and full-text forms.
- **Accessibility:** Screen-reader optimised output with semantic markup.

## What NOT to Change

- Do not change the default English output format; preserve the original phrasing style.
- Do not silently accept invalid numeric input.
- Keep the tool usable as a pipe-able filter.

## Open Questions

- Which locales should the port support first?
- Should currency/cheque modes be flags or separate programs?
- Is a web API useful, or is the CLI sufficient?

## See Also

- [`architecture.md`](./architecture.md) — original code analysis.
- [`spec.md`](./spec.md) — current mechanics.
