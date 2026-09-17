# `canfield` — Lessons Learned

> What's worth adopting, what's dated, and what's uniquely
> `canfield`'s idea.

---

## What `canfield` gets right

### 1. The betting economy IS the game

Solitaire without stakes is a time-killer. Solitaire where every
second costs money, every hint costs money, and every card on
foundation pays money is a **decision game**. Kirk McKusick's
betting layer is what makes `canfield(6)` more interesting than
any generic solitaire clone.

**Takeaway:** A pricing layer can turn a chance-heavy game into a
skill game.

### 2. Two-binary architecture

`canfield` plays; `cfscores` reports. Small, focused tools that
share a data file. Perfect Unix ethos.

**Takeaway:** Don't cram sidecar functionality into the main
binary. Especially: reports, statistics, admin.

### 3. Persistent per-user bankroll

Your account balance survives across sessions. It's a soft
progression system in a solitaire game — an early example of
what we'd call **meta-progression** today.

**Takeaway:** State that persists across sessions makes a
one-off game feel like a campaign.

### 4. Charging for hints

Card counting is a real skill in solitaire. The game exposes it —
`c` toggles the counting display — but charges $1 per revealed
card. The player must decide: pay for information, or estimate?

**Takeaway:** Turning meta-tools (help, hints, undo) into paid
resources creates real trade-offs.

### 5. Thinking-time meter

$1 per minute, capped at $3 per move. Encourages decisive play
without punishing thoughtfulness. The cap is elegant.

**Takeaway:** Uncapped charges lead to griefing (or paralysis);
capped charges create pressure without punishment.

### 6. Instructions-first prompt

The game asks *"Do you want instructions?"* before dealing. A
kind default for newcomers, painless for veterans.

**Takeaway:** In-game tutorials should be opt-in, not on-by-
default.

### 7. Auto-placing base card

The first playable foundation card is placed automatically. No
need to type "sf" for the initial move. Small but delightful.

**Takeaway:** Save the player from mechanical no-choice actions.

## What is dated

### 1. Setgid score file

The traditional BSD deployment gives `canfield` setgid `games`
group so it can update `/var/games/canfield.scores`. This is:

- A minor privilege escalation surface.
- Not portable to non-BSD Unix.
- Broken on modern package managers that don't want setgid
  binaries.
- Meaningless on personal laptops where there's one user.

**Modern replacement:** Per-user files at
`$XDG_STATE_HOME/canfield/scores.json`.

### 2. Fixed-offset binary score file

The score file is a `struct betinfo` per UID, indexed by UID as
byte offset. Not portable across architectures; sensitive to
struct layout changes; unreadable except via `cfscores`.

**Modern replacement:** JSON, SQLite, or Redis (if
multi-machine).

### 3. Hardcoded curses coordinates

Every screen element has a `#define` for its row and column. The
game does not adapt to terminal size larger than 80×24. Resize
during play → probably crashes or draws garbled cards.

**Modern replacement:** Compute positions from `getmaxyx()` at
runtime. Handle `SIGWINCH`.

### 4. `time()` clock for thinking meter

Reads wall-clock seconds every move. Sensitive to:

- System suspend/resume.
- NTP adjustments.
- Time-zone changes.
- Clock jitter.

**Modern replacement:** `clock_gettime(CLOCK_MONOTONIC, ...)`.

### 5. `#define bool char`

Predates C99 `_Bool`. Everywhere in the codebase.

**Modern replacement:** language native.

### 6. Globals for everything

All state is global. Testing is essentially impossible without
running the actual binary and doing tmux capture. There is no
unit-testable rules engine.

**Modern replacement:** Encapsulate into a `GameState` and drive
it with commands. UI is a separate concern.

### 7. Curses-only I/O

The rendering is baked into the rules layer. To make a web or
GUI version, you'd rewrite half the code.

**Modern replacement:** MVC. Rules engine returns events; UI
displays them.

## Non-obvious details worth preserving

### The `paid` flag on each card

Every `cardtype` has a `paid: bool` field. When card counting is
toggled on, the game charges $1 for each card that has NOT been
`paid` before. This means:

- Toggle on → charged for all newly-revealed cards.
- Toggle off → nothing.
- Toggle on again → NOT re-charged for previously-paid cards.

Simple and player-friendly. Preserve this contract.

### Base rank ≠ Ace

Klondike always starts foundations at Ace. Canfield starts them at
**whatever the first placed card is** — the base rank. Then all
four foundations must start there. And they wrap around: after
King comes Ace, then 2, etc.

This is what distinguishes Canfield from Klondike. Preserve
faithfully.

### `stockcnt` = 13

The stock (reserve) starts with 13 cards in Canfield. Traditional
Klondike doesn't have a reserve. Also faithful to the original
Richard Canfield casino rules.

### Auto-move base foundation

When a foundation base card becomes available, it is placed on
foundation automatically without the player typing "sf". Cleanly
avoids busywork.

### `Cflag` naming

Boolean uppercase-C prefix suggests curses ownership; kind of
inconsistent, but no big deal. In a port, `card_counting_on`
would be clearer.

## Comparison with other BSDGames of the era

- **`cribbage`** (BSD): another card game — AI opponent, curses
  board rendering, similar era.
- **`fish`** (BSD): Go Fish. Trivially simple AI, no betting.
- **`monop`** (BSD, Ken Arnold): board game with save/restore
  and a save file that isn't a score file — different persistence
  model.

`canfield` is the **only BSDGame with a persistent user-owned
bankroll**. `cribbage` and others have per-session scoring only.

## For the porter's TODO list

1. **Delete setgid + shared score file.** Use per-user files.
2. **Delete hardcoded curses positions.** Compute at runtime.
3. **Delete `time()` for thinking meter.** Use monotonic clock.
4. **Delete `#define bool char`.** Language native.
5. **Extract rules from rendering.** MVC.
6. **Preserve the economics.** They ARE the game.
7. **Preserve `cfscores` as a companion tool.** Two-binary.
8. **Add a JSON score export** for `cfscores` output.
9. **Add optional `--no-money` mode** for players who just want
   the solitaire.
10. **Add a proper `SIGWINCH` handler.**

## References

- Richard Canfield's casino history:
  <https://en.wikipedia.org/wiki/Richard_A._Canfield>.
- Klondike vs. Canfield distinction:
  <https://en.wikipedia.org/wiki/Canfield_(solitaire)>.
- BSD `bsdgames` package trivia:
  <https://packages.debian.org/bookworm/bsdgames>.

## See also

- Concrete port suggestions: [`port-ideas.md`](./port-ideas.md).
- Working notes: [`notes.md`](./notes.md).
