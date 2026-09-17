# `fish` — Man Page Mirror

Original source: `BSDGames-master/fish/fish.6`.

---

## NAME

**go-fish** — play "Go Fish"

## SYNOPSIS

```
fish [-p]
```

## DESCRIPTION

`fish` is the game *Go Fish*, a traditional children's card game.

The computer deals the player and itself seven cards, and places the
rest of the deck face-down. The object is to collect books — all four
members of a single rank. For example, collecting four 2's gives the
player a "book of 2's".

## OPTIONS

| Option | Description |
|---|---|
| `-p` | Professional mode. |

## RULES

The computer randomly decides who starts. Players take turns asking
for cards of a specified rank. The asked player must hand over any
cards of that rank they hold. The asker must hold at least one card of
the requested rank. If the asked player has none, the asker draws a
card. If the drawn card matches the requested rank, the asker gets
another turn; otherwise the turn passes.

When a player completes a book, the cards are set aside and the rank
is no longer in play. The game ends when either player has no cards
left; the player with the most books wins.

## BUGS

The computer cheats only rarely.

## Annotation

- The man page name is `go-fish`, but the installed binary is
  traditionally `fish`.
- The rare cheat is implemented in the pro-mode AI.
