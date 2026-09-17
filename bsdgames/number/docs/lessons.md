# Lessons from `number`

> Techniques a beginner can extract from the original source, with file:line references.

Upstream tree: <https://github.com/vattam/BSDGames/tree/master/number>.

---

## 1. Decompose Big Problems into Reusable Chunks

The conversion algorithm breaks a number into 3-digit groups. Each group is handled by `number()`, and `unit()` appends the correct scale name (`thousand`, `million`, etc.).

- **Why it matters:** Reusing a small helper for every 3-digit chunk keeps the code short and correct.
- **Reference:** `number.c:199-236` (`unit`), `number.c:238-283` (`number`).

## 2. Lookup Tables Simplify Natural-Language Output

Three small tables (`name1`, `name2`, `name3`) cover most of the English number vocabulary.

```c
// number.c:57-77
static const char *const name1[] = { "", "one", ..., "nineteen" };
static const char *const name2[] = { "", "ten", ..., "ninety" };
static const char *const name3[] = { "hundred", ..., "vigintillion" };
```

- **Why it matters:** Tables separate data from logic, making localisation and extension easier.
- **Reference:** `number.c:57-77`.

## 3. Validate Input Before Processing

`convert()` scans the input once, rejecting embedded blanks, multiple decimal points, and oversized numbers.

- **Why it matters:** Early validation prevents malformed input from producing nonsense output.
- **Reference:** `number.c:139-169`.

## 4. Track Grammar State Explicitly

The `singular` flag lets the fractional part choose between `tenth` and `tenths`.

- **Why it matters:** Natural-language generation often needs grammatical context that the raw digits do not provide.
- **Reference:** `number.c:285-307` (`pfract`), `number.c:247`, `number.c:271-272`, `number.c:279-280`.

## 5. Support Both Interactive and Script-Friendly Output

The `-l` flag removes sentence punctuation so the output can be piped cleanly.

- **Why it matters:** A tool that works both for humans and for scripts has a longer useful life.
- **Reference:** `number.c:86`, `number.c:99-108`, `number.c:172-196`.

## See Also

- [`architecture.md`](./architecture.md) — full code analysis.
- [`references.md`](./references.md) — primary sources.
