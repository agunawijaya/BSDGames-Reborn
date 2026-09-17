# Fortune — BSDGames Reborn

A faithful modernization and pedagogical study of the classic BSD UNIX utility
**Fortune** (and its companion indexing tools **Strfile** and **Unstr**),
originally written in 1979 by **Ken Arnold** at the University of California, Berkeley.

---

## 1. Quick Start

```bash
# Display a random fortune from standard adages (requires bsdgames package on Linux/WSL)
fortune

# Select short fortunes only (< 160 characters)
fortune -s

# Select long maxims only (>= 160 characters)
fortune -l

# Search for fortunes matching a regular expression
fortune -m "computer"

# Compile your own fortune cookie database
strfile my_quotes.txt my_quotes.dat
fortune my_quotes.txt
```

---

## 2. Directory Structure

```
bsdgames/fortune/
├── README.md              # THIS FILE — Landing page & directory map
├── AGENTS.md              # Agent instructions & context for this utility
├── CLAUDE.md              # Thin pointer to AGENTS.md
├── docs/
│   ├── about.md           # History, Ken Arnold (1979), hacker lore, ROT13 debate, screenshots
│   ├── how-to-play.md     # Comprehensive usage manual: flags (-a, -o, -s, -l, -m), weighted paths, strfile
│   ├── spec.md            # Reverse specification: STRFILE binary struct, 32-bit offset tables, invariants
│   ├── architecture.md    # Tripartite architecture (fortune + strfile + unstr), O(1) seek/read, regex engine
│   ├── lessons.md         # Pedagogical analysis: binary offset indexing, endianness portability, ROT13
│   ├── port-ideas.md      # Modernization roadmap: UTF-8, JSON/SQLite backends, fuzzy search TUI, Cowsay
│   ├── diff-log.md        # Original 1979/1985 BSD C vs modern spiritual successor
│   ├── notes.md           # Binary header byte layout, probability weighting math, database statistics
│   ├── manpage.md         # Annotated mirror of fortune(6) and strfile(8) manual pages
│   ├── lineage.md         # Heritage from UNIX motd/cookies to BSD Fortune to Cowsay to Discord bots
│   ├── test-scenarios.md  # Short/long length verification, ROT13 decoding, custom strfile database test scripts
│   ├── references.md      # Primary sources, Ken Arnold citations, Jargon File, CSRG Berkeley archives
│   └── decisions/         # Per-game/utility Architecture Decision Records (ADRs)
│       └── README.md      # ADR index and scope
└── media/                 # Raw terminal captures and usage examples
    ├── 01-fortune.txt     # Standard random fortune output
    ├── 02-offensive.txt   # ROT13 offensive fortune display and decoding
    └── 03-search.txt      # Regular expression search query (-m) output
```

---

## 3. The Utility at a Glance

- **Genre:** Text Epigram & Quotation Database / Systems Utility.
- **Author:** Ken Arnold (University of California, Berkeley CSRG, 1979/1985).
- **Historic Milestone:** A defining staple of UNIX culture. Pre-dating web APIs and RSS feeds by decades, `fortune` greeted millions of programmers upon terminal login, delivering wisdom, humor, and satire through a high-performance $O(1)$ binary indexer.
- **The Tripartite Engine:**
  1. `fortune`: The client that selects and prints random adages based on weighted probability, length filters, or regex queries.
  2. `strfile`: The index compiler that reads delimited text files (`%`) and generates a binary `.dat` file containing a `STRFILE` header and sorted table of 32-bit byte offsets.
  3. `unstr`: The reverse tool that reconstructs clean human-readable source text from an indexed database.
- **The ROT13 Safeguard:** Pioneered the use of symmetric Caesar cipher (ROT13) to store sensitive or offensive epigrams (`-o`, `-a`) in an obfuscated format on multi-user systems.

---

## 4. Upstream Source Reference

The original BSD C source is available in the upstream repository:
- Repository: [vattam/BSDGames](https://github.com/vattam/BSDGames)
- Source folder: [`vattam/BSDGames/tree/master/fortune`](https://github.com/vattam/BSDGames/tree/master/fortune)
