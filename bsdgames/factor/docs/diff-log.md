# `factor` — Original → Port Diff Log

> Feature-by-feature comparison of the original BSD `factor` and the modern port.

---

| Feature | Original | Port (planned) |
|---|---|---|
| Input | CLI arguments or stdin | CLI arguments, stdin, web form, library API |
| Output | Plain text `number: factors` | Plain text + optional JSON / tree / colour |
| Algorithm | Trial division (+ Pollard p−1 with OpenSSL) | Trial division + modern big-int backend |
| Negative input | Rejected | Rejected (preserved) |
| Zero input | Silent exit | Documented; may print `0: 0` or error |
| Platform | UNIX / BSD | Cross-platform (terminal + web + mobile) |
| Dependencies | Optional OpenSSL | Optional modern big-int library |
| Persistence | None | Optional history / cloud account |

## Notes

- The core factorisation behaviour will be preserved exactly.
- Modern additions (JSON output, web UI, history) are optional and do not change the default CLI experience.

## See Also

- [`port-ideas.md`](./port-ideas.md) — brainstorm for future features.
- [`architecture.md`](./architecture.md) — original code analysis.
