# `sail` — Original → Port Diff Log

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

Notable pre-planned changes (from [`port-ideas.md`](./port-ideas.md)):

- 🟨 Locking: `link()` + tempfile → proper DB transactions.
- 🟨 Multi-process: `fork()` → server + client processes.
- 🟨 Communication: shared tempfile → WebSocket.
- 🟨 Poll cycle: 7 seconds → real-time or configurable.
- 🟩 32 canonical scenarios preserved.
- 🟩 4 shot types preserved.
- 🟩 5 crew quality tiers preserved.
- 🟩 Command grammar preserved.
- 🟦 AI captain personalities.
- 🟦 Custom scenario editor.

| # | Feature | Status | Notes |
|--:|---|:---:|---|
| — | *(none yet)* | — | Port not started. |

---

## Narrative

*Once entries accumulate, add a running narrative.*

---

## Cross-References

- [`spec.md`](./spec.md) — mechanical contract.
- [`port-ideas.md`](./port-ideas.md) — planned changes.
- [`./decisions/`](./decisions/) — per-game ADRs.
