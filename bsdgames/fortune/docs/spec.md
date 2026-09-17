# Fortune & Strfile — Reverse Specification

Formal mechanical specification, binary data structure layout, probability models,
and algorithmic invariants reverse-engineered from BSD `fortune` and `strfile` (Ken Arnold, 1979/1985).

---

## 1. Mathematical Objective

Given a set of $K$ database files $\mathcal{F} = \{F_1, F_2, \dots, F_K\}$ containing a total of
$N = \sum_{j=1}^K N_j$ distinct quotations, select and output a quotation $S$ according to
a probability distribution $P(S)$ subject to length and regex constraints:

$$\text{Select } S \sim P(S) \quad \text{such that} \quad \begin{cases}
\text{len}(S) < 160 & \text{if Short\_only} \\
\text{len}(S) \ge 160 & \text{if Long\_only} \\
S \models \mathcal{R} & \text{if Regex Match Active}
\end{cases}$$

---

## 2. Formal Binary `STRFILE` Header Layout (`strfile.h`)

The compiled index file (`.dat`) starts with a fixed-size header struct followed by an array of
32-bit seek offsets:

```
Byte Offset:
00 - 03: [ uint32_t str_version  ]  = Version number (currently 1 or 2)
04 - 07: [ uint32_t str_numstr   ]  = Number of indexed strings in file (N)
08 - 11: [ uint32_t str_longlen  ]  = Length in bytes of the longest string
12 - 15: [ uint32_t str_shortlen ]  = Length in bytes of the shortest string
16 - 19: [ uint32_t str_flags    ]  = Bitmask flags (RANDOM, ORDERED, ROTATED)
20 - 20: [ char     str_delim    ]  = Delimiter character (typically '%')
21 - 23: [ char     str_pad[3]   ]  = 3-byte structure padding / alignment
--------------------------------------------------------------------------------
24 - End: Array of (N + 1) uint32_t Seek Offsets:
          Table[0] = Byte offset of string 0
          Table[1] = Byte offset of string 1
          ...
          Table[N] = EOF byte offset
```

### Upstream C Struct Definition
```c
struct strfile {
    uint32_t    str_version;    /* Version number */
    uint32_t    str_numstr;     /* Number of strings in the file */
    uint32_t    str_longlen;    /* Length of longest string */
    uint32_t    str_shortlen;   /* Length of shortest string */
    uint32_t    str_flags;      /* Bit field for flags */
    char        str_delim;      /* Delimiter character */
    char        str_pad[3];     /* Padding for 32-bit alignment */
};
```

### Bitmask Flags (`str_flags`)
| Flag Identifier | Hex Value | Meaning |
|---|:---:|---|
| `STR_RANDOM` | `0x01` | Pointers randomized in table |
| `STR_ORDERED` | `0x02` | Pointers ordered alphabetically in table |
| `STR_ROTATED` | `0x04` | Quotation text obfuscated with ROT13 |

---

## 3. Byte Offset Table Invariants

Let $\text{Table} = [O_0, O_1, \dots, O_N]$ be the array of $(N+1)$ offsets stored in network byte order.
1. **Monotonic Progression:**
   $$\forall i \in [0, N-1], \quad O_i < O_{i+1}$$
2. **String Length Determination:**
   The exact byte length of quotation $S_i$ is determined in $O(1)$ time without reading the text:
   $$\text{Length}(S_i) = O_{i+1} - O_i - \text{overhead}$$
3. **Constant-Time Seek ($O(1)$):**
   To read quotation $S_i$, the client performs:
   $$\text{fseek}(\text{fp}, O_i, \text{SEEK\_SET})$$
   Reading exactly $(O_{i+1} - O_i)$ bytes directly from disk.

---

## 4. Probability Selection Mathematics

Let $K$ be the number of database files searched.

### Default Weighted Selection (Proportional to Size)
When no explicit percentages are specified:
$$P(F_j) = \frac{N_j}{\sum_{k=1}^K N_k}$$
Each quote across all searched files has equal likelihood of selection.

### Explicit User Percentage Weighting
If percentages $W_1, W_2, \dots, W_K$ are specified ($\sum W_j = 100$):
$$P(F_j) = \frac{W_j}{100}$$

### Equal File Probability Flag (`-e`)
When `-e` is active:
$$P(F_j) = \frac{1}{K} \quad (\forall j \in [1, K])$$

---

## 5. ROT13 Reversible Transformation Invariant

For files marked with `STR_ROTATED` (`str_flags & 0x04`):
$$\text{ROT13}(c) = \begin{cases}
'a' + (c - 'a' + 13) \pmod{26} & \text{if } c \in ['a' \dots 'z'] \\
'A' + (c - 'A' + 13) \pmod{26} & \text{if } c \in ['A' \dots 'Z'] \\
c & \text{otherwise}
\end{cases}$$

**Involutory Property:**
$$\text{ROT13}(\text{ROT13}(c)) = c$$
Decoding uses the exact same function as encoding.
