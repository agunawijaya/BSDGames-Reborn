# Port Ideas for `factor`

> Modernisation brainstorm for the `factor` utility.

---

## Gameplay Modernisation

- **Factor tree visualisation:** Show the factorisation as a branching tree rather than a flat list.
- **Step-by-step mode:** Let the user press a key to advance through trial division, seeing each candidate prime and remainder.
- **Batch report:** Summarise multiple inputs with statistics (largest prime factor, total distinct primes, etc.).
- **Educational mode:** Highlight the Sieve of Eratosthenes and explain why `65537` is the table limit.

## UI/UX Design Ideas

- **Web demo:** A single-page app where users type a number and see animated factorisation.
- **Terminal UI:** Use a progress bar and colour-coded prime factors.
- **Mobile-friendly:** Large input, copy-to-clipboard result, history of recent factorisations.

## Internet Multiplayer Design

Not applicable for a mathematical utility.

## Persistence / Cloud / Cross-Device

- **Factor history:** Save recent inputs/results locally or to a cloud account.
- **Shared factorisation challenges:** Post a "factor this" puzzle and compare who finds the result first. (More of a social feature than true multiplayer.)

## Other Modernisation Angles

- **Big-int by default:** Use a modern big-integer library so arbitrarily large inputs work without an OpenSSL build flag.
- **Algorithm selection:** Automatically switch between trial division, Pollard rho, ECM, or GNFS based on input size.
- **Accessibility:** Screen-reader friendly output with semantic labels ("60 equals 2 squared times 3 times 5").
- **API:** Expose factorisation as a JSON endpoint or serverless function.

## What NOT to Change

- Do not turn `factor` into a timed quiz game — its identity is a calm, precise utility.
- Do not silently accept negative numbers; the historical rejection is part of its character.
- Do not bloat the binary with unnecessary dependencies; keep it installable everywhere.

## Open Questions

- Should the port support negative integers by factoring out `-1`?
- Should the web demo target students, programmers, or number-theory hobbyists?
- Is there value in preserving the OpenSSL / non-OpenSSL dual build, or should we always use a big-int library?

## See Also

- [`architecture.md`](./architecture.md) — original code analysis.
- [`spec.md`](./spec.md) — current mechanics.
