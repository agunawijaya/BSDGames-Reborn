# `<GAME>` — Lessons from the Original Code

> **A textbook.** For each interesting technique in the original C
> source, write a short lesson entry. Beginners should be able to
> pull up this file *and the original source* and learn.

Each lesson:

- Names the technique.
- Says where in the source it lives (`file:line`, `procedure`).
- Includes a short, cited excerpt.
- Explains why it matters and how the same idea appears in modern
  code.

---

## Lesson 1 — [Technique name]

**File:** `<file>.c:LINE-LINE` (upstream tree)
**Function:** `<function_name>()`

**What it teaches:** [concept — one sentence]

**The excerpt:**

```c
// short (5–20 lines) excerpt from the original
// preserving copyright/authorship line above if present
```

**Why it matters:** [1–2 paragraphs explaining the idea, how it
worked given era constraints, and where a modern programmer would
meet the same idea today.]

**See also:** [links to `architecture.md` sections, glossary terms,
etc.]

---

## Lesson 2 — [Technique name]

*Same structure.*

---

## Suggested Reading Order

For a beginner picking up this game:

1. Start with lesson [N] — [why it's the easiest entry point]
2. Then lesson [M] — [why it builds on N]
3. ...

---

## Techniques *Not* Covered Here

*(If a technique is too involved for a lesson entry — e.g. the
entire `curses` API — mention it here with a pointer to external
material.)*

## See Also

- [`architecture.md`](./architecture.md) — the fuller picture the
  lessons draw from.
- [`../../docs/glossary.md`](../../docs/glossary.md) — technical
  terms.
