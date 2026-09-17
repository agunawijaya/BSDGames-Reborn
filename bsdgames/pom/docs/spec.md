# `pom` — Specification

A formal reverse-specification of the original `pom` utility.

---

## Objective

Display the phase of the Moon for the current time or a user-supplied
date.

## State Variables

| Variable | Source | Meaning |
|---|---|---|
| `now` | `time()` | Current system time. |
| `tmpt` | Argument or `now` | Target time for the computation. |
| `days` | `(tmpt - epoch) / 86400.0` | Days since 1990 Jan 0.0. |
| `today` | `potm(days) + 0.5` | Illumination percentage (0–100). |
| `tomorrow` | `potm(days + 1)` | Next day's percentage, for direction. |

## Actions & Commands

| Action | Syntax |
|---|---|
| Current phase | `pom` |
| Phase at date | `pom [[[[[cc]yy]mm]dd]HH]` |

## Legal Rules & Invariants

1. With no argument, the program uses the current time.
2. The date string may be 2, 4, 6, 8, or 10 digits long.
3. Components are parsed right-to-left: hour, day, month, year,
   century.
4. Two-digit years `< 69` are treated as 2000s; `>= 69` as 1900s.
5. Months must be `01–12`; days must be `01–31`; hours must be
   `00–23`.
6. Invalid input prints usage and exits `1`.
7. Phase names:
   - `0%` → `New`
   - `100%` → `Full`
   - `50%` and increasing → `at the First Quarter`
   - `50%` and decreasing → `at the Last Quarter`
   - `>50%` and increasing → `Waxing Gibbous`
   - `>50%` and decreasing → `Waning Gibbous`
   - `<50%` and increasing → `Waxing Crescent`
   - `<50%` and decreasing → `Waning Crescent`
8. Output verb tense depends on whether `tmpt` is before, equal to,
   or after `now`.

## RNG Usage

None.

## Termination Conditions

- **Success:** Phase printed → exit `0`.
- **Invalid date:** Usage printed → exit `1`.
- **Out of range:** `mktime` fails → exit `1`.

## Difficulty Levels & Setup Configuration

Not applicable. The only configuration is the optional date argument.
