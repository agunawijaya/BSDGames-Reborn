# `pig` — Reverse Specification

> Implementation-independent specification of the utility's behavior,
> extracted from the original C source. **Not from memory — from the
> code.**
>
> This document is the contract that `src/` and `tests/` must honour.

---

## Objective

Translate input text from English into Pig Latin, preserving case and non-alphabetic characters.

## State Variables

| Variable | Type | Range | Initial | Persisted? |
|---|---|---|---|:---:|
| `buf[1024]` | `char` array | one word at a time | empty | no |
| `len` | `int` | 0..1023 | 0 | no |

## Actions / Commands

| Command | Args | Effect |
|---|---|---|
| `pig` | none | Read stdin, translate each word to Pig Latin, write to stdout. |

There are no flags or interactive commands.

## Rules & Invariants

1. **Word buffering.** Alphabetic characters are accumulated into `buf`. Non-alphabetic characters flush the current word and are printed verbatim.
2. **Word too long.** If a word reaches 1024 characters, the program exits with `errx(1, "ate too much!")`.
3. **Vowel-start rule.** If the first letter is a vowel (`aeiouAEIOU`), append `way` (or `WAY` if the word is all uppercase).
4. **Consonant-start rule.** Move leading consonants to the end of the word until a vowel (`aeiouyAEIOUY`) is found. Append `ay` (or `AY` if all uppercase).
5. **QU handling.** The unit `qu` / `Qu` / `QU` is treated as part of the leading consonant cluster and moved together.
6. **Case preservation.**
   - If the original word is all uppercase, the suffix is uppercase.
   - If the original first letter is uppercase, the new first letter is capitalised and the rest is lowercased.
   - Otherwise, case is mostly preserved as lowercased by the consonant-move logic.

## Difficulty Levels & Setup Configuration

N/A. Utility.

### Session Replay Semantics

N/A. Each invocation is independent.

## RNG Usage

None.

## Scoring

N/A.

## Termination Conditions

1. **Normal completion.** EOF reached; program exits 0.
2. **Word too long.** A word ≥ 1024 characters causes `errx(1, "ate too much!")`.

## Not in Scope

- Syllable-based Pig Latin rules.
- Punctuation attached to words (e.g., "hello!" becomes "ellohay!" because `!` flushes the word).
- Non-English text.

See [`port-ideas.md`](./port-ideas.md) for modernisation decisions.

## Ambiguities in the Original

- **Capitalisation of consonant-start words.** The code lowercases the original first letter, moves consonants, then capitalises the new first letter if the original first letter was uppercase. This means internal capitals are flattened.
- **Y as vowel.** `y` is treated as a vowel only for the consonant-start rule, not for the vowel-start rule.

## See Also

- [`architecture.md`](./architecture.md)
- [`test-scenarios.md`](./test-scenarios.md)
