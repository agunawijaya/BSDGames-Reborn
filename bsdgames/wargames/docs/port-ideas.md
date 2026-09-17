# `wargames` — Port Ideas

`wargames` is an Easter egg, so modernisation is about tone, UX, and
preservation rather than deep mechanics.

---

## Gameplay Modernisation

- **Keep the launcher behaviour:** answering with an installed game
  still launches it.
- **Add a "Global Thermonuclear War" minigame:** if the user types
  the famous phrase, show a brief ASCII simulation that ends with the
  quote.
- **Fuzzy matching:** suggest nearby game names when the input is not
  found.

## UI/UX Design Ideas

- **Phosphor terminal aesthetic:** green-on-black, slight scanlines,
  typewriter reveal for the quote.
- **Sound:** optional 8-bit rendition of the movie's computer-voice
  prompt.
- **Launcher grid:** after the prompt, show a selectable list of
  installed BSDGames ports.

## Internet Multiplayer Design

Not applicable — `wargames` is a single-user launcher/Easter egg.

## Persistence / Cloud / Cross-Device

- Remember the last-launched game locally.
- Sync a user's "favourite answer" or chosen quote variant across
  devices if the port is web-based.

## Other Modernisation Angles

- **Accessibility:** screen-reader-friendly output and keyboard-only
  navigation.
- **Security:** sandbox the launched game instead of using `exec`.
- **Packaging:** ship as a cross-platform command (Node, Python,
  Go, etc.) with a configurable games directory.

## What NOT to Change

- The prompt "Would you like to play a game?".
- The quote "A strange game. The only winning move is not to play.".
- The overall joke: this program is an Easter egg first.

## Open Questions

- Should the port stay a launcher, or become a standalone
  micro-experience?
- Which modern runtime best preserves the "instant, anywhere" feel of
  a shell command?
