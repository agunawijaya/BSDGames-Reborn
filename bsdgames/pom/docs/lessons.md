# Lessons from `pom`

`pom` is a great example of turning a published algorithm into a
working C program.

---

## 1. Map Textbook Sections to Code

The source comments cite section numbers from *Practical Astronomy
with Your Calculator*, so a reader can follow the derivation.

> **File:** `BSDGames-master/pom/pom.c:162-185`

```c
N = 360 * days / 365.242191;        /* sec 46 #3 */
Msol = N + EPSILONg - RHOg;          /* sec 46 #4 */
Ec = 360 / PI * ECCEN * sin(dtor(Msol)); /* sec 46 #5 */
...
D = ldprime - LambdaSol;             /* sec 67 #2 */
return(50.0 * (1 - cos(dtor(D))));   /* sec 67 #3 */
```

**Why it matters:** Commenting the source of each formula makes the
code auditable and teachable.

## 2. Normalise Angles Early and Often

Astronomical calculations wrap around 360°. `pom` centralises this in
`adj360()`.

> **File:** `BSDGames-master/pom/pom.c:203-214`

```c
void adj360(double *deg)
{
    for (;;)
        if (*deg < 0) *deg += 360;
        else if (*deg > 360) *deg -= 360;
        else break;
}
```

**Why it matters:** A single normalisation helper prevents duplicated
logic and bugs from accumulated rotations.

## 3. Use `time_t` and `mktime()` for Date Arithmetic

The `parsetime()` function builds a `struct tm` and converts it with
`mktime()`, letting the C library handle leap years and month lengths.

> **File:** `BSDGames-master/pom/pom.c:274-275`

```c
if ((tval = mktime(lt)) == -1)
    errx(1, "specified date is outside allowed range");
```

**Why it matters:** Reusing standard-library date routines avoids
reimplementing the Gregorian calendar.

## 4. Disambiguate Ambiguous States with Extra Data

The algorithm cannot tell First Quarter from Last Quarter from a
single percentage. `pom` compares tomorrow's phase with today's to
see whether illumination is increasing or decreasing.

> **File:** `BSDGames-master/pom/pom.c:129-132`

```c
if ((int)today == 50)
    printf("%s\n", tomorrow > today ?
        "at the First Quarter" : "at the Last Quarter");
```

**Why it matters:** When a single measurement is ambiguous, a second
sample can resolve the direction of change.

## 5. Revoke Privileges Immediately

The program calls `setregid(getgid(), getgid())` at the start to drop
any setgid privileges.

> **File:** `BSDGames-master/pom/pom.c:104`

```c
setregid(getgid(), getgid());
```

**Why it matters:** Even simple utilities should follow the principle
of least privilege.

## See Also

- [`architecture.md`](./architecture.md) — full control-flow analysis.
- [`spec.md`](./spec.md) — formal behaviour.
- [`references.md`](./references.md) — sources.
