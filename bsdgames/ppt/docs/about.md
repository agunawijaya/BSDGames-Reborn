# About `ppt`

> **Read text as a reel of punched paper tape.**

---

## What Is `ppt`?

`ppt` (paper tape) reads text and prints each byte as a vertical strip of holes, framed by `|` edges and separated by a feed hole in the middle. It can also run in reverse: with `-d`, it reads paper-tape output and reconstructs the original text. It is the companion to `bcd` and `morse` in BSD’s retro-format trio.

## Screenshots

*Screenshots captured via [`docs/scripts/capture-screenshots.sh`](../../../docs/scripts/capture-screenshots.sh).*

![Encode mode](../media/01-command.png)
*`ppt HI` showing each character as a paper-tape row.*

![Stdin encode](../media/02-example.png)
*Encoding text piped from standard input.*

![Decode mode](../media/03-decode.png)
*Running `ppt -d` to recover text from ppt output.*

## Authors & Publisher

- **Author(s):** Unknown (attributed to the Regents of the University of California).
- **Publisher / distributor:** University of California, Berkeley; later NetBSD.
- **Release year:** 1988 (shipped in 4.3BSD).
- **Language:** C.

## The Era

`ppt` appeared when paper tape was already fading but still remembered by programmers who had loaded software from reels of punched tape. Like `bcd`, it preserves the visual language of obsolete storage media in a few lines of C.

## Why It's Interesting

- **Bidirectional:** Encodes text to tape and decodes tape back to text.
- **Minimal code:** The encode/decode logic fits in about 50 lines.
- **Visual bit pattern:** Each row is literally the binary representation of a byte.
- **Shared heritage:** The man page is shared with `bcd` and `morse`.

## Difficulty & Progression

There is no difficulty or progression. The output is purely determined by the input bytes.

## Making-Of / Anecdotes

The decode routine `getppt()` scans for the feed hole `.` and reads the five bits to its left and three bits to its right, reconstructing the byte. The asymmetry reflects the physical layout of 8-bit paper tape.

## Cultural Impact

`ppt` is part of the retro-format family that inspired modern tools rendering data as floppy disks, cassette tapes, and other dead media. It is also a compact demonstration of binary I/O.

## Known Bugs (Historical)

- **No error recovery in decode:** `getppt()` returns `-1` for malformed rows and relies on sync logic in `main()`.
- **Feed-hole dependency:** Decode requires the `.` marker; losing it means losing sync.

## See Also

- [`how-to-play.md`](./how-to-play.md) — for actually using the tool.
- [`architecture.md`](./architecture.md) — for the code side.
- [`lineage.md`](./lineage.md) — for descendants.
- [`references.md`](./references.md) — for source citations.
