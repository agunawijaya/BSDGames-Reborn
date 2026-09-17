# `boggle` — Reverse Specification

> Formal mechanics specification reverse-engineered directly from `bog.c`, `word.c`, and `bog.h`.

---

## 1. Objective

- **Goal:** Identify the maximum possible subset of valid English words present on a 4x4 letter grid before the timer expires.
- **Victory Condition:** None in single-player; the game is an open-ended benchmark evaluated by word count and capture percentage:
  $$\text{Score} = \frac{N_{\text{player}}}{N_{\text{player}} + N_{\text{missed}}} \times 100\%$$
- **Termination:** Round concludes when `t - start_t >= tlimit` or when the player submits an EOF/early termination signal.

---

## 2. State Variables

| Variable | Type | Range | Initial Value | Persisted? | Description |
|---|---|---|---|:---:|---|
| `board` | `char[17]` | String of 16 letters + `\0` | Derived from cubes or CLI | No | Flattened 16-character board array. |
| `tlimit` | `int` | $1 \dots 3600$ | 180 | No | Round duration limit in seconds. |
| `minlength`| `int` | $3 \dots 15$ | 3 | No | Minimum allowable word character length. |
| `start_t` | `time_t` | Epoch timestamp | `time(NULL)` at start | No | Timestamp of round commencement. |
| `npwords` | `int` | $0 \dots \text{MAXPWORDS}$ | 0 | No | Total unique valid words found by player. |
| `pword` | `char*[]` | Array of strings | All `NULL` | No | Pointers to player-submitted word strings. |
| `nmwords` | `int` | $0 \dots \text{MAXMWORDS}$ | 0 | No | Total valid words on board missed by player. |
| `mword` | `char*[]` | Array of strings | All `NULL` | No | Pointers to computer-discovered missed words. |
| `ngames` | `int` | $0 \dots \infty$ | 0 | Yes (session) | Total rounds played in current session. |
| `tnpwords` | `int` | $0 \dots \infty$ | 0 | Yes (session) | Cumulative words found across all rounds. |
| `tnmwords` | `int` | $0 \dots \infty$ | 0 | Yes (session) | Cumulative words missed across all rounds. |
| `reuse` | `int` | $0, 1$ | 0 | No | Flag allowing non-exclusive cube reuse (`+`). |
| `selfuse` | `int` | $0, 1$ | 0 | No | Flag allowing repeated letter self-loops (`++`).|
| `adjacency`| `int[16][16]`| $0, 1$ | 8-connected grid | Constant | Topological adjacency matrix for 4x4 board. |

---

## 3. The 16 Boggle Cubes Inventory (Physical Entities)

In [`bog.c:305-315`](https://github.com/vattam/BSDGames/tree/master/boggle/boggle/bog.c#L305-L315), the 16 physical letter cubes are defined with their authentic Parker Brothers letter distributions:

| Cube ID | 6 Die Faces (Letters) | Dominant Consonants | Vowels Present | Linguistic / Puzzle Role |
|:---:|:---:|---|---|---|
| **Cube 0** | `e d n o s w` | D, N, S, W | E, O | Common pluralizer (*s*), past-tense stem (*ed*). |
| **Cube 1** | `a a c i o t` | C, T | A (x2), I, O | Heavy vowel hub (4 vowels). |
| **Cube 2** | `a c e l r s` | C, L, R, S | A, E | High-frequency liquid consonants (*l, r*) + *s*. |
| **Cube 3** | `e h i n p s` | H, N, P, S | E, I | Common prefixes (*in-*, *pre-*). |
| **Cube 4** | `e e f h i y` | F, H, Y | E (x2), I | Adverbial suffix (*-y*), double *e*. |
| **Cube 5** | `e l p s t u` | L, P, S, T | E, U | Versatile consonant cluster (*pl-, st-*). |
| **Cube 6** | `a c d e m p` | C, D, M, P | A, E | Common verbs and nouns. |
| **Cube 7** | `g i l r u w` | G, L, R, W | I, U | Common Germanic root consonants. |
| **Cube 8** | `e g k l u y` | G, K, L, Y | E, U | Hard stop consonant (*k*). |
| **Cube 9** | `a h m o r s` | H, M, R, S | A, O | Harmonious consonant blend (*m, r, s*). |
| **Cube 10** | `a b i l t y` | B, L, T, Y | A, I | Suffix provider (*-ability*, *-ly*). |
| **Cube 11** | `a d e n v z` | D, N, V, Z | A, E | High-scoring rare consonant (*z*, *v*). |
| **Cube 12** | `b f i o r x` | B, F, R, X | I, O | High-scoring rare consonant (*x*). |
| **Cube 13** | `d k n o t u` | D, K, N, T | O, U | Strong stop consonants (*d, k, t*). |
| **Cube 14** | `a b j m o q` | B, J, M, Q | A, O | Rare high-value consonants (*j*, *q* $\rightarrow$ *qu*). |
| **Cube 15** | `e g i n t v` | G, N, T, V | E, I | Common participle ending (*-ing*). |

---

## 4. Graph Adjacency Invariants

The 16 board positions are indexed as:

$$\begin{pmatrix} 0 & 1 & 2 & 3 \\ 4 & 5 & 6 & 7 \\ 8 & 9 & 10 & 11 \\ 12 & 13 & 14 & 15 \end{pmatrix}$$

- **Corner Sockets (0, 3, 12, 15):** Degree 3 (3 adjacent neighbors).
- **Edge Sockets (1, 2, 4, 7, 8, 11, 13, 14):** Degree 5 (5 adjacent neighbors).
- **Interior Sockets (5, 6, 9, 10):** Degree 8 (8 adjacent neighbors).

---

## 5. Rules & Path Verification Algorithm

1. **Adjacency Check (`checkword`):**
   - For a submitted word $W = w_0 w_1 \dots w_{k-1}$, find a path of distinct socket indices $(p_0, p_1, \dots, p_{k-1})$ such that $\text{board}[p_i] = w_i$ and $\text{adjacency}[p_i][p_{i+1}] = 1$.
2. **Cube Uniqueness:**
   - In standard mode, $p_i \ne p_j$ for all $i \ne j$.
3. **The `q` / `qu` Invariant:**
   - A *q* cube face automatically matches the character sequence *"qu"*. Words spelled with *q* without *u* are rejected.
4. **Dictionary Verification (`checkdict`):**
   - Candidate words must exist in the indexed dictionary file (`bogdict`).

---

## 6. RNG Usage

| Operation | RNG Call | Consequence |
|---|---|---|
| **Cube Shuffle** | 100 iterations of `random() % 16` | Randomizes which cube occupies which socket. |
| **Face Selection** | `random() % 6` per cube | Selects which of the 6 letter faces is facing upward. |
| **PRNG Seeding** | Seeded with `time(NULL)` or `-s <seed>` | Governs reproducible tournament challenge runs. |

---

## 7. Termination Conditions

1. **Timer Expiration:** $t - \text{start\_t} \ge \text{tlimit} \rightarrow$ disables word input, sorts player submissions, triggers exhaustive dictionary search, and displays results.
2. **Early Finish:** Player enters EOF (`^D`) $\rightarrow$ immediate transition to scoring results.
3. **Session Exit:** Pressing `q` at the post-game prompt terminates the program.
