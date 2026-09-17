# `random` — Lineage

> Where `random` sits in the family tree of sampling utilities.

---

## Direct Siblings (BSDGames)

- `factor` — mathematical utility.
- `number` — text conversion utility.
- `caesar` / `rot13` — text transformations.

## Genre Ancestors

- UNIX `fortune` — random selection from a corpus (mentioned in the original SEE ALSO).
- Shell pipeline composition with `shuf`, `sort -R`, and `awk` sampling.

## Modern Descendants

- `shuf` (GNU coreutils) — shuffle and select lines.
- Reservoir-sampling libraries in Python, Rust, and Go.
- A/B testing and traffic-routing systems.
- Randomised log samplers and monitoring tools.

## Influence

`random` demonstrates how a one-pass probabilistic filter can solve real data-sampling problems with minimal code. Its design influenced later "lightweight sampler" tools.

## See Also

- [`about.md`](./about.md) — cultural context.
- [`references.md`](./references.md) — sources.
