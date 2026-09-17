# `battlestar` — Feature Diff Log

> Detailed comparison between the original 1983 BSD C implementation and the planned spiritual successor port.

---

## Feature Comparison Matrix

| Feature | Original 1983 BSD C Implementation | Planned Spiritual Successor Port | Modernization Rationale |
|---|---|---|---|
| **World Scale** | Exactly 275 rooms (`NUMOFROOMS 275`). | Exactly 275 rooms preserved with canonical text. | Preserves original world geography and puzzle connectivity. |
| **Day / Night Engine** | Pointer swap between `dayfile` and `nightfile` every 100 turns (`CYCLE 100`). | Preserved pointer swap / state machine with smooth transition alerts. | Core identity feature; maintained exactly. |
| **Object Count** | Exactly 64 objects (`NUMOFOBJECTS 64`). | Exactly 64 canonical objects + structured metadata. | Preserves item puzzles, encumbrance mechanics, and inventory balance. |
| **Parser Architecture** | Custom 2-to-3 word token scanner (`getcom()`, `parse()`, `cypher()`). | Enhanced parser with stop-word stripping, typo-tolerance, and auto-complete. | Greatly improves modern user experience without breaking classic verbs. |
| **Flight Engine (`fly.c`)**| Direct Berkeley `curses` routines with fixed 80x24 terminal assumptions. | Cross-platform ANSI/Unicode TUI engine with graceful window scaling. | Fixes terminal resize crashes and ensures compatibility across modern terminals. |
| **Save / Restore** | Binary file (`.Bstar`) with trivial XOR user-name masking. | Structured JSON save format with schema validation and backwards compatibility. | Enhances portability, inspectability, and cross-platform cloud sync. |
| **Scoring Matrix** | Tri-partite evaluation: Pleasure, Power, Ego (`rate()`). | Preserved tri-partite rating + detailed breakdown analytics. | Retains the beloved hacker-era cultural humor and title hierarchy. |
| **Wizard Privileges** | Hardcoded Unix usernames (`riggle`, `dmr`, `ken`) via `getpwuid()`. | Explicit `--wizard` flag or in-game secret passphrase. | Portable across non-Unix OS and modern multi-user environments. |
| **Privilege Model** | Unix `setregid()` for `/var/games/battlestar.log` access. | Pure user-space sandboxed file I/O. | Obsolete on modern single-user desktop and containerized systems. |
| **Color & Graphics** | Monochrome terminal text stream. | Configurable 16-color / 256-color ANSI retro palettes. | Adds visual appeal and improves readability of room exits and statuses. |
