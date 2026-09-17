# Fortune — Engineering Notes

Informal technical observations, binary struct memory layouts, probability weighting algorithms,
and database statistics from BSD `fortune` and `strfile`.

---

## 1. Binary `STRFILE` Memory Layout (`strfile.h`)

The binary `.dat` file header occupies exactly **24 bytes**:

```
+-------------------------------------------------------------+
| Byte Range | Type       | Field Name     | Description      |
+------------+------------+----------------+------------------+
|  00 - 03   | uint32_t   | str_version    | Version (1 or 2) |
|  04 - 07   | uint32_t   | str_numstr     | String count (N) |
|  08 - 11   | uint32_t   | str_longlen    | Max string bytes |
|  12 - 15   | uint32_t   | str_shortlen   | Min string bytes |
|  16 - 19   | uint32_t   | str_flags      | Bitfield flags   |
|  20 - 20   | char       | str_delim      | Delimiter ('%')  |
|  21 - 23   | char[3]    | str_pad        | 32-bit alignment |
+-------------------------------------------------------------+
Total Fixed Header Size: 24 bytes (0x18)
```

### Table Offset Calculation
Following the 24-byte header, the file contains $(N + 1)$ 32-bit seek pointers:
$$\text{Seek Address of String } i = 24 + (i \times 4) \quad \text{bytes}$$
$$\text{Seek Address of End of String } i = 24 + ((i + 1) \times 4) \quad \text{bytes}$$

---

## 2. Authentic BSD Database Statistics

Based on the authentic BSD source distribution in `datfiles/`:

| Database File | Character Count | String Count ($N$) | Flag Type | Description |
|---|:---:|:---:|:---:|---|
| `fortunes` | ~320 KB | ~1,420 quotes | Plain | General humor, computing, literature |
| `fortunes2`| ~580 KB | ~2,650 quotes | Plain | Extended adages and historical maxims |
| `fortunes-o`| ~140 KB | ~520 quotes | `STR_ROTATED` | ROT13-obfuscated adult / offensive humor |

---

## 3. Weighted Probability Selection Algorithm (`fortune.c:pick_file`)

When multiple files or directories are passed with percentage weights:
1. Normalize user weights so $\sum W_i = 100$.
2. For unweighted files, allocate remaining percentage mass proportionally:
   $$W_{\text{unweighted}} = \frac{100 - \sum W_{\text{explicit}}}{M}$$
3. Generate a uniform pseudo-random number $R \in [0, 99]$.
4. Iterate over files with a cumulative threshold:
   $$\text{Threshold}_j = \sum_{k=1}^j W_k$$
   Select file $F_j$ where $R < \text{Threshold}_j$.
5. Within the selected file $F_j$, generate an integer index $r \in [0, N_j - 1]$ to pick the specific quote.
