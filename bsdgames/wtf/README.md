# wtf

> **Acronyms, decoded.** Type `wtf is FUBAR` and get an answer.

**Category:** Cryptography / Text-Transform  
**Status:** 🟠 In Progress — documentation done, awaiting language ADR  
**Original author(s):** Public domain (NetBSD)  
**First released:** NetBSD 1.5 (1998)

---

## About This Folder

This folder is the modernised port of **`wtf`** from the original
BSDGames package. `wtf` is not a game in the traditional sense: it is a
command-line acronym expander that translates chat-room and technical
shorthand (`AFAIK`, `RTFM`, `FUBAR`) into plain English. It is a
self-contained learning artifact — code + history + design record +
technical breakdown.

## Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Authors, history, cultural notes, screenshots |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | Command-line usage and tips |
| [`docs/architecture.md`](./docs/architecture.md) | Shell-script analysis and data flow |
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
$ wtf AFAIK
AFAIK: as far as I know

$ wtf is RTFM
RTFM: read the fuckin' manual
```

## Media

See [`media/`](./media/) for screenshots.

## Attribution

Based on the original **`wtf`** from the BSDGames / NetBSD public-domain
collection. See [`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
