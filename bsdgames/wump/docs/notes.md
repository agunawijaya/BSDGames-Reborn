# `wump` — Working Notes

> Free-form developer and agent working scratchpad for the `wump` porting effort.

---

## 2026-09-16 — Pre-Port Analysis & Documentation Initialization

- **Discrepancy in Room Counts:**
  Noticed that `wump.6` manpage describes a 25-room cave by default, while `wump.c` defines `ROOMS_IN_CAVE` as 20. When implementing, we should preserve the 20-room default for code fidelity, but make the room count fully configurable via CLI argument `-r`.
- **Mathematical Integrity of Coprime Cycle:**
  Verified Dave Taylor's $\gcd$ loop in `wump.c:558-567`:
  ```c
  do {
      delta = (random() % (room_num - 1)) + 1;
  } while (gcd(room_num, delta + 1) != 1);
  ```
  Because $\gcd(R, \delta + 1) = 1$, the stride $\delta + 1$ generates the entire additive cyclic group $\mathbb{Z}_R$. This mathematically guarantees that no rooms are orphaned or disconnected.
- **Directional Links (Asymmetry):**
  Lines 579–591 in `wump.c` only attempt to link backwards $50\%$ of the time (`if (random() % 2 == 1) continue;`). This means the graph is formally a **directed graph (digraph)**, not an undirected graph. In a TUI auto-mapper, we should visually indicate one-way corridors with directional arrows (`──▶` or `◀──`).
- **Bowstring Breakage Probabilities:**
  Shooting 3 hops away triggers a $2/10$ ($20\%$) bowstring snap check (`chance = random() % 10; if (roomcnt == 3 && chance < 2)`).
  Shooting 4 hops triggers a $6/10$ ($60\%$) waver check.
  Shooting 5 hops wavers automatically with no roll.
  This mechanic heavily disincentivizes blind long-range arrow spamming.
- **Pit Survival Check:**
  Walking into a pit is not an immediate 100% death in BSD C: `if (random() % 12 < 2)` triggers `pit_survive()`. It is $2/12 \approx 16.67\%$. A nice flavor moment for explorers clinging to rock outcrops.
- **Documentation Milestone Completed:**
  Full 14+ documentation taxonomy established for `wump`, including deductive `walkthrough.md` and dual-topology `world-map.md`. Ready for platform/language alignment before Phase 3 implementation.
