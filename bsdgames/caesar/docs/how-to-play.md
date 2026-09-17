# How to Play `caesar`

> Usage guide for the `caesar` utility.

---

## Objective

Decode Caesar-rotated text, or encode/decode with a specific rotation.

## Starting the Utility

```
$ echo "Uryyb, Jbeyq!" | caesar 13
Hello, World!

$ echo "Khoor, Zruog!" | caesar
Hello, World!

$ fortune | caesar 13
```

*(Once the port exists, replace `caesar` with the port's command.)*

## Controls

There are no interactive controls. `caesar` is a stream filter:

| Invocation | Effect |
|---|---|
| `caesar` | Auto-detect rotation and decrypt stdin. |
| `caesar N` | Apply rotation N to stdin. |

## How to Win

N/A. Utility.

## Tips & Tricks

- **For ROT13**, pass `13` explicitly; it is faster and guaranteed correct.
- **For unknown rotations**, use auto-detect on at least a sentence of English.
- **For non-English text**, auto-detect will likely guess wrong.

## Scoring

N/A.

## Difficulty Levels & Game Setup Configuration

N/A.

### Setup Options

| Argument | Meaning |
|---|---|
| `N` | Fixed rotation to apply (must be non-negative). |

## Easter Eggs

- **ROT13 is its own inverse.** Running `caesar 13` twice returns the original text.
- **The `fortune` hint.** Many historical `fortune` databases were stored ROT13-encoded.

## Common Pitfalls

- Passing a negative rotation value produces an error.
- Very short input can fool the frequency analyzer.

## See Also

- [`spec.md`](./spec.md)
- [`architecture.md`](./architecture.md)
- [`about.md`](./about.md)
