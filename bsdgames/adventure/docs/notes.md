# `adventure` — Working Notes

> Developer and agent working scratchpad for the `adventure` porting project.

---

## 2026-09-16 — Pre-Port Analysis & Documentation Initialization

- **Historical Scope Verification:**
  Confirmed that the version in the upstream BSDGames package is Jim Gillogly's 1977/1993 C port of the canonical **Don Woods 350-point version**. It is *not* the earlier raw Crowther-only version (which had no fantasy treasures or scoring), nor is it the later 430-point or 550-point expanded editions (by David Long or Dave Platt). This is the pristine, historic 350-point standard.
- **The 351st Point Easter Egg:**
  Verified in `done.c:94-96`:
  ```c
  if (place[magzin] == 108)
      scor++;
  mxscor++;
  ```
  Room 108 is **Witt's End**. If the issue of *"Spelunker Today"* magazine is deposited there, `scor` increases by 1 and `mxscor` increases by 1, enabling the score to hit 351.
- **The Dual Mazes:**
  - *Maze All Alike:* Rooms 42 through 57. All 14 rooms print the identical description string. The only way to solve this in a faithful port is by dropping distinct inventory items to disambiguate identical rooms.
  - *Maze All Different:* Rooms 60 through 87. Each room has a unique grammatical permutation of the words "passages", "twisty", "little", "different".
- **Wizard Hours Lockout:**
  The 45-minute latency lock in `wizard.c` was designed for shared Unix PDP-11 systems in the late 1970s. For modern personal computers, we should provide an option or default to disable this waiting period (or re-interpret it as an optional "Work Hours / Hardcore" mode).
- **Documentation Milestone Completed:**
  Full 14-doc taxonomy generated, including full dual-walkthrough (A: Shortest Path, B: 350-Point Grandmaster) and comprehensive 5-sector Mermaid world map. Ready for Phase 3 planning.
