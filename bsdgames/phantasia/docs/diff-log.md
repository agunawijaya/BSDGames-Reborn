# `phantasia` — Original → Port Diff Log

> Feature-by-feature record. Fill as you port.

---

## Legend

- 🟩 **Kept** — Identical or mechanically faithful.
- 🟨 **Changed** — Same feature, modern implementation.
- 🟦 **Added** — New to the port.
- 🟥 **Removed** — Original had it, port does not.
- 🟪 **Reinterpreted** — Original concept redesigned.

---

## Feature Log

*(Empty until implementation phase begins.)*

| # | Feature | Status | Notes |
|--:|---|:---:|---|
| — | *(none yet)* | — | Port not started; documentation phase only. |

Notable pre-planned changes (from [`port-ideas.md`](./port-ideas.md)):

- 🟨 Password storage — plaintext → bcrypt hash.
- 🟨 Multi-user coordination — `flock()` file → server API.
- 🟨 Event queue — void file → real message queue.
- 🟨 Character DB — flat file → SQLite / Postgres.
- 🟦 Modern MMO features (guilds, cross-shard).
- 🟩 6 character types + 10 stats + spell system — preserved.
- 🟩 Cartesian world + visibility rules — preserved.
- 🟩 Age-based degeneration + sin — preserved.

---

## Narrative

*Once entries accumulate, add a running narrative describing the
port's evolution.*

---

## Cross-References

- [`spec.md`](./spec.md) — the mechanical contract.
- [`port-ideas.md`](./port-ideas.md) — planned changes.
- [`./decisions/`](./decisions/) — per-game ADRs.
