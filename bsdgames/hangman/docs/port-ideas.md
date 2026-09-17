# `hangman` — Port Design Ideas

> **Brainstorm for modernisation.** We are doing a **spiritual
> successor** (root ADR-002). Preserve the core mechanic; freely
> modernise everything else.
>
> Every non-obvious choice becomes a per-game ADR under
> [`./decisions/`](./decisions/) or a root ADR if it affects multiple
> games.

---

## Guiding Question

> If this game were being designed *today*, with no era constraints,
> what would we do?

## 1. Gameplay Modernisation

### AI

N/A. `hangman` is a single-player puzzle. There is no computer opponent beyond the random word picker.

### Mechanics

- **Difficulty tiers.** Add Easy / Medium / Hard modes that select from different word-length ranges or curated dictionaries.
- **Category packs.** Allow players to choose themes (animals, science, geography, etc.).
- **Timed mode.** Optional countdown per guess for added pressure.
- **Limited-hint mode.** One free vowel reveal or one letter-frequency hint per word.
- **Streak scoring.** Track consecutive wins and best streaks.

### Content

- **Curated word lists** beyond the system dictionary.
- **Daily word** mode — everyone gets the same word for 24 hours.
- **Custom words** for private multiplayer or classroom use.

## 2. UI / UX Design

### Visual Direction

- **Neo-retro terminal aesthetic.** Keep the monospace gallows but add smooth animations when body parts appear.
- **Color feedback.** Green for correct guesses, red for wrong guesses, gray for already-guessed letters.
- **Keyboard visualization.** Show an on-screen QWERTY keyboard with guessed letters marked.

### Interaction Paradigm

- **Keyboard-first.** Type letters directly; `Enter` not required.
- **Mouse/touch optional.** Tap the on-screen keyboard or letters.
- **Controller support.** Map letter selection to a virtual keyboard.

### Layout

- **Center:** the word, the gallows, and the keyboard.
- **Top right:** word number, current average, overall average.
- **Bottom:** messages and replay prompt.
- **Responsive:** scale the ASCII art and keyboard for different terminal/screen sizes.

### Accessibility

- **Screen-reader mode.** Announce the word length, guessed letters, and remaining errors.
- **High-contrast palette.** Ensure the gallows is visible for low-vision players.
- **Dyslexia-friendly font option** for the word and keyboard.

## 3. Multiplayer / Networking

The original has no multiplayer, but the mechanic supports extensions:

- **Local hot-seat.** One player enters a word; the other guesses.
- **Asynchronous multiplayer.** Send a word to a friend; they guess and send their score back.
- **Online leaderboards.** Daily-challenge rankings by streak or average errors.

For the core port, multiplayer is optional and can be deferred.

## 4. Persistence

- **Session statistics.** Persist best streak, total words played, and lifetime average.
- **Cross-device sync.** Optional account-based sync of stats and daily progress.
- **No cloud requirement.** All stats should be available locally by default.

## 5. Other Modernisation Angles

- **Telemetry.** Collect only anonymous aggregate metrics: words played, win rate by difficulty. Never collect the actual words guessed. Opt-in only.
- **Configuration.** A `hangman.toml` or settings file for default difficulty, dictionary, and key bindings.
- **Internationalisation.** UI strings localisable; word lists per locale.
- **Modding.** Allow users to supply custom `.txt` word lists.
- **Ports / distribution.** Desktop TUI, web, and mobile builds.

## 6. What NOT to Change

To keep this recognisable as Hangman, the port must preserve:

- One hidden word at a time.
- Letter-by-letter guessing.
- A limited wrong-guess budget (traditionally 7).
- Visual feedback for wrong guesses (the gallows).
- The ability to play again immediately.

## 7. Open Questions

Questions this brainstorm raised that need a decision (usually via ADR):

1. **Should the dictionary be loaded into memory for uniform selection, or should the original random-seek approach be preserved?** **Needs ADR.**
2. **Should the default wrong-guess limit remain 7, or be configurable per difficulty?** **Needs ADR.**
3. **Should the port support multiplayer out of the box, or keep it single-player initially?** **Needs ADR if multiplayer is added.**
4. **What is the target platform / language for the implementation?** A root language ADR is pending; this game defers to it.

## See Also

- [`architecture.md`](./architecture.md) — what we start from.
- [`spec.md`](./spec.md) — the mechanic identity to preserve.
- [`./decisions/`](./decisions/) — where per-game ADRs live.
- Root [ADR-002 Porting Philosophy](../../../docs/decisions/002-porting-philosophy.md).
