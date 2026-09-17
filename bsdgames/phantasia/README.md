# phantasia

> **A persistent, multi-terminal, character-driven fantasy RPG from AT&T Bell Labs, 1986. Roll up a magic-user or a dwarf, wander a Cartesian world, cast spells, fight monsters — and meet other players in real time on the same machine.**

**Category:** Adventure & RPG
· **Status:** 🟠 In Progress (documentation phase)
· **Original author:** Edward A. Estes, AT&T (1986)
· **Version:** Phantasia 3.3.2
· **First BSD release:** ~1986–1987

---

## About This Folder

This folder is the modernised port of **`phantasia`** — a
proto-MMO written for AT&T Unix terminals in 1986, decades before
"online multiplayer" was a phrase. It is one of the earliest
examples of a *persistent, multi-user, character-driven fantasy
RPG*. See [`docs/about.md`](./docs/about.md) for the story.

## Documentation

| Doc | What's in it |
|---|---|
| [`docs/about.md`](./docs/about.md) | Brochure — Edward Estes, AT&T Bell Labs, why it's the proto-MMO |
| [`docs/how-to-play.md`](./docs/how-to-play.md) | Character types, stats, movement, spells, combat |
| [`docs/architecture.md`](./docs/architecture.md) | Shared-file multi-user model, character persistence, event system |
| [`docs/lessons.md`](./docs/lessons.md) | File-based IPC, persistent character DB, spell taxonomy |
| [`docs/port-ideas.md`](./docs/port-ideas.md) | Modernization: internet MMO, real 3D, richer parser |
| [`docs/spec.md`](./docs/spec.md) | Formal spec: 6 character types, 10 stats, 15+ spells, multi-user rules |
| [`docs/notes.md`](./docs/notes.md) | Working notes (includes screenshot gap explanation) |
| [`docs/manpage.md`](./docs/manpage.md) | Mirror + annotation of `phantasia.6` |
| [`docs/diff-log.md`](./docs/diff-log.md) | Feature-by-feature original → port log |
| [`docs/test-scenarios.md`](./docs/test-scenarios.md) | Manual playthrough scripts |
| [`docs/lineage.md`](./docs/lineage.md) | Proto-MMO lineage: MUD1 → Phantasia → Ultima Online → WoW |
| [`docs/references.md`](./docs/references.md) | Sources & citations |

*Not applicable to this game:* `walkthrough.md`, `world-map.md` —
`phantasia`'s "world" is a Cartesian plane, not a room network,
and every session's story emerges from player interaction.

## Media

⚠️ Screenshots pending — `phantasia` is not shipped in the
standard Debian `bsdgames` package (it requires per-system
setup with character files, void files, MOTD, and scoreboard).
See [`docs/notes.md`](./docs/notes.md) for details. Synthetic
mockups embedded in [`docs/about.md`](./docs/about.md) illustrate
key screens.

## Attribution

Based on the original **`phantasia`** by **Edward A. Estes** at
AT&T (March 12, 1986). Distributed with an unusual disclaimer:
*"This game is distributed without notice of copyright, therefore
it may be used in any manner the recipient sees fit."* See
[`../../ATTRIBUTION.md`](../../ATTRIBUTION.md).
