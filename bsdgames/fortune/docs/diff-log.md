# Fortune — Difference Log

Detailed feature-by-feature comparison between the original 1979/1985 BSD Unix C implementation
and the planned modern spiritual successor.

---

## 1. Feature Comparison Matrix

| Feature | Original 1979/1985 BSD Fortune | Modern Spiritual Successor Port | Rationale / ADR Link |
|---|---|---|---|
| **Programming Language** | K&R / ANSI C | Modern memory-safe language (Rust / Go / TS) | Memory safety, zero buffer overruns, cross-platform builds. |
| **Character Encoding** | 7-bit ASCII | Full Unicode / UTF-8 multi-byte support | Preserves accents, multi-lingual quotes, and modern typography. |
| **Database Formats** | Proprietary `.dat` binary index only | Hybrid: `.dat`, SQLite (FTS5), JSON, and TOML | Preserves retro compatibility while empowering modern workflows. |
| **Search Capabilities** | Sequential regex scan (`-m pattern`) | Fast Regex + SQLite FTS5 + Interactive Fuzzy TUI | Instant full-text search across hundreds of thousands of quotes. |
| **Endian Handling** | Host byte order in early BSD; later network order | Strictly Network Byte Order / Little-Endian Safe | Seamless portability between x86, ARM, and Wasm architectures. |
| **Terminal Display** | Raw stdout stream | Formatted text + optional TrueColor styling + Cowsay mode | Modern visual flair while preserving clean terminal pipes. |
| **Interactive Mode** | None (one-shot execution) | Interactive terminal browser (`fortune browse`) | Allows exploring and copying quotes without script loops. |
| **Distribution Model** | System-installed files (`/usr/share/games/fortune`) | Self-contained single binary (embedded data) or modular | Zero-friction installation on Windows, macOS, and Linux. |
| **Web / Cloud Support** | None | WebAssembly module + HTTP REST microservice | Powers web pages, Discord bots, and serverless functions. |
| **Offensive Content** | Raw ROT13 obfuscated text files | Historical ROT13 support + modern tag-based filtering | Respects historical tradition while supporting modern privacy controls. |
