# Port Ideas for `primes`

> Modernisation brainstorm for the `primes` utility.

---

## Gameplay Modernisation

- **Prime-spotting mode:** Highlight twin primes, safe primes, or prime gaps.
- **Benchmark mode:** Time the sieve for different ranges and compare algorithms.
- **Prime-density heatmap:** Visualise how prime density decreases as numbers grow.

## UI/UX Design Ideas

- **Web demo:** A slider-controlled range with animated sieve and live count.
- **Terminal UI:** Progress bar and ETA for long ranges.
- **Mobile app:** Quick prime checker — type a number, get yes/no + nearest primes.

## Internet Multiplayer Design

Not applicable for a mathematical utility.

## Persistence / Cloud / Cross-Device

- **Saved searches:** Bookmark commonly used ranges.
- **Shared results:** Export a prime list as CSV or JSON.

## Other Modernisation Angles

- **Big-int support:** Extend beyond 32-bit limits.
- **Multi-threading:** Use parallel segmented sieves for large ranges.
- **API:** `GET /primes?start=2&stop=1000` returns JSON array.
- **Educational mode:** Step through the sieve window by window.

## What NOT to Change

- Do not remove the one-prime-per-line output format; scripts depend on it.
- Do not accept negative start/stop values.
- Keep the default stop at a sensible finite value if changing from 2^32-1.

## Open Questions

- Should the web demo animate the sieve or just show results?
- Should the port support 64-bit ranges by default?
- Is there value in a "prime gap record" mode?

## See Also

- [`architecture.md`](./architecture.md) — original code analysis.
- [`spec.md`](./spec.md) — current mechanics.
