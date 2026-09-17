# `hunt` — Feature Diff Log

> Detailed comparison between the original 1986 BSD C implementation and the planned spiritual successor port.

---

## Feature Comparison Matrix

| Feature | Original 1986 BSD C Implementation | Planned Spiritual Successor Port | Modernization Rationale |
|---|---|---|---|
| **Networking Model** | Raw BSD Sockets (`AF_INET`, UDP broadcast, raw TCP). | Dual Protocol: Native TCP/UDP + Secure WebSockets (`wss://`). | Enables both terminal play and zero-install web browser play. |
| **Server Discovery** | Unprivileged local UDP broadcast packet sweep. | Centralized HTTP/JSON Lobby Discovery Service. | Overcomes modern NAT, VPN, and firewall broadcast restrictions. |
| **Arena Generation** | Procedural maze generator (`makemaze.c`). | Procedural generation preserved + custom map editor support. | Retains classic labyrinth variety while enabling community arenas. |
| **Terminal Graphics** | Raw monochrome ANSI/VT100 escape codes (`draw.c`). | 256-color / 24-bit TrueColor ANSI with themes. | Greatly improves visual clarity of projectiles and team colors. |
| **Tick Rate & Sync** | Variable microsecond sleep (`select()` timeout). | Fixed 30 Hz / 60 Hz deterministic tick engine. | Eliminates simulation drift and provides smooth cross-platform movement. |
| **AI Bot System** | Single bot heuristic script (`otto.c`). | Tiered bot AI (Novice, Classic Otto, Expert) + Headless mode. | Allows single-player practice and competitive bot testing tournaments. |
| **Cross-Platform OS** | Unix-only (relied on 4.3BSD socket internals). | Cross-platform (Windows, macOS, Linux, WebAssembly). | Eradicates ancient OS incompatibilities. |
| **Spectator Mode** | Passive monitor flag (`-m`). | Preserved `-m` flag + multi-angle cinematic spectator UI. | Ideal for tournament casting and streaming. |
