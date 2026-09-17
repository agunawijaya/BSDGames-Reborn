# Backgammon — Engineering Notes

Informal technical observations, probability matrices, hitting odds tables,
and mathematical equity models from BSD `backgammon`.

---

## 1. The 36 Dice Combinations Matrix (`table.c`)

When two 6-sided dice are rolled, there are $6 \times 6 = 36$ equally probable outcomes:

```
      Die 2:  1      2      3      4      5      6
Die 1
  1          1-1*   1-2    1-3    1-4    1-5    1-6
  2          2-1    2-2*   2-3    2-4    2-5    2-6
  3          3-1    3-2    3-3*   3-4    3-5    3-6
  4          4-1    4-2    4-3    4-4*   4-5    4-6
  5          5-1    5-2    5-3    5-4    5-5*   5-6
  6          6-1    6-2    6-3    6-4    6-5    6-6*

* Doublets (6 outcomes = 16.7%): Move four times the value!
```

---

## 2. Direct vs. Indirect Blot Hitting Probabilities

Assuming no intervening points are blocked by opponent anchors, the mathematical probability
of hitting a lone blot at distance $d \in [1, 12]$ pips:

| Distance ($d$) | Hitting Dice Combinations | Total Ways / 36 | Probability (%) |
|:---:|---|:---:|:---:|
| **1** | 1-1 (4 moves), 1-x (10), 2-2 | 11 | **$30.6\%$** |
| **2** | 2-2 (4 moves), 2-x (10), 1-1 | 12 | **$33.3\%$** |
| **3** | 3-3, 3-x (10), 1-2, 2-1, 1-1 | 14 | **$38.9\%$** |
| **4** | 4-4, 4-x (10), 1-3, 3-1, 2-2, 1-1 | 15 | **$41.7\%$** |
| **5** | 5-5, 5-x (10), 1-4, 4-1, 2-3, 3-2 | 15 | **$41.7\%$** |
| **6** | 6-6, 6-x (10), 1-5, 5-1, 2-4, 4-2, 3-3, 2-2 | **17** | **$47.2\%$ (Peak Danger!)** |
| **7** | 1-6, 6-1, 2-5, 5-2, 3-4, 4-3 | 6 | **$16.7\%$ (Direct cliff drop)** |
| **8** | 2-6, 6-2, 3-5, 5-3, 4-4, 2-2 | 6 | **$16.7\%$** |
| **9** | 3-6, 6-3, 4-5, 5-4, 3-3 | 5 | **$13.9\%$** |
| **10** | 4-6, 6-4, 5-5 | 3 | **$8.3\%$** |
| **11** | 5-6, 6-5 | 2 | **$5.6\%$** |
| **12** | 6-6, 4-4, 3-3 | 3 | **$8.3\%$** |

> **Key Strategic Insight:** A blot at distance **6** is hit nearly half the time ($47.2\%$). Moving just
> one point further to distance **7** drops hitting chance to only $16.7\%$—a dramatic $30\%$ drop in risk!

---

## 3. The 25% Doubling Cube Take Point Derivation

When your opponent offers a double from $V \rightarrow 2V$:
- If you **Drop**, your outcome is a guaranteed loss of $V$:
  $$\mathbb{E}(\text{Drop}) = -V$$
- If you **Accept**, let $p$ be your probability of winning. Your expected value is:
  $$\mathbb{E}(\text{Accept}) = p(+2V) + (1-p)(-2V) = 2V(2p - 1)$$

To make accepting mathematically superior to dropping:
$$\mathbb{E}(\text{Accept}) \ge \mathbb{E}(\text{Drop})$$
$$2V(2p - 1) \ge -V$$
$$4p - 2 \ge -1$$
$$4p \ge 1 \implies p \ge \frac{1}{4} = \mathbf{25\%}$$

**Conclusion:** Even if you only have a **$25\%$ chance of winning**, taking the double is
mathematically break-even compared to surrendering!
