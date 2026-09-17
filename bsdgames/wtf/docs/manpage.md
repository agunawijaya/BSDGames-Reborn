# `wtf` — Man Page Mirror

Original source: `BSDGames-master/wtf/wtf.6.in`.

---

## NAME

**wtf** — translates acronyms for you

## SYNOPSIS

```
wtf [-f dbfile] [-t type] [is] acronym ...
```

## DESCRIPTION

The `wtf` utility displays the expansion of the acronyms specified on
the command line. If an acronym is unknown, `wtf` checks whether the
word is known by the `whatis(1)` command.

If the word **is** is specified on the command line, it is ignored,
allowing the natural usage `wtf is WTF`.

## OPTIONS

| Option | Description |
|---|---|
| `-f dbfile` | Overrides the default acronym database, bypassing the `ACRONYMDB` variable. |
| `-t type` | Specifies the acronym's type. The program reads from `acronyms.type`. |

## ENVIRONMENT

| Variable | Description |
|---|---|
| `ACRONYMDB` | Default acronym database file. The file must contain lines of the form `acronym<TAB>meaning`. |

## FILES

| File | Description |
|---|---|
| `acronyms` | Default acronym database. |
| `acronyms.comp` | Computer-related acronym database. |

## SEE ALSO

`whatis(1)`

## HISTORY

`wtf` first appeared in NetBSD 1.5.

## Annotation

- The public-domain notice in the original source makes this one of the
  least legally encumbered programs in BSDGames.
- The `is` grammar is a deliberate UX affordance, not documented in the
  strict syntax but explained in the description.
