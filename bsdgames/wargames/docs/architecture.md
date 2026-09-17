# `wargames` — Original Architecture

> Deep analysis of the original shell source. What did the programmer
> build, and how?

Cite upstream file:line references only (never local paths). Upstream
tree: <https://github.com/vattam/BSDGames/tree/master/wargames>.

---

## Files & Roles

| File | Purpose | Approx. LoC |
|---|---|---:|
| `wargames` | POSIX shell launcher / Easter egg | 52 |
| `wargames.6` | Man page (movie-reference annotation) | 49 |

## High-Level Flow

```mermaid
flowchart TB
    start[Run wargames] --> prompt[Print prompt]
    prompt --> read[Read raw input x]
    read --> sanitize[sed strip to [-a-z0-9]]
    sanitize --> exists{Exists /usr/games/$x?}
    exists -->|yes| clear[tput clear]
    clear --> exec[exec /usr/games/$x]
    exists -->|no| quote[Print movie quote]
    quote --> exit[exit 0]
```

## Game Loop Detail

There is no loop. `wargames` performs exactly one user interaction and
terminates.

The entry point is the shell script itself
(`wargames:37-51`). The sequence is:

1. `echo -n "Would you like to play a game? "` prints the prompt
   without a trailing newline (`wargames:37`).
2. `read x` blocks for one line of input (`wargames:38`).
3. `x=`echo $x | sed 's/[^-a-z0-9]//g'`` strips any character that is
   not a lowercase letter, digit, or hyphen (`wargames:40`).
4. `if [ -f /usr/games/$x ]` tests whether a file with that sanitized
   name exists in `/usr/games` (`wargames:42`).
5. On success, `tput clear` clears the terminal and `exec
   /usr/games/$x` replaces the shell with the requested game
   (`wargames:43-44`).
6. On failure, a here-document prints the famous quote and the script
   exits (`wargames:46-51`).

## Data Structures

None. The script keeps only the single string variable `x`.

## AI Logic

Not applicable.

## Random Events

Not applicable.

## Difficulty Progression Logic

There is no difficulty system. The behaviour is identical on every
run; the only variation is the user's input.

## What Was Clever for Its Era

- **Process replacement with `exec`:** Instead of forking a child
  game and waiting, the script vanishes and becomes the game. This is
  the cleanest possible hand-off from launcher to payload.
- **Input sanitisation:** The `sed` filter prevents shell injection
  and whitespace surprises without needing quoting gymnastics.
- **Cinematic clear:** `tput clear` gives the launched game a fresh
  screen, echoing the movie's terminal aesthetic.

## Constraints the Original Had To Handle

- **Filesystem layout:** The script assumes games live in
  `/usr/games/`, the traditional BSD games directory.
- **Terminal capability:** `tput clear` requires a working terminfo
  entry.
- **POSIX shell portability:** The script uses only basic shell
  constructs so it runs on any `/bin/sh`.
- **Persistence:** None.

## What This Code Would Look Like Today

A modern port might use a configurable game directory, fuzzy matching,
a sandboxed subprocess launch, or a retro green-phosphor UI with a
typewriter effect. See [`port-ideas.md`](./port-ideas.md) for more.

## See Also

- [`lessons.md`](./lessons.md) — beginner-friendly extraction of
  techniques from this architecture.
- [`spec.md`](./spec.md) — implementation-independent specification.
- [`references.md`](./references.md) — sources & citations.
