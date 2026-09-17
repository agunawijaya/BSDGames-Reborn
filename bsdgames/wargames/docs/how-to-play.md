# How to Play `wargames`

`wargames` is a single-prompt Easter egg, not a long-form game.

## Starting the Program

```
$ wargames
Would you like to play a game?
```

## What to Type

- Type the name of a BSD game that is installed on the system, e.g.
  `robots`, `snake`, or `wump`.
- If that game exists in `/usr/games/`, the screen clears and the
  game starts.
- If the name is not found, you see the movie quote:

```
A strange game.
The only winning move is
not to play.
```

## Tips & Tricks

- Pressing **Enter** without typing anything is a valid "move" and
  always produces the quote.
- Spaces and punctuation are stripped before lookup, so
  `global thermonuclear war` is treated as `globalthermonuclearwar`.
- The script is case-sensitive and lowercases nothing; `Robots` will
  not match `robots` because `R` is removed by the filter.

## Scoring

There is no score.

## Easter Eggs

The program *is* the Easter egg. The quote is the final line of the
1983 film *WarGames*.
