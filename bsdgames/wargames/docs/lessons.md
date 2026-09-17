# Lessons from `wargames`

`wargames` is short, but it demonstrates several portable shell
programming techniques.

## 1. Prompt Without a Trailing Newline

```sh
# wargames:37
echo -n "Would you like to play a game? "
```

**Why it matters:** The user types their answer on the same line as
the prompt, which looks like a real terminal conversation.

## 2. Sanitise Untrusted Input with `sed`

```sh
# wargames:40
x=`echo $x | sed 's/[^-a-z0-9]//g'`
```

**Why it matters:** This removes any character that could surprise a
shell command or a filesystem lookup. It is a simple, predictable
whitelist filter.

## 3. Test for a File Before Running It

```sh
# wargames:42
if [ -f /usr/games/$x ] ; then
```

**Why it matters:** Checking existence before execution avoids ugly
"command not found" errors and lets the program choose a friendly
fallback message.

## 4. Replace the Current Process with `exec`

```sh
# wargames:44
exec /usr/games/$x
```

**Why it matters:** `exec` reuses the same process slot for the
launched game. There is no leftover shell waiting around, and signal
handling is cleaner.

## 5. Use a Here-Document for Multi-Line Output

```sh
# wargames:46-50
exec cat <<QUOTE
A strange game.
The only winning move is
not to play.
QUOTE
```

**Why it matters:** Here-documents keep multi-line text readable in
source form and preserve line breaks exactly.

## See Also

- [`architecture.md`](./architecture.md) — how these pieces fit
  together.
- [`references.md`](./references.md) — upstream source location.
