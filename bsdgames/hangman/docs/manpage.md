# `hangman` — Man Page Mirror

> Mirrored and cleaned from the original BSD man page
> `hangman.6.in`, preserving its copyright and attribution.
>
> Source: <https://github.com/vattam/BSDGames/tree/master/hangman/hangman.6.in>

---

## Copyright

```
Copyright (c) 1983, 1993
	The Regents of the University of California.  All rights reserved.

@(#)hangman.6	8.1 (Berkeley) 5/31/93
```

## Name

`hangman` — computer version of the game hangman

## Synopsis

```
hangman [-d wordlist] [-m minlen]
```

## Description

In `hangman`, the computer picks a word from the on-line word list and you must try to guess it. The computer keeps track of which letters have been guessed and how many wrong guesses you have made on the screen in a graphic fashion.

## Options

| Flag | Meaning |
|---|---|
| `-d wordlist` | Use the specified word list instead of the default one. |
| `-m minlen` | Set the minimum word length to use. The default is 6 letters. |

## Files

| Path | Purpose |
|---|---|
| `@hangman_wordsfile@` | On-line word list. The exact path is substituted at build time. |

## Authors

**Ken Arnold**

## Historical Notes

This is one of the classic 4.3BSD games written by Ken Arnold, who also authored the original `curses` library. The program demonstrates the curses API in its earliest teaching form: a simple loop of input, state update, and screen refresh.
