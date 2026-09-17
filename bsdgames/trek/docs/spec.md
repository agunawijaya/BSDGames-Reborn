# `trek` — Reverse Specification

> Implementation-independent specification of `trek`'s mechanics,
> extracted from the original C source (`main.c`, `play.c`,
> `trek.h`, `setup.c`, `events.c`, and the 20+ command files).

This document is the contract that `src/` and `tests/` must
honour.

Upstream source (not redistributed):
<https://github.com/vattam/BSDGames/tree/master/trek>

---

## Objective

- **Win condition:** all Klingons in the galaxy destroyed
  (`Now.klings == 0`) while Enterprise is still alive and time
  remains.
- **Lose conditions** — 13 distinct codes (see §Termination
  Conditions):
  L_NOTIME, L_NOENGY, L_DSTRYD, L_NEGENB, L_SUICID, L_SNOVA,
  L_NOLIFE, L_NOHELP, L_TOOFAST, L_STAR, L_DSTRCT, L_CAPTURED,
  L_NOCREW.
- **Score:** computed by `score.c` on game end — Klingons killed,
  captives, deaths, penalties for callously killing stars /
  inhabited systems / lost starbases / help calls.

## State Variables

### Galaxy (`trek.h:55-99`)

| Variable | Type | Extent | Description |
|---|---|---|---|
| `Quad[NQUADS][NQUADS]` | struct quad[8][8] | Persistent | 64 quadrant records |
| `Sect[NSECTS][NSECTS]` | char[10][10] | Current quadrant only | Sector map (`.`, `E`, `K`, `#`, `*`, `@`, ` `) |
| `Systemname[NINHAB]` | const char*[32] | Read-only | 32 inhabited system names |
| `Event[MAXEVENTS]` | struct event[25] | Persistent | Scheduled event queue |

### Ship (`trek.h:215-238`)

`struct Ship_struct` fields:

| Field | Type | Description |
|---|---|---|
| `warp`, `warp2`, `warp3` | double | Warp factor and cached powers |
| `shldup` | char | Shield up flag |
| `cloaked` | char | Cloaking device on flag |
| `energy` | int | Current energy |
| `shield` | int | Energy in shields |
| `reserves` | double | Life support reserves |
| `crew` | int | Ship complement |
| `brigfree` | int | Space in brig for captives |
| `torped` | char | Torpedo count |
| `quadx`, `quady` | int | Quadrant position (0..7) |
| `sectx`, `secty` | int | Sector position (0..9) |
| `cond` | unsigned char | GREEN/DOCKED/YELLOW/RED |
| `sinsbad` | char | SINS calibration state |
| `shipname` | const char* | Enterprise / Queene / ... |
| `ship` | char | Glyph on sector map (E or Q) |
| `distressed` | int | Distress call count |

### Game (`trek.h:244-260`)

`struct Game_struct` fields (session-level, scored):

- `killk`, `deaths`, `negenbar`, `killb`, `kills`, `killinhab`
- `skill`, `length`, `killed`, `tourn`
- `passwd[15]` — 14-char password
- `snap`, `helps`, `captives`

### Move (`trek.h:263-273`)

Per-turn transient:

- `free` — this move consumed no time
- `endgame` — flag
- `shldchg`, `newquad`, `resting`
- `time` — actual time consumed this turn

### Param (`trek.h:275-308`)

The difficulty table. Set by `setup.c` from `{skill, length}`.
40+ fields covering:

- Federation resources, energy budgets
- Klingon power, hit factor, surrender probability, move
  probabilities
- Per-device damage probabilities and repair factors
- Event delay multipliers
- Navigation fuzziness (`navigcrud`)

### Now (`trek.h:312-323`)

Serializable snapshot state:

- `bases`, `klings`, `date`, `time`, `resource`
- `distressed`, `eventptr[NEVENTS]`, `base[MAXBASES]`

### Etc (`trek.h:327-337`)

Non-serializable per-quadrant state:

- `klingon[MAXKLQUAD]` — Klingons in this quadrant
- `nkling` — count
- `fast` — terminal speed flag
- `starbase` — starbase location in current quadrant
- `snapshot` — the time-warp buffer
- `statreport` — flag for status included in `srscan`

## Actions / Commands (from `play.c:59-85`)

23 commands, each with prefix + optional suffix:

| Prefix | Full | Function | Notes |
|---|---|---|---|
| `abandon` | | `abandon` | Escape via shuttle |
| `ca` | pture | `capture` | Klingon surrender |
| `cl` | oak | `shield(-1)` | Cloak up/down |
| `c` | omputer | `computer` | Onboard AI queries |
| `da` | mages | `dcrept` | Device damage report |
| `destruct` | | `destruct` | Self-destruct (password req.) |
| `do` | ck | `dock` | Dock at starbase |
| `help` | | `help` | Emergency starbase transporter |
| `i` | mpulse | `impulse` | Impulse engines |
| `l` | rscan | `lrscan` | Long-range scan |
| `m` | ove | `dowarp(0)` | Warp move |
| `p` | hasers | `phaser` | Phasers auto/manual |
| `ram` | | `dowarp(1)` | Deliberate ramming |
| `dump` | | `dumpgame` | Save to file |
| `r` | est | `rest` | Advance time |
| `sh` | ield | `shield(0)` | Shield up/down |
| `s` | rscan | `srscan(0)` | Short-range scan |
| `st` | atus | `srscan(-1)` | Status only |
| `terminate` | | `myreset` | End game |
| `t` | orpedo | `torped` | Fire torpedoes |
| `u` | ndock | `undock` | Undock |
| `v` | isual | `visual` | Optical scan |
| `w` | arp | `setwarp` | Set warp factor |

The `?` meta-command displays valid options.

## Rules & Invariants

1. **Time is discrete.** Each command may or may not advance time
   (`Move.time`).
2. **`Move.free == 1` at start of every turn.** Individual commands
   clear it if they consume time.
3. **`events(0)` fires after every command**, advancing stardate.
4. **`attack(0)` fires after `events()`** if `Move.free == 0`.
5. **Klingons attack only if move was not free.**
6. **Docked ship regenerates energy, torpedoes, and repairs
   devices at rate `Param.dockfac`.**
7. **Warp travel cost:** energy proportional to warp² × distance.
8. **Warp 10 is fatal** (`L_TOOFAST`).
9. **Above certain warp**, negative energy barrier hit → death
   (`L_NEGENB`).
10. **Adjacent Klingon must fire** if in sector.
11. **Cloaking device consumes energy per stardate** (`Param.cloakenergy`).
12. **Life support reserves deplete without dock/regen**;
    eventually kills you (`L_NOLIFE`).
13. **Supernovas destroy quadrants they occur in.** Enterprise in
    a supernova quadrant = `L_SNOVA`.

## RNG Usage

Seed: `srand(time(NULL))` in `main.c:183`.

Primitives (from `ranf.c`):

- `ranf(N)` — uniform int in `[0, N)`
- `franf()` — uniform double in `[0.0, 1.0)`

### RNG Sites

| Site | Distribution | Effect |
|---|---|---|
| `setup.c` — Klingon placement | Uniform over quadrants | Where Klingons live |
| `setup.c` — Starbase placement | Uniform over quadrants | Where bases live |
| `setup.c` — Star / inhabited placement | Uniform | Sector layout |
| `setup.c` — event scheduling | Poisson-like via `eventdly[]` | Base event schedule |
| `events.c` — event effects | Various | Per-event outcomes |
| `attack.c` — Klingon hit | `franf() vs hit_prob` | Whether hit |
| `damage.c` — device damage | Weighted by `damprob[NDEV]` | Which device damaged |
| `klmove.c` — Klingon movement | `moveprob[6]` per state | Whether Klingon moves |
| `help.c` — rematerialization | `franf() > dist_penalty` | Whether transporter works |
| `nova.c`, `snova.c` | Cascaded | Star explosion probabilities |
| `capture.c` — surrender | `Param.srndrprob` | Whether Klingon surrenders |
| `phaser.c` — hit resolution | Various | Damage dealt |
| `torped.c` — torpedo path | Slight randomization | Trajectory jitter |

## Difficulty Levels & Setup Configuration

### Length (`Game.length`)

3 values: `short`, `medium`, `long`. Selects:

- Total time budget (`Param.time`)
- Klingon count (`Param.klings`)
- Federation resource pool (`Param.resource`)
- Starbase count (`Param.bases`)

### Skill (`Game.skill`)

6 values: `novice`, `fair`, `good`, `expert`, `commodore`,
`impossible`. Selects the entire `Param` block:

- Klingon power (`klingpwr`)
- Klingon hit factor (`hitfac`)
- Klingon surrender probability (`srndrprob`)
- Klingon movement probabilities (`moveprob[6]`)
- Per-device damage probabilities (`damprob[NDEV]`)
- Event delay multipliers (`eventdly[NEVENTS]`)
- Repair time factors (`dockfac`)
- Cloak energy cost (`cloakenergy`)
- Energy low threshold (`energylow`)

### Setup Validation

- Length input matched against `cvntab` for length.
- Skill input matched against `cvntab` for skill.
- Password: 14 chars max, stored in `Game.passwd`.
- Setup fills all initial `Ship`, `Now`, `Etc`, `Param` values.
- Initial quadrant populated via `initquad()`.

### Session Replay

- **`dump <file>`** — writes a save file.
- **Startup menu**: `restart` option loads a saved game.
- Save format: raw `memcpy` of state structs. Version-fragile.
- **`-a` flag**: append log instead of truncating.

## Termination Conditions

The 13 loss codes (from `trek.h:352-365`):

| Code | Trigger | Message |
|---|---|---|
| `L_NOTIME` | `Now.time <= 0` | Ran out of time |
| `L_NOENGY` | `Ship.energy < shupengy + stopengy` | Ran out of energy |
| `L_DSTRYD` | Enterprise HP → 0 by Klingon | Destroyed by a Klingon |
| `L_NEGENB` | Warp too fast, hit negative energy barrier | Ran into the negative energy barrier |
| `L_SUICID` | In nova quadrant | Destroyed in a nova |
| `L_SNOVA` | In supernova quadrant | Destroyed in a supernova |
| `L_NOLIFE` | `Ship.reserves <= 0` | Life support died |
| `L_NOHELP` | Emergency transporter failure | Could not be rematerialized |
| `L_TOOFAST` | Warp 10 | Pretty stupid going at warp 10 |
| `L_STAR` | Ran into a star | Ran into a star |
| `L_DSTRCT` | `destruct` command | Self destructed |
| `L_CAPTURED` | Klingons capture you | Captured by Klingons |
| `L_NOCREW` | `Ship.crew <= 0` | Ran out of crew |

Victory: `Now.klings == 0` → `win()` → prints victory message,
computes score.

`terminate` command: `longjmp` to `main`'s `setjmp` — prompts
"Another game?"

## Scoring

Reference: `score.c`.

Score is a weighted sum:

- **Positive:** Klingons killed × skill multiplier, captives ×
  smaller multiplier, time remaining bonus (if won).
- **Negative:** deaths onboard, starbases lost, stars killed
  wastefully, inhabited systems killed (large penalty), help
  calls.
- **Multipliers:** skill and length.
- **Bonuses:** tournament flag (`Game.tourn`).

Score is not saved to a shared score file in the original (unlike
other bsdgames). Displayed at game end.

## Not in Scope for the Port

- **PDP-11 fixed-point workarounds** — modern machines have FP.
- **Non-separated I/D space** — irrelevant on modern systems.
- **Portable-C-library bug workarounds** — not needed.
- **`setgid` privilege drop** — port doesn't need setgid.
- **Terminal speed detection at < B1200** — irrelevant.
- **Raw `memcpy` save format** — replace with structured
  serialization.
- **`setjmp`/`longjmp`** — replace with proper error handling.

## Ambiguities in the Original

- **`shell` command in man page but not in `Comtab`.** Historical
  drift. Man page says it, code doesn't ship it. Port omits.
- **Exact skill-to-Param mapping** — read from `setup.c` code, no
  external table.
- **`srndrprob` scaling with `skill`** — implicit in `setup.c`
  values.
- **`cvntab` prefix matching order** — matters for `s` vs `sh`
  vs `st`. Table order determines longest-match behaviour.

## See Also

- [`architecture.md`](./architecture.md).
- [`test-scenarios.md`](./test-scenarios.md).
