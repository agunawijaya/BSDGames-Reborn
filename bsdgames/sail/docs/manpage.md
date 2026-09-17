# `sail(6)` — Original Man Page (Annotated)

> Mirror + annotation of `sail.6` from BSDGames.
>
> Upstream source:
> <https://github.com/vattam/BSDGames/blob/master/sail/sail.6>
>
> ⚠️ **This is an unusually long and colorful man page** — Dave
> Riggle wrote it as much as an essay on Napoleonic naval history
> as a technical reference. Read the original for the full
> narrative.

---

## NAME

**sail** — multi-user wooden ships and iron men

## SYNOPSIS

```
sail [-s [-l]] [-x] [-b] [num]
```

## DESCRIPTION

*Sail* is a computer version of Avalon Hill's game of fighting
sail originally developed by **S. Craig Taylor**.

Players of *Sail* take command of an old-fashioned Man of War and
fight other players or the computer. They may re-enact one of the
many historical sea battles recorded in the game, or they can
choose a fictional battle.

As a sea captain in the *Sail* Navy, the player has complete
control over the workings of his ship. He must order every
manoeuvre, change the set of his sails, and judge the right
moment to let loose the terrible destruction of his broadsides.

## OPTIONS

- **`-s`** — Print names and ships of top ten sailors.
- **`-l`** — Show login name (only effective with `-s`).
- **`-x`** — Play first available ship (skip prompt).
- **`-b`** — No bells.
- **`num`** — Start on scenario number.

## IMPLEMENTATION

*Sail* is really two programs in one. Each player starts up a
process which runs his own ship. In addition, a *driver* process
is forked (by the first player) to run the computer ships and take
care of global bookkeeping.

Because the driver must calculate moves for each ship it
controls, the more ships the computer is playing, the slower the
game will appear.

If a player joins a game in progress, he will synchronize with
the other players (a rather slow process for everyone), and then
he may play along with the rest.

### The Locking Mechanism

To implement a multi-user game in Version 7 UNIX, communicating
processes must use a common temporary file as a place to read
and write messages. In addition, a locking mechanism must be
provided to ensure exclusive access to the shared file.

*Sail* uses a temporary file named `/tmp/#sailsink.21` for
scenario 21 (and corresponding names for others). Exclusive
access uses a technique **stolen from an old game called
"pubcaves" by Jeff Cohen**. Processes busy-wait in:

```c
for (n = 0; link(sync_file, sync_lock) < 0 && n < 30; n++)
    sleep(2);
```

Since UNIX guarantees a link points to only one file, the process
that succeeds in linking has exclusive access.

*"Whether or not this really works is open to speculation. When
ucbmiro was rebooted after a crash, the file system check program
found 3 links between the Sail temporary file and its link file."*

## CONSEQUENCES OF SEPARATE PLAYER AND DRIVER PROCESSES

When players do something of global interest, such as moving or
firing, the driver must coordinate the action.

**Movement flow:**

1. Player types command.
2. Player process buffers it.
3. Every ~7 seconds, player process locks tempfile and writes
   buffer.
4. Driver reads pending commands and processes turn.
5. Driver writes updated state.
6. Player process reads new state on next poll.

Total end-to-end: **7-21 seconds** depending on cycle alignment.

*"There is room for 'pipelining' in the movement."* Type ahead
to keep the queue full.

*"If the player types several movement commands between two 7-
second updates, only the last movement command typed will be
seen by the driver."*

## THE HISTORY OF SAIL

*"I wrote the first version of Sail on a PDP-11/70 in the fall
of 1980. Needless to say, the code was horrendous, not portable
in any sense of the word, and didn't work."* — Dave Riggle

**1981 (working version).** Bugs concerning firing broadsides and
finding angles. Uses no floating point.

**Ed Wang (1981).** Rewrote angle() routine (*"still doesn't
work perfectly"*). Added ship-selection at start.

**Craig Leres ("Captain Happy") (portability).** Made *Sail*
portable *"for the first time. This was no easy task, by the
way. Constants like 2 and 10 were very frequent in the code."*

**"Riggle Memorial Structures"** — Dave's tendency to deeply-
nested struct references. Example:

```
specs[scene[flog.fgamenum].ship[flog.fshipnum].shipnum].pts
```

**Ed Wang (summer/fall 1983).** Fourth and most thorough
rewrite. Modularized code almost from scratch. Introduced many
new bugs but the final result was much cleaner. Added window
movement and find ship commands.

## HISTORICAL INFO

Old Square Riggers were very maneuverable ships. Only disadvantage:
inability to sail close to the wind. Guns bore left and right
sides only. Broadsides could reach up to range 10.

**Raking**: firing down the length of an enemy ship —
devastating. Stern rake more damaging than bow (bows are stronger,
sterns weaker).

**Carronades** — large short-range guns. American ships from
Revolution to War of 1812 were almost entirely carronade-armed.

**Period covered:** approximately 1770s until end of Napoleonic
France in 1815.

**Recommended reading:** Captain Frederick Marryat, C.S.
Forester, Alexander Kent.

**Ship classes:**

- **First Rates** — huge three-decked ships mounting 80-136 guns.
- **Ships of the Line** — 74 gun two-deckers. Most common.
- **Razees** — ships of the line with one deck sawed off. 40-64
  guns. Poor cross between frigate and line-of-battle.
- **Frigates** — "eyes of the fleet". 32-44 guns. Fast, versatile.
- **Corvettes/Sloops/Brigs** — smaller, under 20 guns.

## SAIL PARTICULARS

**Ship representation:** 2 characters — bow letter (nation) and
stern digit (number).

- First British = `b0`, second = `b1`.
- Fifth Spanish = `s4`.
- Frog (French) with full sails = `F0`.
- Surrendered = `!0`.
- Sinking = `~0`.
- On fire = `#0`.
- Captured: nation of captor; number becomes `&`, `'`, `(`, `)`,
  `*`, `+`.

Ultimate example: exploding British captured by American = `#&`.

## MOVEMENT

8 directions of facing (compass). Stern moves; bow stays
stationary during turn.

**Command grammar**: strings of forward moves and turns.

- `l3` = left, then 3 forward.
- `r1r1r2` = right, 1 forward, right, 1 forward, right, 2 forward.
- `d` = drift.

Turning into wind aborts movement:

```
move (7, 4): l1l4
Movement Error;
Helm: l1l
```

**Drift**: 2 turns without forward = drift; must move ahead
before major turn (marked with `'` in prompt).

## WINDSPEED AND DIRECTION

Vane on side of screen:

```
|
3
+
```

Number = speed 0-7. `+` to `-` = direction (wind blows `+` to
`-`).

Wind speeds: 0=becalmed, 1=light breeze, 2=moderate, 3=fresh,
4=strong, 5=gale, 6=full gale, **7=hurricane** (all ships
destroyed).

## GRAPPLING, FOULING, BOARDING

**Fouling**: colliding ships tangle; neither can move.

**Grappling**: throwing grapnels into enemy rigging.

**Boarding**: send crew across to fouled/grappled ship. Defensive
Boarding Parties fight 2x harder.

## CREW QUALITY

5 tiers:

- **Elite** — outshoots and outfights all others.
- **Crack** — next best.
- **Mundane** — average.
- **Green** — below average.
- **Mutinous** — worst.

Elite/Crack get +1 hit per broadside vs. Mundane. Historically:
Americans had best seamen; British had best training.

## BROADSIDES

4 shot types:

- **Round** (range 10) — general purpose.
- **Double** (range 1) — extra good; 2 turns to load.
- **Chain** (range 3) — rigging only.
- **Grape** (range 1) — crew slaughter.

**Ship status panel:**

```
Load  D! R!
Hull  9
Crew  4  4  2
Guns  4  4
Carr  2  2
Rigg  5 5 5 5
```

- **`!`** = initial broadside (loaded before battle, more
  effective).
- **`*`** = still loading.

## REPAIRS

Hull/Guns/Rigging repair at 2 points per 3 turns. *"Repairs
Completed"* when done.

## PECULIARITIES OF COMPUTER SHIPS

Computer ships follow all rules except: **computer ships never
repair damage**. (More peculiarities in the source but not
enumerated in the man page.)

---

## Historical Notes (Editor's Additions)

- **Dave Riggle's self-deprecating tone** is worth reading in
  full. Rare in technical documentation.
- **Ed Wang's angle() acknowledgment** shows how hard integer
  math for naval angles was.
- **The "Riggle Memorial Structures" joke** immortalizes a real
  code pattern.
- **`link()`-lock admission** — being honest about limitations is
  worth more than pretending they don't exist.
- **Captain Frederick Marryat, C.S. Forester, Alexander Kent** —
  reading list preserved in a Unix man page.
- **32 scenarios enumeration** would be worth preserving in port
  data files.

## See Also

- [`about.md`](./about.md).
- [`architecture.md`](./architecture.md).
- [`how-to-play.md`](./how-to-play.md).
- [`references.md`](./references.md).
