# Lessons from `boggle`

> Algorithmic and software engineering lessons extracted from Barry Brachman's 1988/1993 BSD C implementation.

---

## 1. Bitmask Visited Sets for Graph Backtracking

### Context & Original Code
In graph algorithms (such as finding paths across an 8-connected grid), avoiding revisiting nodes in the current path is a fundamental requirement. Standard implementations often use a `bool visited[16]` array, requiring $O(N)$ resets or allocations upon each recursive backtracking call.

In [`bog.c:375-405`](https://github.com/vattam/BSDGames/tree/master/boggle/boggle/bog.c#L375-L405), Brachman represents visited state as a single 16-bit integer bitmask:

```c
/* Push cell into current path */
usedbits |= (1 << *lm);

/* Recursive search */
if (checkword(word + 1, *lm, path + 1) == 1)
    return (1);

/* Backtrack: pop cell from path */
usedbits &= ~(1 << *lm);
```

### Why It Matters
- **Zero Memory Allocation:** Backtracking state management is reduced to a single bitwise OR and AND operation, executing in a single CPU instruction.
- **Cache Locality:** The entire visited state stays resident in a single CPU register throughout deep recursive calls.
- **Key Takeaway:** For small finite graphs ($N \le 64$), an integer bitmask is the fastest, cleanest mechanism for path tracking and cycle detection.

---

## 2. Inverted Letter-Mapping Index for Rapid Candidate Pruning

### Context & Original Code
A naive recursive DFS checking if a word like `"quartz"` exists on the board would scan all 16 cells to find a `'q'`, then look at neighbors for `'u'`, and so on.

Brachman pre-computes an inverted index `letter_map[26][16]` during board initialization in [`bog.c:330-348`](https://github.com/vattam/BSDGames/tree/master/boggle/boggle/bog.c#L330-L348):

```c
for (i = 0; i < 26; i++)
    lm[i] = letter_map[i];
for (i = 0; i < 16; i++)
    *lm[board[i] - 'a']++ = i;
for (i = 0; i < 26; i++)
    *lm[i] = -1;
```

### Why It Matters
- **Instant Feasibility Pruning:** Before initiating any graph traversal, if `letter_map[ch][0] == -1` for any letter in the target word, the entire word is rejected in $O(1)$ time without exploring a single graph edge!
- **Fast First-Step Enumeration:** The algorithm directly jumps to the exact cells containing the starting letter without scanning empty positions.

---

## 3. Asynchronous Signal-Driven Timers (`timer.c`)

### Context & Original Code
Terminal interactive games often need to display a ticking countdown clock while simultaneously blocking on user keyboard input (`getline()` or `getchar()`).

Brachman implemented an asynchronous alarm clock in [`timer.c:45-75`](https://github.com/vattam/BSDGames/tree/master/boggle/boggle/timer.c#L45-L75):

```c
void start_timer(int duration) {
    struct itimerval itv;

    signal(SIGALRM, timer_handler);
    itv.it_interval.tv_sec = 1;
    itv.it_interval.tv_usec = 0;
    itv.it_value.tv_sec = duration;
    itv.it_value.tv_usec = 0;
    setitimer(ITIMER_REAL, &itv, NULL);
}
```

### Why It Matters
- **Separation of I/O and Timing:** The main thread remains simple and synchronous, blocking cleanly on terminal input while the kernel's timer subsystem triggers periodic clock interrupts.
- **Handling Long Jumps:** When the timer expires, `longjmp(env, 1)` cleanly unwinds nested input loops to jump directly to the `timesup` scoring routine.
