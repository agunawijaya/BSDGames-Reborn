# How to Play `pom`

`pom` is not a game, but it is "played" by asking it for the Moon's
phase.

---

## Controls / Commands

```
pom [[[[[cc]yy]mm]dd]HH]
```

With no arguments, `pom` uses the current system time. With a
compressed date string, it computes the phase for that moment.

| Argument | Example | Meaning |
|---|---|---|
| `HH` | `12` | Hour today |
| `ddHH` | `3112` | Day 31, hour 12 |
| `mmddHH` | `103112` | October 31, hour 12 |
| `yymmddHH` | `26103112` | 2026 Oct 31, hour 12 |
| `ccyymmddHH` | `2026103112` | Full four-digit year |

## How to Win

There is no win condition. A "successful" run prints a phase and
exits `0`.

## Tips & Tricks

- **No arguments** gives the current phase.
- **Full Moon** appears as `Full`.
- **New Moon** appears as `New`.
- **Quarters** are detected by comparing today's phase with
  tomorrow's, because the algorithm alone cannot distinguish First
  from Last Quarter.
- **Percentages** are approximate and rounded to the nearest whole
  percent.

## Scoring Mechanism

None.

## Easter Eggs

- The man page's tongue-in-cheek claim that `pom` helps with
  "predicting managerial behavior" is the program's best-known joke.

## Difficulty Modes

No difficulty modes. A future port might add a visual ASCII moon,
location-aware corrections, or a calendar view.
