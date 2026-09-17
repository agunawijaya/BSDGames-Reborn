# `pom` — Man Page Mirror

Original source: `BSDGames-master/pom/pom.6`.

---

## NAME

**pom** — display the phase of the moon

## SYNOPSIS

```
pom [[[[[cc]yy]mm]dd]HH]
```

## DESCRIPTION

The `pom` utility displays the current phase of the moon. It is useful
for selecting software completion target dates and predicting
managerial behavior.

With an optional argument, it displays the phase for the given time.
The format is similar to the canonical representation used by `date(1)`.

## OPTIONS

No flags. The optional argument is a compressed date/time string.

## SEE ALSO

`date(1)`

## AUTHOR

`pom` was written by Keith E. Brandt.

## BUGS

- Times must be within the range of the Unix epoch.
- The program does not allow for the difference between TDT and UTC
  (about one minute at the time of writing).

## ACKNOWLEDGEMENTS

The program is based on algorithms from *Practical Astronomy with Your
Calculator, Third Edition* by Peter Duffett-Smith.

## Annotation

- The man page's joke about predicting managerial behavior is one of
  the most quoted lines in BSDGames.
- The compressed date format is inherited from `date(1)` and can be
  confusing for new users; a port should probably accept ISO dates as
  well.
