# Port Ideas for `random`

> Modernisation brainstorm for the `random` utility.

---

## Gameplay Modernisation

- **Reservoir sampling:** Add an option to select exactly `k` lines uniformly from a stream of unknown size.
- **Weighted sampling:** Accept line weights for non-uniform selection.
- **Random seed option:** Allow reproducible sampling with `--seed`.
- **Distribution presets:** Bernoulli, reservoir, shuffle, stratified.

## UI/UX Design Ideas

- **Web demo:** Paste a list and adjust a slider to see which lines survive.
- **Terminal UI:** Live preview with a progress bar and sample count.
- **API:** `POST /sample` with JSON body returns random subset.

## Internet Multiplayer Design

Not applicable.

## Persistence / Cloud / Cross-Device

- **Saved seeds:** Reproduce a random sample later by storing the seed.
- **Shared sampling configs:** Share a URL with a chosen denominator.

## Other Modernisation Angles

- **Performance:** Use SIMD or fast RNG for very high-throughput streams.
- **JSON mode:** Output selected lines as a JSON array.
- **Line numbering:** Preserve original line indices in output.
- **Accessibility:** Announce sample count and probability audibly.

## What NOT to Change

- Do not break the default Bernoulli behaviour; scripts depend on it.
- Do not change the default denominator from `2`.
- Keep the `-e` and `-r` flags working as originally documented.

## Open Questions

- Should reservoir sampling be a new flag or a separate program?
- Should the web demo target data scientists, educators, or casual users?
- Is there demand for cryptographically secure sampling?

## See Also

- [`architecture.md`](./architecture.md) — original code analysis.
- [`spec.md`](./spec.md) — current mechanics.
