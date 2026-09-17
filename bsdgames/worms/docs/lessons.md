# Lessons from `worms`

> Techniques a beginner can extract from the original source, with file:line references.

Upstream tree: <https://github.com/vattam/BSDGames/tree/master/worms>.

---

## 1. Circular Queues Model Moving Bodies

Each worm stores its body as a circular array of positions. Advancing the head index and erasing the old tail produces movement without shifting data.

- **Why it matters:** Circular buffers turn O(n) body shifts into O(1) head/tail updates.
- **Reference:** `worms.c:175-178`, `worms.c:259-271`, `worms.c:303-341`.

## 2. Reference Counting Prevents Over-Erasing

The `ref` grid counts how many worms occupy each cell. A cell is erased only when its count drops to zero.

```c
// worms.c:319-321
if (--ref[y1][x1] == 0) {
    mvaddch(y1, x1, trail);
}
```

- **Why it matters:** When multiple entities share a screen, naive erasing can leave holes in other entities.
- **Reference:** `worms.c:249-258`, `worms.c:319-321`, `worms.c:339`.

## 3. Lookup Tables Encode Complex Boundary Logic

Nine tables map current orientation to valid next orientations based on whether the worm is at a screen edge or corner.

- **Why it matters:** Tables separate policy (what is allowed) from execution (how to move), making the code easier to verify.
- **Reference:** `worms.c:72-164`, `worms.c:323`.

## 4. Bitmaps Can Be Source Code

The `-f` flag fills the screen with the ASCII-art "WORMS" header embedded in the source.

- **Why it matters:** Self-contained assets keep the program single-file and portable.
- **Reference:** `worms.c:46-61`, `worms.c:217-218`, `worms.c:279-290`.

## 5. Graceful Degradation on Bad Input

The program validates delay, length, and number ranges and exits with clear messages.

- **Why it matters:** Validating configuration early prevents crashes deep in the animation loop.
- **Reference:** `worms.c:211-228`.

## See Also

- [`architecture.md`](./architecture.md) — full code analysis.
- [`references.md`](./references.md) — primary sources.
