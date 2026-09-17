# Working Notes — `random`

- Default denominator is 2.
- `-e` mode changes the program to a pure random exit-code generator.
- `-r` forces unbuffered stdout in line-filter mode.
- RNG seeded with `gettimeofday` microseconds + seconds + PID.
- Selection is per-line, decided by `(denom * random()) / MAXRANDOM == 0`.
