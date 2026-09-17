# Scripts

Utility scripts for the BSDGames Reborn workflow.

## Two screenshot pipelines

The repo uses **two** screenshot pipelines depending on what's
being captured:

| What you're capturing | Pipeline | Docs |
|---|---|---|
| BSDGames original binary running in a terminal | Terminal pipeline (this file) | Below |
| Browser-based port (HTML + Canvas) | Browser pipeline | [`../learning/browser-port-screenshots.md`](../learning/browser-port-screenshots.md) |

Different tools, same purpose. If you're documenting the **original
game** to give context for a port, use the terminal pipeline. If
you're documenting a **port you built** that runs in a browser
(fancy-web, classic-web, etc.), use the browser pipeline.

## `capture-screenshots.sh`

Captures terminal screenshots of a BSDGames original binary by driving
it inside a headless `tmux` session and rendering the captured text as
a PNG.

### Prerequisites

Linux or WSL2 (Ubuntu tested):

```bash
sudo apt install bsdgames tmux expect imagemagick wkhtmltopdf python3
```

Font `DejaVu Sans Mono` ships with most Linux distros.

### Why `wkhtmltoimage` and not just ImageMagick?

Earlier iterations of this script rendered captured text via
ImageMagick's `label:` operator. That approach *silently collapses
runs of whitespace*, breaking column alignment for anything with a
right-hand sidebar (`robots`, `snake`, `gomoku`'s move log).

The current approach:

1. Wrap the text in an HTML `<pre>` block with `white-space: pre`
   and a strict monospace font.
2. Render the HTML to PNG using `wkhtmltoimage`, which honours
   whitespace exactly.
3. Post-process with ImageMagick to strip metadata, quantise to a
   16-colour indexed palette, and apply max PNG compression —
   shrinking a 1.5 MB PNG down to ~4 KB with no visible loss for
   two-colour terminal captures.

Result: pixel-accurate terminal screenshots at ~5 KB each.

### Usage

From the repository root:

```bash
bash docs/scripts/capture-screenshots.sh <game>
```

Where `<game>` is one of `robots`, `snake`, `gomoku`, `wump`, or any
other game for which a `capture_<name>()` function has been defined in
the script. Output PNGs and matching `.txt` files land in
`bsdgames/<game>/media/`.

### Adding a New Game

Copy an existing `capture_<name>()` function and adapt the keystroke
sequence. Each step is one of:

| Directive | Effect |
|---|---|
| `send_keys "$s" "hjkl"` | Send raw keystrokes (no Enter). Curses cbreak games. |
| `send_string "$s" "black"` | Send text then Enter. Line-oriented input. |
| `sleep N` | Wait N seconds for the game to render. |
| `capture "$s" "label" "$dir" $idx` | Snapshot pane as `NN-label.png` + `.txt`. |

Screenshots use a **retro terminal palette** (`#39FF14` on `#0d1117`).
Adjust `FG_COLOR` / `BG_COLOR` / `FONT_FAMILY` / `FONT_SIZE` at the
top of the script if you want a different look.

### Why the Text Files Too?

Every PNG has a sibling `.txt` — the raw text capture that produced
it. Reasons:

1. **Diffable.** Two runs of the same game with the same seed should
   produce identical `.txt` — reviewable via `git diff`.
2. **Regenerable.** If we change the visual style (font, colours) we
   re-render from the `.txt` without re-playing.
3. **Accessible.** Screen readers can consume the `.txt`.

### Non-Deterministic Games

Games that use `srand(getpid())` (like `robots`) or `srand(time(NULL))`
(like `gomoku`) produce different layouts each run. That is fine — we
are producing *representative* screenshots, not test golden files.

If you re-run the capture, expect different initial placements. The
narrative caption in `about.md` should describe what *kind* of state
the screenshot shows, not exact positions.
