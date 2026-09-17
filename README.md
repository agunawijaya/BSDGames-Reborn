# BSDGames Reborn

**A spiritual-successor port of the classic BSDGames package to modern platforms — and a living textbook on classic Unix game programming.**

[Original source: github.com/vattam/BSDGames](https://github.com/vattam/BSDGames) · [License: MIT](./LICENSE) · Status: **Phase 1 — Foundation**

---

## What Is This?

**BSDGames Reborn** takes all **43 programs** from the classic BSDGames
package — from `tetris` and `hack` to the multiplayer `hunt` and the
persistent RPG `phantasia` — and re-implements them for modern
platforms with modern UI/UX, internet multiplayer, and improved AI.

But this isn't only a port. Every game folder is a **self-contained
learning artifact**:

- A brochure with history, authors, and cultural context.
- A guide to playing, winning, and finding easter eggs.
- An analysis of the original C architecture (with mermaid diagrams
  and code excerpts) — how programmers of the 1980s solved problems
  with tiny memory and 80×24 terminals.
- A "textbook" pointing to specific file / line / procedure in the
  original source, telling beginner programmers *what to learn and
  where*.
- A design brainstorm on how the modernized port improves on the
  original.

**The goal**: preserve, modernize, and teach — all at once.

## Why Bother?

- Many of these games are the direct ancestors of modern genres.
  `hack` → roguelike (NetHack, Diablo, Hades). `adventure` →
  interactive fiction. `hunt` → LAN deathmatch → FPS multiplayer.
  `phantasia` → MMO.
- The original source is beautiful, compact C — a museum of technique.
- Multiplayer *before the Internet* is a fascinating piece of
  computing history worth preserving.
- 43 discrete units of work make a rich portfolio of learning.

## Documentation Map

- [`docs/catalog.md`](./docs/catalog.md) — All 43 programs by category.
- [`docs/heritage.md`](./docs/heritage.md) — Historical context on the original BSDGames.
- [`docs/multiplayer.md`](./docs/multiplayer.md) — How multiplayer worked before the Internet.
- [`docs/porting-guide.md`](./docs/porting-guide.md) — Standard workflow for porting a game.
- [`docs/progress.md`](./docs/progress.md) — 43-program dashboard.
- [`docs/decisions/`](./docs/decisions/) — Architecture Decision Records (ADRs).

## For AI Agents / Contributors

The primary instruction file is [`AGENTS.md`](./AGENTS.md). All AI
coding tools (Claude Code, Codex, Kimi, Gemini via AntiGravity, etc.)
should read that file first. It is the *single source of truth* for
project conventions.

## Attribution

Based on the [BSDGames port to Linux by Joseph S. Myers](https://github.com/vattam/BSDGames),
which itself ports the games from NetBSD. Every ported game credits
its original authors in `bsdgames/<game>/docs/about.md`. See
[`ATTRIBUTION.md`](./ATTRIBUTION.md) for details.

## License

[MIT](./LICENSE). Original BSD-licensed source is *not* redistributed
here — retrieve it from the upstream link above.
