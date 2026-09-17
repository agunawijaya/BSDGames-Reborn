# `pig` — Port Design Ideas

> Modernisation brainstorm for the `pig` utility.

---

## 1. Gameplay Modernisation

N/A — utility.

## 2. UI / UX Design

- **Live translator web page.** Type English, see Pig Latin in real time.
- **Copy button.** One-click copy of translated output.

## 3. Multiplayer / Networking

N/A. Could add a "translate and send" messaging toy.

## 4. Persistence

- Optional history of recent translations.

## 5. Other Modernisation Angles

- **Reverse translation.** Convert Pig Latin back to English.
- **API endpoint.** `POST /piglatin`.
- **Unicode support.** Handle non-ASCII letters.
- **Speech output.** Read the result aloud for laughs.

## 6. What NOT to Change

- Core Pig Latin rules (consonant clusters to end + `ay`; vowel-start + `way`).
- Stream/filter semantics.

## 7. Open Questions

1. Should the port support other Pig Latin dialects? **Needs ADR if yes.**
2. Should reverse translation be included? **Needs ADR.**

## See Also

- [`architecture.md`](./architecture.md)
- [`spec.md`](./spec.md)
