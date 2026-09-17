# Learning — Skill Notes

> Accumulated techniques, patterns, and hard-won lessons from
> building this repo. Distinct from ADRs (which are decisions
> with binding force) and from porting-guide (which is workflow).
> These are **skills** — reusable know-how that would otherwise
> die when a session ends or an agent rotates out.

## What lives here

| File | Topic | When to read |
|---|---|---|
| [`fancy-web-visual-toolkit.md`](./fancy-web-visual-toolkit.md) | Canvas 2D procedural rendering techniques: single-pass glow, offscreen cache, spring-follow physics, state-machine sprites, multi-theme palette system | Building any `fancy-web` port or similar visual work |
| [`browser-port-screenshots.md`](./browser-port-screenshots.md) | Playwright + Chromium pipeline for capturing browser-based port screenshots (multi-theme, driven interactions) | Any port with an HTML/JS entry point (`fancy-web`, `classic-web`, `mobile-gimmicks`) |
| [`git-and-github-workflow.md`](./git-and-github-workflow.md) | Multi-account gh CLI pitfalls, WSL vs Windows gh separation, staged commit narrative pattern, ambiguity-triggers-stop rule | Any interaction with git, GitHub CLI, or setting up a new repo |

## Why a separate folder

- **ADRs** (`docs/decisions/`) are decisions. They bind, they're
  accepted or superseded, they carry authority.
- **Porting guide** (`docs/porting-guide.md`) is workflow — the
  standard step-by-step for the standard case.
- **Templates** (`docs/templates/`) are boilerplate scaffolds.
- **Learning notes** (`docs/learning/`) are techniques and skills.
  Nobody is bound by them. They're offered as help.

The distinction matters because ADRs must be maintained
authoritatively (superseded, updated on decision change), while
learning notes accumulate as a knowledge library and rarely need
formal supersession — only revision as techniques evolve.

## Contribution

Add a skill note when:

1. You solved a non-obvious problem whose solution is **not
   captured** in an ADR, porting-guide, or template.
2. The solution is **reusable** — another agent or contributor
   would benefit from knowing it.
3. The solution has **concrete WHY, WHEN, and HOW** — not just
   "here's what I did once".

Don't add a skill note for:

- One-off game logic (goes in that game's `docs/lessons.md`)
- Decisions with binding force (make an ADR)
- Standard workflow steps (update porting-guide)
- Code patterns already documented inline

## Naming

Descriptive kebab-case: `<topic>-<focus>.md`. Examples:

- `fancy-web-visual-toolkit.md`
- `browser-port-screenshots.md`
- `git-and-github-workflow.md`

Not:

- `notes.md` (too generic)
- `snake-things.md` (game-specific → goes in the game's folder)
- `misc.md` (nothing this vague earns a slot here)

## Related

- [Porting guide](../porting-guide.md) — the standard workflow
- [ADRs](../decisions/) — binding decisions
- [Templates](../templates/) — boilerplate scaffolds
- [Root `AGENTS.md`](../../AGENTS.md) — repo-wide agent instructions
