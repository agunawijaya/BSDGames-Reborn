# How to Play `wtf`

`wtf` is not a game, but the manual below treats it like one: you give
it a puzzle (an acronym), and it gives you an answer.

---

## Controls / Commands

Run `wtf` from a terminal.

```
wtf [-f dbfile] [-t type] [is] <acronym> ...
```

| Flag | Meaning |
|---|---|
| `-f dbfile` | Use a custom acronym database file. |
| `-t type` | Use the database `acronyms.type` instead of the default. |
| `is` | Optional noise word, ignored. |
| `<acronym>` | One or more acronyms to expand. |

### Environment

| Variable | Meaning |
|---|---|
| `ACRONYMDB` | Path to the default acronym file. Overrides built-in default. |

## How to Win

There is no win condition. The goal is to learn what an acronym means.
A "successful" lookup prints the expansion and exits with code `0`.

## Tips & Tricks

- **Use natural language:** `wtf is FUBAR` works because `is` is
  ignored.
- **Look up several at once:** `wtf AFK BBL BRB`.
- **Switch databases:** `wtf -t comp CPU` uses the computer-related
  database.
- **Custom list:** create a file with `ACRONYM<TAB>meaning` lines and
  run `wtf -f myfile WTF`.
- **Unknown acronym:** if `whatis(1)` knows the word, `wtf` prints the
  man-page one-liner instead.

## Scoring Mechanism

None. This is a lookup utility.

## Easter Eggs

- The `is` grammar is the closest thing to an Easter egg: the program
  understands you even when you type like a human.
- The fallback error message is intentionally folksy: *"Gee... I don't
  know what X means..."*

## Difficulty Modes

No difficulty modes exist. Future ports could add fuzzy matching,
multiple-choice quizzes, or a "guess the acronym" game mode.
