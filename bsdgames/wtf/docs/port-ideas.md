# `wtf` — Port Ideas

`wtf` is a utility, not a game, so "modernisation" means rethinking how
people look up jargon today while keeping the original's blunt charm.

---

## Gameplay Modernisation

- **Quiz mode:** Show the expansion, ask the user to guess the acronym
  (or vice-versa). Keep a streak counter.
- **Fuzzy matching:** Tolerate typos (`wtf afiak` → "did you mean
  AFAIK?").
- **Add-a-slang mode:** Let users contribute new acronyms to a local
  crowd-sourced database.
- **Context packs:** Separate databases for gaming, medical, aviation,
  etc., selected with `-t`.

## UI/UX Design Ideas

- **Web UI:** A single-page app with a search box and instant results.
  Use the same retro green-on-black terminal theme as the rest of the
  BSDGames Reborn project.
- **Mobile widget:** Quick acronym lookup from a share sheet.
- **Rich terminal output:** Use colour to highlight the matched acronym
  and show related entries.
- **Autocomplete:** As the user types, suggest acronyms from the
  database.

## Internet Multiplayer Design

Not applicable as a competitive game, but multiplayer could appear as:

- **Shared guild dictionary:** A server-backed acronym database for a
  team or Discord server.
- **Guess-the-acronym lobby:** Players take turns submitting acronyms
  or expansions; others vote on the best/funniest.

## Persistence / Cloud / Cross-Device

- Sync custom acronym databases across devices.
- Allow users to star or bookmark frequently needed acronyms.
- Maintain per-user contribution history in quiz mode.

## Other Modernisation Angles

- **Local LLM fallback:** If the acronym is unknown, ask a small local
  model for a likely expansion (with a confidence warning).
- **Accessibility:** Screen-reader friendly output, high-contrast
  themes, and large-type mode.
- **Package as a library:** Expose the lookup logic as a tiny npm / pip
  package so other tools can reuse it.

## What NOT to Change

- Keep the one-shot, command-line-first interface. `wtf` must remain
  usable in a pipeline.
- Preserve the public-domain spirit: no proprietary dictionary locks.
- Do not bloat the database with low-quality entries; curate.

## Open Questions

- Should the port ship with the original 252-entry database, expand it,
  or make it user-extensible by default?
- Is there value in preserving the `whatis(1)` fallback, or should the
  port rely entirely on its own database?
