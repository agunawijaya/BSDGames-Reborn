# AGENTS.md — `sail` (BSDGames Reborn)

Context for AI agents and human contributors working on the port of
**`sail`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Board Games (multi-process naval combat)
- **One-line description:** Napoleonic-era wooden-ship combat
  simulator; based on Avalon Hill's *Wooden Ships and Iron Men*;
  multi-user via shared temp file with `link()`-based locking.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/sail>

## 2. Port Status

- **Current status:** 🟠 In Progress (documentation phase)
- **Owner:** Agun Wijaya (with Claude Opus)
- **Baseline released?** no

## 3. Folder Contents

```
sail/
├── README.md         Landing page
├── AGENTS.md         This file
├── CLAUDE.md         Thin pointer
├── docs/             12 documentation files
│   └── decisions/    Per-game ADR overrides (may be empty)
├── src/              Implementation (awaiting language ADR)
├── data/             Scenario data, ship specs
├── media/            3 screenshots + text captures
└── tests/            Automated tests
```

## 4. Design Decisions Specific to `sail`

None yet. Likely future ADRs:

- **Multi-process → multi-player.** Original uses OS processes
  + shared tempfile. Modernize to WebSocket server + clients?
- **Locking model.** Original uses `link()`-based advisory lock
  (from "pubcaves" by Jeff Cohen). Modern equivalent: proper
  distributed lock.
- **Tempfile → shared memory / DB.** Modern port needs to
  choose.
- **AI captain quality.** Original driver AI is simplistic;
  modernize?
- **32 scenarios preservation.** All historical? Add new? Both?

## 5. Gotchas & Non-Obvious Notes

- **Two programs in one.** Each player forks a "player process";
  the first player also forks a "driver process" that runs
  computer ships and does global bookkeeping.
- **`link()` lock is racy.** Man page even admits: *"When ucbmiro
  was rebooted after a crash, the file system check program
  found 3 links between the Sail temporary file and its link
  file."* Port must fix.
- **7-second poll cycle** in the player process → 7-21 seconds
  from command to visible result (worst case 3 poll cycles).
  Called "pipelining" — type ahead to survive.
- **Movement command grammar**: string of turns + forward moves
  (e.g. `l1r1r2` = left, 1 forward, right, 1 forward, right, 2
  forward).
- **8 directions** for ship facing (compass rose).
- **Sail modes**: Battle Sails (default) vs Full Sails
  (capital letter nationality). Full sails = 2x speed but 2x
  rigging damage.
- **Ship rendering**: 2 characters (bow letter + stern digit).
  Example: `b0` = British ship #0. `F1` = French ship #1 with
  full sails. `!0` = surrendered ship. `~0` = sinking. `#0` = on
  fire.
- **Captured ships** — nationality changes, ship number becomes
  `&`, `'`, `(`, `)`, `*`, or `+`.
- **4 shot types**: round (range 10), double (range 1, 2-turn
  reload), chain (range 3, rigging only), grape (range 1, crew).
- **Raking** — firing down the bow-to-stern axis; multiplies
  damage. **Stern rakes** hit harder than bow rakes.
- **Fouling** — colliding ships get tangled; requires unfoul
  action.
- **Grappling / Boarding** — send crew to fight on enemy ship.
- **Crew quality tiers**: Elite / Crack / Mundane / Green /
  Mutinous. Elite = +1 broadside hit.
- **5 ship classes**: First Rate (80-136 guns), Ship of the Line
  (74), Razee (40-64), Frigate (32-44), Corvette/Sloop/Brig
  (<20).
- **Windspeed 0-7**: becalmed → hurricane. Hurricane destroys
  all ships.
- **`-s` shows top ten sailors**. `-l` (with `-s`) shows login
  names.
- **Man page is exhaustive** — read it entire before making
  design decisions.

## 6. Workflow

Follow the standard 14-step workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source not committed. Cite upstream only.
- Preserve Dave Riggle's colorful comments in `sail.6`.
- Attribute the *"Wooden Ships and Iron Men"* concept to Avalon
  Hill's S. Craig Taylor in `about.md`.
