# `<GAME>` — Original → Port Diff Log

> Feature-by-feature record of what was kept, changed, added,
> removed, and *why*. Fill this **as you port**, not at the end.
>
> This is the *story of the port*. It is often the most-read doc.

---

## Legend

- 🟩 **Kept** — identical or near-identical to original.
- 🟨 **Changed** — same feature, different implementation or UX.
- 🟦 **Added** — new to the port.
- 🟥 **Removed** — original had it, port doesn't.
- 🟪 **Reinterpreted** — original concept, radically different
  execution.

---

## Feature Log

| # | Feature | Status | Notes |
|--:|---|:---:|---|
| 1 | [feature] | 🟩 | [why kept as-is] |
| 2 | [feature] | 🟨 | Was [X] → now [Y] because [reason] |
| 3 | [feature] | 🟦 | Not in original; added because [reason] |
| 4 | [feature] | 🟥 | Original had [X]; dropped because [reason] |
| 5 | [feature] | 🟪 | Original [X] reinterpreted as [Y] because [reason]. See [ADR](./decisions/NNN-...md). |

---

## Narrative

*Once several entries accumulate, add a running narrative here that
tells the story of the port. Prose. What did we learn? What did we
argue about? What surprised us?*

---

## Cross-References

- [`spec.md`](./spec.md) — the mechanical contract.
- [`port-ideas.md`](./port-ideas.md) — where changes were planned.
- [`./decisions/`](./decisions/) — where changes became ADRs.
