# `morse` — Reverse Specification

> Implementation-independent specification of the utility's behavior,
> extracted from the original C source. **Not from memory — from the
> code.**
>
> This document is the contract that `src/` and `tests/` must honour.

---

## Objective

Encode text into International Morse code, or decode Morse code back into text.

## State Variables

| Variable | Type | Range | Initial | Persisted? |
|---|---|---|---|:---:|
| `sflag` | `int` | 0 or 1 | 0 | no |
| `dflag` | `int` | 0 or 1 | 0 | no |
| `alph[26]` | `const char *` array | Morse strings | hard-coded | no |
| `digit[10]` | `const char *` array | Morse strings | hard-coded | no |
| `other[]` | `struct punc` array | punctuation mappings | hard-coded | no |

## Actions / Commands

| Command | Args | Effect |
|---|---|---|
| `morse` | none | Read stdin and encode to Morse. |
| `morse <string> ...` | strings | Encode each argument string to Morse. |
| `morse -d` | none | Read Morse from stdin and decode to text. |
| `morse -d <string> ...` | strings | Decode each Morse argument to text. |
| `morse -s` | … | Print `dit`/`daw` instead of `.` / `-`. |

## Rules & Invariants

1. **Encoding (`morse()`).**
   - Letters A–Z/a–z map to `alph[]`.
   - Digits map to `digit[]`.
   - Whitespace outputs a word separator (blank line in default mode).
   - Supported punctuation maps via `other[]`.
   - Unsupported characters are silently ignored.
2. **Output format (`show()`).**
   - Default: prints each Morse symbol on its own line as ` .` / ` -` sequences.
   - With `-s`: prints ` dit` / ` daw` sequences.
   - After encoding stdin, the program emits the Morse prosign `...-.-` (SK) on its own line.
3. **Decoding (`decode()`).**
   - Reads tokens of `.` and `-`.
   - Compares against `digit[]`, `alph[]`, and `other[]`.
   - Outputs the matching character, or `x` for unknown tokens.
   - Double whitespace in decoded input produces a single space in output.
4. **Decoding overflow.** If a token reaches 10 characters without a separator, it is treated as gibberish: an `x` is printed and the remaining dots/dashes of that token are skipped.

## Difficulty Levels & Setup Configuration

N/A. Utility.

### Session Replay Semantics

N/A. Each invocation is independent.

## RNG Usage

None.

## Scoring

N/A.

## Termination Conditions

1. **Normal completion.** All input/arguments processed; program returns 0.
2. **Invalid flag.** Unknown option prints usage and exits 1.

## Not in Scope

- Non-International Morse variants (e.g., American Morse).
- Sound output.
- Prosigns other than SK.

See [`port-ideas.md`](./port-ideas.md) for modernisation decisions.

## Ambiguities in the Original

- **No man page in upstream BSDGames.** This spec is reconstructed from `morse.c`.
- **Decoding token separator.** The decoder uses any non-dot/dash character as a separator; double whitespace becomes a space.

## See Also

- [`architecture.md`](./architecture.md)
- [`test-scenarios.md`](./test-scenarios.md)
