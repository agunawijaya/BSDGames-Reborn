# `tetris` — Lessons from the Original Code

> **A textbook.** For each interesting technique in the original C
> source, a short lesson entry. Beginners should be able to pull up
> this file *and the original source* and learn.
>
> Upstream tree: <https://github.com/vattam/BSDGames/tree/master/tetris>

---

## Suggested Reading Order

1. **Lesson 1 — Sentinel boundaries** — the easiest concept; shows how a tiny data-layout choice removes branches everywhere else.
2. **Lesson 2 — Rotation as a lookup table** — builds on the shape representation; a classic "precompute instead of recompute" example.
3. **Lesson 3 — Frame differencing for terminal rendering** — introduces the screen module and era-specific rendering tricks.
4. **Lesson 4 — Timeout carry-over for fair real-time input** — shows how to keep a timer fair even when the player is mashing keys.
5. **Lesson 5 — Setgid privilege dance** — security and Unix history; more advanced but important for shared high-score files.

---

## Lesson 1 — Sentinel Boundaries

**File:** `tetris.c:88-97`  
**Function:** `setup_board()`

**What it teaches:** How embedding a wall around your playfield lets you delete bounds checks from the hot path.

**The excerpt:**

```c
void
setup_board(void)
{
	int i;
	cell *p;

	p = board;
	for (i = 0; i < B_SIZE; i++)
		*p++ = i < (B_COLS * 2) || i >= (B_SIZE - (B_COLS * 2)) ||
		    i % B_COLS == 0 || i % B_COLS == B_COLS - 1;
}
```

**Why it matters:** The visible Tetris board is 10×20, but the program allocates a 12×23 logical board and pre-fills the outer ring with "occupied" cells. When `fits_in()` later checks whether a piece can be placed, it only tests the four cells of the piece. If any part would leave the board, it naturally collides with a sentinel wall. There is no `if (x < 0 || x >= WIDTH)` anywhere in the movement code.

The same idea appears today in image processing (padding kernels), grid-based games (level borders), and database query planners (sentinel values in B-trees). The payoff is fewer branches, smaller code, and fewer off-by-one bugs.

**See also:** `architecture.md` §Data Structures; `shapes.c:81-92` for `fits_in()`.

---

## Lesson 2 — Rotation as a Lookup Table

**File:** `shapes.c:55-75` and `tetris.c:277-283`  
**Function:** global shape table; rotation handling in `main()`

**What it teaches:** Precompute all possible rotated states and chain them, turning a geometric operation into a single array index.

**The excerpt:**

```c
const struct shape shapes[] = {
	/* 0*/	{ 7,	{ TL, TC, MR, } },
	/* 1*/	{ 8,	{ TC, TR, ML, } },
	/* 2*/	{ 9,	{ ML, MR, BC, } },
	/* 3*/	{ 3,	{ TL, TC, ML, } },
	...
};
```

**Why it matters:** Instead of rotating a 2-D matrix at runtime, the program stores every orientation of every shape. The `rot` field tells you which table entry to use next. Rotating becomes:

```c
if (fits_in(&shapes[curshape->rot], pos))
    curshape = &shapes[curshape->rot];
```

This is tiny, branch-light, and deterministic. It also makes wall kicks impossible without extra logic, which is why the original has none. Modern game engines still use this pattern: animation state machines, sprite rotation atlases, and finite-state automata all trade memory for speed by precomputing transitions.

**See also:** `architecture.md` §Shape Representation.

---

## Lesson 3 — Frame Differencing for Terminal Rendering

**File:** `screen.c:374-481`  
**Function:** `scr_update()`

**What it teaches:** On slow output devices, redraw only what changed.

**The excerpt (abridged):**

```c
void
scr_update(void)
{
	cell *bp, *sp;
	int i, j;

	bp = board;
	sp = curscreen;
	...
	for (i = 0; i < B_SIZE; i++, bp++, sp++) {
		if (*bp == *sp)
			continue;
		...
		/* move cursor, draw or erase cell */
	}
}
```

**Why it matters:** 1980s terminals were slow — sending a full screen of characters every frame caused visible flicker and lag. `scr_update()` keeps a shadow buffer `curscreen[]` and only moves the cursor to cells whose value changed. It even includes a small lookahead to batch cursor moves. This same principle drives modern incremental DOM diffing (React, Vue), game engine dirty-rectangle rendering, and terminal UI libraries like `ratatui`/`blessed`. The problem domain changed, but the optimization did not.

**See also:** `architecture.md` §Screen / Rendering.

---

## Lesson 4 — Timeout Carry-Over for Fair Real-Time Input

**File:** `input.c:139-155`  
**Function:** `tgetchar()`

**What it teaches:** A real-time game timer must keep its "debt" across player inputs, or button mashing will pause gravity.

**The excerpt (abridged):**

```c
int
tgetchar(void)
{
	static long timeleft;
	struct timeval tv;
	...
	tv.tv_usec = fallrate + timeleft;
	...
	if (/* timed out */) {
		faster();
		timeleft = /* remaining time */;
		return -1;
	}
	/* input arrived */
	timeleft = /* time not yet consumed */;
	return c;
}
```

**Why it matters:** If the game waited exactly `fallrate` microseconds of *idle* time before dropping a piece, every keypress would reset the timer. `timeleft` stores unused microseconds so the fall interval continues to accrue while the player is moving and rotating. This is the same idea as delta-time accumulators in modern game loops (`accumulator += dt; while (accumulator >= TICK) { update(); accumulator -= TICK; }`). Keeping time fair is what separates a reactive game from a sluggish one.

**See also:** `architecture.md` §Game Loop Detail.

---

## Lesson 5 — Setgid Privilege Dance

**File:** `tetris.c:139-141` and `scores.c:113`, `scores.c:128`  
**Functions:** `main()`, `getscores()`

**What it teaches:** When a shared high-score file must be writable by ordinary users, carefully drop and regain privileges rather than running privileged code during gameplay.

**The excerpt (abridged):**

```c
/* in main */
gid = getgid();
egid = getegid();
setegid(gid);       /* drop to unprivileged */
...
/* in getscores, around file open */
setegid(egid);      /* raise for score file access */
/* ... open / lock / read ... */
setegid(gid);       /* drop again */
```

**Why it matters:** The game binary is installed setgid-games so it can write to a shared score file. But if it ran with elevated privileges while parsing player input and rendering the screen, a bug could become a privilege escalation. The program therefore drops to the user's real group ID immediately after startup and only re-elevates around the tiny, well-audited score-file operations. This pattern is the ancestor of modern privilege-separation practices: web servers drop root after binding a port, containers run applications as unprivileged users, and sandboxes whitelist only the operations that need extra rights.

**See also:** `architecture.md` §High Score / Persistence.

---

## Techniques *Not* Covered Here

- **Termcap API usage.** The renderer relies on `tgetent`, `tgetstr`, `tgoto`, `tputs`, and `termios`. These are deep terminal-programming topics better covered by a dedicated curses/termcap tutorial or the NetBSD termcap manual.
- **File locking with `flock()`.** The score file uses advisory locks. For a thorough treatment see the POSIX `flock` man page and the original `scores.c`.

## See Also

- [`architecture.md`](./architecture.md) — the fuller picture the lessons draw from.
- [`../../../docs/glossary.md`](../../../docs/glossary.md) — technical terms.
- [`references.md`](./references.md) — primary sources and citations.
