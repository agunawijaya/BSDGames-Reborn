# Lessons from `rain`

> Techniques a beginner can extract from the original source, with file:line references.

Upstream tree: <https://github.com/vattam/BSDGames/tree/master/rain>.

---

## 1. Circular Buffers Animate Without Redrawing the Whole Screen

The last 5 drop positions are stored in `xpos[5]` and `ypos[5]`. The index `j` wraps around, letting the program draw the next frame from a tiny history.

- **Why it matters:** You can create smooth-looking animation by updating only a few cells instead of clearing and redrawing everything.
- **Reference:** `rain.c:77`, `rain.c:109-112`, `rain.c:121-145`.

## 2. Use Terminal Abstraction Libraries

`initscr()`, `mvaddch()`, and `refresh()` from curses handle terminal differences automatically.

- **Why it matters:** Writing raw escape sequences for every terminal type was painful and error-prone in the 1980s; curses solved that.
- **Reference:** `rain.c:100`, `rain.c:120-143`, `rain.c:146`.

## 3. Always Restore the Terminal on Exit

The signal handler sets a flag; the main loop calls `endwin()` before exiting.

```c
// rain.c:154-158
static void
onsig(int dummy)
{
    sig_caught = 1;
}
```

- **Why it matters:** A curses program that exits without `endwin()` can leave the terminal in a garbled state.
- **Reference:** `rain.c:62`, `rain.c:104-106`, `rain.c:114-117`.

## 4. Frame Pacing Matters

The original used `tcdrain()` when no delay was set, letting the terminal itself throttle the speed. On modern fast terminals, `-d` is essential.

- **Why it matters:** Animation speed depends on the display device; always provide a timing knob.
- **Reference:** `rain.c:147-150`.

## 5. Randomness Can Be Unseeded

The program calls `random()` without `srandom()`, relying on the default libc seed.

- **Why it matters:** For a screensaver this is usually fine, but deterministic tests may want an explicit seed.
- **Reference:** `rain.c:110-112`, `rain.c:118-119`.

## See Also

- [`architecture.md`](./architecture.md) — full code analysis.
- [`references.md`](./references.md) — primary sources.
