# `morse` — Port Design Ideas

> Modernisation brainstorm for the `morse` utility.

---

## 1. Gameplay Modernisation

N/A — utility. Could add a "Morse trainer" mini-game.

## 2. UI / UX Design

- **Live encoder/decoder web page.**
- **Audio playback** at adjustable WPM.
- **Flashing light visualisation.**

## 3. Multiplayer / Networking

N/A.

## 4. Persistence

- Optional history of recent translations.

## 5. Other Modernisation Angles

- **Sound output.** Generate WAV/MP3 of Morse code.
- **Koch trainer.** Teach Morse code interactively.
- **Non-International variants.** American Morse, etc.

## 6. What NOT to Change

- International Morse mappings for A–Z, 0–9, and supported punctuation.
- Bidirectional encode/decode capability.

## 7. Open Questions

1. Should the port add audio output? **Needs ADR.**
2. Should it support Morse variants beyond International? **Needs ADR.**

## See Also

- [`architecture.md`](./architecture.md)
- [`spec.md`](./spec.md)
