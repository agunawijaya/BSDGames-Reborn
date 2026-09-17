# `wtf` — Original → Port Diff Log

Tracks every deliberate change from the original BSDGames `wtf` to the
modern port.

---

## Preserved

| Feature | Original | Port |
|---|---|---|
| Core behaviour | Expand acronyms from a text database | Same |
| Database format | `ACRONYM<TAB>expansion` | Same |
| Natural-language `is` | Ignored | Same |
| `-f dbfile` flag | Custom database | Same |
| `-t type` flag | `acronyms.type` database | Same |
| `ACRONYMDB` env var | Default database override | Same |
| `whatis(1)` fallback | If acronym not found | Same (where available) |

## Modernised

| Feature | Original | Port |
|---|---|---|
| Implementation | POSIX `/bin/sh` script | TBD by language ADR |
| Database distribution | Installed by BSD build system | Bundled in `data/` |
| Error output | Mixed stdout/stderr | Consistent stderr for errors |
| Portability | Unix only | Cross-platform where feasible |

## Reinterpreted

None yet. Future ADRs may add quiz mode, fuzzy matching, or a web UI.

## Removed

| Feature | Reason |
|---|---|
| Install-time placeholder `@wtf_acronymfile@` | Port uses a runtime path or bundled `data/` directory. |

## See Also

- [`port-ideas.md`](./port-ideas.md) for proposed future changes.
