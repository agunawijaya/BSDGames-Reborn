# Lessons from `countmail`

`countmail` is a compact lesson in shell scripting, number
manipulation, and the value of honest comments.

---

## 1. Use the Right Tool for the Job

The author wrote a pure-shell read loop, then commented it out with the
note that it is *"horrendously slow on every implementation I've
tried"*. The shipped version uses `from | wc -l` instead.

> **File:** `BSDGames-master/countmail/countmail:40-46`

```sh
# Count the messages in your mailbox, using only POSIX shell builtins.
#
# Caveats:
#
# The read loop is horrendously slow on every implementation I've
# tried.  I suggest using from(1) and wc(1) instead, though these are
# not shell builtins.
```

**Why it matters:** Performance and simplicity often beat purity. A
script that uses external tools where appropriate is more useful than a
slow pure-shell proof of concept.

## 2. Decompose Numbers by Pattern Matching

The script converts a number to words without arithmetic libraries,
using repeated `case` pattern matching on digit positions.

> **File:** `BSDGames-master/countmail/countmail:90-141`

```sh
case $v in
  *10) y=TEN ;;
  *11) y=ELEVEN ;;
  ...
esac
```

**Why it matters:** `case` in shell is a powerful pattern-matching
engine. Understanding it lets you write compact parsers and
transformers.

## 3. Handle Pluralisation Explicitly

The script special-cases `ONE` to produce *"ONE MAIL MESSAGE"* and
uses the plural `S` for everything else.

> **File:** `BSDGames-master/countmail/countmail:152-157`

```sh
p=S

case "$*" in
  "") set ZERO ;;
  ONE) p= ;;
esac
```

**Why it matters:** Natural-language output needs small grammatical
rules. Even a joke program benefits from attention to detail.

## 4. Set Clear Failure Bounds

If the count exceeds `SEPTILLION`, the script exits with a deliberate
error rather than producing incorrect output.

> **File:** `BSDGames-master/countmail/countmail:84-87`

```sh
*)
  echo "YOU HAVE TOO MUCH MAIL!" 1>&2
  exit 1
  ;;
```

**Why it matters:** Defining in-bounds behaviour keeps a program
predictable. The error message is also on-brand.

## See Also

- [`architecture.md`](./architecture.md) — full control-flow analysis.
- [`spec.md`](./spec.md) — formal behaviour.
- [`references.md`](./references.md) — sources.
