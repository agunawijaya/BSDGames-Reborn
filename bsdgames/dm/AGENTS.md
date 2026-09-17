# AGENTS.md — `dm`

> Instructions for AI coding agents working on the `dm`
> documentation. **Read this first.**

## Owner and status

- **Current owner:** Agun (via Claude).
- **Phase:** Documentation only — port explicitly **skipped** by
  [`docs/decisions/dm-001-skip-port.md`](./docs/decisions/dm-001-skip-port.md).
- **Root sync:** upstream at
  <https://github.com/vattam/BSDGames/tree/master/dm>.
- Do **not** paste local filesystem paths (`E:\...`, `/mnt/...`,
  `/home/...`) into any doc — this repo will be public on GitHub.
  Cite upstream URLs only.

## What's already done

- 4 detailed docs written to teach modern programmers what `dm`
  did and how it worked around 1987's limitations:
  - `docs/about.md` — introduction + advanced-for-its-time trivia.
  - `docs/architecture.md` — mechanism walkthrough.
  - `docs/lessons.md` — modern padanan (cgroups, MDM, K8s, etc.).
  - `docs/lineage.md` — where these ideas live now.
- ADR `dm-001-skip-port.md` records the skip decision with full
  reasoning.
- Stub docs for `how-to-play.md`, `port-ideas.md`,
  `test-scenarios.md` point at the ADR.

## Editorial direction

The user's brief for this folder is unusual:

> *"Saya tetap mau document about dan architecture. Supaya
> programmer jaman sekarang bisa belajar, bagaimana cara orang di
> masa lalu bisa mengakali keterbatasan. Tulis juga apa yang
> advance pada masanya."*

Translation: write for modern programmers who've never touched a
shared Unix machine. Show them **how the 1987 engineers hacked
around limits that no longer exist** (no containers, no cgroups, no
systemd), and **highlight what was ahead of its time** (declarative
policy files, symlink dispatchers, load-aware scheduling).

## What NOT to do

- **Do not attempt a port.** The port is explicitly skipped. Any
  "modernization" belongs in a separate project (e.g., a
  parental-controls tool inspired by dm), not here.
- **Do not add `src/`, `data/`, or `tests/` content.** Those
  folders exist for structural consistency only.
- **Do not capture screenshots.** `dm` has no interactive UI;
  its output is a single denial message to stderr.

## Files

- No screenshots (`media/` is empty and stays that way — dm's
  entire "UI" is 1–2 lines of error text).
- No `src/` (port skipped).
- No `data/` (dm.conf is user-authored, not shipped by the
  program).
- No `tests/` (nothing to test — the port is skipped).

## Quality checklist

Follow the Quality Self-Check in root [`AGENTS.md`](../../AGENTS.md)
§12 before marking anything done — but with the port-related
items marked "n/a".

## Contact

Questions → open an issue tagged `dm` or ping @agunawijaya.
