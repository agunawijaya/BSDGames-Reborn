# `battlestar` — References & Historical Sources

> Citations, archival links, academic documents, and source repositories.

---

## 1. Upstream Primary Source Code

- **Debian / NetBSD BSDGames Upstream Mirror:**
  [`vattam/BSDGames/tree/master/battlestar`](https://github.com/vattam/BSDGames/tree/master/battlestar)
  - Key Modules:
    - [`battlestar.c`](https://github.com/vattam/BSDGames/tree/master/battlestar/battlestar.c) — Main entry point and game loop.
    - [`init.c`](https://github.com/vattam/BSDGames/tree/master/battlestar/init.c) — Initialization, world loading, hereditary wizard registry.
    - [`extern.h`](https://github.com/vattam/BSDGames/tree/master/battlestar/extern.h) — Constants, structs, bitmasks, 64 objects, 13 injury definitions.
    - [`dayfile.c`](https://github.com/vattam/BSDGames/tree/master/battlestar/dayfile.c) — Daytime 275-room world definitions.
    - [`nightfile.c`](https://github.com/vattam/BSDGames/tree/master/battlestar/nightfile.c) — Nighttime 275-room world definitions.
    - [`dayobjs.c`](https://github.com/vattam/BSDGames/tree/master/battlestar/dayobjs.c) — Daytime object initial placement map.
    - [`nightobjs.c`](https://github.com/vattam/BSDGames/tree/master/battlestar/nightobjs.c) — Nighttime object initial placement map.
    - [`command1.c` - `command7.c`](https://github.com/vattam/BSDGames/tree/master/battlestar/) — Command handlers, combat logic, score rating.
    - [`fly.c`](https://github.com/vattam/BSDGames/tree/master/battlestar/fly.c) — Curses-based space flight simulation.
    - [`words.c`](https://github.com/vattam/BSDGames/tree/master/battlestar/words.c) — Natural language vocabulary dictionary.
    - [`save.c`](https://github.com/vattam/BSDGames/tree/master/battlestar/save.c) — Game state persistence routines.

---

## 2. Unix Historical Archives

1. **CSRG (Computer Systems Research Group) Archives:**
   - University of California, Berkeley. *4.2 Berkeley Software Distribution (4.2BSD)*, August 1983. Contains original release of `battlestar`.
2. **The Unix Heritage Society (TUHS):**
   - Source code repository archives of 2.11BSD, 4.2BSD, and 4.3BSD: [tuhs.org](https://www.tuhs.org).
3. **NetBSD Games Source Repository:**
   - NetBSD Project. *src/games/battlestar/*: [cvsweb.netbsd.org](http://cvsweb.netbsd.org/bsdweb.cgi/src/games/battlestar/).

---

## 3. Interactive Fiction History & Literature

1. **Montfort, Nick (2003):**
   - *Twisty Little Passages: An Approach to Interactive Fiction*. MIT Press. Cambridge, Massachusetts.
2. **Jerz, Dennis G. (2007):**
   - *Somewhere Nearby is Colossal Cave: Examining Will Crowther's Original 'Adventure' in Code and in Kentucky*. Digital Humanities Quarterly.
3. **Nelson, Graham (2001):**
   - *The Inform Designer's Manual (4th Edition)*. The Interactive Fiction Library. St. Charles, Illinois.
4. **Bauslaugh, Bruce (1985):**
   - *Adventures on the DEC PDP-11: A Survey of Berkeley Campus Games*. Student Computing Quarterly, UC Berkeley.
