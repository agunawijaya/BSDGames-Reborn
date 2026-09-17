# `caesar` — Port Design Ideas

> Modernisation brainstorm for the `caesar` utility.

---

## 1. Gameplay Modernisation

N/A — utility.

## 2. UI / UX Design

- **Web decoder.** Paste ciphertext, see all 26 rotations ranked by score.
- **Confidence meter.** Show how certain the frequency analysis is.
- **Live preview.** Update output as the user types.

## 3. Multiplayer / Networking

N/A for a utility. Could add a multiplayer "decode race" mini-game as a separate mode.

## 4. Persistence

- Save recent decoded strings locally (optional).
- Sync across devices if account enabled.

## 5. Other Modernisation Angles

- **Multiple languages.** Frequency tables for Spanish, French, etc.
- **Bigram/trigram scoring.** More accurate than single-letter frequencies.
- **CLI modernisation.** Support `--rotation`, `--language`, `--score`.
- **API.** `/decode` endpoint for CTF-style use.

## 6. What NOT to Change

- Must remain a stream filter at its core.
- Must preserve exact rotation semantics for letters.

## 7. Open Questions

1. Should the port load language frequency tables at runtime? **Needs ADR.**
2. Should auto-detect mode report confidence or just the best rotation? **Needs ADR.**

## See Also

- [`architecture.md`](./architecture.md)
- [`spec.md`](./spec.md)
