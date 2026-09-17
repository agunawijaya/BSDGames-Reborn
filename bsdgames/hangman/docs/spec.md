# `hangman` — Reverse Specification

> Implementation-independent specification of the game's mechanics,
> extracted from the original C source. **Not from memory — from the
> code.**
>
> This document is the contract that `src/` and `tests/` must honour.

---

## Objective

- **Win condition:** Guess every letter in the hidden word before making 7 incorrect guesses.
- **Lose condition:** Make 7 incorrect guesses before the word is fully revealed.
- **Draw / stalemate:** Not applicable.

## State Variables

| Variable | Type | Range | Initial | Persisted? |
|---|---|---|---|:---:|
| `Word[]` | `char` array | lowercase word from dictionary | from `getword()` | no |
| `Known[]` | `char` array | same length as `Word`, letters or `'-'` | all `'-'` | no |
| `Guessed[26]` | `bool` array | TRUE/FALSE per letter | all FALSE | no |
| `Errors` | `int` | 0..9 | 0 | no |
| `Wordnum` | `int` | 1..∞ | 1 | no |
| `Average` | `double` | 0..7 | 0.0 | no (session cumulative) |
| `Dict` | `FILE *` | open dictionary stream | opened in `setup()` | no |
| `Dict_size` | `off_t` | bytes in dictionary | from `fstat()` | no |
| `Minlen` | `unsigned int` | ≥ 2 | 6 (default) or `-m` value | no |
| `Dict_name` | `const char *` | file path | `_PATH_DICT` (default) or `-d` value | no |

### Object / Entity Inventory

The game has no portable items, treasures, or moving creatures. The only "entities" are the static ASCII noose picture and the hang-man body parts drawn from `Err_pos`:

| Part | Order drawn | Character | Position |
|---|---|---|---|
| Head | 1st wrong | `O` | (2, 10) |
| Torso upper | 2nd wrong | `\|` | (3, 10) |
| Torso lower | 3rd wrong | `\|` | (4, 10) |
| Left leg | 4th wrong | `/` | (5, 9) |
| Left arm | 5th wrong | `/` | (3, 9) |
| Right arm | 6th wrong | `\\` | (3, 11) |
| Right leg | 7th wrong | `\\` | (5, 11) |

After 7 errors the game ends in a loss.

## Actions / Commands

| Command | Input | Effect | Preconditions |
|---|---|---|---|
| Guess letter | printable letter `a-z`/`A-Z` | Reveal all occurrences of that letter in `Known`, or increment `Errors` if none. | Game in progress; letter not already guessed. |
| Already-guessed letter | previously guessed letter | Display message "Already guessed 'x'"; no state change. | Game in progress. |
| Invalid input | non-letter (except Ctrl-L/Ctrl-D) | Display "Not a valid guess: ..."; no state change. | Game in progress. |
| Redraw | `Ctrl-L` | Refresh the curses screen. | Any time during input. |
| Quit | `Ctrl-D` | Exit cleanly via `die()`. | During input prompt. |
| Play again | `y` at end-of-game prompt | Start a new word. | End-of-game prompt. |
| Stop playing | `n` at end-of-game prompt | Exit cleanly via `die()`. | End-of-game prompt. |

## Rules & Invariants

1. **Dictionary words.** Words are drawn from a plain text file, one word per line, consisting entirely of lowercase letters (`islower`). Words shorter than `Minlen` are rejected and a new word is chosen.
2. **Word selection.** A random byte position is picked uniformly in the dictionary file; the next complete line after that position is read as the candidate word.
3. **Letter normalization.** Uppercase guesses are converted to lowercase.
4. **Guess deduplication.** A letter that has already been guessed produces a warning and is not re-counted.
5. **Error budget.** The player is allowed at most `MAXERRS = 7` wrong guesses.
6. **Win detection.** The word is solved when `strchr(Known, '-') == NULL`, i.e., no placeholder remains.
7. **Loss detection.** The game is lost when `Errors >= MAXERRS`.
8. **Averaging.** After each game, `Average` is updated as a running mean of errors per word: `Average = (Average * (Wordnum - 1) + Errors) / Wordnum`.
9. **No persistence.** Scores/averages are not saved to disk; they persist only within the process session.

## Difficulty Levels & Setup Configuration

### Difficulty Modes

There are no explicit difficulty modes. Difficulty is controlled indirectly by:

- **Minimum word length** (`-m`): longer words are generally harder. Default 6, must be ≥ 2.
- **Dictionary choice** (`-d`): a harder dictionary makes the game harder.

### Setup & Invariant Bounds

| Flag / Option | Parameter | Range | Validation | Rejection |
|---|---|---|---|---|
| `-m minlen` | minimum word length | integer ≥ 2 | `if (Minlen < 2) errx(...)` | prints error and exits |
| `-d wordlist` | dictionary file path | any path | `fopen()` at `setup()` time | exits with `err()` if file cannot be opened |

### Session Replay Semantics

There is no replay or saved-game feature. Each run:
- Seeds RNG from `time(NULL) + getpid()`.
- Opens the dictionary.
- Starts a fresh average and word counter.

## RNG Usage

| Trigger | Distribution | Effect |
|---|---|---|
| Word selection | Uniform byte position in dictionary file (`rand() / (RAND_MAX + 1.0) * Dict_size`) | Chooses a random seek point; the next complete line becomes the candidate word. |

**Seed strategy:** Fresh per run. `srand(time(NULL) + getpid())` is called once in `setup()`.

## Scoring

There is no point score. The game tracks:

- **Errors** per word (0–7).
- **Current Average** errors per word for the session.
- **Overall Average** running mean across all words played in the session.

A win is a word solved with ≤ 6 errors; a loss occurs at 7 errors.

## Termination Conditions

1. **Win — word solved.** `playgame()` loop exits because `Known` contains no `'-'`. `endgame()` prints "You got it!" and asks to play again.
2. **Lose — 7 wrong guesses.** `playgame()` loop exits because `Errors >= MAXERRS`. `endgame()` prints "Sorry, the word was ..." and asks to play again.
3. **Quit during play.** `Ctrl-D` at the guess prompt calls `die()`.
4. **Quit at replay prompt.** Pressing `n` at "Another word?" calls `die()`.
5. **Invalid arguments.** Bad `-m` value prints usage/error and exits before starting curses.
6. **Missing dictionary.** If `Dict_name` cannot be opened, `setup()` exits with `err()`.

## Not in Scope

Things the original does that a modern port may choose differently:

- Hint system or letter-frequency assistance.
- Difficulty tiers beyond minimum word length.
- Multiplayer or competitive modes.
- Persistent high scores.
- Visual themes beyond the ASCII noose.

See [`port-ideas.md`](./port-ideas.md) for modernisation decisions.

## Ambiguities in the Original

- **Word selection edge cases.** If the random seek lands near EOF, `fgets()` may return EOF and the loop retries. If the dictionary has very long lines, `BUFSIZ` limits the buffer. The port preserves the same retry behavior.
- **Endgame error clamp.** `endgame()` sets `Errors = MAXERRS + 2` on loss before drawing the final man and printing the word. This ensures the full body is drawn even though the loop already terminated at `Errors == MAXERRS`.

## See Also

- [`architecture.md`](./architecture.md)
- [`test-scenarios.md`](./test-scenarios.md)
