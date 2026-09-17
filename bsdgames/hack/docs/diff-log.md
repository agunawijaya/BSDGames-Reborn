# `hack` — Feature Diff Log

> Detailed comparison between the original 1985 BSD Hack 1.0.3 implementation and the planned spiritual successor port.

---

## Feature Comparison Matrix

| Feature | Original 1985 BSD Hack 1.0.3 | Planned Spiritual Successor Port | Modernization Rationale |
|---|---|---|---|
| **Dungeon Generation** | 30 procedural floors ($80 \times 24$ character grid). | 30 procedural floors preserved with canonical room layouts. | Preserves the authentic level pacing and dungeon depth. |
| **Monster Roster** | Exactly 58 monster classes (`def.permonst.h`). | Exactly 58 canonical monsters + detailed stat inspect UI. | Preserves original tactical bestiary and damage equations. |
| **Bones System** | Local spool directory binary files (`bonD0.x`). | Local files preserved + opt-in Global Cloud Bones API. | Extends legendary social graveyard feature to the internet. |
| **Rendering Engine** | Termcap / curses monochrome terminal routines. | Multi-backend: ANSI 24-bit TrueColor + Optional Pixel Tileset. | Eliminates terminal display glitches and adds visual accessibility. |
| **Controls & Navigation** | Pure vi-keys (`h/j/k/l/y/u/b/n`). | Vi-keys preserved + arrow keys, numpad, and mouse pathfinding. | Enhances accessibility on modern keyboards and laptop layouts. |
| **Item Identification** | Randomized colors and manual testing. | Randomized appearances preserved + automatic in-game notebook. | Retains deduction puzzle while reducing repetitive player paper notes. |
| **Save / Restore** | Binary memory dumps to `/tmp` with setuid locks. | Structured cross-platform JSON save files with checksums. | Modern security and clean cross-platform desktop persistence. |
| **Seed Support** | Seeded solely with `time(NULL)`. | Deterministic CLI `--seed <num>` support. | Enables competitive daily challenges and speedrun verification. |
| **Role Selection** | 6 roles: Tourist, Speleologist, Fighter, Knight, Cave-man, Wizard. | All 6 canonical roles preserved with distinct starting gear. | Preserves class balance and distinct survival strategies. |
