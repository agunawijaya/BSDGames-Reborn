# Lessons from `ppt`

> Techniques a beginner can extract from the original source, with file:line references.

Upstream tree: <https://github.com/vattam/BSDGames/tree/master/ppt>.

---

## 1. Use a Fixed Anchor for Self-Synchronising Formats

The feed hole `.` in the middle of every row lets the decoder recover the byte even if alignment is slightly off.

- **Why it matters:** Physical media formats need reference marks so readers can resync.
- **Reference:** `ppt.c:152-179` (`getppt`).

## 2. Encode and Decode Should Share the Same Visual Layout

`putppt()` prints bits in positions 7..0; `getppt()` reads the same positions around the feed hole.

```c
// ppt.c:140-147
for (i = 7; i >= 0; i--) {
    if (i == 2) putchar('.'); /* feed hole */
    if ((c&(1<<i)) != 0) putchar('o');
    else putchar(' ');
}
```

- **Why it matters:** A symmetric format is easier to verify and debug.
- **Reference:** `ppt.c:133-150`, `ppt.c:152-179`.

## 3. Separate Mode Selection from I/O Logic

`main()` decides encode vs decode once, then each branch handles only its own I/O.

- **Why it matters:** Each mode stays small and focused.
- **Reference:** `ppt.c:78-129`.

## 4. Validate Mutual Exclusion of Modes

Decode mode (`-d`) rejects command-line arguments because they would be ambiguous.

- **Why it matters:** Strict validation prevents confusing input/flag combinations.
- **Reference:** `ppt.c:92-95`.

## 5. Keep Presentation Simple

The output uses only `|`, `o`, `.`, spaces, and underscores.

- **Why it matters:** Restricted character sets are portable across every terminal and printer.
- **Reference:** `ppt.c:52`, `ppt.c:139-149`.

## See Also

- [`architecture.md`](./architecture.md) — full code analysis.
- [`references.md`](./references.md) — primary sources.
