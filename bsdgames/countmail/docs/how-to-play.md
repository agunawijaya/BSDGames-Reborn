# How to Play `countmail`

`countmail` is not a game, but it is played by running it and watching
its reaction to your mailbox.

---

## Controls / Commands

Run `countmail` from a terminal with no arguments.

```
countmail
```

The program shells out to `from | wc -l`, converts the resulting
number to words, and prints the announcement.

## How to Win

There is no win condition. The only goal is entertainment. A mailbox
with a prime number of messages arguably produces the funniest output.

## Tips & Tricks

- **Empty inbox:** `countmail` still performs — it will shout *"ZERO
  MAIL MESSAGES! HAHAHAHAHA!"*.
- **One message:** the script uses the singular form *"ONE MAIL
  MESSAGE!"*.
- **Too much mail:** if you somehow exceed `SEPTILLION` messages, the
  script gives up and prints *"YOU HAVE TOO MUCH MAIL!"* to stderr.
- **Prank mode:** put `countmail` in a login script to announce every
  user's mail count when they open a terminal.

## Scoring Mechanism

None. The output is the score.

## Easter Eggs

- The man page synopsis contains no options — the program has exactly
  one mode of operation.
- The final `HAHAHAHAHA!` is the same regardless of the actual count.

## Difficulty Modes

No difficulty modes. Future ports might add flags such as `--quiet`,
`--loud`, or `--mock N` to simulate a count.
