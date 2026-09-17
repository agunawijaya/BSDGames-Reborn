# `boggle` — Working Notes & Implementation Quirks

> Technical observations, memory limits, and dictionary formatting quirks.

---

## 1. The `Qu` Problem in Boggle Engines

In English, the letter *Q* is almost always followed by *U*. Physical Boggle represents this by printing `Qu` on a single face of die 14 (`"abjmoq"`).

In Barry Brachman's implementation:
- The cube face string is defined as `"abjmoq"`, storing `'q'`.
- During board checking in [`bog.c:380-395`](https://github.com/vattam/BSDGames/tree/master/boggle/boggle/bog.c#L380-L395), whenever the parser encounters `'q'`, it asserts that the next character in the target word must be `'u'`:
  ```c
  if (*p++ == 'q') {
      if (*p++ != 'u')
          return (-1);
  }
  ```
- This folds the two characters into a single logical step in the graph path.

---

## 2. Memory Limits & Array Bounds (`bog.h`)

The original header enforces static buffers designed for low-memory Unix terminals:
- `MAXWORDLEN = 32`: Maximum length of any single word.
- `MAXPWORDS = 2000`: Maximum unique words a human player can enter in 3 minutes.
- `MAXMWORDS = 2000`: Maximum missed words the computer can identify on a single board.
- `MAXPSPACE = 15000`: Character buffer for player word storage.

In practice, a typical 4x4 Boggle board contains between 60 and 150 valid English words of 3+ letters.

---

## 3. The `mkindex` Pre-Compilation Utility

The `boggle` package includes a standalone helper program: `mkindex`.
- It processes a raw newline-delimited text dictionary.
- It filters out non-alphabetic characters, upper-case words, and words shorter than 3 letters.
- It computes the byte offset and length of words starting with each letter $a \dots z$, writing a 26-entry header index `bogdict.index`.
- When `boggle` runs, it maps this 26-entry index into memory, allowing it to seek directly to the exact file offset for any initial letter.
