# countmail

> **Be obnoxious about how much mail you have.**

**Category:** Fun / Info  
**Status:** 🟠 In Progress — documentation done, awaiting language ADR  
**Original author(s):** Noah Friedman (1993); NetBSD version by Charles M. Hannum  
**First released:** NetBSD 1.3 (1998)

---

## About This Folder

This folder is the modernised port of **`countmail`** from the original
BSDGames package. `countmail` counts the messages in your mailbox and
announces the total in loud, all-caps English, ending with maniacal
laughter. It is a self-contained learning artifact — code + history +
design record + technical breakdown.

## Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Authors, history, screenshots, cultural notes |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | How to run it and what the output means |
| [`docs/architecture.md`](./docs/architecture.md) | Shell-script analysis and number-to-words algorithm |
| [`docs/lessons.md`](./docs/lessons.md) | Beginner-friendly lessons from the original code |
| [`docs/port-ideas.md`](./docs/port-ideas.md) | Modernisation brainstorm |
| [`docs/spec.md`](./docs/spec.md) | Reverse-specification of behaviour |
| [`docs/notes.md`](./docs/notes.md) | Working notes |
| [`docs/manpage.md`](./docs/manpage.md) | Mirror + annotation of the original `.6` man page |
| [`docs/diff-log.md`](./docs/diff-log.md) | Original → port feature log |
| [`docs/test-scenarios.md`](./docs/test-scenarios.md) | Manual test scripts |
| [`docs/lineage.md`](./docs/lineage.md) | Genre siblings and modern descendants |
| [`docs/references.md`](./docs/references.md) | Sources & citations |

## Running the Port

*(Add build/run instructions once implementation exists.)*

```
$ countmail
ONE!

ONE MAIL MESSAGE!

HAHAHAHAHA!
```

## Media

See [`media/`](./media/) for screenshots.

## Attribution

Based on the original **`countmail`** by Noah Friedman and Charles M.
Hannum as shipped in BSDGames. See
[`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
