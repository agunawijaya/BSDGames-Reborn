# hangman · fancy-web — Escape the Gallows

> A **spiritual successor** to BSD `hangman(6)` — letter-by-letter
> word-guessing under a limited miss budget — reframed as a
> **5-level narrative escape** where each door bears a themed cipher
> and each failed guess advances a scene-specific threat. Same core
> mechanic as the 1985 original (one hidden word, N wrong guesses =
> death); everything else is modernised.

[![status](https://img.shields.io/badge/status-released-brightgreen)](../../../../docs/progress.md)
[![style](https://img.shields.io/badge/style-fancy--web-ff00ff)](../../../../docs/decisions/006-multi-port-architecture.md)
[![license](https://img.shields.io/badge/license-MIT-blue)](../../../../LICENSE)

## Play

Open [`index.html`](./index.html) in any modern browser.

Double-click, drag to Chrome/Firefox — no build, no server, no
deps. All 5 themes + lose visuals work offline.

### Controls

- **Type any letter** — guess it
- **Click the on-screen keyboard** — same effect
- **Enter** on the game-over overlay — restart

### The five levels

Each level is a themed room with its own cipher (word), threat
mechanic, and boss whose weakness is a single word. Solve the
cipher to reveal the boss taunt + weakness clue.

| # | Level | Boss | Threat | Weakness word |
|---:|---|---|---|---|
| 1 | Pirate's Hold | Cpt. Blackrot | Rising water (max 50% so death-scene stays visible) | PARDON |
| 2 | Alchemist's Laboratory | Doktor Formalin | Full-screen poison gas fog (opacity ramps up per miss) | ANTIDOTE |
| 3 | Pharaoh's Tomb | Amun-Rekh, the Undying | Cinematic sand rain per miss + base sand pile | SUNLIGHT |
| 4 | Vampire's Crypt | Count Nachtvorn | Vampire approaches werewolf — no rising overlay | GARLIC |
| 5 | Void Vessel | The Warden (AI) | Oxygen dashboard depletes (green → amber → red) | OVERRIDE |

The player switches themes freely via the picker at the top —
each theme starts a fresh word from its ~40-word themed dictionary.

### Death scenes

Every theme has a bespoke death visual so losing feels earned
(not just an overlay). Text on the game-over screen is drawn
with heavy shadow so the scene stays visible behind:

- **Pirate**: character disappears, 13 scattered floating bodies
  half-submerged on the water surface
- **Lab**: alchemist replaced by suffocated variant, gas fog at
  ~62 % opacity
- **Temple**: worker collapses to 50 % size, mummy walks in from
  the left edge (mirrored, half-visible)
- **Crypt**: vampire and werewolf both hidden, replaced by a
  single "Dracula killing werewolf" image with thin moonlight halo
- **Void**: cockpit glass shatters with 100+ procedural crack
  paths (radial primary + branches + concentric rings + micro
  fragments + debris + impact hole)

### What's preserved from BSD `hangman(6)`

| Original mechanic | Preserved |
|---|---|
| One hidden word at a time | Yes — one word per level per round |
| Letter-by-letter guessing | Yes |
| Fixed miss budget → death | Yes — 6 wrong guesses (was 7 in original) |
| Curated dictionary | Yes — but per-theme thematic pools (~40 words each) instead of system dictionary |
| Text UI | No — that's the point of `fancy-web` |

The 6 vs 7 miss budget is the only mechanic deviation and is
recorded in [`docs/decisions/fancy-web-001-tech-stack.md`](./docs/decisions/fancy-web-001-tech-stack.md).

## Style credit — reference assets

This port is a **reference-asset composition**, not a hand-drawn
piece. Every character, statue, prop, and background image lives
in [`references/`](./references/) and is embedded via `<img>`,
CSS `background-image`, or `mask-image`. Only procedural
generation is done in code (wood grain seams, temple stone
courses, tesla sparks, sand rain, cockpit shatter, etc).

Reference source-of-truth is
[`docs/decisions/fancy-web-001-tech-stack.md`](./docs/decisions/fancy-web-001-tech-stack.md).

## For agents modifying this port

- Read [`AGENTS.md`](./AGENTS.md) first.
- See [`docs/diff-log.md`](./docs/diff-log.md) for a
  Kept/Changed/Added/Removed narrative of every meaningful
  decision.
- See [`docs/decisions/`](./docs/decisions/) for port ADRs.

## See also

- Canonical spec: [`../../docs/spec.md`](../../docs/spec.md)
- Port ideas / competitive landscape:
  [`../../docs/port-ideas.md`](../../docs/port-ideas.md)
- Root port architecture ADR:
  [`../../../../docs/decisions/006-multi-port-architecture.md`](../../../../docs/decisions/006-multi-port-architecture.md)
