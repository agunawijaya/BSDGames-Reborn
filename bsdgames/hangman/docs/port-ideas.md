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

## Competitive Landscape

Hangman as a core loop is unusually shallow — one hidden word,
letter-by-letter guessing, limited misses — and that shallowness
has been thoroughly mined for four decades. Any port must
acknowledge who already owns the space and what remains open.

### The current ceilings

- **[Hangman.io](https://hangman.io/)** and its many clones —
  browser-based, mobile-first, ad-supported, category packs
  (movies, animals, geography). Owns the casual-mobile slot.
- **[Wordle](https://www.nytimes.com/games/wordle/index.html)** —
  the *daily-word, letter-feedback* genre-adjacent giant. Sets
  the ceiling for social/daily-challenge word games. New York
  Times acquisition confirmed the format's mass appeal.
- **[Semantle](https://semantle.com/)** and
  **[Contexto](https://contexto.me/)** — semantic-distance guess
  games. Own the "vocabulary-nerd, one word per day" slot.
- **[Cemantix](https://cemantix.certitudes.org/)**,
  **[Waffle](https://wafflegame.net/)**, and the rest of the
  post-Wordle wave — most niches (crossword-hangman hybrid,
  daily-anagram) are occupied.
- **Educational hangman apps** (Duolingo mini-games, Quizlet
  hangman-mode, several K-12 vocabulary tools). Own the
  language-learning slot for children and beginners.

### What's still open

- **Etymology.** No mainstream hangman variant treats each miss
  as an opportunity to *reveal the word's ancestry* — its Latin,
  Greek, Old English, Sanskrit, or Arabic root — as playable
  content. Etymology as content is the domain of dictionaries
  and the [`etymonline.com`](https://www.etymonline.com/) audience
  — a real, monetisable, share-motivated community.
- **Cryptic-clue hangman.** The guess word is presented via a
  cryptic-crossword-style clue rather than "5 letters, animal."
  Would draw the *Guardian*/*Times* cryptic-crossword audience.
  Overlaps slightly with rebus games but not directly occupied.
- **Chain / crossword hangman.** Successive words share
  letters — solving one gives you a head start on the next.
  Occupied lightly by *Waffle* but not in the hangman format
  specifically.
- **Historical / archaeological framing** consistent with the
  rest of this project — hangman as it appeared on paper
  slates, then on 1970s terminals, then on the BSD 1985 version.
  Niche but on-brand.

### Positioning statement (working)

> Not "another hangman." An **etymological hangman**: every miss
> reveals a root of the hidden word. You lose slowly if you know
> nothing about language history; you can win fast if you spot
> the Latin ancestor.

The full hook this positioning implies is described in
[Distinctive Hook](#distinctive-hook) below.

## Distinctive Hook

Two candidate hooks. **Neither is committed** — this section
brainstorms; the choice becomes a per-game ADR. Both accept that
we cannot win on the shallow-casual axis (Hangman.io) or the
social-daily axis (Wordle), so we must win on *content depth*.

### Hook A — "Etymology Hangman" *(recommended)*

**Premise:** Every hidden word carries a hidden **etymological
tree**. Each incorrect letter guess doesn't build the gallows —
it *reveals* one node of that tree.

Example — the hidden word is `AQUEDUCT`:

```
Guess: E                     ← correct    _ _ _ E _ _ _ _
Guess: X                     ← wrong (1)  Reveal: "Latin: aqua = water"
Guess: A                     ← correct    A _ _ E _ _ _ _
Guess: Q                     ← correct    A Q _ E _ _ _ _
Guess: Z                     ← wrong (2)  Reveal: "Latin: ducere = to lead"
Guess: U                     ← correct    A Q U E _ U _ _
Guess: J                     ← wrong (3)  Reveal: "Compound: 'to lead water'"
Guess: D                     ← correct    A Q U E D U _ _
Guess: C                     ← correct    A Q U E D U C _
Guess: T                     ← correct    A Q U E D U C T   ✓
```

The gallows never appears — replaced with an **illuminated
manuscript** whose margin fills with etymology as you fail.
A word with a rich etymology forgives more misses; a word with a
plain Old English root punishes you faster.

Two symmetric modes:

- **Guess the word from its etymology** — the traditional flow,
  above.
- **Guess the etymology from the word** — you see the word;
  guess which language it came from and what the ancestor meant.
  Multiple-choice or free-typed.

Signature moments:

- **Word-family constellations.** After a win, the word appears
  at the centre of a tree showing its cognates: `AQUEDUCT` links
  to `AQUARIUM`, `AQUATIC`, `AQUA`, `DUCT`, `DEDUCT`, `PRODUCE`.
  Sharable as a static image.
- **Language streaks.** Track how often you win on Latin roots
  vs. Greek roots vs. Germanic roots — you get a "polyglot
  profile" over time.
- **Daily etymology.** One word per day, same for everyone,
  Wordle-style. Score = misses + time. Global leaderboard split
  by native language (some etymologies are trivial to speakers
  of certain languages).

Why it fits **this project**:

- **Genuinely educational.** Aviation and cryptography audiences
  found us via `atc` and `caesar` docs; the word-nerd /
  etymology audience is the same *shape* of niche — small,
  passionate, share-motivated.
- **Content is the moat.** Building a curated etymology database
  is real work; a competitor cloning the mechanic without the
  data ships a hollow product. This is the opposite of Tetris,
  where the mechanic is the product.
- **Aligns with the historical-preservation identity** of this
  project — hangman as a vehicle for language history matches
  BSD Games as a vehicle for computing history.

### Hook B — "Cryptic Clue Hangman"

**Premise:** The traditional letter-guessing loop is preserved,
but the hidden word is introduced via a **cryptic-crossword-style
clue** rather than "5 letters, animal."

Example:

```
Clue: "Small mammal loses way, becomes royalty (5)"
_ _ _ _ _
[MOUSE - OU + INE = MINCE? no...]
```

*(Answer: `MOUSE` → drop `OUSE`, wrap the M... okay, cryptic-
crossword design is genuinely hard; this hook needs a professional
setter to work.)*

Signature moments:

- The clue itself is a puzzle before you even start guessing
  letters. Solving the clue often lets you guess the whole word.
- Difficulty tiers = clue difficulty (surface-reading easy,
  full-cryptic hard).
- Daily challenge with global leaderboard, split by
  clue-solve-speed vs. letter-guess-efficiency.

Why it fits: draws from the ~2 million-strong cryptic-crossword
audience (*Guardian*, *Times*, *NYT*, Australian, Indian
cryptic communities). Weakness: requires a professional cryptic
setter to author clues — significant ongoing content cost.

### Recommendation

Hook A ("Etymology Hangman") is stronger for a first port —
content is one-time authoring (etymology data is stable) rather
than perpetual (cryptic clues need fresh puzzles indefinitely),
and etymology's educational value gives it word-of-mouth reach
that pure puzzle games struggle to match. Hook B remains an
interesting v2 direction if the audience proves out. **This is a
proposal, not a decision** — the final choice becomes ADR
`hangman/docs/decisions/002-port-identity-hook.md` (still to
write).

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
