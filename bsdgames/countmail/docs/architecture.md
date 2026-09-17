# `countmail` — Architecture

`countmail` is a POSIX shell script with two distinct parts: measuring
the mailbox and converting the count to English words.

---

## Control Flow

```mermaid
flowchart TD
    A[Start countmail] --> B[Run `from | wc -l`]
    B --> C[Store count in v]
    C --> D{Too much mail?}
    D -->|> SEPTILLION| E[Print YOU HAVE TOO MUCH MAIL! exit 1]
    D -->|otherwise| F[Break v into 3-digit groups]
    F --> G{Each group}
    G -->|has value| H[Convert hundreds to word]
    G -->|has value| I[Convert tens/units to word]
    G -->|has value| J[Append scale: THOUSAND/MILLION/etc.]
    G -->|empty| K[Skip group]
    J --> L[Build final word list]
    L --> M{Plural?}
    M -->|ONE| N[Print ONE MAIL MESSAGE!]
    M -->|ZERO/other| O[Print N MAIL MESSAGES!]
    N --> P[Print HAHAHAHAHA!]
    O --> P
```

## Game Loop / Control Flow

There is no interactive loop. The script runs once and exits.

## AI Logic

None.

## Random-Event System

None.

## Difficulty Progression & Runtime Setup

Not applicable. The only "input" is the number of messages reported by
`from(1)`. The only runtime failure mode is a count greater than
`SEPTILLION`.

## Key Code Excerpts

### Counting mail (`countmail:51-52`)

```sh
set -- `from | wc -l`
v=$1
```

### Number scaling and hundreds/tens/units decomposition (`countmail:64-149`)

The script pads the count with leading zeros (`v=000$v`) and then
repeatedly strips the last three digits (`v=${v%%???}`). For each
triplet it builds:

- `z` — the hundreds word (`ONE HUNDRED`, `TWO HUNDRED`, ...).
- `y` — the tens-and-units word (`TWENTY`, `THIRTY-FOUR`, ...).
- `x` — the scale word (`THOUSAND`, `MILLION`, ...).

These are prepended to the result list with `set $z ${z:+HUNDRED} $y $x $*`.

### Pluralisation and final output (`countmail:152-163`)

```sh
p=S

case "$*" in
  "") set ZERO ;;
  ONE) p= ;;
esac

echo "$*!

$* MAIL MESSAGE$p!

HAHAHAHAHA!"
```

## Data Format

No external data file. The vocabulary (`ZERO`, `ONE`, ... `NINETY`,
`HUNDRED`, `THOUSAND`, ... `SEPTILLION`) is hard-coded in the script.

## See Also

- [`spec.md`](./spec.md) — formal behaviour.
- [`lessons.md`](./lessons.md) — teaching points.
- [`references.md`](./references.md) — sources.
