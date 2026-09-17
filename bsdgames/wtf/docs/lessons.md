# Lessons from `wtf`

`wtf` is a concise, teachable shell script. Beginners can read it in
one sitting and see several Unix ideas in action.

---

## 1. Let Unix Tools Do the Work

`wtf` does not implement string searching or case conversion by hand.
It chains `tr`, `fgrep`, and `sed`.

> **File:** `BSDGames-master/wtf/wtf.in:50-52`

```sh
target=`echo $1 | tr '[a-z]' '[A-Z]'`
ans=`fgrep $target < $acronyms 2>/dev/null \
     | sed -ne "\|^$target[[:space:]]|s|^$target[[:space:]]*||p"`
```

**Why it matters:** Each tool is optimised for one job. Composing small
tools is the core of the Unix philosophy and keeps scripts short and
readable.

## 2. Normalise Input Early

Before lookup, the acronym is forced to upper case. This makes the
database case-insensitive without storing multiple copies.

> **File:** `BSDGames-master/wtf/wtf.in:50`

```sh
target=`echo $1 | tr '[a-z]' '[A-Z]'`
```

**Why it matters:** Normalising data at the boundary (user input) means
the rest of the program can assume a single canonical form.

## 3. Graceful Degradation with a Fallback

When the acronym database fails, `wtf` asks `whatis(1)` whether the
word is a system command.

> **File:** `BSDGames-master/wtf/wtf.in:56-62`

```sh
ans=`whatis $1 2> /dev/null | egrep "^$1[, ]" 2> /dev/null`
if [ $? -eq 0 ] ; then
    echo "$1: $ans"
else
    echo "Gee...  I don't know what $1 means..." 1>&2
    rv=1
fi
```

**Why it matters:** A utility that says "I don't know" honestly is more
useful than one that silently fails. Returning a non-zero exit code
also lets scripts detect failure.

## 4. Make the CLI Forgiving

The word `is` is ignored so users can type naturally.

> **File:** `BSDGames-master/wtf/wtf.in:35-37`

```sh
if [ X"$1" = X"is" ] ; then
    shift
fi
```

**Why it matters:** Small affordances in command-line parsing make a
tool feel friendly without adding complexity.

## 5. Document Assumptions

The script assumes `getopt` is available and that the database path
placeholder `@wtf_acronymfile@` is replaced at install time. The
`ACRONYMDB` environment variable lets users override that assumption.

> **File:** `BSDGames-master/wtf/wtf.in:13`

```sh
acronyms=${ACRONYMDB:-@wtf_acronymfile@}
```

**Why it matters:** Hard-coded paths break when software is packaged or
moved. Environment-variable overrides keep the tool portable.

## See Also

- [`architecture.md`](./architecture.md) — full control-flow analysis.
- [`spec.md`](./spec.md) — formal behaviour.
- [`references.md`](./references.md) — sources.
