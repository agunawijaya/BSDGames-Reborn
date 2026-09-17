# `countmail` — Man Page Mirror

Original source: `BSDGames-master/countmail/countmail.6`.

---

## NAME

**countmail** — be obnoxious about how much mail you have

## SYNOPSIS

```
countmail
```

## DESCRIPTION

The `countmail` program counts your mail and tells you about it rather
obnoxiously.

## HISTORY

`countmail` first appeared in NetBSD 1.3. It was first written by Noah
Friedman in 1993. The NetBSD version was written by Charles M. Hannum.

## CAVEATS

The read loop is horrendously slow on every shell implementation tried.
`countmail` uses `from(1)` and `wc(1)` instead, though these are not
shell builtins.

## SEE ALSO

`from(1)`

## Annotation

- The man page accurately warns that the pure-shell loop is slow; the
  shipped implementation therefore relies on external commands.
- The program has no options, making it one of the simplest commands in
  BSDGames.
