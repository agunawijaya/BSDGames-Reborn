#!/usr/bin/env bash
#
# capture-screenshots.sh — capture terminal screenshots of BSDGames
# programs and save as PNG in the target game's media/ folder.
#
# REQUIREMENTS
#   - Linux / WSL2 (Ubuntu tested)
#   - Packages: bsdgames, tmux, expect, imagemagick, wkhtmltopdf, python3
#   - Font: DejaVu Sans Mono (bundled with most Linux distros)
#
# USAGE
#   Called from the repository root:
#
#     bash docs/scripts/capture-screenshots.sh <game>
#
#   Where <game> is one of: robots, snake, gomoku, wump, ...
#
#   Output goes to bsdgames/<game>/media/ as NN-label.png + NN-label.txt.
#
# HOW IT WORKS
#   1. Start the game in a headless 80x24 tmux session.
#   2. Send scripted keystrokes with `tmux send-keys` and sleep in between.
#   3. At chosen moments, `tmux capture-pane -p` grabs the visible pane
#      as plain text.
#   4. The text is embedded in an HTML `<pre>` block styled as a
#      retro terminal (green on black, DejaVu Sans Mono).
#   5. `wkhtmltoimage` renders that HTML to PNG — this preserves
#      whitespace and monospacing exactly (unlike ImageMagick's
#      `label:` operator, which collapses spaces).
#   6. ImageMagick `convert` post-processes the PNG down to a
#      16-color indexed palette + max PNG compression, shrinking
#      files ~99% without visual loss.
#
# CUSTOMISING PER GAME
#   Each game has its own case block below. Fill in a sequence of
#   keystrokes with sleeps and capture points. Copy an existing
#   `capture_<name>()` function as a starting template.
#
# NOTES
#   - Games use curses, which requires a real TTY; tmux provides one.
#   - Palette configurable at the top of this file.

set -e

BASE="$(cd "$(dirname "$0")/../.." && pwd)"

# ---------- Configuration ----------

FG_COLOR="#39FF14"     # bright green (phosphor)
BG_COLOR="#0d1117"     # near-black (GitHub dark)
FONT_FAMILY="DejaVu Sans Mono, Courier New, monospace"
FONT_SIZE=14           # px
PANE_WIDTH=80          # columns
PANE_HEIGHT=24         # rows
PNG_WIDTH=900          # rendered PNG width in px

# ---------- Helpers ----------

# Detect whether a file contains ANSI escape sequences.
has_ansi() {
    local f=$1
    LC_ALL=C grep -q $'\x1b\[' "$f" 2>/dev/null
}

# Render captured text file to optimized PNG.
# If the text contains ANSI escapes (e.g. reverse-video blocks from
# tetris), they are interpreted so that standout/reverse cells become
# solid green blocks. Plain text files use the normal green-on-black
# terminal renderer.
txt_to_png() {
    local text_file=$1 png_file=$2
    local tmp_html tmp_raw
    tmp_html=$(mktemp --suffix=.html)
    tmp_raw=$(mktemp --suffix=.png)

    if has_ansi "$text_file"; then
        python3 - "$text_file" "$tmp_html" <<PYEOF
import html, re, sys
src, out = sys.argv[1], sys.argv[2]
text = open(src, errors='replace').read()

FG = "${FG_COLOR}"
BG = "${BG_COLOR}"
FONT = "${FONT_FAMILY}"
SIZE = ${FONT_SIZE}

parts = []
reverse = False
for m in re.finditer(r'\x1b\[(\d+(;\d+)*)?m|[^\x1b]+', text):
    if m.group(0).startswith('\x1b['):
        # SGR sequence
        codes = m.group(1) or '0'
        for code in codes.split(';'):
            code = code or '0'
            if code == '0':
                reverse = False
            elif code == '7':
                reverse = True
            elif code == '27':
                reverse = False
        continue
    chunk = m.group(0)
    for line in chunk.split('\n'):
        if reverse:
            parts.append(f'<span class="rv">{html.escape(line)}</span>')
        else:
            parts.append(html.escape(line))
        parts.append('\n')
    parts.pop()  # remove trailing newline added after last line

html_body = f"""<!DOCTYPE html>
<html><head><meta charset='utf-8'><style>
html, body {{ margin: 0; padding: 0; background: {BG}; }}
pre {{
  font-family: {FONT};
  font-size: {SIZE}px;
  line-height: 1.15;
  color: {FG};
  background: {BG};
  padding: 12px;
  margin: 0;
  white-space: pre;
  letter-spacing: 0;
}}
pre span.rv {{
  color: {BG};
  background: {FG};
}}
</style></head><body><pre>{''.join(parts)}</pre></body></html>"""
open(out, 'w').write(html_body)
PYEOF
    else
        python3 - "$text_file" "$tmp_html" <<PYEOF
import html, sys
src, out = sys.argv[1], sys.argv[2]
text = open(src).read()
html_body = f"""<!DOCTYPE html>
<html><head><meta charset='utf-8'><style>
html, body {{ margin: 0; padding: 0; background: ${BG_COLOR}; }}
pre {{
  font-family: ${FONT_FAMILY};
  font-size: ${FONT_SIZE}px;
  line-height: 1.15;
  color: ${FG_COLOR};
  background: ${BG_COLOR};
  padding: 12px;
  margin: 0;
  white-space: pre;
  letter-spacing: 0;
}}
</style></head><body><pre>{html.escape(text)}</pre></body></html>"""
open(out, 'w').write(html_body)
PYEOF
    fi

    wkhtmltoimage --quiet --width "$PNG_WIDTH" "$tmp_html" "$tmp_raw" >/dev/null 2>&1 || true

    # Optimize: strip metadata, 16-color palette, max compression.
    convert "$tmp_raw" -strip \
        -define png:compression-level=9 \
        -colors 16 \
        "$png_file"

    rm -f "$tmp_html" "$tmp_raw"
}

capture() {
    local session=$1 label=$2 dir=$3 idx=$4
    local use_ansi=${5:-0}
    local base
    base=$(printf "%s/%02d-%s" "$dir" "$idx" "$label")
    if [ "$use_ansi" -eq 1 ]; then
        tmux capture-pane -t "$session" -p -e > "${base}.txt"
    else
        tmux capture-pane -t "$session" -p > "${base}.txt"
    fi
    txt_to_png "${base}.txt" "${base}.png"
    echo "  captured: $(basename "${base}").png"
}

# Capture a non-interactive filter command (caesar, pig, morse, etc.).
# Usage: capture_filter "label" "dir" idx "shell command"
capture_filter() {
    local label=$1 dir=$2 idx=$3
    local cmd=$4 base
    base=$(printf "%s/%02d-%s" "$dir" "$idx" "$label")
    # Run the filter inside the user's login shell so PATH and bsdgames
    # binaries are available; wrap output in a simple terminal frame.
    bash -lc "$cmd" > "${base}.txt" 2>&1
    txt_to_png "${base}.txt" "${base}.png"
    echo "  captured: $(basename "${base}").png"
}

send_string() {
    local session=$1 str=$2
    tmux send-keys -t "$session" "$str" Enter
}

send_keys() {
    local session=$1 keys=$2
    tmux send-keys -t "$session" -- "$keys"
}

start_session() {
    local s=$1 cmd=$2
    tmux kill-session -t "$s" 2>/dev/null || true
    tmux new-session -d -s "$s" -x "$PANE_WIDTH" -y "$PANE_HEIGHT" \
        "$cmd; read -t 30"
    sleep 1
}

end_session() {
    local s=$1
    tmux send-keys -t "$s" q 2>/dev/null || true
    sleep 0.3
    tmux kill-session -t "$s" 2>/dev/null || true
}

# ---------- Game-specific capture scripts ----------

capture_robots() {
    local dir=$1 s=bsdcap-robots
    start_session "$s" "robots"
    capture "$s" "start-level1" "$dir" 1

    send_keys "$s" "llllll"; sleep 0.5
    send_keys "$s" "jjjj";   sleep 0.5
    capture "$s" "mid-chase" "$dir" 2

    send_keys "$s" "w"; sleep 2
    capture "$s" "death" "$dir" 3

    end_session "$s"
}

capture_snake() {
    local dir=$1 s=bsdcap-snake
    start_session "$s" "snake -w 60 -l 20"
    capture "$s" "start" "$dir" 1

    send_keys "$s" "lllllll"; sleep 0.5
    send_keys "$s" "jjjjjj";  sleep 0.5
    capture "$s" "midgame" "$dir" 2

    end_session "$s"
    tmux send-keys -t "$s" x 2>/dev/null || true
}

capture_gomoku() {
    local dir=$1 s=bsdcap-gomoku
    start_session "$s" "gomoku"
    capture "$s" "color-prompt" "$dir" 1

    send_string "$s" "black"; sleep 1.5
    send_string "$s" "K10";   sleep 2
    capture "$s" "first-exchange" "$dir" 2

    send_string "$s" "L11"; sleep 2
    capture "$s" "midgame" "$dir" 3

    send_string "$s" "quit"; sleep 0.5
    tmux kill-session -t "$s" 2>/dev/null || true
}

capture_wump() {
    local dir=$1 s=bsdcap-wump
    start_session "$s" "wump"
    capture "$s" "instructions-prompt" "$dir" 1

    send_string "$s" "n"; sleep 1
    capture "$s" "cave-start" "$dir" 2

    send_string "$s" "m"; sleep 0.5
    send_string "$s" "1"; sleep 1
    capture "$s" "attempted-move" "$dir" 3

    send_string "$s" "q"; sleep 0.5
    tmux kill-session -t "$s" 2>/dev/null || true
}

capture_sail() {
    local dir=$1 s=bsdcap-sail
    tmux kill-session -t "$s" 2>/dev/null || true
    tmux new-session -d -s "$s" -x 80 -y 24 "sail; sleep 30"
    sleep 2
    capture "$s" "scenario-menu" "$dir" 1

    send_string "$s" "21"; sleep 2
    capture "$s" "ship-selection" "$dir" 2

    send_string "$s" "0"; sleep 3
    capture "$s" "battle-screen" "$dir" 3

    send_keys "$s" "q"; sleep 0.5
    send_string "$s" "y"; sleep 0.5
    tmux kill-session -t "$s" 2>/dev/null || true
}

capture_canfield() {
    local dir=$1 s=bsdcap-canfield
    tmux kill-session -t "$s" 2>/dev/null || true
    tmux new-session -d -s "$s" -x 80 -y 24 "canfield; sleep 30"
    sleep 1

    # Screen 1: instructions prompt
    capture "$s" "instructions-prompt" "$dir" 1

    # View instructions
    send_string "$s" "y"; sleep 1
    capture "$s" "instructions-page" "$dir" 2

    # Advance past instructions and land on the initial deal.
    for _ in 1 2 3 4 5 6 7 8 9 10; do
        send_keys "$s" " "; sleep 0.3
    done
    capture "$s" "initial-deal" "$dir" 3

    # Try a couple of moves. Individual command chars are consumed
    # as they arrive; some will be legal on this random deal, some
    # will error harmlessly.
    send_keys "$s" "sf"; sleep 0.5
    send_keys "$s" "s1"; sleep 0.5
    send_keys "$s" "12"; sleep 0.5
    capture "$s" "mid-game" "$dir" 4

    send_keys "$s" "q"; sleep 0.3
    send_string "$s" "y"; sleep 0.3
    tmux kill-session -t "$s" 2>/dev/null || true
}

capture_monop() {
    local dir=$1 s=bsdcap-monop
    # `monop` is not in the Debian bsdgames package (Hasbro trademark
    # restriction). Build the binary from upstream first and expose its
    # path via $MONOP_BIN, or install a `monop` command on PATH.
    local bin="${MONOP_BIN:-monop}"
    if ! command -v "$bin" >/dev/null 2>&1 && [ ! -x "$bin" ]; then
        echo "monop binary not found. Build from upstream and set MONOP_BIN=/path/to/monop." >&2
        return 1
    fi
    tmux kill-session -t "$s" 2>/dev/null || true
    tmux new-session -d -s "$s" -x 80 -y 24 "$bin; sleep 30"
    sleep 1

    # Screen 1: how many players?
    capture "$s" "players-prompt" "$dir" 1

    # Set up 2 players
    send_string "$s" "2"; sleep 0.5
    send_string "$s" "Alice"; sleep 0.5
    send_string "$s" "Bob"; sleep 0.8
    capture "$s" "first-turn" "$dir" 2

    # Roll dice — often lands on a Chance/Community Chest square
    send_string "$s" "roll"; sleep 0.8
    capture "$s" "after-roll" "$dir" 3

    # ? help
    send_string "$s" "?"; sleep 0.6
    capture "$s" "help" "$dir" 4

    # print the full board
    send_string "$s" "print"; sleep 0.8
    capture "$s" "board" "$dir" 5

    # where — player positions
    send_string "$s" "where"; sleep 0.6
    capture "$s" "where" "$dir" 6

    # holdings prompt
    send_string "$s" "holdings"; sleep 0.6
    capture "$s" "holdings" "$dir" 7

    # Quit cleanly
    send_string "$s" "done"; sleep 0.3
    send_string "$s" "quit"; sleep 0.3
    send_string "$s" "y"; sleep 0.3
    tmux kill-session -t "$s" 2>/dev/null || true
}

capture_adventure() {
    local dir=$1 s=bsdcap-adventure
    tmux kill-session -t "$s" 2>/dev/null || true
    tmux new-session -d -s "$s" -x 80 -y 24 "adventure; sleep 30"
    sleep 1

    # Screen 1: welcome / instructions prompt
    capture "$s" "welcome-prompt" "$dir" 1

    # Decline instructions to see the classic opening scene
    send_string "$s" "no"; sleep 1
    capture "$s" "opening-scene" "$dir" 2

    # Enter the brick building
    send_string "$s" "in"; sleep 1
    capture "$s" "inside-building" "$dir" 3

    # Take the keys and lantern
    send_string "$s" "take keys"; sleep 0.5
    send_string "$s" "take lantern"; sleep 0.5
    send_string "$s" "inventory"; sleep 1
    capture "$s" "inventory" "$dir" 4

    # XYZZY — the legendary teleport
    send_string "$s" "xyzzy"; sleep 1
    capture "$s" "xyzzy-teleport" "$dir" 5

    # Quit
    send_string "$s" "quit"; sleep 0.5
    send_string "$s" "yes"; sleep 0.5
    tmux kill-session -t "$s" 2>/dev/null || true
}

capture_trek() {
    local dir=$1 s=bsdcap-trek
    tmux kill-session -t "$s" 2>/dev/null || true
    tmux new-session -d -s "$s" -x 80 -y 24 "trek; sleep 30"
    sleep 1

    capture "$s" "startup" "$dir" 1

    send_string "$s" "short"; sleep 0.5
    send_string "$s" "novice"; sleep 0.5
    send_string "$s" "y"; sleep 1
    capture "$s" "mission-briefing" "$dir" 2

    send_string "$s" "srscan"; sleep 1
    capture "$s" "srscan" "$dir" 3

    send_string "$s" "lrscan"; sleep 1
    capture "$s" "lrscan" "$dir" 4

    send_string "$s" "damages"; sleep 1
    capture "$s" "damages" "$dir" 5

    send_string "$s" "terminate"; sleep 0.3
    send_string "$s" "y"; sleep 0.3
    tmux kill-session -t "$s" 2>/dev/null || true
}

capture_atc() {
    local dir=$1 s=bsdcap-atc
    # atc needs a slightly taller pane for radar + info + author
    tmux kill-session -t "$s" 2>/dev/null || true
    tmux new-session -d -s "$s" -x 80 -y 25 "atc; sleep 30"
    sleep 2
    capture "$s" "fresh-start" "$dir" 1

    # Start typing a command to show the input prompt state
    send_keys "$s" "a"; sleep 0.3
    capture "$s" "command-prompt" "$dir" 2

    # Cancel partial input and let the game update once
    send_keys "$s" Escape
    sleep 12
    send_keys "$s" Enter
    sleep 1
    capture "$s" "after-updates" "$dir" 3

    send_keys "$s" "q"; sleep 0.5
    tmux kill-session -t "$s" 2>/dev/null || true
}

capture_tetris() {
    local dir=$1 s=bsdcap-tetris
    start_session "$s" "tetris-bsd -p -l 2"
    # Tetris draws blocks with standout/reverse-video spaces, so we must
    # preserve ANSI attributes and render them as solid green blocks.
    capture "$s" "start" "$dir" 1 1

    # Build a small stack to create an interesting mid-game state.
    send_keys "$s" "llllll"; sleep 0.2
    send_keys "$s" "kkkk";   sleep 0.2
    send_keys "$s" "        "; sleep 0.5
    send_keys "$s" "jjjjjj"; sleep 0.2
    send_keys "$s" "kkkk";   sleep 0.2
    send_keys "$s" "        "; sleep 0.5
    capture "$s" "midgame" "$dir" 2 1

    # Quit to show the final score / high-score screen.
    send_keys "$s" "q"; sleep 0.5
    capture "$s" "gameover" "$dir" 3 1

    end_session "$s"
}

capture_hangman() {
    local dir=$1 s=bsdcap-hangman
    start_session "$s" "hangman"
    capture "$s" "start" "$dir" 1

    # Make some common guesses to create a mid-game state.
    send_keys "$s" "aeioutn"; sleep 0.5
    capture "$s" "midgame" "$dir" 2

    # Make a series of uncommon guesses to reach the loss screen.
    send_keys "$s" "qxzjvkbpm"; sleep 1
    capture "$s" "gameover" "$dir" 3

    end_session "$s"
}

build_from_source() {
    local game=$1
    local libs=${2:-}
    local extra_src=${3:-}
    local cppflags=${4:-}
    local src="$BASE/BSDGames-master/$game/$game.c"
    local out="/tmp/bsdgames-$game"
    if [ ! -x "$out" ]; then
        gcc -D'__COPYRIGHT(x)=' -D'__RCSID(x)=' $cppflags -o "$out" "$src" $extra_src $libs >/dev/null 2>&1
    fi
    if [ ! -x "$out" ]; then
        echo "Error: could not build $game from $src" >&2
        exit 1
    fi
    echo "$out"
}

capture_caesar() {
    local dir=$1
    capture_filter "start" "$dir" 1 "printf 'Khoor Zruog\\n' | caesar"
    capture_filter "midgame" "$dir" 2 "printf 'Hello World\\n' | caesar 13"
    capture_filter "gameover" "$dir" 3 "printf 'Guvf vf n grfg.\\n' | caesar 13"
}

capture_pig() {
    local dir=$1
    local pig
    pig=$(build_from_source pig)
    capture_filter "start" "$dir" 1 "printf 'Hello world\\n' | $pig"
    capture_filter "midgame" "$dir" 2 "printf 'The quick brown fox\\n' | $pig"
    capture_filter "gameover" "$dir" 3 "printf 'Useful for generating monthly reports.\\n' | $pig"
}

capture_morse() {
    local dir=$1
    local morse
    morse=$(build_from_source morse)
    capture_filter "start" "$dir" 1 "printf 'SOS\\n' | $morse"
    capture_filter "midgame" "$dir" 2 "printf 'SOS\\n' | $morse -s"
    capture_filter "gameover" "$dir" 3 "printf '... --- ...\\n' | $morse -d"
}

capture_factor() {
    local dir=$1
    local factor
    factor=$(build_from_source factor "-I$BASE/BSDGames-master/primes" "$BASE/BSDGames-master/primes/pr_tbl.c")
    capture_filter "command" "$dir" 1 "$factor 60"
    capture_filter "example" "$dir" 2 "$factor 1234567890"
    capture_filter "large" "$dir" 3 "$factor 97"
}

capture_primes() {
    local dir=$1
    local primes
    primes=$(build_from_source primes "-I$BASE/BSDGames-master/primes -lm" "$BASE/BSDGames-master/primes/pr_tbl.c $BASE/BSDGames-master/primes/pattern.c")
    capture_filter "command" "$dir" 1 "$primes 2 100"
    capture_filter "example" "$dir" 2 "$primes 1000 1100"
    capture_filter "large" "$dir" 3 "$primes 1000000 1000100"
}

capture_banner() {
    local dir=$1
    local banner
    banner=$(build_from_source banner)
    capture_filter "command" "$dir" 1 "$banner BSD"
    capture_filter "example" "$dir" 2 "$banner -w 40 BSD"
    capture_filter "words" "$dir" 3 "$banner HI THERE"
}

capture_bcd() {
    local dir=$1
    local bcd
    bcd=$(build_from_source bcd)
    capture_filter "command" "$dir" 1 "$bcd HELLO"
    capture_filter "example" "$dir" 2 "printf 'WORLD\n' | $bcd"
    capture_filter "long" "$dir" 3 "$bcd THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG"
}

capture_ppt() {
    local dir=$1
    local ppt
    ppt=$(build_from_source ppt)
    capture_filter "command" "$dir" 1 "$ppt HI"
    capture_filter "example" "$dir" 2 "printf 'TAPE\n' | $ppt"
    capture_filter "decode" "$dir" 3 "printf 'TEST\n' | $ppt | $ppt -d"
}

capture_wtf() {
    local dir=$1
    local wtf="$BASE/BSDGames-master/wtf/wtf.in"
    local db="$BASE/BSDGames-master/wtf/acronyms"
    capture_filter "start" "$dir" 1 "bash $wtf -f $db RTFM"
    capture_filter "midgame" "$dir" 2 "bash $wtf -f $db is LOL"
    capture_filter "gameover" "$dir" 3 "bash $wtf -f $db XYZABC || true"
}

capture_countmail() {
    local dir=$1
    local cm="$BASE/BSDGames-master/countmail/countmail"
    local fdir="/tmp/bsdgames-countmail"
    mkdir -p "$fdir"
    printf '#!/bin/sh\necho "From user@example.com"\n' > "$fdir/from1"
    printf '#!/bin/sh\nfor i in $(seq 12); do echo "From user@example.com"; done\n' > "$fdir/from12"
    printf '#!/bin/sh\n' > "$fdir/from0"
    chmod +x "$fdir"/from*

    cat > "$fdir/run.sh" <<EOF
#!/usr/bin/env bash
cp -f "$fdir/\$1" "$fdir/from"
export PATH="$fdir:/usr/bin:/bin"
bash "$cm"
EOF
    chmod +x "$fdir/run.sh"

    capture_filter "start" "$dir" 1 "bash $fdir/run.sh from1"
    capture_filter "midgame" "$dir" 2 "bash $fdir/run.sh from12"
    capture_filter "gameover" "$dir" 3 "bash $fdir/run.sh from0"
}

capture_pom() {
    local dir=$1
    local pom
    pom=$(build_from_source pom "-lm")
    capture_filter "start" "$dir" 1 "$pom"
    capture_filter "midgame" "$dir" 2 "$pom 2025011400"
    capture_filter "gameover" "$dir" 3 "$pom 2025030700"
}

capture_arithmetic() {
    local dir=$1
    local ar
    ar=$(build_from_source arithmetic "" "" '-Dgetprogname()="arithmetic"')
    local s=bsdcap-arithmetic
    start_session "$s" "$ar -r 5"
    capture "$s" "start" "$dir" 1

    send_string "$s" "7"; sleep 0.5
    send_string "$s" "1"; sleep 0.5
    send_string "$s" "9"; sleep 0.5
    capture "$s" "midgame" "$dir" 2

    send_string "$s" "2"; sleep 0.5
    send_string "$s" "3"; sleep 0.5
    send_string "$s" "4"; sleep 0.5
    capture "$s" "gameover" "$dir" 3

    end_session "$s"
}

capture_dab() {
    local dir=$1
    local dab=/tmp/bsdgames-dab
    if [ ! -x "$dab" ]; then
        g++ -D'__COPYRIGHT(x)=' -D'__RCSID(x)=' -o "$dab" \
            "$BASE/BSDGames-master/dab"/*.cc -lncurses >/dev/null 2>&1 || \
        g++ -D'__COPYRIGHT(x)=' -D'__RCSID(x)=' -o "$dab" \
            $(ls "$BASE/BSDGames-master/dab"/*.cc | grep -v test.cc) -lncurses >/dev/null 2>&1
    fi
    if [ ! -x "$dab" ]; then
        echo "Error: could not build dab" >&2
        exit 1
    fi

    # Screen 1: fresh human-vs-computer board
    local s=bsdcap-dab
    start_session "$s" "$dab -p hc 3 3"
    sleep 1
    capture "$s" "start" "$dir" 1

    # Screen 2: human makes a few moves
    send_keys "$s" " "; sleep 0.5
    send_keys "$s" "l "; sleep 0.5
    send_keys "$s" "j "; sleep 0.5
    send_keys "$s" "k "; sleep 0.5
    capture "$s" "midgame" "$dir" 2
    end_session "$s"

    # Screen 3: let the computer finish a game
    s=bsdcap-dab-end
    start_session "$s" "$dab -p cc -w -n 1"
    sleep 6
    capture "$s" "gameover" "$dir" 3
    end_session "$s"
}

capture_fish() {
    local dir=$1
    local fish=/tmp/bsdgames-fish
    if [ ! -x "$fish" ]; then
        cat > /tmp/pathnames.h <<EOF
#define _PATH_MORE "more"
#define _PATH_INSTR "$BASE/BSDGames-master/fish/fish.instr"
EOF
        gcc -D'__COPYRIGHT(x)=' -D'__RCSID(x)=' -I/tmp \
            -o "$fish" "$BASE/BSDGames-master/fish/fish.c" >/dev/null 2>&1
    fi
    if [ ! -x "$fish" ]; then
        echo "Error: could not build fish" >&2
        exit 1
    fi

    local s=bsdcap-fish
    start_session "$s" "$fish"
    # Decline instructions
    send_string "$s" "n"; sleep 1
    capture "$s" "start" "$dir" 1

    # Ask for a card and draw a few times
    send_string "$s" "A"; sleep 1
    send_string "$s" "K"; sleep 1
    capture "$s" "midgame" "$dir" 2

    # Continue until near end of game is hard to script; send quit for final shot
    send_string "$s" "quit"; sleep 0.5
    capture "$s" "gameover" "$dir" 3

    end_session "$s"
}

capture_quiz() {
    local dir=$1
    local quiz=/tmp/bsdgames-quiz
    if [ ! -x "$quiz" ]; then
        mkdir -p /tmp/quiz_include
        cat > /tmp/quiz_include/pathnames.h <<EOF
#define _PATH_PAGER "cat"
#define _PATH_QUIZIDX "/tmp/quiz_index"
EOF
        sed "s|@quiz_dir@|$BASE/BSDGames-master/quiz/datfiles|g" \
            "$BASE/BSDGames-master/quiz/datfiles/index.in" > /tmp/quiz_index
        cat > /tmp/quiz_include/fgetln.h <<'EOF'
#include <stdio.h>
char *fgetln(FILE *stream, size_t *len);
EOF
        cat > /tmp/quiz_include/fgetln.c <<'EOF'
#include <stdio.h>
#include <stdlib.h>
char *fgetln(FILE *stream, size_t *len) {
    static char *buf = NULL;
    static size_t bufsiz = 0;
    size_t pos = 0;
    int c;
    if (buf == NULL) { bufsiz = 128; buf = malloc(bufsiz); }
    while ((c = fgetc(stream)) != EOF) {
        if (pos + 1 >= bufsiz) { bufsiz *= 2; buf = realloc(buf, bufsiz); }
        buf[pos++] = c;
        if (c == '\n') break;
    }
    if (pos == 0) return NULL;
    *len = pos;
    return buf;
}
EOF
        gcc -D'__COPYRIGHT(x)=' -D'__RCSID(x)=' -I/tmp/quiz_include \
            -include /tmp/quiz_include/fgetln.h \
            -o "$quiz" "$BASE/BSDGames-master/quiz/quiz.c" \
            "$BASE/BSDGames-master/quiz/rxp.c" \
            /tmp/quiz_include/fgetln.c >/dev/null 2>&1
    fi
    if [ ! -x "$quiz" ]; then
        echo "Error: could not build quiz" >&2
        exit 1
    fi

    capture_filter "start" "$dir" 1 "printf '' | $quiz"
    capture_filter "midgame" "$dir" 2 "printf 'Booth\n' | $quiz victim killer"
    capture_filter "gameover" "$dir" 3 "printf '\n' | $quiz victim killer"
}

capture_wargames() {
    local dir=$1 s=bsdcap-wargames
    start_session "$s" "bash $BASE/BSDGames-master/wargames/wargames"
    capture "$s" "start" "$dir" 1

    send_keys "$s" Enter
    sleep 0.5
    capture "$s" "quote" "$dir" 2

    end_session "$s"
}

capture_number() {
    local dir=$1
    local number
    number=$(build_from_source number)
    capture_filter "command" "$dir" 1 "$number 12345"
    capture_filter "example" "$dir" 2 "$number -l 12345"
    capture_filter "large" "$dir" 3 "$number 3.14"
}

capture_random() {
    local dir=$1
    local random
    random=$(build_from_source random)
    capture_filter "command" "$dir" 1 "printf 'alpha\\nbeta\\ngamma\\ndelta\\nepsilon\\n' | $random 2"
    capture_filter "example" "$dir" 2 "printf 'alpha\\nbeta\\ngamma\\ndelta\\nepsilon\\nzeta\\neta\\ntheta\\n' | $random 5"
    capture_filter "exit" "$dir" 3 "$random -e 5; echo exit-code:\$?"
}

capture_rain() {
    local dir=$1 s=bsdcap-rain
    local rain
    rain=$(build_from_source rain "-lncurses" "" '-Dgetprogname()=\"rain\"')
    start_session "$s" "$rain -d 120"
    sleep 2
    capture "$s" "start" "$dir" 1
    sleep 3
    capture "$s" "midgame" "$dir" 2
    sleep 3
    capture "$s" "end" "$dir" 3
    end_session "$s"
}

capture_worms() {
    local dir=$1 s=bsdcap-worms
    local worms
    worms=$(build_from_source worms "-lncurses")
    start_session "$s" "$worms -n 3 -l 16 -d 100"
    sleep 2
    capture "$s" "start" "$dir" 1
    sleep 3
    capture "$s" "midgame" "$dir" 2
    sleep 3
    capture "$s" "end" "$dir" 3
    end_session "$s"
}

# ---------- Dispatcher ----------

if [ $# -ne 1 ]; then
    echo "Usage: $0 <game>"
    echo "  where <game> ∈ {robots, snake, gomoku, wump, ...}"
    exit 2
fi

GAME=$1
DIR="$BASE/bsdgames/$GAME/media"

if [ ! -d "$DIR" ]; then
    echo "Error: $DIR does not exist. Create the game folder first."
    exit 1
fi

echo "Capturing screenshots for $GAME into $DIR ..."

case "$GAME" in
    robots)  capture_robots  "$DIR" ;;
    snake)   capture_snake   "$DIR" ;;
    gomoku)  capture_gomoku  "$DIR" ;;
    wump)    capture_wump    "$DIR" ;;
    tetris)  capture_tetris  "$DIR" ;;
    hangman) capture_hangman "$DIR" ;;
    caesar)  capture_caesar  "$DIR" ;;
    pig)     capture_pig     "$DIR" ;;
    morse)   capture_morse   "$DIR" ;;
    atc)     capture_atc     "$DIR" ;;
    trek)    capture_trek    "$DIR" ;;
    adventure) capture_adventure "$DIR" ;;
    sail)    capture_sail    "$DIR" ;;
    monop)     capture_monop     "$DIR" ;;
    canfield)  capture_canfield  "$DIR" ;;
    factor)  capture_factor  "$DIR" ;;
    primes)  capture_primes  "$DIR" ;;
    banner)  capture_banner  "$DIR" ;;
    bcd)     capture_bcd     "$DIR" ;;
    ppt)     capture_ppt     "$DIR" ;;
    wtf)     capture_wtf     "$DIR" ;;
    countmail) capture_countmail "$DIR" ;;
    pom)     capture_pom     "$DIR" ;;
    arithmetic) capture_arithmetic "$DIR" ;;
    dab)     capture_dab     "$DIR" ;;
    fish)    capture_fish    "$DIR" ;;
    quiz)    capture_quiz    "$DIR" ;;
    wargames) capture_wargames "$DIR" ;;
    number)  capture_number  "$DIR" ;;
    random)  capture_random  "$DIR" ;;
    rain)    capture_rain    "$DIR" ;;
    worms)   capture_worms   "$DIR" ;;
    *)
        echo "No capture routine defined for '$GAME' yet."
        echo "Copy an existing capture_*() function above and adapt."
        exit 3
        ;;
esac

echo "Done. See $DIR"
