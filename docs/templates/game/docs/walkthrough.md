# `<GAME>` — Walkthrough

> **Conditional document.** Only applies to adventure-style games
> with a definite win state. If this doesn't fit, delete the file
> and note in `README.md`.

Contains **two** walkthroughs:

1. The **shortest path** to victory.
2. The **maximum-score** path.

---

## Walkthrough A — Shortest Path to Victory

**Steps to complete:** [count]
**Score achieved:** [n]
**Estimated real-time:** [minutes]

### Route Summary

```
[start] → [room 1] → ... → [win]
```

### Step-by-Step

1. `<command>` — [what happens, why this step is chosen]
2. `<command>` — [...]
3. ...

---

## Walkthrough B — Maximum Score

**Steps to complete:** [count]
**Score achieved:** [maximum possible]
**Estimated real-time:** [minutes]

### Route Summary

```
[start] → [detour A] → [detour B] → ... → [win]
```

### Step-by-Step

1. `<command>` — [...]
2. ...

### Score Log

| Step | Command | Score change | Cumulative |
|---:|---|---:|---:|
| 1 | ... | +N | N |
| ... | ... | ... | ... |
| **Total** | | | **max** |

---

## Notes

- Cross-reference the [`world-map.md`](./world-map.md) for the map
  used above.
- Reference `architecture.md` for the scoring formulas.
- Reference `spec.md` for the state machine underlying these paths.
