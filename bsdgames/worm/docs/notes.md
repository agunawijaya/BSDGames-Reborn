# Worm — Engineering Notes

Informal technical observations, window geometry formulas, probability models,
and memory footprint analyses from BSD `worm`.

---

## 1. Terminal Window Geometry Constraints (`worm.c:117-135`)

Michael Toy enforced strict spatial bounds at startup:

```c
if (COLS < 18 || LINES < 5) {
    endwin();
    errx(1, "screen too small");
}
```

### Rationale
- **Width:** 18 columns is the minimal space needed to render the status bar: `" Worm"` (5 chars) +
  padding + `"Score: %3d"` (11 chars) = 16 chars minimum plus terminal margin.
- **Height:** 5 lines is the bare minimum for:
  - Row 0: Status window (`stw`)
  - Row 1: Top arena wall (`*`)
  - Row 2: Worm head row
  - Row 3: Playfield interior
  - Row 4: Bottom arena wall (`*`)

### Playfield Usable Area
On a standard $80 \times 24$ terminal:
- Window `tv` dimensions: $23 \times 79$.
- Playfield interior (excluding `*` border):
  $$\text{Width} = 79 - 2 = 77 \text{ cells}, \quad \text{Height} = 23 - 2 = 21 \text{ cells}$$
  $$\text{Total Usable Floor Space} = 77 \times 21 = \mathbf{1,617\text{ cells}}$$

---

## 2. Starting Length Bound Formula (`worm.c:128`)

When a player launches with a custom length argument (`worm [size]`):
$$\text{Max Allowed Length} = \left\lfloor \frac{(\text{LINES} - 3) \times (\text{COLS} - 2)}{3} \right\rfloor$$
On an $80 \times 24$ terminal:
$$\text{Max Allowed Length} = \left\lfloor \frac{(24 - 3) \times (80 - 2)}{3} \right\rfloor = \left\lfloor \frac{21 \times 78}{3} \right\rfloor = \frac{1638}{3} = \mathbf{546\text{ segments.}}$$
If a user requests a starting size $\le 0$ or $> 546$, the game automatically resets `start_len` to
default `LENGTH = 7`. This prevents the worm from occupying more than one-third of the total arena at launch!

---

## 3. Food Digit Probability & Scoring Expectations

In `prize()`, food digits are selected using pseudo-random modulo:
```c
value = rnd(9) + 1; /* Uniform integer in [1, 9] */
```
Each digit $d \in \{1, 2, 3, 4, 5, 6, 7, 8, 9\}$ has an exact uniform probability of:
$$P(d) = \frac{1}{9} \approx 11.11\%$$

### Expected Values
- **Expected Growth per Prize:**
  $$\mathbb{E}[\text{growth}] = \frac{1+2+3+4+5+6+7+8+9}{9} = \frac{45}{9} = \mathbf{5.0\text{ segments}}$$
- **Growth Accumulation Formula:**
  Because score increments by `growing` (which accumulates), eating consecutive high digits
  yields compounding score boosts:
  $$\Delta S = \text{growing}_{\text{previous}} + d$$

---

## 4. Memory Footprint Analysis (`struct body`)

On a modern 64-bit architecture:
```c
struct body {
    int x;              /* 4 bytes */
    int y;              /* 4 bytes */
    struct body *prev;  /* 8 bytes */
    struct body *next;  /* 8 bytes */
};                      /* Total: 24 bytes per node */
```
Even an enormous worm occupying half the arena (800 segments) consumes:
$$800 \times 24\text{ bytes} \approx 19.2\text{ KB of heap memory}$$
In 1980 on a PDP-11 with 64 KB user address space, a 100-segment worm consumed just 1.6 KB,
making Toy's dynamic doubly linked list exceptionally lean and cache-friendly.
