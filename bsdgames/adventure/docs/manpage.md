# `adventure` — Original Man Page (Annotated)

> Mirror of the original `adventure.6` man page from BSDGames, converted
> to Markdown and annotated with historical and technical context.
>
> Upstream source: <https://github.com/vattam/BSDGames/blob/master/adventure/adventure.6>

---

## Copyright & License Notice

```text
Copyright (c) 1991, 1993
	The Regents of the University of California.  All rights reserved.

The game adventure was originally written in Fortran by Will Crowther
and Don Woods.  It was later translated to C and enhanced by Jim
Gillogly.  This code is derived from software contributed to Berkeley
by Jim Gillogly at The Rand Corporation.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:
1. Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.
3. Neither the name of the University nor the names of its contributors
   may be used to endorse or promote products derived from this software
   without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED.  IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
SUCH DAMAGE.

	@(#)adventure.6	8.1 (Berkeley) 5/31/93
```

---

## NAME

`adventure` — an exploration game

## SYNOPSIS

```bash
adventure [saved-file]
```

## DESCRIPTION

The object of the game is to locate and explore Colossal Cave, find the treasures hidden there, and bring them back to the building with you. The program is self-descriptive to a point, but part of the game is to discover its rules.

To terminate a game, enter `quit`; to save a game for later resumption, enter `suspend`.

---

## HISTORICAL & TECHNICAL ANNOTATIONS

1. **Authorship Lineage:**
   - **Will Crowther (1975–1976):** Wrote the original version in PDP-10 Fortran on a DEC PDP-10 at Bolt, Beranek and Newman (BBN). Crowther based the cave layout on real-world surveys of Bedquilt Cave in Kentucky's Mammoth Cave National Park.
   - **Don Woods (1976–1977):** Discovered the source on the Stanford AI Lab (SAIL) PDP-10 and vastly expanded the game, adding Tolkien-inspired fantasy elements (dwarves, dragon, troll, magic words like `plugh` and `xyzzy`, and the 350-point scoring system).
   - **Jim Gillogly (1977):** Ported the Fortran code to the C programming language at The Rand Corporation, creating the foundation for Unix distributions.
2. **The `suspend` Mechanic:**
   In early university and corporate timesharing networks, *Adventure* was notorious for consuming excessive CPU cycles. The `suspend` command saved state to a file, but the underlying engine (`wizard.c`) checked timestamps to ensure students did not resume play during prime working hours (`latncy = 45` minutes delay), unless authenticated by the wizard password.
3. **Vocabulary Truncation:**
   The command parser recognizes English words, but compares only the first **5 letters** (e.g. `INVENTORY` becomes `INVEN`, `NORTH` becomes `NORTH`, `NORTHEAST` becomes `NE`).
