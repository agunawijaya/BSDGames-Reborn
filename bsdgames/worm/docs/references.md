# Worm — References & Bibliography

Authoritative citations, historical documentation, and upstream source references for BSD Worm.

---

## 1. Upstream Source Code

- **Repository:** [BSDGames on GitHub (vattam/BSDGames)](https://github.com/vattam/BSDGames)
- **Worm Directory:** [`vattam/BSDGames/tree/master/worm`](https://github.com/vattam/BSDGames/tree/master/worm)
- **Primary Source Files:**
  - [`worm.c`](https://github.com/vattam/BSDGames/tree/master/worm/worm.c) — Complete game loop, signal handler, doubly linked list queue, curses rendering.
  - [`worm.6`](https://github.com/vattam/BSDGames/tree/master/worm/worm.6) — Original UNIX troff manual page.

---

## 2. Historical & Game Design References

- **Toy, Michael.** *Worm* (1980), University of California, Santa Cruz / UC Berkeley. Author comments
  and design notes in early BSD distributions (2.8BSD and 4.1BSD).
- **Gremlin Industries.** *Blockade: Operation and Service Manual* (1976), San Diego, California.
  The earliest commercial coin-operated arcade game establishing trailing line collision mechanics.
- **Raddatz, Rick.** *NIBBLES.BAS* (1991), Microsoft Corporation. Included as a standard sample program
  with MS-DOS 5.0, directly adopting the digit-based growth model from BSD `worm`.
- **Armanto, Taneli.** "The History of Nokia Snake" (1997/2012), *Nokia Design Archives*. Overview
  of adapting snake mechanics for embedded mobile handset hardware.

---

## 3. Systems Programming & Curses References

- **Arnold, Kenneth.** "Screen Updating and Cursor Movement Optimization: A Library Package" (1977/1980),
  *Proceedings of the USENIX Conference*, University of California, Berkeley. Founding paper describing
  curses window allocation (`newwin`) and buffer reading (`winch`).
- **CSRG (Computer Systems Research Group):** *4.1 Berkeley Software Distribution (4.1BSD)*,
  University of California, Berkeley (1981). Earliest major BSD distribution shipping `worm` in `/usr/games`.
- **Wichman, Glenn & Toy, Michael.** "The History of Rogue" (1997), *A.D.venture Magazine*. Background
  on early experiments with curses and terminal action games at Santa Cruz and Berkeley prior to *Rogue*.
