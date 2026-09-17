# About `random`

> **The original command-line slot machine: every line gets a chance.**

---

## What Is `random`?

`random` is a tiny BSD filter that reads lines from standard input and copies each line to standard output with probability `1/denominator`. It can also act as a random exit-code generator with the `-e` flag. It is the kind of small, composable tool that UNIX shells were built for.

## Screenshots

*Screenshots captured via [`docs/scripts/capture-screenshots.sh`](../../../docs/scripts/capture-screenshots.sh).*

![Default 50% sampling](../media/01-command.png)
*Running `random` with default denominator 2 on a small word list.*

![Custom denominator](../media/02-example.png)
*Using a larger denominator to select fewer lines.*

![Random exit code](../media/03-exit.png)
*The `-e` flag returning a random exit status.*

## Authors & Publisher

- **Author(s):** Guy Harris, Network Appliance Corp.
- **Publisher / distributor:** University of California, Berkeley; later NetBSD.
- **Release year:** 1994 (shipped in 4.4BSD-Lite).
- **Language:** C.

## The Era

`random` arrived in the mid-1990s, when shell scripting and pipeline composition were central to UNIX productivity. The program exemplifies the "do one thing well" philosophy: it does not sort, count, or format — it just probabilistically filters lines.

## Why It's Interesting

- **Surprisingly useful:** Sampling logs, picking raffle winners, fuzz-testing pipelines, or creating random subsets of data.
- **Two modes in one binary:** Line filter or random exit code, selected by a single flag.
- **RNG seeding:** Uses microsecond time plus process ID, making collisions unlikely.
- **Minimal dependencies:** Only standard C library and `gettimeofday`.

## Difficulty & Progression

There is no difficulty or progression. The behaviour is entirely governed by the denominator and the input stream.

## Making-Of / Anecdotes

The program's exit-code mode (`-e`) makes it easy to simulate flaky commands in shell scripts. A one-liner like `random -e 5 || echo "simulated failure"` became a quick way to test error-handling paths.

## Cultural Impact

`random` influenced later command-line sampling tools such as `shuf`, `sample`, and reservoir-sampling implementations. Its simplicity also makes it a classic teaching example for random filters and probability.

## Known Bugs (Historical)

- **No reservoir sampling:** `random` is a Bernoulli filter, not a "select exactly N lines" sampler. Users sometimes expect a fixed sample size.
- **Floating denominator:** The denominator is parsed as `double`, so values like `2.5` are accepted even though the probability formula is slightly unusual.
- **Zero denominator:** Rejected with `denominator is not valid.`

## See Also

- [`how-to-play.md`](./how-to-play.md) — for actually using the tool.
- [`architecture.md`](./architecture.md) — for the code side.
- [`lineage.md`](./lineage.md) — for descendants.
- [`references.md`](./references.md) — for source citations.
