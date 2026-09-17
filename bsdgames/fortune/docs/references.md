# Fortune — References & Bibliography

Authoritative citations, historical documentation, and upstream source references
for BSD Fortune, Strfile, and Unstr.

---

## 1. Upstream Source Code

- **Repository:** [BSDGames on GitHub (vattam/BSDGames)](https://github.com/vattam/BSDGames)
- **Fortune Directory:** [`vattam/BSDGames/tree/master/fortune`](https://github.com/vattam/BSDGames/tree/master/fortune)
- **Primary Source Modules:**
  - [`fortune/fortune.c`](https://github.com/vattam/BSDGames/tree/master/fortune/fortune/fortune.c) — Main query client and selection engine.
  - [`strfile/strfile.c`](https://github.com/vattam/BSDGames/tree/master/fortune/strfile/strfile.c) — Index table compiler.
  - [`strfile/strfile.h`](https://github.com/vattam/BSDGames/tree/master/fortune/strfile/strfile.h) — Binary `STRFILE` header structure definition.
  - [`unstr/unstr.c`](https://github.com/vattam/BSDGames/tree/master/fortune/unstr/unstr.c) — Index decompiler.
  - [`fortune/fortune.6.in`](https://github.com/vattam/BSDGames/tree/master/fortune/fortune/fortune.6.in) — User manual page.
  - [`strfile/strfile.8`](https://github.com/vattam/BSDGames/tree/master/fortune/strfile/strfile.8) — Administrator manual page.

---

## 2. Historical & Cultural References

- **Arnold, Kenneth.** *Fortune* (1979/1985), Computer Systems Research Group (CSRG),
  University of California, Berkeley.
- **Raymond, Eric S.** *The New Hacker's Dictionary* (The Jargon File), 3rd Edition (1996),
  MIT Press. Definitive etymology and hacker cultural context for "fortune cookie" and UNIX adages.
- **Salus, Peter H.** *A Quarter Century of UNIX* (1994), Addison-Wesley. Historical overview of
  Berkeley software distributions and interactive terminal culture.
- **Monroe, Tony.** *Cowsay* (1999). Classic terminal utility and ASCII art generator designed
  to consume `fortune` output.

---

## 3. Systems Programming References

- **IEEE / The Open Group:** *The Open Group Base Specifications Issue 7 / IEEE Std 1003.1-2017*
  (POSIX.1-2017). Specification for `regcomp()`, `regexec()`, and regular expression pattern matching.
- **Reynolds, J. & Postel, J.** *RFC 1700: Assigned Numbers* (1994), Internet Engineering Task Force
  (IETF). Formal definition of Network Byte Order (Big-Endian) byte layout for network data transfer.
- **CSRG:** *4.3 Berkeley Software Distribution (4.3BSD)*, University of California, Berkeley (1986).
  The release that codified the modern `strfile` binary format and ROT13 offensive database isolation.
