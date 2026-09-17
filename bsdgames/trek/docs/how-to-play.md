# How to Play `trek`

> Command the Enterprise. 23 commands. 14 devices. 8×8 galaxy.
> One captain (you). No pressure.

---

## Objective

Destroy all Klingons in the galaxy within the allotted time. If
Klingons reach zero → you win. If time or energy runs out → you
lose. If you take too many risks → you also lose (many ways).

## Starting the Game

```
$ trek [-a] [-f | -s] [logfile]
```

Flags:

- `-a` — append log to file instead of truncating
- `-f` — force fast mode (assume speed > 1200 baud)
- `-s` — force slow mode
- `logfile` — record the game to a log file

### Setup Prompts

On startup you'll be asked:

1. **Length:** `short`, `medium`, or `long` (or `restart` to
   load a saved game).
2. **Skill:** `novice`, `fair`, `good`, `expert`, `commodore`, or
   `impossible`.
3. **Password:** any word; used to verify the player when
   restarting.

The game responds with:

- Number of Klingons to kill.
- Starbase coordinates (list).
- Energy per Klingon kill.
- Initial position.

You are now at the `Command:` prompt.

## Reading the Short-Range Scanner

The `srscan` command shows the 10×10 sector map of your current
quadrant plus a status panel:

| Glyph | Meaning |
|:---:|---|
| `E` | Enterprise (you) |
| `Q` | Queene (alternate starship name) |
| `K` | Klingon warship |
| `#` | Starbase |
| `*` | Star |
| `@` | Inhabited planet |
| ` ` | Black hole |
| `.` | Empty space |

Status panel columns:

- **stardate** — current in-game time
- **condition** — GREEN / YELLOW / RED / DOCKED
- **position** — `qx,qy/sx,sy` (quadrant / sector)
- **warp factor** — speed setting
- **total energy** — energy budget
- **torpedoes** — torpedo count
- **shields** — up/down + charge %
- **Klingons left** — galaxy-wide
- **time left** — stardates remaining
- **life support** — active or depleted

## The 23 Commands

### Movement

- **`warp <factor>`** — Set warp factor (0.1 – 10). Above 6 is
  risky; warp 10 has known dangers (see below).
- **`move <course> <distance>`** — Move using warp engines.
  Course is 1.0 – 9.0 (compass rose; 1 = north). Distance in
  quadrant units.
- **`impulse <course> <distance>`** — Impulse engines. Slower,
  uses less energy.
- **`ram <course> <distance>`** — Deliberate ramming attack.
  Suicidal but sometimes strategic.

### Combat

- **`phasers automatic <total>`** — Fire phasers auto-distributed
  across Klingons in this quadrant.
- **`phasers manual <amt1> <course1> <spread1> ...`** — Fire
  phasers with per-bank targeting. Up to 6 banks.
- **`torpedo <course> [yes/no] [angle]`** — Fire photon torpedo.
  Optionally provide angle for spread; `no` to abort.

### Defence

- **`shields up`** / **`shields down`** — Raise/lower shields.
  Down = no protection but no energy drain.
- **`cloak up`** / **`cloak down`** — Cloaking device on/off.
  Consumes energy per stardate.

### Docking & Repair

- **`dock`** — Dock at adjacent starbase. Regenerates energy,
  torpedoes, and repairs devices (fast).
- **`undock`** — Undock and depart.

### Information

- **`srscan`** or just **`s`** — Short-range scan (current
  quadrant).
- **`srscan yes`** — Toggle continuous mode.
- **`lrscan`** or **`l`** — Long-range scan (3×3 grid of
  surrounding quadrants).
- **`status`** — Just the right-hand status panel (no map).
- **`damages`** or **`da`** — Report on device damage and repair
  times.
- **`computer <request>`** — Ask onboard computer. Multiple
  subcommands (course to target, time to arrive, etc.).
- **`visual <course>`** — Optical scan in a given direction.

### Emergency

- **`abandon`** — Abandon ship. Instant loss but at least
  cinematic.
- **`destruct`** — Self-destruct. Requires password. Takes any
  adjacent Klingons with you.
- **`rest <time>`** — Advance time without moving. Events still
  fire; Klingons may attack.
- **`help`** — Call starbase for emergency transporter. 3
  attempts. If starbase is surrounded, you die. Costs a "helps"
  point toward final score.
- **`capture`** — Attempt to capture a Klingon (they surrender
  under specific conditions). Adds them to your brig (if space).

### Meta

- **`terminate`** — End current game, return to "Another game?"
  prompt.
- **`dump`** — Save game state to file.

## The `?` Completion Trick

Type `?` at any prompt to get valid options. The game will tell
you what it expects — for command names, coordinates, subcommands,
whatever.

## How to Win

1. **Do a `lrscan` first thing.** Find quadrants with Klingons.
2. **Warp toward Klingons.** Warp 5 is safe. Warp 8+ risky.
3. **When you enter their quadrant**, expect immediate fire.
4. **Raise shields before engaging** (they're up by default at
   start).
5. **Phasers first**, torpedoes for finishers. Phasers regenerate
   at starbase; torpedoes are precious.
6. **After combat, `damages`** to see what broke. If critical,
   head to nearest starbase to dock.
7. **`dock` restores everything.** But it uses time.
8. **Repeat.** Find quadrants, engage, dock, hunt, engage, dock.
9. **Don't waste time.** The clock is your worst enemy.
10. **Manage energy.** Below `energylow` = YELLOW condition.
    Empty = death.

## Tips & Tricks

- **`computer` is your friend.** It'll tell you course/time to a
  target, energy budgets, etc.
- **Cloaking has an energy cost per stardate.** Not free.
- **Shields at 100% up cost energy** to maintain during hits.
  Down = you die if hit.
- **Multiple Klingons in one quadrant** is a killing floor. Warp
  in with shields up, phasers ready, torpedo aim locked.
- **`capture` gives you brig space** and a score bonus. Doesn't
  work on high-power Klingons.
- **`help` costs score.** Only use in genuine emergencies.
- **Warp 10 is stupid.** The game has a `L_TOOFAST` loss code.
  Don't do it.
- **The negative energy barrier surrounds the galaxy.** Hit it →
  you die.

## Scoring

Score is computed by `score.c` from:

- Klingons killed (`Game.killk`).
- Klingon crew captured (`Game.captives`).
- Deaths onboard Enterprise (penalty).
- Starbases destroyed by Klingons on your watch (penalty).
- Stars killed unnecessarily (penalty).
- Inhabited systems killed (large penalty).
- Times you called for help (penalty).
- Time remaining bonus (if you win early).
- Skill level multiplier.
- Length multiplier.

## Difficulty Modes

Length and skill are the two knobs.

**Recommended progression:**

1. `short` × `novice` — learn the commands. Should take 30 min.
2. `short` × `fair` — real challenge.
3. `medium` × `good` — sitting at the captain's chair.
4. `long` × `expert` — you're commodore material.
5. `long` × `commodore` — respected.
6. `long` × `impossible` — trolling yourself. Almost unwinnable.

## Easter Eggs

- **Uhura's dialogue** — she talks. `"Uhura: But Captain, we're
  already docked"` from `help.c:81`.
- **`destruct` requires the password** — no accidental
  self-destructs.
- **`capture` command name** — legendary contribution from Nick
  Whyte per source comments.
- **`L_TOOFAST` = pretty stupid going at warp 10** — Eric's dry
  loss code enum.

## Common Pitfalls

- **Setting warp too high** without knowing the risks.
- **Forgetting to raise shields** in a new quadrant.
- **Not docking often enough** — device damage accumulates.
- **Using `help` casually** — the score hit is real.
- **Ignoring inhabited systems** — Klingons enslave them for
  Federation resources.

## See Also

- [`spec.md`](./spec.md) — full formal contract.
- [`architecture.md`](./architecture.md) — how it works under the
  hood.
