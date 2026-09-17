# How to Play `morse`

> Usage guide for the `morse` utility.

---

## Objective

Encode text to Morse code or decode Morse code to text.

## Starting the Utility

```
$ echo "SOS" | morse
...
---
...
...-.-

$ echo "... --- ..." | morse -d
SOS

$ echo "SOS" | morse -s
dit dit dit
daw daw daw
dit dit dit
```

## Controls

| Invocation | Effect |
|---|---|
| `morse` | Encode stdin to Morse. |
| `morse -d` | Decode Morse from stdin. |
| `morse -s` | Use spoken `dit`/`daw` output. |
| `morse [string ...]` | Encode command-line arguments. |

## How to Win

N/A. Utility.

## Tips & Tricks

- **Separate words with spaces** when decoding.
- **Use `-s`** to practice the spoken rhythm.
- **The trailing `...-.-`** is the SK prosign, not part of your message.

## Scoring

N/A.

## Difficulty Levels & Game Setup Configuration

N/A.

## Easter Eggs

- **SK prosign.** Every encoded message ends with the "end of contact" signal.

## Common Pitfalls

- Decoding requires exact dot/dash/space input.
- Unknown symbols decode to `x`.

## See Also

- [`spec.md`](./spec.md)
- [`architecture.md`](./architecture.md)
- [`about.md`](./about.md)
