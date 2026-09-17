# `phantasia` — Working Notes

> Free-form working notes for the `phantasia` port.

---

## 2026-09-16 — Pre-Port Documentation Phase

- All 12 pre-porting docs generated from source analysis
  (`main.c`, `phantasia.6`, `phantstruct.h`, `phantglobs.h`,
  `phantdefs.h` surveyed; `fight.c`, `interplayer.c`, `setup.c`
  overviewed).
- Screenshots **NOT captured live** — see below.
- Added synthesized mockups in `about.md` based on man page
  description.

## Screenshot Gap

`phantasia` is **not shipped in the standard Debian bsdgames
package** because it requires system-wide setup:

1. A character file (fixed-size records, one slot per player).
2. An energy void file (event queue).
3. A MOTD file.
4. A scoreboard file.
5. The `monsters.asc` monster database.

These are created by a system administrator, typically once
per host, before `phantasia` will run. Debian and NetBSD have
package-management challenges around this setup and generally
exclude phantasia from the default `bsdgames` binary package.

### Alternatives for Live Capture

- **Option 1:** Compile phantasia from BSDGames-master source in
  WSL, run `phantasia -S` as root to set up, capture.
- **Option 2:** Use a dedicated Docker container with phantasia
  pre-setup.
- **Option 3:** Use synthetic mockups (current approach).

For the port itself, the `data/` directory in this folder will
hold the necessary setup files with a bootstrap script.

## Key Findings from Source Analysis

- **Edward Estes was at Bell Labs** — the birthplace of Unix.
  This game is written in the environment that invented Unix.
- **No formal copyright** — Estes's disclaimer says the game
  "may be used in any manner the recipient sees fit." Legally
  ambiguous.
- **File-based multi-user coordination** — no daemons, no
  sockets. Just `flock()` on shared files. Elegant and 1986-
  perfect.
- **6 character types × 10 stats × ~15 spells × 100 monsters** —
  substantial content for a text game.
- **Real-time inter-terminal PvP** — the proto-MMO feature.
- **`monsters.asc`** is user-editable ASCII — mod support in
  1986.

## Open Design Questions (Future ADRs)

- Password migration from plaintext to bcrypt.
- Persistence: replace `flock()` file with SQLite? Server API?
- Multiplayer: single-machine vs. internet MMO?
- Tolkien vocabulary: keep with attribution or rename?
- Wizard mode: preserve or replace with admin panel?

## Compared to Other Pilot Games

- **trek** (Estes-era peer): both use fixed-size records + type-
  driven stat progression. Trek is single-player; phantasia is
  proto-MMO.
- **hack** (also 1985-1986): both use RPG mechanics; hack is
  procedural single-player, phantasia is persistent multi-user.
- **hunt** (multiplayer): both are multi-user; hunt uses UDP
  daemon, phantasia uses shared files. Different eras of Unix
  IPC.

## Cultural Weight

For anyone interested in MMO history, `phantasia` is a **must-
port**. It demonstrates that the proto-MMO existed in 1986,
predating Ultima Online by 11 years. The port could be a
teaching artifact for MMO archaeology.

<!--
Notes to future iterations:
- Consider a "hardcore mode" as a purity-preserving flag.
- The wizard-mode dialogue with sysadmin ergonomics is worth a
  dedicated ADR.
- The Tolkien vocabulary licensing is genuinely tricky for
  commercial distribution. Consider a "vanilla" mode with
  renamed ranks.
-->
