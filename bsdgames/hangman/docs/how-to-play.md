# How to Play `hangman`

> Manual + strategy guide. Covers: controls, objective, how to win,
> tips & tricks, scoring, and easter eggs.

---

## Objective

Guess the hidden word one letter at a time before the stick figure is fully drawn. You have at most 7 wrong guesses.

## Starting the Game

```
$ hangman
```

To use a custom word list or change the minimum word length:

```
$ hangman -d /path/to/words.txt -m 8
```

- `-d` specifies the dictionary file.
- `-m` sets the minimum word length (default 6).

*(Once the port exists, replace `hangman` with the port's launch command.)*

## Controls

| Input | Action |
|---|---|
| `a`–`z` or `A`–`Z` | Guess that letter |
| `Ctrl-D` | Quit immediately |
| `Ctrl-L` | Redraw the curses screen |
| `y` at "Another word?" | Play another word |
| `n` at "Another word?" | Quit |

There is no Enter key; the game reads one character at a time.

## Playing

1. The game shows a gallows, a row of dashes representing the hidden word, and a list of labels ("Guess:", "Guessed:", "Word #:", averages).
2. Type a letter.
   - If the letter appears in the word, it is filled into every matching position.
   - If it does not appear, the letter is added to "Guessed:" and another body part is drawn.
3. Keep guessing until you either complete the word or reach 7 wrong guesses.
4. At the end, press `y` to play again or `n` to quit.

## How to Win

Reveal every letter in the word using 6 or fewer wrong guesses. Practical advice:

- **Start with vowels.** `e`, `a`, `o`, `i`, `u` are common in English words.
- **Guess common consonants next.** `t`, `n`, `s`, `r`, `l` are good second choices.
- **Use word-length clues.** A 10-letter word is less likely to contain `x` or `z`.
- **Track the guessed list.** Do not waste guesses on letters you already tried.

## Tips & Tricks

- **The running average is your enemy.** Try to keep your average errors low over multiple words.
- **Longer words are not always harder.** They often contain more common letters.
- **Custom dictionary can make it easier.** Play with a topic you know well.
- **There is no time limit.** Take your time to think about letter frequency.

## Scoring

There are no points in the original game. The game tracks:

| Metric | Meaning |
|---|---|
| Errors | Wrong guesses for the current word (0–7) |
| Current Average | Average errors for the current word across all words played |
| Overall Average | Running mean of errors per word across the session |

A "good" round is one solved with 0–3 errors. A "perfect" round guesses the word with no errors.

## Difficulty Levels & Game Setup Configuration

### Difficulty Modes

The original has no named modes. Difficulty is controlled by:

- **Minimum word length** (`-m`): higher values mean longer words.
- **Dictionary difficulty**: use `-d` with a harder or easier word list.

### Setup Options

| Flag | Default | Effect |
|---|---|---|
| `-d wordlist` | system dictionary | Use a custom word list |
| `-m minlen` | 6 | Reject words shorter than this |

### Rematch & Replay Options

The game loops forever until you press `n` at the replay prompt. There is no saved state or replay file in the original.

## Easter Eggs

- **The noose is a static ASCII drawing.** It is drawn once and never changes during the round.
- **Ctrl-D is the hidden quit.** There is no on-screen quit key; `Ctrl-D` at the guess prompt exits cleanly.

## Common Pitfalls

- **Guessing the same letter twice.** The game warns you but does not penalize you.
- **Forgetting case insensitivity.** Uppercase letters are converted to lowercase.
- **Non-letter inputs.** Numbers and symbols produce a "Not a valid guess" message.

## See Also

- [`spec.md`](./spec.md) — full mechanical specification.
- [`architecture.md`](./architecture.md) — how the original implements these mechanics.
- [`about.md`](./about.md) — history and cultural context.
