# AGENTS.md — `robots` (BSDGames Reborn)

This file provides context for AI agents and human contributors
working specifically on the port of **`robots`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Arcade & Action
- **One-line description:** Fight off villainous robots by tricking
  them into destroying each other. You have no weapons.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/robots>

## 2. Port Status

- **Current status:** 🟠 In Progress (documentation phase)
- **Owner:** Agun Wijaya (with Claude Opus assistance)
- **Baseline released?** no

## 3. Folder Contents

```
robots/
├── README.md         Landing page for this game
├── AGENTS.md         This file
├── CLAUDE.md         Thin pointer to this file
├── docs/             12 documentation files
│   ├── decisions/    Per-game ADR overrides (empty — game defers to root defaults)
│   └── ...
├── src/              Implementation (empty — awaiting language ADR)
├── data/             Game data (none needed — procedural)
├── media/            Screenshots / demos (empty)
└── tests/            Automated tests (empty)
```

## 4. Design Decisions Specific to `robots`

No per-game ADRs yet. All decisions defer to root defaults.

Likely future ADRs:

- Whether real-time mode (`-r`) or turn-based (default) becomes the primary port experience.
- Whether the auto-bot mode (`-A`) is retained, expanded, or removed.
- Level progression: infinite levels (original) vs. campaign structure.

## 5. Gotchas & Non-Obvious Notes

- **AI is trivial**: each robot moves `sign(dy), sign(dx)` toward the
  player. Zero lookahead, zero pathfinding. Robots don't avoid each
  other — that's the entire strategic exploit for the player.
- **Field size is fixed at 60×23** (see `robots.h:53-54`). The port
  should probably make this configurable.
- **Grid layout requires an 80×24 terminal minimum** (`main.c:154-160`).
- **Score storage** uses a `SCORE` struct (`robots.h:86-92`) with fixed
  `MAXNAME=16` and stores u_int32_t values.
- **The `w` (wait) command** carries a big risk/reward: 10% score
  bonus per robot that dies during your wait, but you can die
  yourself. See `add_score()` on `move_robs.c:132-138`.
- **Teleport is random** (`rnd_pos.c:49-62`) with a retry loop — will
  never place you on an occupied cell but no smart placement.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives locally — do **not** commit it to this
  repo.
- Preserve original BSD copyright/authorship as a comment where
  algorithms are transcribed.
- List sources in [`docs/references.md`](./docs/references.md).
