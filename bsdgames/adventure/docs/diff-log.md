# `adventure` — Original → Port Diff Log

> Feature-by-feature tracking log of what is kept, changed, added, removed,
> and reinterpreted between the historical C/Fortran original and the BSDGames Reborn port.

---

## Legend

- 🟩 **Kept** — Identical or mechanically faithful to the original Woods/Gillogly version.
- 🟨 **Changed** — Same mechanic, modernized UX or ergonomic upgrade.
- 🟦 **Added** — New feature not present in original BSD `adventure`.
- 🟥 **Removed** — Deprecated or obsolete subsystem dropped.
- 🟪 **Reinterpreted** — Original concept fundamentally redesigned.

---

## Feature Log

| # | Feature | Status | Notes |
|:--:|---|:---:|---|
| 1 | **Colossal Cave Room Topology** | 🟩 | Kept 100% identical room connections, crawlways, and descriptions based on real Bedquilt Cave. |
| 2 | **15 Canonical Treasures & Scoring** | 🟩 | Preserved 350-point scoring formula, object locations, and Grandmaster rank criteria. |
| 3 | **Two-Word Command Grammar** | 🟩 | Preserved classic two-word imperative commands (`TAKE LAMP`, `WAVE ROD`, `XYZZY`). |
| 4 | **The 5-Letter Parser Truncation** | 🟨 | Relaxed to accept full natural English words while remaining backward-compatible with 5-letter abbreviations. |
| 5 | **45-Minute Work Hours Delay** | 🟥 | Dropped obsolete PDP-11 timesharing restriction (`wizard.c:Start()`). Resuming suspended games is instant. |
| 6 | **Terminal UI / Presentation** | 🟨 | Upgraded from scrolling teletype text to modern responsive multi-pane TUI layout with auto-mapping panel. |
| 7 | **Interactive Auto-Mapper** | 🟦 | Added optional live Unicode map rendering to eliminate the need for physical graph paper. |
| 8 | **Screen-Reader Accessibility** | 🟦 | Added `--screen-reader` mode outputting raw stream text without ANSI art boxes or visual layout barriers. |
| 9 | **Colorized Syntax Highlighting** | 🟦 | Added subtle ANSI styling to highlight exits (yellow), treasures (gold), and hazards (red). |
| 10 | **Unlimited Save Slots & Undo** | 🟦 | Added multiple save states and optional `undo` command to prevent accidental fatal drops. |

---

## Narrative

*Colossal Cave Adventure* is sacred ground in video game history. Our porting philosophy for this title is to treat the text and mechanical state machine with utmost preservationist fidelity (🟩). Every room, puzzle, magic word, and creature interaction from Don Woods's 350-point masterpiece is retained without alteration.

Modernization focuses entirely on **interface ergonomics and cognitive accessibility** (🟨, 🟦): replacing the frustrating 1970s teletype scrolling buffer with a multi-pane TUI, providing an optional live cave visualizer, and eliminating the long-obsolete 45-minute working-hours lockout originally designed to stop PDP-11 CPU hogs.

---

## Cross-References

- [`spec.md`](./spec.md) — The mechanical specification.
- [`port-ideas.md`](./port-ideas.md) — Long-term modernization brainstorm.
- [`walkthrough.md`](./walkthrough.md) — Canonical 350-point Grandmaster solution.
