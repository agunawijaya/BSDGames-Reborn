# `wargames` — Original → Port Diff Log

Tracks every deliberate change from the original BSDGames `wargames`
to the modern port.

---

| Feature | Original | Port | Rationale |
|---|---|---|---|
| Language | POSIX shell script | TBD by language ADR | Modern language choice |
| Game directory | Hard-coded `/usr/games` | Configurable default | Portability across OS installs |
| Screen clear | `tput clear` | Optional / graceful fallback | Avoid errors on minimal terminals |
| Input filter | `sed 's/[^-a-z0-9]//g'` | Equivalent whitelist | Preserve security semantics |
| Quote output | Here-document | Preserved verbatim | Cultural identity |
| Launch mechanism | `exec /usr/games/$x` | Subprocess launch or `exec` | Safer sandboxing if desired |

## Unchanged

- Prompt text: "Would you like to play a game?"
- The three-line movie quote.
- Single-prompt interaction model.
