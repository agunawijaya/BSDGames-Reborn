# `caesar` — Reverse Specification

> Implementation-independent specification of the utility's behavior,
> extracted from the original C source. **Not from memory — from the
> code.**
>
> This document is the contract that `src/` and `tests/` must honour.

---

## Objective

Transform input text by a Caesar rotation, either:
- automatically determining the most likely rotation via English letter-frequency analysis, or
- applying a user-specified rotation.

## State Variables

| Variable | Type | Range | Initial | Persisted? |
|---|---|---|---|:---:|
| `stdf[26]` | `double` array | log-scaled frequencies | hard-coded English frequencies | no |
| `obs[26]` | `int` array | 0..N | all zero | no |
| `winner` | `int` | 0..25 | 0 | no |
| `winnerdot` | `double` | any | 0 | no |
| `inbuf` | `char *` | input chunk | `malloc(LINELENGTH)` | no |
| `rot` (explicit mode) | `int` | 0..∞ | from argv[1] | no |

## Actions / Commands

| Command | Args | Effect |
|---|---|---|
| `caesar` | none | Read stdin, auto-detect rotation, output decrypted text. |
| `caesar <rotation>` | integer | Read stdin, apply that rotation, output result. |

There are no interactive commands; the utility is stream-driven.

## Rules & Invariants

1. **Rotation math.** `ROTATE(ch, perm)` shifts letters by `perm` positions modulo 26. Non-letters pass through unchanged.
2. **Explicit rotation.** If `argc > 1`, the program calls `printit(argv[1])`, which applies `atoi()` to the argument and uses that rotation directly. Negative values are rejected.
3. **Auto-detection.** If no rotation is given, the program:
   a. Reads up to `LINELENGTH` bytes from stdin.
   b. Counts letter occurrences into `obs[26]` (case-insensitive).
   c. Preprocesses `stdf` with `log(freq) + log(26/100)`.
   d. For every possible rotation `try` in 0..25, computes a dot product `dot = Σ obs[i] * stdf[(i + try) % 26]`.
   e. Chooses the rotation with the highest dot product.
4. **Streaming.** If the input chunk is smaller than `LINELENGTH`, the program stops; otherwise it loops, reading more chunks.

## Difficulty Levels & Setup Configuration

N/A. This is a utility with no difficulty levels.

### Setup Options

| Argument | Range | Validation | Rejection |
|---|---|---|---|
| `rotation` | non-negative integer | `atoi(arg) < 0` check | `errx(1, "bad rotation value.")` |

### Session Replay Semantics

N/A. Each invocation is independent.

## RNG Usage

None. Auto-detection is deterministic given the same input and frequency table.

## Scoring

N/A.

## Termination Conditions

1. **Normal completion.** All input is read and transformed; program exits 0.
2. **Bad explicit rotation.** Negative rotation value exits with an error message.
3. **Read error.** Failure to read stdin exits via `err(1, "reading from stdin")`.
4. **Malloc failure.** Failure to allocate the input buffer exits via `err(1, NULL)`.

## Not in Scope

- Preserving exact `rot13` symlink behavior (the original also installs `rot13` as a symlink to `caesar`).
- Decrypting non-English text.
- Handling rotations larger than 25 in auto-detect mode.

See [`port-ideas.md`](./port-ideas.md) for modernisation decisions.

## Ambiguities in the Original

- **Short inputs.** Very short inputs may produce unreliable frequency analysis. The port preserves the same behavior.
- **Case preservation.** Rotation preserves the case of each letter (`A` stays uppercase, `a` stays lowercase).

## See Also

- [`architecture.md`](./architecture.md)
- [`test-scenarios.md`](./test-scenarios.md)
