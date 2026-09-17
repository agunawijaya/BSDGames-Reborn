# AGENTS.md — Fortune Agent Instructions

This file contains instructions specific to the `bsdgames/fortune` folder.
It inherits from and defers to the root [AGENTS.md](../../AGENTS.md).

---

## 1. Scope and Mission

`bsdgames/fortune` is the modern spiritual successor port of BSD `fortune`,
`strfile`, and `unstr`, originally authored in 1979 by **Ken Arnold** at UC Berkeley.

Our objectives for this utility:
1. **Preserve:** Keep authentic fortune behavior (command-line options `-a`, `-o`, `-s`,
   `-l`, `-m pattern`, `-f`, weighted selection syntax `N% file`, delimiter `%` parsing,
   and reversible ROT13 obfuscation).
2. **Modernize:** Provide complete multi-byte and UTF-8 encoding support, alternative
   modern backends (JSON, SQLite, TOML), cross-platform binary compatibility, and an
   interactive terminal TUI for fuzzy-searching quotes (similar to `fzf`).
3. **Teach:** Demystify $O(1)$ random-access binary file indexing (`fseek`/`fread`),
   network byte-order serialization (`htonl`/`ntohl`), defensive text obfuscation, and
   command-line probability distribution grammar.

---

## 2. Applicable Standards

- Root ADRs in `docs/decisions/` apply unless overridden in `docs/decisions/`.
- No local filesystem paths anywhere in documentation or code (see root `AGENTS.md` §11).
- Use upstream GitHub links: `https://github.com/vattam/BSDGames/tree/master/fortune/...`
- All diagrams must be Mermaid.
- Documentation adheres strictly to the taxonomy defined in root `AGENTS.md` §6.

---

## 3. Key Upstream Source Files

| Upstream Directory & File | Role & Relevance |
|---|---|
| `fortune/fortune.c` | Main client: CLI parsing, weighted file probability calculation, regex search |
| `strfile/strfile.c` | Binary compiler: parses text delimited by `%`, builds `STRFILE` header and offset table |
| `strfile/strfile.h` | Binary format header definition (`STRFILE`), flags (`STR_RANDOM`, `STR_ORDERED`, `STR_ROTATED`) |
| `unstr/unstr.c` | Decompiler: recreates source text from `.dat` binary index |
| `fortune/fortune.6.in` | Original BSD UNIX troff manual page for fortune |
| `strfile/strfile.8` | System administrator manual page for strfile |
