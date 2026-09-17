# How to Play `bcd`

> **Type a word, get a punched card.**

---

## Controls / Commands

`bcd` is a command-line utility.

```sh
bcd [string ...]
```

## Basic Usage

Print a single word:

```sh
$ bcd HELLO
```

Read from stdin:

```sh
$ echo "WORLD" | bcd
```

Print multiple arguments:

```sh
$ bcd THE QUICK BROWN FOX
```

## Input Rules

- Input is converted to uppercase.
- Lines are truncated to 48 characters.
- Newlines are stripped.
- Most control characters produce blank columns.

## How to "Win"

There is no win condition. The fun is in the retro visual output.

## Tips & Tricks

- **Use short words:** The card is only 48 columns wide, so short words look best.
- **Combine with `banner`:** `banner HELLO` for big letters, then `bcd HELLO` for the punch-card version.
- **Pipe a file:** `head -1 message.txt | bcd` turns the first line into a card.
- **Notice the hole pattern:** `]` marks punched holes; row numbers mark unpunched positions.

## Scoring Mechanism

None.

## Easter Eggs

- The source header tells the story of the `Q`/`R` bug fix.

## Difficulty Levels & Setup Configuration

There are no difficulty modes or flags. The program has no options.

## See Also

- [`spec.md`](./spec.md) — formal rules and invariants.
- [`architecture.md`](./architecture.md) — how the hole table works.
- [`test-scenarios.md`](./test-scenarios.md) — manual test scripts.
