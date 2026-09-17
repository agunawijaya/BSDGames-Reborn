# AGENTS.md — `trek` (BSDGames Reborn)

Context for AI agents and human contributors working on the port of
**`trek`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Simulation & Strategy
- **One-line description:** Star Trek starship combat simulation
  — command the Enterprise across an 8×8 galaxy of quadrants,
  killing Klingons, docking at starbases, managing 14 devices,
  before time or energy runs out.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/trek>

## 2. Port Status

- **Current status:** 🟠 In Progress (documentation phase)
- **Owner:** Agun Wijaya (with Claude Opus)
- **Baseline released?** no

## 3. Folder Contents

```
trek/
├── README.md         Landing page
├── AGENTS.md         This file
├── CLAUDE.md         Thin pointer
├── docs/             12 documentation files
│   └── decisions/    Per-game ADR overrides (may be empty)
├── src/              Implementation (awaiting language ADR)
├── data/             Star system names, tables (probably synthesized)
├── media/            5 screenshots + text captures
└── tests/            Automated tests
```

## 4. Design Decisions Specific to `trek`

None yet. All decisions defer to root defaults.

Likely future ADRs:

- **Command dispatch pattern.** Original uses a `cvntab` (conversion
  table) with prefix/suffix matching and function pointers. Modern
  equivalents: enum + match, hashmap of closures, command pattern.
- **Time-warp snapshot mechanism.** Original literally memcpy's the
  entire game state into a `char[]` buffer. Modern equivalents:
  proper serialization, immutable snapshots via structural sharing.
- **`setjmp`/`longjmp` for game-over recovery.** Modern languages
  use exceptions, Result types, or explicit control flow.
- **Whether "5 skill levels + 3 length levels" survives modernization
  or becomes something more flexible.**

## 5. Gotchas & Non-Obvious Notes

- **Command dispatch table** at `play.c:59-85` — 23 entries. Each is
  `{prefix, suffix, function_ptr, value}`. Prefix + suffix matching
  gives natural command completion.
- **Free vs charged moves.** `Move.free = 1` at start of each turn;
  some commands (like `srscan`, `status`) don't consume time and
  don't trigger Klingon attacks. Others do.
- **Event system** (`events.c`) — max 25 pending events; each has
  a stardate and a type (Klingon attacks starbase, distress call,
  supernova, etc.). Events fire in stardate order.
- **`setjmp(env)` in `main.c:240`** — allows any command (like
  `terminate`) to `longjmp` back to "Another game?" prompt.
- **Every command implemented in its own file.** 55 source files
  = 23 commands + supporting subsystems. Extreme separation of
  concerns for its era.
- **Skill affects damfac** (damage factor multiplier), Klingon
  power, event probabilities — see `setup.c`.
- **Length affects total time available** (`Param.time`) and
  number of Klingons.
- **RNG helpers** in `ranf.c`: `ranf(N)` for uniform int in
  `[0, N)`; `franf()` for uniform double in `[0, 1)`.
- **`cvntab` is used across the game** — for skills, lengths,
  commands, all use the same prefix-matching mechanism.
- **`setgid` privilege drop** (`main.c:176`) — same as other
  bsdgames.

## 6. Workflow

Follow the standard 14-step workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source not committed. Cite upstream only.
- Preserve Eric Allman's 1980 copyright + the extensive attribution
  chain in `main.c:60-121`.
- Eric Allman later became famous for `sendmail` — this is his
  early work; treat with respect.
