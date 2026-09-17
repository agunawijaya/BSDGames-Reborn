# Port Ideas for `ppt`

> Modernisation brainstorm for the `ppt` utility.

---

## Gameplay Modernisation

- **Reel animation:** Show a paper tape unwinding as bytes are encoded.
- **Sound:** Add authentic paper-tape reader noise during decode.
- **Tape editor:** Click holes to flip bits and see the resulting character.

## UI/UX Design Ideas

- **Web demo:** Type text on the left, see paper tape on the right; click to copy either form.
- **Terminal UI:** Colour-coded bits and a round-trip verifier.
- **Mobile app:** Generate paper-tape images to share.

## Internet Multiplayer Design

Not applicable.

## Persistence / Cloud / Cross-Device

- **Saved tapes:** Store encoded messages as text or images.
- **Shared reels:** Post paper-tape puzzles for others to decode.

## Other Modernisation Angles

- **Image decode:** Use OCR to decode a photo of real paper tape.
- **7-track/5-track modes:** Simulate historical tape widths.
- **API:** `POST /ppt/encode` and `POST /ppt/decode` with JSON.
- **Accessibility:** Audio Morse-like playback of the bit stream.

## What NOT to Change

- Preserve the `|` + 8 bits + `.` + `|` row format in default output.
- Keep the round-trip property: `ppt | ppt -d` must return the original text.
- Do not add decode-mode arguments.

## Open Questions

- Should the web demo animate the tape or show a static strip?
- Should the port support image-based decode?
- Is there educational value in comparing paper tape with modern binary formats?

## See Also

- [`architecture.md`](./architecture.md) — original code analysis.
- [`spec.md`](./spec.md) — current mechanics.
