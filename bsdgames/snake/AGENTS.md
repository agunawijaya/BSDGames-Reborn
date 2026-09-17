# AGENTS.md — `snake` (BSDGames Reborn)

Context for AI agents and human contributors working on the port of
**`snake`**.

For repository-wide instructions, see the **root
[`AGENTS.md`](../../AGENTS.md)**. Read that file first.

---

## 1. What This Game Is

- **Category:** Arcade & Action
- **One-line description:** Grab money, dodge the pursuing snake,
  escape via the exit. **Not** the Nokia-style
  eat-food-to-grow-longer snake.
- **Upstream source:**
  <https://github.com/vattam/BSDGames/tree/master/snake>
  (contains subfolders `snake/` and `snscore/`)

## 2. Port Status

- **Current status:** 🟠 In Progress (documentation phase)
- **Owner:** Agun Wijaya
- **Baseline released?** no

## 3. Folder Contents

```
snake/
├── README.md         Landing page
├── AGENTS.md         This file
├── CLAUDE.md         Thin pointer
├── docs/             12 documentation files
├── src/              (empty — awaiting language ADR)
├── data/             (empty)
├── media/            (empty)
└── tests/            (empty)
```

## 4. Design Decisions Specific to `snake`

None yet.

Likely future ADRs:

- **Whether `snscore` is a separate binary or a subcommand of
  `snake`.** Original is separate; port could unify.
- **Scoring formula:** original scales with screen size; port
  should decide whether to keep that or use a normalised scoring
  system.
- **Snake speed:** the original is user-turn-driven (snake moves
  once per user command); a modern real-time variant is
  interesting but changes the game fundamentally.

## 5. Gotchas & Non-Obvious Notes

- **The snake is a 6-segment chain** (`snake.c:106` —
  `struct point snake[6]`). The head chases you; each successive
  segment follows the one in front.
- **The `chase()` function** is used for two things: (a) snake AI,
  (b) initial placement of segments 1..5 following segment 0.
- **`snrand()` returns via out-parameter** — random placement with
  collision-avoidance retry loop.
- **Money placement is retry-based:** `snake.c:418-426` — after
  collecting money, a new one is placed but retried if it would
  land on the exit, the top-left status area, or the player.
- **Scoring is dynamic:** `chunk = (675.0 / (i + 6)) + 2.5` where
  `i = min(width, height) + 2`. Formula tries to be fair across
  screen sizes.
- **Spacewarp costs 10%** of your loot as penalty — see
  `snake.c:84` and the `spacewarp()` function.
- **Last-digit bonus:** post-game, a random digit appears; if it
  matches your score's last digit, you get a bonus. Man page
  §pinball reference.

## 6. Workflow

Follow the porting workflow in
[`../../docs/porting-guide.md`](../../docs/porting-guide.md).

## 7. Attribution Reminder

- Original C source lives locally — do **not** commit it.
- Preserve BSD copyright header (1980, 1993 UC Regents).
