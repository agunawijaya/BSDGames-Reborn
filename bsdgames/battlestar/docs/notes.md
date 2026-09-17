# `battlestar` — Working Notes & Engine Quirks

> Technical notes, historical curiosities, and implementation quirks discovered during codebase reverse-engineering.

---

## 1. Room Numbering & Virtual Coordinate Layout

The original game defines 275 rooms (`NUMOFROOMS 275`), indexed from 1 to 275 (room 0 is an empty sentinel struct):
- **Rooms 1–31:** The Battlestar cruiser decks.
- **Rooms 32–68:** Outer space coordinates (37 discrete flight cells).
- **Rooms 69–246:** Planetary surface (tropical island exterior).
- **Rooms 247–275:** Interior grottoes, ancient temple crypts, and the High Altar.

### The `OUTSIDE` Macro
In [`extern.h:42`](https://github.com/vattam/BSDGames/tree/master/battlestar/extern.h#L42):
```c
#define OUTSIDE (position > 68 && position < 246 && position != 218)
```
Notice that Room 218 is explicitly excluded from being `OUTSIDE`! Room 218 is the Sacred Springs / Grotto of the Sea Nymph—it is an enclosed natural cave surrounded by outdoor jungle, so daylight rules do not penetrate its cavern roof.

---

## 2. Parser Quirks & Command Splitting

1. **Multiple Commands on a Single Line:**
   - The parser splits input lines on commas, semicolons, and the word `and`. For example:
     ```text
     >-: take laser and wear pajamas
     ```
     is broken into two separate execution cycles inside `cypher()`.
2. **Ambiguous Pronoun Handling:**
   - The word `everything` / `all` iterates over every object in the current room's bitmask:
     ```c
     case EVERYTHING:
         for (n = 0; n < NUMOFOBJECTS; n++)
             if (testbit(location[position].objects, n))
                 take(n);
     ```
3. **The `su` Magic Word:**
   - Named after the Unix `su` (*substitute user* / superuser) command, this is the ultimate debugger command. When granted wizard status, entering `su` prompts for any integer between 1 and 275, directly mutating `position`.

---

## 3. Flight Engine Curses Quirks (`fly.c`)

- The curses loop relies on `cbreak()` and `noecho()`.
- During flight, keypresses `h`, `j`, `k`, `l` represent traditional *vi* cursor navigation keys. This is classic Berkeley heritage—Bill Joy wrote *vi* at Berkeley around the same time Riggle wrote *Battlestar*, so *vi* muscle memory was standard across Cory Hall terminals.
- If a terminal sends ANSI escape sequences for arrow keys (e.g. `\033[A`), classic `battlestar` misinterprets the escape character as unknown input. The modern port will properly bind ANSI cursor arrow keys.

---

## 4. Encumbrance Formula Details

- Base carrying capacity is 60 kg (`MAXWEIGHT`).
- Maximum bulk is 10 units (`MAXCUMBER`).
- However, if the player puts on clothing (`wearit()`), the object's bulk is reduced to 0 because it is distributed over the body rather than carried in arms. This allows players to wear heavy chainmail (`MAIL`) and a helmet (`HELM`) without exhausting their hand-carrying capacity.
