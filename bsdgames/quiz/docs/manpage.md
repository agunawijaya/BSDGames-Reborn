# `quiz` — Man Page Mirror

Original source: `BSDGames-master/quiz/quiz.6.in`.

---

## NAME

**quiz** — random knowledge tests

## SYNOPSIS

```
quiz [-t] [-i file] [question answer]
```

## DESCRIPTION

`quiz` tests your knowledge of random facts. It has a database of
subjects from which you can choose. With no arguments, `quiz`
displays the list of available subjects.

## OPTIONS

| Option | Description |
|---|---|
| `-t` | Tutorial mode: repeat missed questions and present new ones less frequently. |
| `-i file` | Use an alternative index file. |

## USAGE

Subjects are divided into categories. Pick any two categories from the
same subject and `quiz` will ask questions from the first category,
expecting answers from the second. For example:

```
quiz victim killer
quiz killer victim
```

If you get an answer wrong, you can try again. Enter a blank line to
see the correct answer.

## DATA FILE SYNTAX

Index and data files use colon-separated fields. Categories are tiny
regular expressions supporting `|` (alternation), `{}` (optional), and
`[]` (delimiters). Backslash escapes special characters or continues a
line.

## FILES

- `@quiz_dir@` — default index and data files.

## BUGS

`quiz` is pretty cynical about certain subjects.

## Annotation

- The `@quiz_dir@` placeholder is replaced at install time.
- A modern port should probably use standard regular expressions but
  preserve the simple data-file format.
