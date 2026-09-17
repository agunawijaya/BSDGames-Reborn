# `wtf` — Specification

A formal reverse-specification of the original `wtf` utility.

---

## Objective

Translate one or more acronyms supplied on the command line into their
plain-English expansions.

## State Variables

| Variable | Source | Meaning |
|---|---|---|
| `acronyms` | `-f` flag, `-t` flag, or `ACRONYMDB` env var | Path to the database file currently in use. |
| `target` | Command-line argument, upper-cased | Canonical form of the acronym being looked up. |
| `ans` | Database or `whatis(1)` | Resolved expansion, if any. |
| `rv` | Accumulated | Exit status: `0` if all lookups succeeded, `1` otherwise. |

## Actions & Commands

| Action | Syntax |
|---|---|
| Lookup | `wtf <acronym>` |
| Natural lookup | `wtf is <acronym>` |
| Custom database | `wtf -f <dbfile> <acronym>` |
| Typed database | `wtf -t <type> <acronym>` |
| Multiple lookups | `wtf <acronym1> <acronym2> ...` |

## Legal Rules & Invariants

1. The program exits with usage message if no acronym is supplied.
2. The word `is` is ignored when it appears as the first argument.
3. Input acronyms are converted to upper case before lookup.
4. The database must exist; otherwise the program exits with an error.
5. A database line must match `^ACRONYM[[:space:]]+expansion$`.
6. If the acronym is not found in the database, `whatis(1)` is tried.
7. Exit code is `0` only if every acronym resolved successfully.

## RNG Usage

None.

## Termination Conditions

- **Success:** All acronyms expanded → exit `0`.
- **Partial failure:** One or more acronyms unknown → exit `1`.
- **Usage error:** Missing arguments or bad flags → exit `1`.
- **Missing database:** Database file not found → exit `1`.

## Difficulty Levels & Setup Configuration

Not applicable. The only configuration is the choice of database file
via `-f`, `-t`, or `ACRONYMDB`.
