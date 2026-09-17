# How to Play `pig`

> Usage guide for the `pig` utility.

---

## Objective

Translate English text into Pig Latin.

## Starting the Utility

```
$ echo "Hello world" | pig
elloHay orldway

$ cat report.txt | pig > report-pig.txt
```

## Controls

No controls or flags. Pipe text in, read Pig Latin out.

## How to Win

N/A. Utility.

## Tips & Tricks

- **Works on files.** Any text file can be piped through it.
- **Preserves punctuation.** Commas, periods, and spaces stay in place.
- **Try it on source code.** Variable names become temporarily unreadable.

## Scoring

N/A.

## Difficulty Levels & Game Setup Configuration

N/A.

## Easter Eggs

- **The man page is written in Pig Latin.**

## Common Pitfalls

- Very long "words" (>1024 chars) cause the program to exit with "ate too much!".

## See Also

- [`spec.md`](./spec.md)
- [`architecture.md`](./architecture.md)
- [`about.md`](./about.md)
