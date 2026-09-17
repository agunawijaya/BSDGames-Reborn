# Learning — Git & GitHub Workflow

> Practical git and GitHub CLI lessons learned setting up this
> repo. Includes multi-account `gh` pitfalls, WSL vs Windows
> separation, staged commit narrative patterns, and the
> **ambiguity-triggers-stop** rule.

---

## The ambiguity-triggers-stop rule

**Before running any command whose behavior depends on identity
or context that isn't 100% clear — pause and confirm.**

Example that hurt this repo's setup:

- `gh auth status` showed **two** accounts logged in:
  `agunawijaya` and `ardhi-zl`.
- User had said "use agunawijaya" explicitly.
- I ran `gh repo create BSDGames-Reborn --public --source=. --push`
  **without** an explicit `--owner`.
- `gh` chose `ardhi-zl` (probably because that token had wider
  scopes). Repo landed in the wrong account.
- Cleanup required user to manually delete the wrong repo, then
  I recreated with explicit owner.

**The lesson:** *"active" account in `gh auth status` does not
guarantee that account is used for a given command.* When
multiple accounts exist, `gh` may pick any of them based on
factors that aren't visible to you.

**The rule:** when you notice N ≥ 2 identities/accounts/paths/
possible interpretations, **stop and ask the user "which one"**
before proceeding. The cost of one clarifying message is far
lower than the cost of undoing an action across an external
service.

Categories where this rule applies:

- Multiple GitHub accounts logged in via `gh`
- Multiple SSH keys / git identities configured
- Multiple remote repos with the same name in different orgs
- Multiple gcloud / aws / az profiles active
- Multiple branches with similar names (main vs master vs
  develop)
- Ambiguous local paths (`~/project` vs `/mnt/…/project`)

## Windows `gh` vs WSL `gh` — separate configs

**They are different installations with different auth stores.**

- Windows `gh` stores config at
  `%APPDATA%\GitHub CLI\hosts.yml` (or similar).
- WSL `gh` stores config at `~/.config/gh/hosts.yml`.

You can be logged in as different accounts in each — and it
happens more often than you'd expect if you `apt install gh`
inside WSL after already having Windows `gh`.

### Check which context you're in

```bash
# Windows (from PowerShell / cmd — Bash tool default)
gh auth status
# Reports Windows gh's stored accounts

# WSL (from `wsl -e bash -lc "..."`)
gh auth status
# Reports WSL gh's stored accounts — possibly different set
```

### Which one to use in Claude Code

- **Default Bash tool** runs PowerShell on Windows; `gh` there is
  Windows `gh`. Use it if the target account is only in Windows
  `gh`.
- **`wsl -e bash -lc "gh ..."`** runs WSL `gh`. Use it if the
  target account is only in WSL `gh`, or if you're chaining with
  other Linux commands.

### If accounts diverge

If you need the same account in both, login again in whichever
context lacks it:

```bash
# From WSL:
gh auth login
# Follow the browser flow
```

## Explicit `<owner>/<repo>` form

Even when `gh` is authenticated as the intended user, the safe
form is:

```bash
gh repo create <owner>/<repo> ...
```

Not:

```bash
gh repo create <repo> ...
```

The explicit form is unambiguous even in multi-account setups.
The implicit form relies on `gh`'s account selection heuristics,
which can surprise you.

## `delete_repo` scope not in default token

Default `gh` token scopes typically include `repo`, `read:org`,
`gist` — but **not** `delete_repo`.

If you need to delete a repo you own:

```bash
gh auth refresh -h github.com -s delete_repo
# Opens browser OAuth flow to add the scope
```

Then:

```bash
gh repo delete <owner>/<repo> --yes
```

**Do not** silently add `delete_repo` scope to a token — the user
should be aware their token gained a destructive capability.
Prefer to ask them to refresh (with the `!<command>` pattern in
Claude Code) or to delete via web UI.

## Staged commit narrative pattern

For an initial commit of a project with meaningful subsections,
resist the urge to do `git add . && git commit -m "initial"`.
Instead, tell the project's story through a small number of
commits.

Pattern used in this repo:

1. **`chore: initial scaffolding`** — root files (README, LICENSE,
   ATTRIBUTION, `.gitignore`, root `AGENTS.md` + `CLAUDE.md`),
   root docs (`docs/*.md` except progress), ADRs, templates,
   scripts. Anything foundational.
2. **`docs(games): 43 game folders`** — the mass content. Big
   commit but clearly one thing.
3. **`port(<game>): <port> — 🟢 Released`** — the pilot port.
   Sets precedent for future port release commits.
4. **`docs: progress dashboard baseline`** — the state summary
   pointing to everything the previous three commits created.

Result: `git log --oneline` reads as a table of contents. Anyone
skimming the history understands the shape of the project
without opening any file.

### Staging with exclusion

To include most of a subtree but not a subfolder:

```bash
git add bsdgames/                        # stage everything under bsdgames/
git reset HEAD bsdgames/<game>/ports/    # unstage the ports subfolder
git commit -m "..."
git add bsdgames/<game>/ports/           # commit ports separately
git commit -m "..."
```

`git reset HEAD <path>` unstages a path while keeping the working
tree unchanged. Not `git rm` (which deletes) — `git reset` just
removes from the index.

## Commit message conventions

Format used in this repo:

```
<type>(<scope>): <short summary>

<optional body — what and why>

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```

Types:

- `chore` — housekeeping (scaffolding, config, deps)
- `docs` — documentation only
- `port` — port-related changes; scope is the game name
- `feat` — new feature (post-release)
- `fix` — bug fix
- `refactor` — code restructuring without behavior change
- `perf` — performance improvement
- `test` — test additions/changes

Scope is optional but useful:

- `chore(deps): ...`
- `docs(games): ...`
- `port(snake): ...`
- `feat(snake/fancy-web): ...`

### Emoji-status markers

Reserved for port-release commits per this repo's convention:

- `🟢 Released` — port meets baseline (README + docs + working
  src + tests + media + passes canonical scenarios)
- `✨ Complete` — polished, live URL, all optional docs filled

Example: `port(snake): fancy-web pilot — 🟢 Released`.

## `.gitignore` — what to exclude

For a preservation project like this repo:

```gitignore
# Upstream vendored source — NOT redistributed here
BSDGames-master/
BSDGames-master.zip
*.tar.gz
*.tgz

# OS / editor cruft
.DS_Store
Thumbs.db
*.swp
*~
.vscode/
.idea/

# Build output
target/
build/
dist/
node_modules/
*.o
*.obj

# Secrets
.env
.env.local

# Local dev helper scripts (hardcoded paths, per-machine)
build_*.sh
compile_*.sh
```

### Why exclude `BSDGames-master/` upstream

The original BSDGames source is publicly available at
<https://github.com/vattam/BSDGames>. Redistributing it here
would:

1. Bloat the repo (~3 MB compressed, more uncompressed).
2. Muddy the licensing story — upstream is BSD 3-clause; this
   repo is MIT; mixing needs care.
3. Diverge from upstream over time.

Instead: developers who need it clone it themselves alongside
this repo. `.gitignore` prevents accidental commit of the local
copy.

## WSL/Windows path translation

Files at Windows path `E:\Projects\BSDGames` are also visible in
WSL as `/mnt/e/Projects/BSDGames`.

Both point to the same bytes on disk. Editing from either side is
safe. But:

- **Line endings** — WSL creates LF; Windows tools may create
  CRLF. Configure git: `core.autocrlf = input` (or install a
  `.gitattributes` with `* text=auto eol=lf`).
- **File permissions** — WSL sees Windows filesystem mounts with
  `chmod 777` by default; permissions bits from git are less
  meaningful. Executable scripts still need `chmod +x` in git's
  eyes.

For git operations, either context works. WSL is often faster
for git operations because native Linux git is faster than
Windows Git for Windows (Cygwin-based).

## Don't paste local paths in public docs

Anti-pattern documented in root `AGENTS.md` §11 and worth
repeating:

**Do not** write `E:\Projects\...` or `/mnt/e/Projects/...` in
any file that will be committed. This repo is public on GitHub.
Cite upstream URLs or relative paths only.

Example — bad:

> The dab source is at `/mnt/e/Projects/BSDGames/BSDGames-master/dab/`.

Example — good:

> The dab source is at
> [upstream](https://github.com/vattam/BSDGames/tree/master/dab).

If you need a local helper script with hardcoded paths (like
`build_dab.sh`), add its filename pattern to `.gitignore`.

## Setup checklist for a new repo like this one

Run once at start:

```bash
# 1. Init
git init
git branch -M main

# 2. Configure user
git config user.name "Full Name"
git config user.email "email@example.com"

# 3. Verify gh auth for the target account
gh auth status
# If wrong account is active, use `gh auth switch --user X` or
# `--hostname github.com`

# 4. Stage + commit in narrative chunks
git add <foundation-files>
git commit -m "chore: initial scaffolding — Project Name"
# ... repeat for other chunks

# 5. Create GitHub repo with EXPLICIT owner
gh repo create <owner>/<repo> \
  --public \
  --source=. \
  --remote=origin \
  --description "One-line summary" \
  --push

# 6. Verify
git remote -v
git log --oneline
gh repo view <owner>/<repo> --json url,visibility,owner
```

## See also

- [`fancy-web-visual-toolkit.md`](./fancy-web-visual-toolkit.md)
  — what you're actually shipping
- [`browser-port-screenshots.md`](./browser-port-screenshots.md)
  — capturing what you built
- [`../../AGENTS.md`](../../AGENTS.md) §11 — What NOT to Do
  (local paths, force-push, etc.)
- [Conventional Commits](https://www.conventionalcommits.org/)
  — extended reference for commit message format
